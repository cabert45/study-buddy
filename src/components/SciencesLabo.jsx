import React, { useState, useEffect, useRef, useMemo } from 'react';
import { speak } from '../utils/speech';
import { saveSession } from '../utils/storage';
import { notifySessionResult } from '../utils/notifications';
import { buildSmartQueue, recordAnswer, getWeekSummary } from '../utils/wordMastery';
import { INSTRUMENTS, MONTAGES, EXTRA, ALL_NAMES, byId, isNameCorrect, masteryItems } from '../data/sciencesLabo';
import { isGuest } from '../utils/guest';

// Sciences — Instruments de laboratoire (Cayla, secondaire 1). Test le 14 sept. 2026.
//   🃏 Cartes — photo → elle dit le NOM et l'UTILITÉ à voix haute → retourne → s'auto-évalue
//   ✍️ Écrire — photo → elle TAPE le nom (orthographe exacte: électronique, nacelle, pH…)
//   ▶ Quiz    — choix multiples avec photos: nom, utilité, et les montages (flèches)
// Écran autonome (avec ses propres images) — ne passe pas par PracticeSession.

const MASTERY_KEY = 'sciences_labo';
const ALL_ITEMS = [...INSTRUMENTS, ...EXTRA];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function grad() { return { background: 'linear-gradient(90deg, #c74a15, #e8622a)' }; }

export default function SciencesLabo({ onHome }) {
  const profile = localStorage.getItem('sb_profile') || 'cayla';
  const [view, setView] = useState('cartes');
  const [tick, setTick] = useState(0);
  const summary = useMemo(() => getWeekSummary(profile, MASTERY_KEY, masteryItems), [tick]);
  const bump = () => setTick((t) => t + 1);

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-10">
      <div className="flex items-center justify-between mb-1">
        <button onClick={onHome} className="text-s4 font-bold text-sm hover:text-lava">← Menu</button>
        <span className="text-[10px] font-extrabold text-pink-600 bg-pink-50 border border-pink-200 rounded-full px-2 py-0.5">Secondaire 1</span>
      </div>
      <h2 className="font-heading font-extrabold text-stone text-xl leading-tight">🧪 Instruments de laboratoire</h2>
      <p className="text-xs font-semibold text-s4 mb-3">Sciences · Labo d'introduction · 14 instruments + les montages</p>

      <div className="bg-orange-50 rounded-xl p-3 mb-3 border-2 border-orange-200 text-xs font-semibold text-stone">
        <p className="font-extrabold text-fox-d uppercase tracking-wide mb-1">À savoir pour le test</p>
        <p>Pour chaque photo: le <b>nom exact</b> (balance <b>électronique</b>, pince <b>universelle</b>, <b>nacelle</b>, papier <b>pH</b>) et son <b>utilité</b>. Et reconnaître les instruments dans un montage.</p>
      </div>

      <div className="bg-white rounded-xl p-3 mb-3 border-2 border-s1">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-s4 uppercase tracking-wide">Instruments maîtrisés</p>
          <p className="text-xs font-bold text-stone">{summary.mastered}/{summary.total}</p>
        </div>
        <div className="w-full bg-s1 rounded-full h-3 overflow-hidden flex">
          <div className="h-3" style={{ width: `${(summary.mastered / summary.total) * 100}%`, background: '#2d7a3a' }} />
          <div className="h-3" style={{ width: `${(summary.practicing / summary.total) * 100}%`, background: '#fdcb6e' }} />
          <div className="h-3" style={{ width: `${(summary.learning / summary.total) * 100}%`, background: '#e8622a' }} />
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {[['cartes', '🃏 Cartes'], ['ecrire', '✍️ Écrire'], ['quiz', '▶ Quiz']].map(([id, label]) => (
          <button key={id} onClick={() => setView(id)}
            className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-bold ${view === id ? 'bg-stone text-white' : 'bg-white border-2 border-s2 text-s6'}`}>
            {label}
          </button>
        ))}
      </div>

      {view === 'cartes' && <Cartes profile={profile} onAnswer={bump} onHome={onHome} />}
      {view === 'ecrire' && <Ecrire profile={profile} onAnswer={bump} onHome={onHome} />}
      {view === 'quiz' && <Quiz profile={profile} onAnswer={bump} onHome={onHome} />}
    </div>
  );
}

function Photo({ src, alt, small }) {
  if (!src) return null;
  return (
    <div className={`bg-white rounded-xl border-2 border-s1 overflow-hidden flex items-center justify-center ${small ? 'h-40' : 'h-56'} mb-3`}>
      <img src={src} alt={alt || ''} className="max-h-full max-w-full object-contain" />
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

  function start() {
    setQueue(buildSmartQueue(profile, MASTERY_KEY, masteryItems));
    setIdx(0); setFlipped(false); setRound(1); setMissed([]); setStats({ correct: 0, total: 0 }); setDone(false); setStarted(true);
  }

  function grade(ok) {
    const m = queue[idx];
    recordAnswer(profile, MASTERY_KEY, m.correct, ok);
    onAnswer();
    const s = { correct: stats.correct + (ok ? 1 : 0), total: stats.total + 1 };
    setStats(s);
    const nextMissed = ok ? missed : [...missed, m];
    if (idx + 1 < queue.length) { setIdx(idx + 1); setFlipped(false); setMissed(nextMissed); return; }
    if (nextMissed.length === 0) {
      setDone(true);
      saveSession('sciences_labo_cartes', s.total, s.correct, [{ category: 'sciences_labo', correct: true }]);
      notifySessionResult({ profile, mode: 'sciences — instruments (cartes)', correct: s.correct, total: s.total, streak: 0, results: [] });
      return;
    }
    setRound((r) => r + 1); setQueue(shuffle(nextMissed)); setMissed([]); setIdx(0); setFlipped(false);
  }

  if (!started) {
    return (
      <div className="bg-white rounded-2xl border-2 border-s1 p-5 text-center">
        <div className="text-4xl mb-2">🃏</div>
        <h3 className="font-heading text-xl font-extrabold text-stone mb-1">Nomme l'instrument et dis à quoi il sert</h3>
        <p className="text-sm font-semibold text-s4 mb-4">
          Tu vois la photo. Dis le <b>nom</b> et l'<b>utilité</b> à voix haute (rien à écrire), puis retourne la carte.
          « Je ne le connais pas » te lit la réponse. Les instruments ratés reviennent au tour suivant.
        </p>
        <button onClick={start} className="w-full py-3 rounded-xl font-bold text-white text-lg" style={grad()}>Commencer</button>
      </div>
    );
  }
  if (done) return <Done stats={stats} round={round} onAgain={start} onHome={onHome} />;
  const m = queue[idx];
  if (!m) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-xs font-bold text-s4">
        <span>Tour {round} · {idx + 1}/{queue.length}</span>
        <span>{stats.correct} ✓ · {stats.total - stats.correct} ✗ · {missed.length} à revoir</span>
      </div>
      <div className="bg-white rounded-2xl p-5 border-2 border-s1 border-l-4 border-l-lava">
        {m.img ? <Photo src={m.img} alt="" /> : (
          <p className="font-heading text-2xl font-extrabold text-stone mb-3">{m.nom}</p>
        )}
        {!flipped ? (
          <>
            <p className="text-sm font-semibold text-s4 mb-3">{m.img ? "C'est quoi? Et ça sert à quoi? Dis-le à voix haute." : 'À quoi ça sert? Dis-le à voix haute.'}</p>
            <button onClick={() => { setFlipped(true); speak(`${m.nom}. ${m.cle}`); }} className="w-full py-3 rounded-xl font-bold text-white" style={grad()}>Retourner la carte</button>
            <button onClick={() => { setFlipped(true); speak(`${m.nom}. ${m.cle}`); }}
              className="w-full mt-2 py-3 rounded-xl font-bold text-s6 bg-white border-2 border-s2 hover:border-lava">
              ❓ Je ne le connais pas → écouter la réponse
            </button>
          </>
        ) : (
          <>
            <div className="bg-cream rounded-xl border-2 border-s1 p-3 mb-3">
              <div className="flex items-center gap-2">
                <p className="font-heading text-2xl font-extrabold text-stone">{m.nom}</p>
                <button onClick={() => speak(`${m.nom}. ${m.cle}`)} className="text-lg">🔊</button>
              </div>
              <p className="text-xs font-bold text-fox-d uppercase mt-2">Utilité</p>
              <p className="text-sm font-semibold text-stone">{m.utilite}</p>
              {m.piege && <p className="mt-2 text-xs font-bold text-red-600">⚠️ {isGuest() ? `Erreur fréquente: « ${m.piege} »` : `Sur ta feuille tu avais écrit « ${m.piege} »`} — le bon nom est « {m.nom} ».</p>}
            </div>
            <p className="text-xs font-bold text-s4 text-center mb-2">Tu avais le nom ET l'utilité?</p>
            <div className="flex gap-2">
              <button onClick={() => grade(false)} className="flex-1 py-3 rounded-xl font-bold text-red-600 bg-red-50 border-2 border-red-300">✗ À revoir</button>
              <button onClick={() => grade(true)} className="flex-1 py-3 rounded-xl font-bold text-white bg-green-600">✓ Je l'avais</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Écrire
function Ecrire({ profile, onAnswer, onHome }) {
  const [started, setStarted] = useState(false);
  const [queue, setQueue] = useState([]);
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [round, setRound] = useState(1);
  const [missed, setMissed] = useState([]);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [done, setDone] = useState(false);
  const inputRef = useRef(null);
  const item = queue[idx];

  useEffect(() => { if (item && !revealed) setTimeout(() => inputRef.current?.focus(), 100); }, [item, revealed]);

  function start() {
    // seulement les items avec photo (comme au test)
    setQueue(buildSmartQueue(profile, MASTERY_KEY, masteryItems.filter((i) => i.img)));
    setIdx(0); setTyped(''); setRevealed(false); setRound(1); setMissed([]); setStats({ correct: 0, total: 0 }); setDone(false); setStarted(true);
  }

  function check(e) {
    e?.preventDefault();
    if (revealed) return next();
    if (!typed.trim()) return;
    const ok = isNameCorrect(typed, item);
    setStats((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }));
    recordAnswer(profile, MASTERY_KEY, item.correct, ok);
    onAnswer();
    if (!ok) setMissed((m) => [...m, item]);
    setRevealed(true);
    speak(item.nom);
  }

  function skip() {
    setMissed((m) => [...m, item]);
    setStats((s) => ({ ...s, total: s.total + 1 }));
    recordAnswer(profile, MASTERY_KEY, item.correct, false);
    onAnswer();
    setRevealed(true);
    speak(item.nom);
  }

  function next() {
    if (idx + 1 < queue.length) { setIdx(idx + 1); setTyped(''); setRevealed(false); return; }
    if (missed.length === 0) {
      setDone(true);
      saveSession('sciences_labo_ecrire', stats.total, stats.correct, [{ category: 'sciences_labo', correct: true }]);
      notifySessionResult({ profile, mode: 'sciences — instruments (écrire)', correct: stats.correct, total: stats.total, streak: 0, results: [] });
      return;
    }
    setRound((r) => r + 1); setQueue(shuffle(missed)); setMissed([]); setIdx(0); setTyped(''); setRevealed(false);
  }

  if (!started) {
    return (
      <div className="bg-white rounded-2xl border-2 border-s1 p-5 text-center">
        <div className="text-4xl mb-2">✍️</div>
        <h3 className="font-heading text-xl font-extrabold text-stone mb-1">Écris le nom de l'instrument</h3>
        <p className="text-sm font-semibold text-s4 mb-4">
          Comme au test: la photo, et tu tapes le nom. Les accents sont tolérés, mais les lettres comptent:
          « électro<b>n</b>ique », « na<b>c</b>elle », « papier p<b>H</b> », « pince <b>universelle</b> ».
        </p>
        <button onClick={start} className="w-full py-3 rounded-xl font-bold text-white text-lg" style={grad()}>Commencer</button>
      </div>
    );
  }
  if (done) return <Done stats={stats} round={round} onAgain={start} onHome={onHome} />;
  if (!item) return null;
  const ok = revealed && isNameCorrect(typed, item);

  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-xs font-bold text-s4">
        <span>Tour {round} · {idx + 1}/{queue.length}</span>
        <span>{stats.correct} ✓ · {stats.total - stats.correct} ✗ · {missed.length} à revoir</span>
      </div>
      <div className="bg-white rounded-2xl p-5 border-2 border-s1 border-l-4 border-l-lava">
        <Photo src={item.img} alt="" />
        <form onSubmit={check}>
          <input ref={inputRef} type="text" value={typed} onChange={(e) => setTyped(e.target.value)} disabled={revealed}
            placeholder="Nom de l'instrument..." autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
            className={`w-full px-4 py-3 rounded-xl border-2 font-heading text-xl font-bold text-center focus:outline-none ${
              !revealed ? 'border-s2 text-stone focus:border-lava' : ok ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-400 text-red-600'}`} />
          {revealed && (
            <div className="mt-3 p-3 bg-cream rounded-xl border-2 border-s1">
              <p className="text-xs font-bold text-s4 uppercase">Réponse</p>
              <p className="font-heading text-2xl font-extrabold text-stone">{item.nom}</p>
              <p className="text-sm font-semibold text-stone mt-1">{item.utilite}</p>
              {ok ? <p className="text-xs font-bold text-ok mt-2">✓ Bravo!</p>
                : <p className="text-xs font-bold text-red-600 mt-2">Regarde bien l'orthographe. Tu le reverras au prochain tour.</p>}
            </div>
          )}
          {!revealed ? (
            <div className="flex gap-2 mt-3">
              <button type="submit" disabled={!typed.trim()} className="flex-1 py-3 rounded-xl font-bold text-white disabled:opacity-40" style={grad()}>✓ Vérifier</button>
              <button type="button" onClick={skip} className="px-4 py-3 rounded-xl font-bold text-s4 bg-white border-2 border-s2">Je ne sais pas</button>
            </div>
          ) : (
            <button type="button" onClick={next} className="w-full mt-3 py-3 rounded-xl font-bold text-white" style={grad()}>
              {idx + 1 < queue.length ? 'Suivant →' : (missed.length === 0 ? 'Terminer 🏆' : `Tour suivant (${missed.length} à revoir)`)}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Quiz (choix multiples avec photos)
const QUIZ_SIZE = 15;

function nameOptions(correct, piege) {
  const opts = new Set([correct]);
  if (piege && Math.random() < 0.7) opts.add(piege);
  for (const n of shuffle(ALL_NAMES)) { if (opts.size >= 4) break; opts.add(n); }
  return shuffle([...opts]);
}
function useOptions(item) {
  const opts = new Set([item.cle]);
  for (const i of shuffle(ALL_ITEMS)) { if (opts.size >= 4) break; if (i.id !== item.id) opts.add(i.cle); }
  return shuffle([...opts]);
}

function makeQuestion(item) {
  const r = Math.random();
  if (r < 0.4 && item.img) {
    return { item, kind: 'Nom de l\'instrument', img: item.img, text: 'Quel est le nom de cet instrument?', correct: item.nom, options: nameOptions(item.nom, item.piege) };
  }
  if (r < 0.7) {
    return { item, kind: 'Utilité', img: item.img, text: `À quoi sert ${item.img ? 'cet instrument' : 'le ' + item.nom.toLowerCase()}?`, correct: item.cle, options: useOptions(item) };
  }
  if (r < 0.85) {
    return { item, kind: 'Trouve l\'instrument', img: null, text: `Quel instrument sert à: « ${item.utilite} »`, correct: item.nom, options: nameOptions(item.nom, item.piege) };
  }
  const m = pick(MONTAGES.filter((x) => x.ref === item.id)) || pick(MONTAGES);
  const target = byId[m.ref];
  return { item: target, kind: 'Montage', img: m.img, text: `${m.fleche}: quel instrument est-ce?`, correct: m.nom, options: nameOptions(m.nom, target?.piege) };
}

function Quiz({ profile, onAnswer, onHome }) {
  const [started, setStarted] = useState(false);
  const [qs, setQs] = useState([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [done, setDone] = useState(false);
  const [results, setResults] = useState([]);

  function start() {
    const order = buildSmartQueue(profile, MASTERY_KEY, masteryItems);
    const items = [...order, ...order].slice(0, QUIZ_SIZE);
    setQs(items.map(makeQuestion));
    setIdx(0); setSelected(null); setStats({ correct: 0, total: 0 }); setDone(false); setResults([]); setStarted(true);
  }

  function answer(opt) {
    if (selected !== null) return;
    const q = qs[idx];
    const ok = opt === q.correct;
    setSelected(opt);
    recordAnswer(profile, MASTERY_KEY, q.item.nom, ok);
    onAnswer();
    setStats((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }));
    setResults((r) => [...r, { question: `${q.kind}: ${q.text}`, category: 'sciences_labo', correct: ok, userAnswer: opt, correctAnswer: q.correct }]);
    speak(ok ? 'Bravo!' : `${q.correct}`);
  }

  function next() {
    if (idx + 1 < qs.length) { setIdx(idx + 1); setSelected(null); return; }
    setDone(true);
    saveSession('sciences_labo_quiz', stats.total, stats.correct, results);
    notifySessionResult({ profile, mode: 'sciences — instruments (quiz)', correct: stats.correct, total: stats.total, streak: 0, results: [] });
  }

  if (!started) {
    return (
      <div className="bg-white rounded-2xl border-2 border-s1 p-5 text-center">
        <div className="text-4xl mb-2">▶</div>
        <h3 className="font-heading text-xl font-extrabold text-stone mb-1">Quiz à choix multiples</h3>
        <p className="text-sm font-semibold text-s4 mb-4">{QUIZ_SIZE} questions avec photos: le nom, l'utilité, et les instruments dans les montages. Les mauvais noms de ta feuille sont dans les choix — attention!</p>
        <button onClick={start} className="w-full py-3 rounded-xl font-bold text-white text-lg" style={grad()}>Commencer</button>
      </div>
    );
  }
  if (done) return <Done stats={stats} round={1} onAgain={start} onHome={onHome} />;
  const q = qs[idx];
  if (!q) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-xs font-bold text-s4">
        <span>{idx + 1}/{qs.length}</span>
        <span>{stats.correct} ✓ · {stats.total - stats.correct} ✗</span>
      </div>
      <div className="bg-white rounded-2xl p-5 border-2 border-s1 border-l-4 border-l-lava">
        <p className="text-[10px] font-extrabold uppercase tracking-wide text-fox-d mb-2">{q.kind}</p>
        <Photo src={q.img} alt="" small />
        <p className="font-heading text-lg font-bold text-stone mb-3">{q.text}</p>
        <div className="grid grid-cols-1 gap-2">
          {q.options.map((opt) => {
            let cls = 'bg-white border-s2 text-stone hover:border-fox';
            if (selected !== null) {
              if (opt === q.correct) cls = 'bg-green-50 border-green-500 text-green-700';
              else if (opt === selected) cls = 'bg-red-50 border-red-400 text-red-600';
              else cls = 'bg-gray-50 border-gray-200 text-gray-400';
            }
            return (
              <button key={opt} onClick={() => answer(opt)} disabled={selected !== null}
                className={`py-3 px-3 rounded-xl border-2 font-bold text-left ${cls}`}>{opt}</button>
            );
          })}
        </div>
        {selected !== null && (
          <>
            <div className="mt-3 p-3 bg-cream rounded-xl border-2 border-s1 text-sm">
              <b>{q.item?.nom}</b> — {q.item?.utilite}
              {q.item?.piege && selected === q.item.piege && <p className="text-red-600 font-bold mt-1">⚠️ « {q.item.piege} » n'existe pas dans la banque de mots. C'est « {q.item.nom} ».</p>}
            </div>
            <button onClick={next} className="w-full mt-3 py-3 rounded-xl font-bold text-white" style={grad()}>{idx + 1 < qs.length ? 'Suivant →' : 'Terminer 🏆'}</button>
          </>
        )}
      </div>
    </div>
  );
}

function Done({ stats, round, onAgain, onHome }) {
  const pct = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0;
  return (
    <div className="bg-white rounded-2xl border-2 border-s1 p-6 text-center">
      <div className="text-6xl mb-3">{pct >= 80 ? '🏆' : '💪'}</div>
      <h3 className="font-heading text-2xl font-extrabold text-ok mb-1">{stats.correct}/{stats.total} ({pct}%)</h3>
      <p className="text-stone font-semibold mb-5">{round > 1 ? `${round} tours` : 'Bien joué!'}</p>
      <button onClick={onAgain} className="w-full py-3 rounded-xl font-bold text-white mb-2" style={grad()}>Encore</button>
      <button onClick={onHome} className="w-full py-3 rounded-xl font-bold text-s6 bg-white border-2 border-s2">← Menu</button>
    </div>
  );
}
