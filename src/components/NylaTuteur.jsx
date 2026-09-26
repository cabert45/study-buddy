import React, { useState, useRef, useEffect, useCallback } from 'react';
import { speakAndWait, stopSpeech } from '../utils/speech';
import { saveSession } from '../utils/storage';
import { serieOrale } from '../data/nylaOral';
import { jugerOral } from '../utils/nylaOralCheck';
import Mascot, { MASCOTS } from './Mascots';
import { useSettings, mascotFor } from '../utils/settings';

// Nyla — le tuteur qui PARLE, et qui écoute.
//
// Tout le reste de son portail est à choix multiples, et un choix multiple
// bute toujours sur le même mur à cinq ans: il faut lire les réponses.
// Réciter les jours de la semaine, compter jusqu'à 20, dire son âge — rien de
// tout ça ne se coche. Ça se dit.
//
// L'écran suit la pratique orale de Prepara (/parler), y compris ce qui est
// revenu du premier essai en famille:
//   • on CHOISIT d'abord qui nous parle — « Choisissez une personne » chez
//     Prepara, seize mascottes ici;
//   • on appuie pour parler, on ne se fait pas surprendre par un micro qui
//     s'ouvre tout seul (« Appuyez, puis parlez »);
//   • ce que la personne a dit s'affiche et se CORRIGE (« Vous avez dit —
//     corrigez si besoin »), parce qu'une transcription se trompe, et encore
//     plus sur une voix de cinq ans;
//   • toute la conversation reste à l'écran, pour le parent assis à côté.
//
// Deux règles qui ne bougent pas:
//   • le micro ne s'ouvre QU'APRÈS la fin de la phrase, sinon l'app
//     s'enregistre elle-même en train de poser la question;
//   • on ne dit jamais « non »: elle pleure quand elle se trompe.

const MAX_ECOUTE_MS = 20000;
const MIN_AUDIO_BYTES = 2000;
const CLE_AVATAR = 'sb_nyla_avatar_tuteur';

// Où on en est dans le tour de parole. Affiché en toutes lettres: la première
// version n'avait qu'un « … » gris, et personne ne pouvait savoir si l'app
// écoutait, réfléchissait, ou était simplement plantée.
const ETATS = {
  CHOIX: 'choix',
  PRET: 'pret',
  PARLE: 'parle',
  ECOUTE: 'ecoute',
  RELIT: 'relit',          // elle a parlé: on montre le texte, corrigeable
  REFLECHIT: 'reflechit',
  REPOND: 'repond',
  FINI: 'fini',
};

const LIBELLE_ETAT = {
  [ETATS.PARLE]: '🔊 Elle parle…',
  [ETATS.ECOUTE]: '🎤 Je t’écoute',
  [ETATS.RELIT]: '✏️ Vérifie ce que j’ai entendu',
  [ETATS.REFLECHIT]: '💭 Je réfléchis…',
  [ETATS.REPOND]: '🔊 Elle répond…',
};

export default function NylaTuteur({ onHome, onFinish }) {
  const reglages = useSettings('nyla');
  const [avatar, setAvatar] = useState(() => {
    try { return localStorage.getItem(CLE_AVATAR) || ''; } catch { return ''; }
  });
  const [serie] = useState(() => serieOrale(5));
  const [idx, setIdx] = useState(0);
  const [etat, setEtat] = useState(avatar ? ETATS.PRET : ETATS.CHOIX);
  const [conversation, setConversation] = useState([]); // {qui:'elle'|'nyla', texte}
  const [brouillon, setBrouillon] = useState('');       // ce que Scribe a entendu, corrigeable
  const [score, setScore] = useState(0);
  const [essais, setEssais] = useState(0);
  const [micRefuse, setMicRefuse] = useState(false);
  const [niveauMic, setNiveauMic] = useState(0);
  const [details, setDetails] = useState([]);
  const [relance, setRelance] = useState(false);

  const recRef = useRef(null);
  const chunksRef = useRef([]);
  const stopTimerRef = useRef(null);
  const vivantRef = useRef(true);
  const audioCtxRef = useRef(null);
  const rafRef = useRef(null);
  const finEcouteRef = useRef(null);
  const basRef = useRef(null);

  const question = serie[idx];

  useEffect(() => () => {
    vivantRef.current = false;
    clearTimeout(stopTimerRef.current);
    cancelAnimationFrame(rafRef.current);
    try { recRef.current?.stream?.getTracks().forEach((t) => t.stop()); } catch {}
    try { audioCtxRef.current?.close(); } catch {}
    stopSpeech();
  }, []);

  // La conversation défile toute seule vers le bas.
  useEffect(() => {
    basRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [conversation, brouillon, etat]);

  function ajouter(qui, texte) {
    if (!texte) return;
    setConversation((c) => [...c, { qui, texte }]);
  }

  // ===== Le niveau du micro, pour qu'on VOIE qu'elle est entendue =====
  function suivreLeNiveau(stream) {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      audioCtxRef.current = ctx;
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const boucle = () => {
        analyser.getByteTimeDomainData(data);
        let max = 0;
        for (let i = 0; i < data.length; i++) max = Math.max(max, Math.abs(data[i] - 128));
        setNiveauMic(Math.min(1, max / 60));
        rafRef.current = requestAnimationFrame(boucle);
      };
      boucle();
    } catch {}
  }

  function couperLeNiveau() {
    cancelAnimationFrame(rafRef.current);
    setNiveauMic(0);
    try { audioCtxRef.current?.close(); } catch {}
    audioCtxRef.current = null;
  }

  // ===== Enregistrer un tour =====
  const enregistrer = useCallback(async () => {
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setMicRefuse(true);
      return null;
    }
    suivreLeNiveau(stream);
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
        couperLeNiveau();
        try { stream.getTracks().forEach((t) => t.stop()); } catch {}
        resolve(new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' }));
      };
      finEcouteRef.current = () => { if (rec.state === 'recording') rec.stop(); };
      rec.start();
      setEtat(ETATS.ECOUTE);
      stopTimerRef.current = setTimeout(() => finEcouteRef.current?.(), MAX_ECOUTE_MS);
    });
  }, []);

  // 1. Poser la question, puis ouvrir le micro.
  const poser = useCallback(async (phraseDeRelance) => {
    if (!question || !vivantRef.current) return;
    const phrase = phraseDeRelance || question.dire;
    setRelance(!!phraseDeRelance);
    setBrouillon('');
    setEtat(ETATS.PARLE);
    ajouter('elle', phrase);
    await speakAndWait(phrase);
    if (!vivantRef.current) return;

    const blob = await enregistrer();
    if (!blob || !vivantRef.current) return;
    clearTimeout(stopTimerRef.current);

    if (blob.size < MIN_AUDIO_BYTES) {
      setBrouillon('');
      setEtat(ETATS.RELIT);
      return;
    }

    setEtat(ETATS.REFLECHIT);
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

    // On NE JUGE PAS tout de suite: on montre d'abord ce qu'on a entendu.
    // Une transcription se trompe, et sur une voix de cinq ans elle se trompe
    // souvent — la corriger d'un doigt vaut mieux que de la faire recommencer.
    setBrouillon(texte);
    setEtat(ETATS.RELIT);
  }, [question, enregistrer]);

  // 2. Elle (ou le parent) valide le texte: on juge.
  async function envoyer() {
    const texte = brouillon.trim();
    if (!texte) { poser(question.aide); return; }
    ajouter('nyla', texte);
    setEtat(ETATS.REFLECHIT);

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
        // `ok: null` = personne n'a pu juger. On ne compte pas ça contre elle.
        ok = typeof j.ok === 'boolean' ? j.ok : true;
      } catch {
        dire = 'Merci Nyla! On continue.';
        ok = true;
      }
    }
    if (!vivantRef.current) return;

    setBrouillon('');
    setEtat(ETATS.REPOND);
    ajouter('elle', dire);
    setDetails((d) => [...d, { category: 'nyla_oral', type: question.theme, correct: ok }]);
    if (ok) setScore((s) => s + 1);
    setEssais((n) => n + 1);

    await speakAndWait(dire);
    if (!vivantRef.current) return;

    if (!ok && local.verdict === 'presque' && !relance) { poser(question.aide); return; }
    suivante();
  }

  function suivante() {
    if (idx + 1 >= serie.length) {
      setEtat(ETATS.FINI);
      const fin = 'Bravo Nyla! On a fini de parler ensemble.';
      ajouter('elle', fin);
      speakAndWait(fin);
      try { saveSession('nyla_oral', essais + 1, score, details); } catch {}
      return;
    }
    setIdx((i) => i + 1);
    setEtat(ETATS.PRET);
  }

  useEffect(() => {
    if (etat === ETATS.PRET && idx > 0) {
      const t = setTimeout(() => poser(), 500);
      return () => clearTimeout(t);
    }
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  // ===== Choisir qui parle =====
  if (etat === ETATS.CHOIX) {
    const suggere = mascotFor('nyla', reglages);
    return (
      <div className="max-w-xl mx-auto px-4 pt-4 pb-10">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onHome} className="text-s4 font-bold text-sm hover:text-lava">← Menu</button>
          <h2 className="font-heading font-bold text-stone">🗣️ On parle ensemble</h2>
          <span className="w-12" />
        </div>
        <p className="text-center font-heading text-xl font-extrabold text-stone mb-1">Choisis qui va te parler</p>
        <p className="text-center text-sm font-semibold text-s4 mb-5">Touche un ami. C’est lui qui posera les questions.</p>
        <div className="grid grid-cols-3 gap-3">
          {MASCOTS.map((m) => (
            <button key={m.id}
              onClick={() => {
                setAvatar(m.id);
                try { localStorage.setItem(CLE_AVATAR, m.id); } catch {}
                setEtat(ETATS.PRET);
                setTimeout(() => poser(), 300);
              }}
              className={`rounded-2xl p-2 border-2 bg-white transition-all active:scale-[0.96] ${
                m.id === suggere ? 'border-purple-400 shadow-sm' : 'border-s1 hover:border-purple-300'
              }`}>
              <Mascot id={m.id} width={72} animated={false} />
              <div className="text-xs font-bold text-s6 mt-1">{m.label}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (micRefuse) {
    return (
      <div className="max-w-xl mx-auto px-4 pt-10 text-center">
        <div className="text-6xl mb-4">🎤</div>
        <h2 className="font-heading text-2xl font-extrabold text-stone mb-2">Le micro est fermé</h2>
        <p className="text-s6 font-semibold mb-2">
          Pour parler, il faut autoriser le microphone dans le navigateur.
        </p>
        <p className="text-sm text-s4 mb-6">
          Touche l’icône 🎤 (ou le cadenas) à gauche de l’adresse, choisis « Autoriser », puis rouvre cette page.
        </p>
        <button onClick={onHome} className="w-full py-3 rounded-xl font-bold text-white"
          style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
          ← Retour
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 pt-4 pb-10">
      <div className="flex items-center justify-between mb-3">
        <button onClick={onHome} className="text-s4 font-bold text-sm hover:text-lava">← Menu</button>
        <h2 className="font-heading font-bold text-stone">🗣️ On parle ensemble</h2>
        <div className="text-xs font-bold text-s4">{Math.min(idx + 1, serie.length)}/{serie.length}</div>
      </div>

      <div className="w-full bg-s1 rounded-full h-2 mb-4">
        <div className="h-2 rounded-full transition-all duration-300"
          style={{ width: `${(idx / serie.length) * 100}%`, background: 'linear-gradient(90deg, #6d28d9, #8b5cf6)' }} />
      </div>

      {/* Où on en est — en toutes lettres, jamais un « … » muet */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`transition-transform duration-300 flex-shrink-0 ${
          etat === ETATS.PARLE || etat === ETATS.REPOND ? 'scale-110' : ''
        }`}>
          <Mascot id={avatar} width={56} animated={etat === ETATS.PARLE || etat === ETATS.REPOND} />
        </div>
        <div className="flex-1">
          <div className="font-heading font-extrabold text-stone">
            {LIBELLE_ETAT[etat] || (etat === ETATS.FINI ? '🏆 Fini!' : 'Prête?')}
          </div>
          {etat === ETATS.ECOUTE && (
            <div className="mt-1 h-3 rounded-full bg-s1 overflow-hidden">
              {/* Le niveau du micro: la preuve visible qu'elle est entendue */}
              <div className="h-3 rounded-full transition-[width] duration-75"
                style={{ width: `${Math.max(4, niveauMic * 100)}%`, background: 'linear-gradient(90deg, #2d7a3a, #4ca65b)' }} />
            </div>
          )}
        </div>
        <button onClick={() => setEtat(ETATS.CHOIX)}
          className="text-[11px] font-bold text-s4 underline flex-shrink-0">changer</button>
      </div>

      {/* La conversation, en entier — c'est ce que le parent lit */}
      <div className="bg-white rounded-2xl border-2 border-s1 p-3 mb-4 max-h-[42vh] overflow-y-auto">
        {conversation.length === 0 && (
          <p className="text-sm text-s4 font-semibold text-center py-4">La conversation s’écrira ici.</p>
        )}
        {conversation.map((t, i) => (
          <div key={i} className={`flex mb-2 ${t.qui === 'nyla' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-[15px] font-semibold leading-snug ${
              t.qui === 'nyla'
                ? 'bg-purple-50 border-2 border-purple-200 text-stone rounded-br-md'
                : 'bg-cream border-2 border-s2 text-stone rounded-bl-md'
            }`}>
              <div className="text-[10px] font-extrabold uppercase tracking-wide text-s4 mb-0.5">
                {t.qui === 'nyla' ? 'Nyla' : 'Ton ami'}
              </div>
              {t.texte}
            </div>
          </div>
        ))}
        <div ref={basRef} />
      </div>

      {/* Ce qu'on a entendu — corrigeable, comme « Vous avez dit » chez Prepara */}
      {etat === ETATS.RELIT && (
        <div className="bg-purple-50 border-2 border-purple-300 rounded-2xl p-3 mb-3">
          <div className="text-[10px] font-extrabold uppercase tracking-wide text-purple-700 mb-1">
            Elle a dit — corrige si c’est mal entendu
          </div>
          <input
            value={brouillon}
            onChange={(e) => setBrouillon(e.target.value)}
            placeholder="(rien entendu)"
            className="w-full px-3 py-2.5 rounded-xl border-2 border-purple-200 focus:border-lava focus:outline-none text-base text-stone font-semibold bg-white"
          />
          <div className="flex gap-2 mt-2">
            <button onClick={() => poser(relance ? question.aide : undefined)}
              className="flex-1 py-3 rounded-xl font-bold text-s6 bg-white border-2 border-s2 hover:border-lava text-sm">
              ↺ Reprendre
            </button>
            <button onClick={envoyer}
              className="flex-1 py-3 rounded-xl font-extrabold text-white text-sm"
              style={{ background: 'linear-gradient(90deg, #2d7a3a, #4ca65b)' }}>
              ✓ Envoyer
            </button>
          </div>
        </div>
      )}

      {/* Le bouton principal */}
      {etat === ETATS.PRET && (
        <button onClick={() => poser()}
          className="w-full py-6 rounded-3xl font-heading font-extrabold text-white text-2xl active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)' }}>
          🎤 On commence!
        </button>
      )}

      {etat === ETATS.ECOUTE && (
        <button onClick={() => finEcouteRef.current?.()}
          className="w-full py-6 rounded-3xl font-heading font-extrabold text-white text-2xl active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #2d7a3a, #4ca65b)' }}>
          ✓ J’ai fini de parler
        </button>
      )}

      {(etat === ETATS.PARLE || etat === ETATS.REFLECHIT || etat === ETATS.REPOND) && (
        <div className="w-full py-5 rounded-3xl bg-s1 text-center font-heading font-bold text-s6 text-lg">
          {LIBELLE_ETAT[etat]}
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
// plutôt que demandée au modèle: instantané, gratuit, et ça marche sans réseau.
function reactionLocale(question, local) {
  const bravos = ['Bravo Nyla!', 'Oui, c’est ça!', 'Parfait!', 'Super!'];
  const bravo = bravos[Math.floor(Math.random() * bravos.length)];

  if (local.verdict === 'bravo') {
    if (question.verif === 'liste') return `${bravo} Tu as tout dit jusqu’à ${local.jusqua}.`;
    if (question.verif === 'parmi' && local.trouves?.length) {
      return `${bravo} Tu as dit ${local.trouves.slice(0, 3).join(', ')}.`;
    }
    return bravo;
  }
  if (local.verdict === 'presque') {
    if (question.verif === 'liste') {
      return `Très bien jusqu’à ${local.jusqua}! Après ${local.jusqua}, il y a ${local.bloqueA}. On recommence.`;
    }
    if (question.verif === 'parmi') {
      const n = local.manque;
      return `Bon début! Il t’en manque encore ${n === 1 ? 'un' : n}. Essaie encore.`;
    }
    return null;
  }
  if (local.verdict === 'encore') {
    if (question.verif === 'liste' && local.bloqueA != null) {
      return `On recommence ensemble. Ça commence par ${question.attendu[0]}.`;
    }
    return null;
  }
  return null;
}
