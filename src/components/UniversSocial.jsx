import React, { useState, useMemo, useEffect } from 'react';
import { Landmark, Layers, List, ClipboardCheck, Target, Info } from 'lucide-react';
import { SecHeader, Segmented, MasteryBar, Callout, StartCard, IconTile } from './sec/SecUi';
import { Volume2, HelpCircle, Trophy, PenLine } from 'lucide-react';
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
      <SecHeader onBack={onHome} icon={Landmark} tone="amber"
        eyebrow="Univers social · Histoire · Dossier 1" title="La sédentarisation"
        subtitle="29 notions de vocabulaire, du Paléolithique au troc" />

      <Callout tone="indigo" icon={Info} title="Ce que l'examen demande">
        Associer un mot à sa définition · trouver le mot qui résume un texte · placer un mot dans un texte · <b className="text-stone">définir un mot dans tes mots</b>.
        <span className="block mt-1.5 text-emerald-700 font-medium">Pas besoin d'apprendre par cœur: explique l'idée dans tes mots.</span>
      </Callout>

      <MasteryBar label="Notions maîtrisées" summary={summary} />

      {/* Où elle se trompe (d'après ses Tests) */}
      {weak.length > 0 && (
        <div className="bg-white rounded-2xl p-4 mb-3 border border-s1" style={{ boxShadow: 'inset 3px 0 0 #fb7185, 0 1px 2px rgba(15,23,42,.04)' }}>
          <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.06em] text-rose-700 mb-2"><Target size={14} /> À travailler, d'après tes tests</p>
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

      <div className="mt-5">
        <Segmented value={view}
          onChange={(id) => (id === 'test' ? onStartPractice && onStartPractice('univers_social') : setView(id))}
          items={[
            { id: 'cartes', label: 'Cartes', icon: Layers },
            { id: 'liste', label: 'Liste', icon: List },
            ...(onStartPractice ? [{ id: 'test', label: 'Test', icon: ClipboardCheck }] : []),
          ]} />
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
          <button onClick={() => speak(`${m.mot}. ${m.cle}`)} className="mt-1 text-xs font-bold text-fox-d">Écouter le mot et l'idée simple</button>
          {open === m.id && (
            <div className="mt-2 pt-2 border-t border-s1 text-sm">
              <p className="text-xs font-bold text-s4 uppercase">Définition du prof</p>
              <p className="text-stone font-medium">{m.def}</p>
              {PERSO && m.note && <p className="mt-1 text-pink-600 font-semibold">Ta note: {m.note}</p>}
              <div className="flex gap-3 mt-1">
                <button onClick={() => speak(`${m.mot}. ${m.cle}`)} className="text-xs font-bold text-fox-d">Écouter l'idée simple</button>
                <button onClick={() => speak(`${m.mot}. ${m.def}`)} className="text-xs font-bold text-s4">Écouter la définition du prof</button>
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
        <div className="flex justify-center mb-3"><IconTile icon={Layers} tone="indigo" size={56} /></div>
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
        <div className="flex justify-center mb-3"><IconTile icon={Trophy} tone="emerald" size={60} /></div>
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
            className="w-10 h-10 rounded-full bg-orange-50 border border-orange-200 text-fox-d flex items-center justify-center flex-shrink-0"><Volume2 size={18} /></button>
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
              <span className="inline-flex items-center gap-2"><HelpCircle size={16} /> Je ne le connais pas — écouter l'explication</span>
            </button>
          </>
        ) : (
          <>
            <div className="bg-cream rounded-xl border-2 border-s1 p-3 mb-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-fox-d uppercase">L'idée à avoir</p>
                <button onClick={() => speak(`${m.mot}. ${m.cle}`)} className="text-xs font-bold text-fox-d">Écouter l'idée simple</button>
              </div>
              <p className="font-heading text-lg font-bold text-stone">{m.cle}</p>
              {PERSO && m.note && <p className="mt-1 text-sm text-pink-600 font-semibold">Ta note: {m.note}</p>}
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
