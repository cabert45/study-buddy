import React, { useState, useMemo, useEffect } from 'react';
import { speak } from '../utils/speech';
import { saveSession } from '../utils/storage';
import { notifySessionResult } from '../utils/notifications';
import { buildSmartQueue, recordAnswer, getWeekSummary } from '../utils/wordMastery';
import { DOSSIER, MOTS, ASPECTS, masteryItems } from '../data/universSocialD1';
import { syncFromServer, weakWords, fetchVariants } from '../data/universSocialStats';
import { isGuest } from '../utils/guest';

// Les pastilles et les notes manuscrites viennent de la feuille de Cayla: on ne les montre qu'à elle
const PERSO = !isGuest();

// Univers social — Dossier 1 (Cayla, secondaire 1)
//   📖 Liste  — les 30 mots, définition du prof + idée-clé + ses notes
//   🃏 Cartes — le mot → elle dit la définition DANS SES MOTS → retourne → s'auto-évalue
//               (format #4 de l'examen; répétition espacée, les rouges/jaunes passent d'abord)
//   ▶ Test    — choix multiple (formats #1-2-3 + images) via la session de pratique

const MASTERY_KEY = 'univers_social_d1';
const CONF = {
  rouge: { dot: 'bg-red-500', label: 'Difficile' },
  jaune: { dot: 'bg-yellow-400', label: 'Moyen' },
  vert: { dot: 'bg-green-500', label: 'Facile' },
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function UniversSocial({ onHome, onStartPractice }) {
  const profile = localStorage.getItem('sb_profile') || 'cayla';
  const [view, setView] = useState('cartes');
  const [tick, setTick] = useState(0);
  const summary = useMemo(() => getWeekSummary(profile, MASTERY_KEY, masteryItems), [tick]);
  const [weak, setWeak] = useState(() => weakWords(6));
  const [aiStatus, setAiStatus] = useState('');

  // À l'ouverture: on récupère ses résultats de Test (tous appareils), puis l'IA
  // écrit de nouveaux textes / phrases pour ses mots faibles.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await syncFromServer(profile);
      const w = weakWords(6);
      if (cancelled) return;
      setWeak(w);
      if (w.length) {
        setAiStatus('🤖 L\'IA prépare de nouvelles questions sur tes mots difficiles…');
        await fetchVariants(w.map((x) => x.id));
        if (!cancelled) setAiStatus('🤖 Nouvelles questions prêtes pour: ' + w.map((x) => x.mot).join(', '));
      }
    })();
    return () => { cancelled = true; };
  }, [profile]);

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-10">
      <div className="flex items-center justify-between mb-1">
        <button onClick={onHome} className="text-s4 font-bold text-sm hover:text-lava">← Menu</button>
        <span className="text-[10px] font-extrabold text-pink-600 bg-pink-50 border border-pink-200 rounded-full px-2 py-0.5">Secondaire 1</span>
      </div>
      <h2 className="font-heading font-extrabold text-stone text-xl leading-tight">🏺 {DOSSIER.titre}</h2>
      <p className="text-xs font-semibold text-s4 mb-3">{DOSSIER.matiere} · 29 mots de vocabulaire</p>

      {/* Ce que l'examen demande */}
      <div className="bg-orange-50 rounded-xl p-3 mb-3 border-2 border-orange-200 text-xs font-semibold text-stone">
        <p className="font-extrabold text-fox-d uppercase tracking-wide mb-1">L'examen demande de</p>
        <p>1. associer le mot à une définition · 2. trouver le mot qui résume un texte · 3. placer un mot dans un texte · 4. <b>donner une définition dans tes mots</b></p>
        <p className="mt-1 text-green-700">✅ Pas besoin d'apprendre les définitions par cœur: il faut juste pouvoir <b>expliquer l'idée dans tes mots</b>.</p>
      </div>

      {/* Maîtrise */}
      <div className="bg-white rounded-xl p-3 mb-3 border-2 border-s1">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-s4 uppercase tracking-wide">Mots maîtrisés (cartes)</p>
          <p className="text-xs font-bold text-stone">{summary.mastered}/{summary.total}</p>
        </div>
        <div className="w-full bg-s1 rounded-full h-3 overflow-hidden flex">
          <div className="h-3" style={{ width: `${(summary.mastered / summary.total) * 100}%`, background: '#2d7a3a' }} />
          <div className="h-3" style={{ width: `${(summary.practicing / summary.total) * 100}%`, background: '#fdcb6e' }} />
          <div className="h-3" style={{ width: `${(summary.learning / summary.total) * 100}%`, background: '#e8622a' }} />
        </div>
      </div>

      {/* Où elle se trompe (d'après ses Tests) */}
      {weak.length > 0 && (
        <div className="bg-red-50 rounded-xl p-3 mb-3 border-2 border-red-200">
          <p className="text-xs font-extrabold text-red-700 uppercase tracking-wide mb-1">🎯 Tes mots à travailler (d'après tes tests)</p>
          <div className="space-y-1">
            {weak.map((w) => (
              <div key={w.id} className="text-sm text-stone">
                <b>{w.mot}</b> <span className="text-xs text-s4 font-bold">{w.right}/{w.total} bon{w.total > 1 ? 's' : ''}</span>
                {w.confusions.length > 0 && (
                  <span className="text-xs text-red-700 font-semibold"> — tu l'as confondu avec {w.confusions.slice(0, 2).map((c) => c.mot).join(' et ')}</span>
                )}
              </div>
            ))}
          </div>
          {aiStatus && <p className="text-[11px] font-bold text-s4 mt-2">{aiStatus}</p>}
          <p className="text-[11px] font-semibold text-s4 mt-1">Le Test te repose ces mots plus souvent et te ressort exprès les choix que tu as confondus.</p>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button onClick={() => setView('cartes')}
          className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-bold ${view === 'cartes' ? 'bg-stone text-white' : 'bg-white border-2 border-s2 text-s6'}`}>
          🃏 Cartes
        </button>
        <button onClick={() => setView('liste')}
          className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-bold ${view === 'liste' ? 'bg-stone text-white' : 'bg-white border-2 border-s2 text-s6'}`}>
          📖 Liste
        </button>
        {onStartPractice && (
          <button onClick={() => onStartPractice('univers_social')}
            className="flex-1 rounded-xl px-3 py-2.5 text-sm font-bold bg-white border-2 border-s2 text-s6 hover:border-lava hover:text-lava">
            ▶ Test
          </button>
        )}
      </div>

      {view === 'liste' && <Liste />}
      {view === 'cartes' && <Cartes profile={profile} onAnswer={() => setTick((t) => t + 1)} onHome={onHome} />}
    </div>
  );
}

function Pastille({ confiance }) {
  const c = CONF[confiance] || CONF.vert;
  return <span title={c.label} className={`inline-block w-3 h-3 rounded-full ${c.dot} flex-shrink-0`} />;
}

function AspectTag({ aspect }) {
  const a = ASPECTS[aspect];
  if (!a) return null;
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: a.color }}>{a.label}</span>
  );
}

// ---------------------------------------------------------------- Liste
function Liste() {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-s4 text-center">{PERSO ? 'Les pastilles sont celles de ta feuille: 🔴 difficile · 🟡 moyen · 🟢 facile. ' : ''}Touche un mot pour voir la définition complète.</p>
      {MOTS.map((m) => (
        <div key={m.id} className="bg-white rounded-2xl border-2 border-s1 p-3">
          <button onClick={() => setOpen(open === m.id ? null : m.id)} className="w-full text-left">
            <div className="flex items-center gap-2 flex-wrap">
              {PERSO && <Pastille confiance={m.confiance} />}
              <span className="font-heading font-extrabold text-stone">{m.mot}</span>
              {m.page && <span className="text-[10px] text-s4 font-bold">p.{m.page}</span>}
              <AspectTag aspect={m.aspect} />
            </div>
            <p className="text-sm font-semibold text-stone mt-1">{m.cle}</p>
          </button>
          <button onClick={() => speak(`${m.mot}. ${m.cle}`)} className="mt-1 text-xs font-bold text-fox-d">🔊 Écouter le mot et l'idée simple</button>
          {open === m.id && (
            <div className="mt-2 pt-2 border-t border-s1 text-sm">
              <p className="text-xs font-bold text-s4 uppercase">Définition du prof</p>
              <p className="text-stone font-medium">{m.def}</p>
              {PERSO && m.note && <p className="mt-1 text-pink-600 font-semibold">✍️ Ta note: {m.note}</p>}
              <div className="flex gap-3 mt-1">
                <button onClick={() => speak(`${m.mot}. ${m.cle}`)} className="text-xs font-bold text-fox-d">🔊 Écouter l'idée simple</button>
                <button onClick={() => speak(`${m.mot}. ${m.def}`)} className="text-xs font-bold text-s4">🔊 Définition du prof</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- Cartes
function Cartes({ profile, onAnswer, onHome }) {
  const [started, setStarted] = useState(false);
  const [queue, setQueue] = useState([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [round, setRound] = useState(1);
  const [missed, setMissed] = useState([]);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [done, setDone] = useState(false);
  const [unknown, setUnknown] = useState(false); // « je ne le connais pas » → on écoute l'explication

  // Le mot est lu à voix haute dès qu'une carte apparaît (elle ne connaît pas encore la plupart des mots)
  const current = queue[idx];
  useEffect(() => {
    if (started && current && !flipped) setTimeout(() => speak(current.mot), 250);
  }, [current, started]);

  function start() {
    // Priorité: les mots ratés / nouveaux d'abord, puis on met les rouges et jaunes de sa feuille en tête
    const q = buildSmartQueue(profile, MASTERY_KEY, masteryItems);
    const rank = { rouge: 0, jaune: 1, vert: 2 };
    const half = Math.ceil(q.length / 2);
    const top = q.slice(0, half).sort((a, b) => rank[a.confiance] - rank[b.confiance]);
    setQueue([...top, ...q.slice(half)]);
    setIdx(0); setFlipped(false); setRound(1); setMissed([]); setStats({ correct: 0, total: 0 }); setDone(false);
    setStarted(true);
  }

  function grade(ok) {
    const m = queue[idx];
    recordAnswer(profile, MASTERY_KEY, m.correct, ok);
    onAnswer && onAnswer();
    const s = { correct: stats.correct + (ok ? 1 : 0), total: stats.total + 1 };
    setStats(s);
    const nextMissed = ok ? missed : [...missed, m];
    if (idx + 1 < queue.length) {
      setIdx(idx + 1); setFlipped(false); setUnknown(false); setMissed(nextMissed);
      return;
    }
    if (nextMissed.length === 0) {
      setDone(true);
      saveSession('univers_social_cartes', s.total, s.correct, [{ category: 'univers_social', correct: true }]);
      notifySessionResult({ profile, mode: 'univers social — cartes', correct: s.correct, total: s.total, streak: 0, results: [] });
      return;
    }
    setRound((r) => r + 1); setQueue(shuffle(nextMissed)); setMissed([]); setIdx(0); setFlipped(false); setUnknown(false);
  }

  if (!started) {
    return (
      <div className="bg-white rounded-2xl border-2 border-s1 p-5 text-center">
        <div className="text-4xl mb-2">🃏</div>
        <h3 className="font-heading text-xl font-extrabold text-stone mb-1">Explique chaque mot dans tes mots</h3>
        <p className="text-sm font-semibold text-s4 mb-2">
          <b>Rien à écrire ni à taper.</b> Tu vois le mot, tu l'expliques <b>à voix haute</b> comme à une amie, puis tu retournes la carte et tu compares avec l'idée-clé.
        </p>
        <p className="text-sm font-semibold text-s4 mb-4">
          Pas besoin des mêmes mots que le prof — seulement la bonne idée. Sois honnête: « Je l'avais » seulement si l'idée y était.
          Les mots ratés reviennent au tour suivant.
        </p>
        <button onClick={start} className="w-full py-3 rounded-xl font-bold text-white text-lg"
          style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
          Commencer les 29 mots
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="bg-white rounded-2xl border-2 border-s1 p-6 text-center">
        <div className="text-6xl mb-3">🏆</div>
        <h3 className="font-heading text-2xl font-extrabold text-ok mb-1">Les 29 mots sont passés!</h3>
        <p className="text-stone font-semibold mb-5">{stats.correct}/{stats.total} du premier coup · {round} tour{round > 1 ? 's' : ''}</p>
        <button onClick={start} className="w-full py-3 rounded-xl font-bold text-white mb-2"
          style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>Encore une fois</button>
        <button onClick={onHome} className="w-full py-3 rounded-xl font-bold text-s6 bg-white border-2 border-s2">← Menu</button>
      </div>
    );
  }

  const m = queue[idx];
  if (!m) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-xs font-bold text-s4">
        <span>Tour {round} · {idx + 1}/{queue.length}</span>
        <span>{stats.correct} ✓ · {stats.total - stats.correct} ✗ · {missed.length} à revoir</span>
      </div>

      <div className="bg-white rounded-2xl p-6 border-2 border-s1 border-l-4 border-l-lava min-h-[220px]">
        <div className="flex items-center gap-2 mb-3">
          {PERSO && <Pastille confiance={m.confiance} />}
          <AspectTag aspect={m.aspect} />
          {m.page && <span className="text-[10px] text-s4 font-bold">p.{m.page}</span>}
        </div>
        <div className="flex items-center gap-3 mb-2">
          <p className="font-heading text-3xl font-extrabold text-stone">{m.mot}</p>
          <button onClick={() => speak(m.mot)} aria-label="Écouter le mot"
            className="w-10 h-10 rounded-full bg-orange-50 border-2 border-orange-200 text-lg flex-shrink-0">🔊</button>
        </div>
        {m.alias && <p className="text-xs font-semibold text-s4 mb-2">aussi: {m.alias}</p>}

        {!flipped ? (
          <>
            <p className="text-sm font-semibold text-s4 mb-4">Explique ce mot à voix haute, dans tes mots (rien à écrire), puis retourne la carte.</p>
            <button onClick={() => { setFlipped(true); speak(m.cle); }}
              className="w-full py-3 rounded-xl font-bold text-white"
              style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
              Retourner la carte
            </button>
            <button onClick={() => { setUnknown(true); setFlipped(true); speak(`${m.mot}. ${m.cle}`); }}
              className="w-full mt-2 py-3 rounded-xl font-bold text-s6 bg-white border-2 border-s2 hover:border-lava">
              ❓ Je ne le connais pas → écouter l'explication
            </button>
          </>
        ) : (
          <>
            <div className="bg-cream rounded-xl border-2 border-s1 p-3 mb-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-fox-d uppercase">L'idée à avoir</p>
                <button onClick={() => speak(`${m.mot}. ${m.cle}`)} className="text-xs font-bold text-fox-d">🔊 Écouter l'idée simple</button>
              </div>
              <p className="font-heading text-lg font-bold text-stone">{m.cle}</p>
              {PERSO && m.note && <p className="mt-1 text-sm text-pink-600 font-semibold">✍️ Ta note: {m.note}</p>}
              <details className="mt-2">
                <summary className="text-xs font-bold text-s4 cursor-pointer">Voir la définition du prof (pour référence seulement)</summary>
                <p className="text-sm text-stone font-medium mt-1">{m.def}</p>
              </details>
            </div>
            {unknown ? (
              <>
                <p className="text-xs font-bold text-s4 text-center mb-2">Répète l'idée à voix haute une fois, puis continue. Ce mot reviendra au prochain tour.</p>
                <button onClick={() => grade(false)} className="w-full py-3 rounded-xl font-bold text-white"
                  style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
                  Compris, suivant →
                </button>
              </>
            ) : (
              <>
                <p className="text-xs font-bold text-s4 text-center mb-2">Est-ce que ton explication avait cette idée?</p>
                <div className="flex gap-2">
                  <button onClick={() => grade(false)} className="flex-1 py-3 rounded-xl font-bold text-red-600 bg-red-50 border-2 border-red-300">✗ À revoir</button>
                  <button onClick={() => grade(true)} className="flex-1 py-3 rounded-xl font-bold text-white bg-green-600">✓ Je l'avais</button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
