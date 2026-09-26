import React, { useState, useRef, useEffect, useCallback } from 'react';
import { speakAndWait, stopSpeech } from '../utils/speech';
import { saveSession } from '../utils/storage';
import { serieOrale } from '../data/nylaOral';
import { jugerOral } from '../utils/nylaOralCheck';
import Mascot from './Mascots';
import { useSettings, mascotFor } from '../utils/settings';

// Nyla — le tuteur qui PARLE, et qui écoute.
//
// Tout le reste de son portail est à choix multiples, et un choix multiple
// bute toujours sur le même mur à cinq ans: il faut lire les réponses. Réciter
// les jours de la semaine, compter jusqu'à 20 d'un trait, dire son âge — rien
// de tout ça ne se coche. Ça se dit.
//
// Le tour de parole, repris de la pratique orale de Prepara:
//   la voix pose la question  →  (elle se tait)  →  le micro s'ouvre
//   →  elle répond  →  l'audio part à Scribe  →  le texte revient
//   →  on juge (localement si possible)  →  la voix réagit  →  question suivante
//
// Deux choses comptent plus que tout ici:
//   • Le micro ne s'ouvre QU'APRÈS la fin de la phrase (speakAndWait), sinon
//     l'app s'enregistre elle-même en train de poser la question.
//   • On ne dit jamais « non ». Elle pleure quand elle se trompe: on nomme ce
//     qui est déjà bon, puis on relance avec l'indice.

const ETATS = {
  PRET: 'pret',
  PARLE: 'parle',       // la voix pose la question
  ECOUTE: 'ecoute',     // le micro est ouvert
  REFLECHIT: 'reflechit', // transcription + jugement
  REPOND: 'repond',     // la voix réagit
  FINI: 'fini',
};

// Au-delà, on arrête tout seul: une enfant de cinq ans qui cherche ses mots ne
// doit pas rester devant un micro ouvert indéfiniment.
const MAX_ECOUTE_MS = 15000;
// En dessous, c'est un silence ou un « euh »: on relance sans juger.
const MIN_AUDIO_BYTES = 2000;

export default function NylaTuteur({ onHome, onFinish }) {
  const [serie] = useState(() => serieOrale(5));
  const [idx, setIdx] = useState(0);
  const [etat, setEtat] = useState(ETATS.PRET);
  const [bulle, setBulle] = useState('');
  const [entendu, setEntendu] = useState('');
  const [score, setScore] = useState(0);
  const [essais, setEssais] = useState(0);
  const [micRefuse, setMicRefuse] = useState(false);
  const [details, setDetails] = useState([]);

  const recRef = useRef(null);
  const chunksRef = useRef([]);
  const stopTimerRef = useRef(null);
  const vivantRef = useRef(true);

  const question = serie[idx];
  // La mascotte que Nyla a choisie dans les Reglages: c'est elle qui parle.
  const mascotte = mascotFor('nyla', useSettings('nyla'));

  useEffect(() => () => {
    vivantRef.current = false;
    clearTimeout(stopTimerRef.current);
    try { recRef.current?.stream?.getTracks().forEach((t) => t.stop()); } catch {}
    stopSpeech();
  }, []);

  // ===== Enregistrer un tour =====
  const enregistrer = useCallback(async () => {
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setMicRefuse(true);
      setEtat(ETATS.PRET);
      return null;
    }
    return new Promise((resolve) => {
      let mime = '';
      for (const m of ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4']) {
        if (window.MediaRecorder && MediaRecorder.isTypeSupported(m)) { mime = m; break; }
      }
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      rec.stream = stream;
      recRef.current = rec;
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data && e.data.size) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        try { stream.getTracks().forEach((t) => t.stop()); } catch {}
        resolve(new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' }));
      };
      rec.start();
      setEtat(ETATS.ECOUTE);
      // Filet: si elle ne touche jamais « J'ai fini », on coupe tout seul.
      stopTimerRef.current = setTimeout(() => {
        if (rec.state === 'recording') rec.stop();
      }, MAX_ECOUTE_MS);
    });
  }, []);

  function arreterEcoute() {
    clearTimeout(stopTimerRef.current);
    const rec = recRef.current;
    if (rec && rec.state === 'recording') rec.stop();
  }

  // ===== Un tour complet =====
  const poserLaQuestion = useCallback(async (relance) => {
    if (!question || !vivantRef.current) return;
    const phrase = relance || question.dire;
    setBulle(phrase);
    setEntendu('');
    setEtat(ETATS.PARLE);
    await speakAndWait(phrase);
    if (!vivantRef.current) return;

    const blob = await enregistrer();
    if (!blob || !vivantRef.current) return;

    setEtat(ETATS.REFLECHIT);

    if (blob.size < MIN_AUDIO_BYTES) {
      const r = "Je ne t'ai pas bien entendue. Parle un peu plus fort!";
      setBulle(r);
      setEtat(ETATS.REPOND);
      await speakAndWait(r);
      if (vivantRef.current) poserLaQuestion(question.aide);
      return;
    }

    // --- Transcrire ---
    let texte = '';
    try {
      const res = await fetch('/api/ecoute', {
        method: 'POST',
        headers: { 'Content-Type': blob.type || 'audio/webm' },
        body: blob,
      });
      if (res.ok) texte = (await res.json()).texte || '';
    } catch {}
    if (!vivantRef.current) return;
    setEntendu(texte);

    if (!texte) {
      const r = 'Je ne suis pas sûre d\'avoir compris. On réessaie?';
      setBulle(r);
      setEtat(ETATS.REPOND);
      await speakAndWait(r);
      if (vivantRef.current) poserLaQuestion(question.aide);
      return;
    }

    // --- Juger: le local d'abord, le modèle seulement s'il ne peut pas trancher ---
    const local = jugerOral(question, texte);
    let ok = local.verdict === 'bravo';
    let dire = reactionLocale(question, local);

    if (local.verdict === 'modele' || !dire) {
      try {
        const res = await fetch('/api/oral', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: question.dire,
            attendu: question.attendu ? String(question.attendu) : null,
            transcript: texte,
            verdict: local.verdict,
          }),
        });
        const j = await res.json();
        dire = j.dire;
        // `ok: null` = personne n'a pu juger (pas de clé, ou l'appel a échoué).
        // On ne compte PAS ça contre elle: sur une question ouverte, avoir
        // ouvert la bouche et dit quelque chose est déjà la réussite.
        ok = typeof j.ok === 'boolean' ? j.ok : true;
      } catch {
        dire = 'Merci Nyla! On continue.';
        ok = true;
      }
    }
    if (!vivantRef.current) return;

    setBulle(dire);
    setEtat(ETATS.REPOND);
    setDetails((d) => [...d, { category: 'nyla_oral', type: question.theme, correct: ok }]);
    if (ok) setScore((s) => s + 1);
    setEssais((n) => n + 1);

    await speakAndWait(dire);
    if (!vivantRef.current) return;

    // « Presque » sur une suite: on la relance là où elle s'est arrêtée,
    // une seule fois, plutôt que de passer à autre chose.
    if (!ok && local.verdict === 'presque' && !relance) {
      poserLaQuestion(question.aide);
      return;
    }
    suivante();
  }, [question, enregistrer]); // eslint-disable-line react-hooks/exhaustive-deps

  function suivante() {
    if (idx + 1 >= serie.length) {
      setEtat(ETATS.FINI);
      const fin = 'Bravo Nyla! On a fini de parler ensemble.';
      setBulle(fin);
      speakAndWait(fin);
      try { saveSession('nyla_oral', essais + 1, score, details); } catch {}
      return;
    }
    setIdx((i) => i + 1);
    setEtat(ETATS.PRET);
  }

  // Enchaîner automatiquement dès que la question change.
  useEffect(() => {
    if (etat === ETATS.PRET && idx > 0) {
      const t = setTimeout(() => poserLaQuestion(), 400);
      return () => clearTimeout(t);
    }
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  // ===== Écran =====
  if (micRefuse) {
    return (
      <div className="max-w-xl mx-auto px-4 pt-10 text-center">
        <div className="text-6xl mb-4">🎤</div>
        <h2 className="font-heading text-2xl font-extrabold text-stone mb-2">Le micro est fermé</h2>
        <p className="text-s6 font-semibold mb-6">
          Pour parler avec Nyla, il faut autoriser le microphone dans le navigateur,
          puis rouvrir cette page.
        </p>
        <button onClick={onHome} className="w-full py-3 rounded-xl font-bold text-white"
          style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
          ← Retour
        </button>
      </div>
    );
  }

  const enCours = etat !== ETATS.PRET && etat !== ETATS.FINI;

  return (
    <div className="max-w-xl mx-auto px-4 pt-4 pb-10">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onHome} className="text-s4 font-bold text-sm hover:text-lava">← Menu</button>
        <h2 className="font-heading font-bold text-stone">🗣️ On parle ensemble</h2>
        <div className="text-xs font-bold text-s4">{Math.min(idx + 1, serie.length)}/{serie.length}</div>
      </div>

      <div className="w-full bg-s1 rounded-full h-2 mb-6">
        <div className="h-2 rounded-full transition-all duration-300"
          style={{ width: `${(idx / serie.length) * 100}%`, background: 'linear-gradient(90deg, #6d28d9, #8b5cf6)' }} />
      </div>

      {/* La mascotte — c'est elle qui parle */}
      <div className="text-center mb-4">
        <div className={`inline-block transition-transform duration-300 ${
          etat === ETATS.PARLE || etat === ETATS.REPOND ? 'scale-110' : ''
        }`}>
          <Mascot id={mascotte} width={120} />
        </div>
      </div>

      {/* Ce qui est dit — écrit pour l'adulte à côté, pas pour elle */}
      <div className="bg-white rounded-2xl p-5 border-2 border-purple-200 mb-4 min-h-[92px] flex items-center justify-center">
        <p className="text-lg font-heading font-bold text-stone text-center leading-snug">
          {bulle || 'Touche le gros bouton pour commencer!'}
        </p>
      </div>

      {/* L'état du tour, en gros et sans mots à lire */}
      {etat === ETATS.ECOUTE && (
        <div className="text-center mb-4">
          <div className="text-5xl mb-2 animate-pulse">🎤</div>
          <p className="font-heading font-extrabold text-lava text-lg">Je t'écoute...</p>
        </div>
      )}
      {etat === ETATS.REFLECHIT && (
        <div className="text-center mb-4">
          <div className="text-4xl mb-2 animate-pulse">💭</div>
          <p className="font-heading font-bold text-s4">Un instant...</p>
        </div>
      )}

      {/* Ce que le micro a compris — pour que le parent voie ce qui s'est passé */}
      {entendu && (
        <div className="bg-cream rounded-xl px-3 py-2 border border-s2 mb-4">
          <div className="text-[10px] font-bold uppercase tracking-wide text-s4 mb-0.5">Elle a dit</div>
          <p className="text-sm font-semibold text-s6">« {entendu} »</p>
        </div>
      )}

      {/* Le seul bouton qui compte */}
      {etat === ETATS.PRET && (
        <button onClick={() => poserLaQuestion()}
          className="w-full py-6 rounded-3xl font-heading font-extrabold text-white text-2xl active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)' }}>
          🎤 On commence!
        </button>
      )}

      {etat === ETATS.ECOUTE && (
        <button onClick={arreterEcoute}
          className="w-full py-6 rounded-3xl font-heading font-extrabold text-white text-2xl active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #2d7a3a, #4ca65b)' }}>
          ✓ J'ai fini de parler
        </button>
      )}

      {enCours && etat !== ETATS.ECOUTE && (
        <div className="w-full py-6 rounded-3xl bg-s1 text-center font-heading font-bold text-s4 text-lg">
          …
        </div>
      )}

      {etat === ETATS.FINI && (
        <div className="text-center">
          <div className="text-6xl mb-3">🏆</div>
          <p className="font-heading text-2xl font-extrabold text-ok mb-1">{score} sur {serie.length}</p>
          <p className="text-s6 font-semibold mb-5">Tu as bien parlé, Nyla!</p>
          <button onClick={onFinish || onHome}
            className="w-full py-4 rounded-xl font-bold text-white text-lg"
            style={{ background: 'linear-gradient(90deg, #2d7a3a, #4ca65b)' }}>
            ← Retour
          </button>
        </div>
      )}
    </div>
  );
}

// La réaction parlée quand le vérificateur local a su trancher. Écrite ici
// plutôt que demandée au modèle: c'est instantané, gratuit, et ça marche même
// sans réseau. Le modèle ne sert que là où il juge vraiment quelque chose.
function reactionLocale(question, local) {
  const bravos = ['Bravo Nyla!', 'Oui, c\'est ça!', 'Parfait!', 'Super!'];
  const bravo = bravos[Math.floor(Math.random() * bravos.length)];

  if (local.verdict === 'bravo') {
    if (question.verif === 'liste') return `${bravo} Tu as tout dit jusqu'à ${local.jusqua}.`;
    if (question.verif === 'parmi' && local.trouves?.length) {
      return `${bravo} Tu as dit ${local.trouves.slice(0, 3).join(', ')}.`;
    }
    return bravo;
  }

  if (local.verdict === 'presque') {
    if (question.verif === 'liste') {
      return `Très bien jusqu'à ${local.jusqua}! Après ${local.jusqua}, il y a ${local.bloqueA}. Recommence.`;
    }
    if (question.verif === 'parmi') {
      const n = local.manque;
      return `Bon début! Il t'en manque encore ${n === 1 ? 'un' : n}. Essaie encore.`;
    }
    return null;
  }

  if (local.verdict === 'encore') {
    if (question.verif === 'liste' && local.bloqueA != null) {
      return `On recommence ensemble. Ça commence par ${question.attendu[0]}.`;
    }
    return null; // le modèle trouvera mieux que nous
  }
  return null;
}
