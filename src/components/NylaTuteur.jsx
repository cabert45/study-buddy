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
// Deux façons de parler, parce que les deux servent à des choses différentes:
//   • « Les questions » — cinq consignes précises du programme de maternelle,
//     corrigées (les jours, compter, les couleurs).
//   • « On jase » — une vraie conversation libre de deux ou trois minutes,
//     sans bonne réponse, où on parle juste pour parler. C'est /parler de
//     Prepara: on choisit quelqu'un, on touche, et ça discute.
//
// L'écran reprend ce qui marche chez Prepara:
//   • on CHOISIT d'abord qui nous parle (« Choisissez une personne »);
//   • on appuie pour parler, le micro ne s'ouvre pas tout seul;
//   • ce qu'on a entendu s'affiche et se CORRIGE avant d'être envoyé
//     (« Vous avez dit — corrigez si besoin ») — une transcription se trompe,
//     et sur une voix de cinq ans elle se trompe souvent;
//   • toute la conversation reste à l'écran, pour le parent assis à côté.
//
// Deux règles qui ne bougent pas: le micro ne s'ouvre QU'APRÈS la fin de la
// phrase (sinon l'app s'enregistre elle-même), et on ne dit jamais « non ».

const MAX_ECOUTE_MS = 20000;
const MIN_AUDIO_BYTES = 2000;
const CLE_AVATAR = 'sb_nyla_avatar_tuteur';

const ETATS = {
  CHOIX: 'choix',
  MODE: 'mode',
  PRET: 'pret',
  PARLE: 'parle',
  ECOUTE: 'ecoute',
  RELIT: 'relit',
  REFLECHIT: 'reflechit',
  REPOND: 'repond',
  FINI: 'fini',
};

// Où on en est, en toutes lettres. La première version n'avait qu'un « … »
// gris: impossible de savoir si l'app écoutait, réfléchissait, ou était plantée.
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
  const [mode, setMode] = useState(null); // 'questions' | 'causerie'
  const [serie] = useState(() => serieOrale(5));
  const [idx, setIdx] = useState(0);
  const [etat, setEtat] = useState(avatar ? ETATS.MODE : ETATS.CHOIX);
  const [conversation, setConversation] = useState([]);
  const [brouillon, setBrouillon] = useState('');
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
  // Le fil de la conversation, aussi dans une ref: « On jase » l'envoie au
  // serveur à chaque tour, et l'état React n'est pas encore à jour à ce
  // moment-là.
  const filRef = useRef([]);

  const question = serie[idx];
  const mascotteLabel = (MASCOTS.find((m) => m.id === avatar) || {}).label || 'ton ami';

  useEffect(() => () => {
    vivantRef.current = false;
    clearTimeout(stopTimerRef.current);
    cancelAnimationFrame(rafRef.current);
    try { recRef.current?.stream?.getTracks().forEach((t) => t.stop()); } catch {}
    try { audioCtxRef.current?.close(); } catch {}
    stopSpeech();
  }, []);

  useEffect(() => {
    basRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [conversation, brouillon, etat]);

  function ajouter(qui, texte) {
    if (!texte) return;
    filRef.current = [...filRef.current, { qui, texte }];
    setConversation(filRef.current);
  }

  // ===== Le niveau du micro: la preuve visible qu'elle est entendue =====
  function suivreLeNiveau(stream) {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(analyser);
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

  // Dire une phrase, puis ouvrir le micro et transcrire.
  const direPuisEcouter = useCallback(async (phrase) => {
    if (!vivantRef.current) return;
    setBrouillon('');
    setEtat(ETATS.PARLE);
    ajouter('elle', phrase);
    await speakAndWait(phrase);
    if (!vivantRef.current) return;

    const blob = await enregistrer();
    if (!blob || !vivantRef.current) return;
    clearTimeout(stopTimerRef.current);

    if (blob.size < MIN_AUDIO_BYTES) { setBrouillon(''); setEtat(ETATS.RELIT); return; }

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
    setBrouillon(texte);
    setEtat(ETATS.RELIT);
  }, [enregistrer]);

  // ===== Mode « questions » =====
  // On enchaine comme dans une conversation, pas comme un formulaire: entre
  // deux questions, une petite phrase de liaison, puis la question. C'est
  // dit d'un seul souffle, donc elle n'attend pas entre les deux.
  const LIAISONS = [
    'Une autre question pour toi, Nyla. Tu es prête?',
    'Bon, on continue! Autre question.',
    'Maintenant, j’ai une question pour toi.',
    'On en fait une autre? Alors écoute bien.',
  ];

  const poser = useCallback(async (phraseDeRelance) => {
    if (!question) return;
    setRelance(!!phraseDeRelance);
    if (phraseDeRelance) return direPuisEcouter(phraseDeRelance);
    const liaison = idx > 0 ? LIAISONS[(idx - 1) % LIAISONS.length] + ' ' : '';
    await direPuisEcouter(liaison + question.dire);
  }, [question, direPuisEcouter, idx]); // eslint-disable-line react-hooks/exhaustive-deps

  async function envoyerQuestion() {
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
        ok = typeof j.ok === 'boolean' ? j.ok : true;
      } catch { dire = 'Merci Nyla! On continue.'; ok = true; }
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
    if (idx + 1 >= serie.length) return terminer(`Bravo Nyla! On a fini de parler ensemble.`);
    setIdx((i) => i + 1);
    setEtat(ETATS.PRET);
  }

  // ===== Mode « on jase » =====
  const tourDeCauserie = useCallback(async () => {
    setEtat(ETATS.REFLECHIT);
    let ligne = 'Raconte-moi!';
    let fini = false;
    try {
      const res = await fetch('/api/causerie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tours: filRef.current, mascotte: mascotteLabel.toLowerCase() }),
      });
      const j = await res.json();
      if (j.dire) ligne = j.dire;
      fini = !!j.fini;
    } catch {}
    if (!vivantRef.current) return;
    if (fini) { terminer(ligne); return; }
    await direPuisEcouter(ligne);
  }, [direPuisEcouter, mascotteLabel]);

  async function envoyerCauserie() {
    const texte = brouillon.trim();
    if (!texte) { await direPuisEcouter('Je ne t’ai pas entendue. Redis-moi ça?'); return; }
    ajouter('nyla', texte);
    setBrouillon('');
    setEssais((n) => n + 1);
    await tourDeCauserie();
  }

  function terminer(phrase) {
    setEtat(ETATS.FINI);
    ajouter('elle', phrase);
    speakAndWait(phrase);
    try {
      if (mode === 'questions') saveSession('nyla_oral', essais + 1, score, details);
      else saveSession('nyla_oral', Math.max(1, essais), Math.max(1, essais),
        [{ category: 'nyla_oral', type: 'causerie', correct: true }]);
    } catch {}
  }

  const envoyer = () => (mode === 'causerie' ? envoyerCauserie() : envoyerQuestion());
  const reprendre = () => (mode === 'causerie'
    ? direPuisEcouter('Vas-y, je t’écoute.')
    : poser(relance ? question.aide : undefined));

  useEffect(() => {
    if (mode === 'questions' && etat === ETATS.PRET && idx > 0) {
      const t = setTimeout(() => poser(), 500);
      return () => clearTimeout(t);
    }
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  function demarrer(m) {
    setMode(m);
    filRef.current = [];
    setConversation([]);
    setEtat(ETATS.PRET);
    setTimeout(() => (m === 'causerie' ? tourDeCauserie() : poser()), 300);
  }

  // ===== Choisir qui parle =====
  if (etat === ETATS.CHOIX) {
    const suggere = mascotFor('nyla', reglages);
    return (
      <div className="max-w-xl mx-auto px-4 pt-4 pb-10">
        <Entete onHome={onHome} />
        <p className="text-center font-heading text-xl font-extrabold text-stone mb-1">Choisis qui va te parler</p>
        <p className="text-center text-sm font-semibold text-s4 mb-5">Touche un ami.</p>
        <div className="grid grid-cols-3 gap-3">
          {MASCOTS.map((m) => (
            <button key={m.id}
              onClick={() => {
                setAvatar(m.id);
                try { localStorage.setItem(CLE_AVATAR, m.id); } catch {}
                setEtat(ETATS.MODE);
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

  // ===== Choisir ce qu'on fait =====
  if (etat === ETATS.MODE) {
    return (
      <div className="max-w-xl mx-auto px-4 pt-4 pb-10">
        <Entete onHome={onHome} />
        <div className="text-center mb-4">
          <Mascot id={avatar} width={110} />
          <button onClick={() => setEtat(ETATS.CHOIX)} className="block mx-auto text-[11px] font-bold text-s4 underline mt-1">
            changer d’ami
          </button>
        </div>
        <div className="space-y-3">
          <button onClick={() => demarrer('causerie')}
            className="w-full rounded-3xl p-5 text-left text-white active:scale-[0.98] transition-transform"
            style={{ background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)' }}>
            <div className="font-heading text-2xl font-extrabold">💬 On jase</div>
            <div className="text-sm font-semibold text-white/85 mt-0.5">
              Une vraie conversation, deux ou trois minutes. Pas de bonne réponse.
            </div>
          </button>
          <button onClick={() => demarrer('questions')}
            className="w-full rounded-3xl p-5 text-left text-white active:scale-[0.98] transition-transform"
            style={{ background: 'linear-gradient(135deg, #c74a15, #e8622a)' }}>
            <div className="font-heading text-2xl font-extrabold">🎯 Les questions</div>
            <div className="text-sm font-semibold text-white/85 mt-0.5">
              Cinq questions: les jours, compter, les couleurs…
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (micRefuse) {
    return (
      <div className="max-w-xl mx-auto px-4 pt-10 text-center">
        <div className="text-6xl mb-4">🎤</div>
        <h2 className="font-heading text-2xl font-extrabold text-stone mb-2">Le micro est fermé</h2>
        <p className="text-s6 font-semibold mb-2">Pour parler, il faut autoriser le microphone.</p>
        <p className="text-sm text-s4 mb-6">
          Touche l’icône 🎤 (ou le cadenas) à gauche de l’adresse, choisis « Autoriser », puis rouvre la page.
        </p>
        <button onClick={onHome} className="w-full py-3 rounded-xl font-bold text-white"
          style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>← Retour</button>
      </div>
    );
  }

  const enCausant = mode === 'causerie';

  return (
    <div className="max-w-xl mx-auto px-4 pt-4 pb-10">
      <Entete onHome={onHome}
        droite={enCausant ? `${essais} réponses` : `${Math.min(idx + 1, serie.length)}/${serie.length}`} />

      {!enCausant && (
        <div className="w-full bg-s1 rounded-full h-2 mb-4">
          <div className="h-2 rounded-full transition-all duration-300"
            style={{ width: `${(idx / serie.length) * 100}%`, background: 'linear-gradient(90deg, #6d28d9, #8b5cf6)' }} />
        </div>
      )}

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
              <div className="h-3 rounded-full transition-[width] duration-75"
                style={{ width: `${Math.max(4, niveauMic * 100)}%`, background: 'linear-gradient(90deg, #2d7a3a, #4ca65b)' }} />
            </div>
          )}
        </div>
        <button onClick={() => setEtat(ETATS.MODE)} className="text-[11px] font-bold text-s4 underline flex-shrink-0">
          changer
        </button>
      </div>

      {/* La conversation en entier — c'est ce que le parent lit */}
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
                {t.qui === 'nyla' ? 'Nyla' : mascotteLabel}
              </div>
              {t.texte}
            </div>
          </div>
        ))}
        <div ref={basRef} />
      </div>

      {etat === ETATS.RELIT && (
        <div className="bg-purple-50 border-2 border-purple-300 rounded-2xl p-3 mb-3">
          <div className="text-[10px] font-extrabold uppercase tracking-wide text-purple-700 mb-1">
            Elle a dit — corrige si c’est mal entendu
          </div>
          <input value={brouillon} onChange={(e) => setBrouillon(e.target.value)}
            placeholder="(rien entendu)"
            className="w-full px-3 py-2.5 rounded-xl border-2 border-purple-200 focus:border-lava focus:outline-none text-base text-stone font-semibold bg-white" />
          <div className="flex gap-2 mt-2">
            <button onClick={reprendre}
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

      {etat === ETATS.ECOUTE && (
        <button onClick={() => finEcouteRef.current?.()}
          className="w-full py-6 rounded-3xl font-heading font-extrabold text-white text-2xl active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #2d7a3a, #4ca65b)' }}>
          ✓ J’ai fini de parler
        </button>
      )}

      {(etat === ETATS.PARLE || etat === ETATS.REFLECHIT || etat === ETATS.REPOND || etat === ETATS.PRET) && (
        <div className="w-full py-5 rounded-3xl bg-s1 text-center font-heading font-bold text-s6 text-lg">
          {LIBELLE_ETAT[etat] || '…'}
        </div>
      )}

      {etat === ETATS.FINI && (
        <div className="text-center">
          <div className="text-6xl mb-3">🏆</div>
          {enCausant
            ? <p className="font-heading text-2xl font-extrabold text-ok mb-1">Belle conversation!</p>
            : <p className="font-heading text-2xl font-extrabold text-ok mb-1">{score} sur {serie.length}</p>}
          <p className="text-s6 font-semibold mb-5">Tu as bien parlé, Nyla!</p>
          <button onClick={onFinish || onHome}
            className="w-full py-4 rounded-xl font-bold text-white text-lg"
            style={{ background: 'linear-gradient(90deg, #2d7a3a, #4ca65b)' }}>← Retour</button>
        </div>
      )}
    </div>
  );
}

function Entete({ onHome, droite }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <button onClick={onHome} className="text-s4 font-bold text-sm hover:text-lava">← Menu</button>
      <h2 className="font-heading font-bold text-stone">🗣️ On parle ensemble</h2>
      <div className="text-xs font-bold text-s4 min-w-[48px] text-right">{droite || ''}</div>
    </div>
  );
}

// La réaction parlée quand le vérificateur local a su trancher: instantané,
// gratuit, et ça marche même sans réseau.
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
    // Elle a saute un element: on le nomme, et on dit apres quoi il vient.
    // « Bravo! Mais tu as oublie jeudi. Apres mercredi, c'est jeudi. »
    if (local.oublies?.length) {
      const o = local.oublies[0];
      const place = o.apres ? ` Après ${o.apres}, c’est ${o.quoi}.` : '';
      const reste = local.oublies.length > 1 ? ` Et aussi ${local.oublies[1].quoi}.` : '';
      return `${bravo} Mais tu as oublié ${o.quoi}.${place}${reste} On refait la suite ensemble?`;
    }
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
