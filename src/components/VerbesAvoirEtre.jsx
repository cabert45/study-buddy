import React, { useState, useEffect, useRef, useMemo } from 'react';
import { speak } from '../utils/speech';
import { saveSession } from '../utils/storage';
import { notifySessionResult } from '../utils/notifications';
import { buildSmartQueue, recordAnswer, getWeekSummary } from '../utils/wordMastery';
import {
  TENSES, VERBES, VERB_IDS, tenseById, personsFor, display, promptPrefix, tenseLabel,
  buildItems, isCorrectAnswer, loadSelection, saveSelection,
} from '../data/verbesAvoirEtre';

// Verbes AVOIR & ÊTRE — tous les modes et temps (Cayla, secondaire 1)
// 3 façons de travailler:
//   📖 Tableau  — lire / écouter les conjugaisons sélectionnées
//   ✍️ Écrire   — taper la forme (comme au vrai test); les formes ratées reviennent
//   ▶ Choix multiple — via la session de pratique habituelle (progrès dans le tableau de bord)

const MASTERY_KEY = 'verbes_avoir_etre';
const MODES = ['Indicatif', 'Conditionnel', 'Subjonctif', 'Impératif'];
const LEVEL_LABEL = { 1: 'Temps simples', 2: 'Temps composés', 3: 'À reconnaître' };
const LEVEL_STYLE = {
  1: 'bg-green-50 text-green-700 border-green-200',
  2: 'bg-orange-50 text-orange-700 border-orange-200',
  3: 'bg-purple-50 text-purple-700 border-purple-200',
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function diffChars(typed, correct) {
  const out = [];
  const max = Math.max(typed.length, correct.length);
  for (let i = 0; i < max; i++) {
    const t = typed[i] || '';
    const c = correct[i] || '';
    if (t === c) out.push({ char: c, status: 'ok' });
    else if (i >= correct.length) out.push({ char: t, status: 'extra' });
    else if (i >= typed.length) out.push({ char: c, status: 'missing' });
    else out.push({ char: t, status: 'wrong' });
  }
  return out;
}

export default function VerbesAvoirEtre({ onHome, onStartPractice }) {
  const profile = localStorage.getItem('sb_profile') || 'cayla';
  const [sel, setSel] = useState(loadSelection);
  const [view, setView] = useState('tableau'); // tableau | ecrire
  const [showPicker, setShowPicker] = useState(true);
  const [masteryTick, setMasteryTick] = useState(0); // rafraîchit la barre après chaque réponse

  useEffect(() => { saveSelection(sel); }, [sel]);

  const toggleVerb = (v) => setSel((s) => {
    const verbs = s.verbs.includes(v) ? s.verbs.filter((x) => x !== v) : [...s.verbs, v];
    return verbs.length ? { ...s, verbs } : s;
  });
  const toggleTense = (t) => setSel((s) => {
    const tenses = s.tenses.includes(t) ? s.tenses.filter((x) => x !== t) : [...s.tenses, t];
    return tenses.length ? { ...s, tenses } : s;
  });
  const setLevels = (levels) => setSel((s) => ({ ...s, tenses: TENSES.filter((t) => levels.includes(t.level)).map((t) => t.id) }));

  const orderedTenses = TENSES.filter((t) => sel.tenses.includes(t.id)).map((t) => t.id);
  const items = useMemo(() => buildItems(sel.verbs, orderedTenses), [sel.verbs, sel.tenses.join(',')]);
  const summary = useMemo(() => getWeekSummary(profile, MASTERY_KEY, items), [items, masteryTick]);

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onHome} className="text-s4 font-bold text-sm hover:text-lava">← Menu</button>
        <h2 className="font-heading font-extrabold text-stone text-lg">Verbes avoir &amp; être</h2>
        <span className="text-[10px] font-extrabold text-pink-600 bg-pink-50 border border-pink-200 rounded-full px-2 py-0.5">Secondaire 1</span>
      </div>

      {/* Sélection verbes + temps */}
      <div className="bg-white rounded-2xl border-2 border-s1 p-4 mb-3">
        <button onClick={() => setShowPicker((p) => !p)} className="w-full flex items-center justify-between">
          <span className="text-xs font-bold text-s4 uppercase tracking-wide">
            {sel.verbs.map((v) => VERBES[v].label).join(' + ')} · {sel.tenses.length} temps · {items.length} formes
          </span>
          <span className="text-xs font-bold text-fox-d">{showPicker ? 'Fermer ▲' : 'Modifier ▼'}</span>
        </button>

        {showPicker && (
          <div className="mt-3">
            <div className="flex gap-2 mb-3">
              {VERB_IDS.map((v) => (
                <button key={v} onClick={() => toggleVerb(v)}
                  className={`flex-1 py-2 rounded-xl font-heading font-extrabold text-lg border-2 transition-all ${
                    sel.verbs.includes(v) ? 'bg-stone text-white border-stone' : 'bg-white text-s4 border-s2'
                  }`}>
                  {VERBES[v].label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <button onClick={() => setLevels([1])} className="text-xs font-bold px-3 py-1.5 rounded-full border-2 border-green-200 bg-green-50 text-green-700">Niveau 1 — temps simples</button>
              <button onClick={() => setLevels([1, 2])} className="text-xs font-bold px-3 py-1.5 rounded-full border-2 border-orange-200 bg-orange-50 text-orange-700">Niveaux 1 + 2</button>
              <button onClick={() => setLevels([1, 2, 3])} className="text-xs font-bold px-3 py-1.5 rounded-full border-2 border-purple-200 bg-purple-50 text-purple-700">Tous les temps</button>
            </div>

            {MODES.map((mode) => (
              <div key={mode} className="mb-2">
                <p className="text-[11px] font-extrabold text-s4 uppercase tracking-wide mb-1">{mode}</p>
                <div className="flex flex-wrap gap-1.5">
                  {TENSES.filter((t) => t.mode === mode).map((t) => {
                    const on = sel.tenses.includes(t.id);
                    return (
                      <button key={t.id} onClick={() => toggleTense(t.id)}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border-2 transition-all ${
                          on ? 'bg-fox text-white border-fox' : 'bg-white text-s6 border-s2 hover:border-fox'
                        }`}>
                        {t.label}
                        <span className={`ml-1 text-[9px] ${on ? 'text-white/80' : 'text-s4'}`}>N{t.level}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Maîtrise */}
      <div className="bg-white rounded-xl p-3 mb-3 border-2 border-s1">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-s4 uppercase tracking-wide">Maîtrise des formes sélectionnées</p>
          <p className="text-xs font-bold text-stone">{summary.mastered}/{summary.total}</p>
        </div>
        <div className="w-full bg-s1 rounded-full h-3 overflow-hidden flex">
          <div className="h-3" style={{ width: `${(summary.mastered / Math.max(1, summary.total)) * 100}%`, background: '#2d7a3a' }} />
          <div className="h-3" style={{ width: `${(summary.practicing / Math.max(1, summary.total)) * 100}%`, background: '#fdcb6e' }} />
          <div className="h-3" style={{ width: `${(summary.learning / Math.max(1, summary.total)) * 100}%`, background: '#e8622a' }} />
        </div>
        <div className="flex flex-wrap gap-3 mt-2 text-[10px] font-bold text-s4">
          <span><span className="inline-block w-2 h-2 rounded-full bg-green-700 mr-1" />Maîtrisées: {summary.mastered}</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-1" />Bonnes: {summary.practicing}</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-1" />Difficiles: {summary.learning}</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-gray-300 mr-1" />Nouvelles: {summary.new}</span>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setView('tableau')}
          className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-bold ${view === 'tableau' ? 'bg-stone text-white' : 'bg-white border-2 border-s2 text-s6'}`}>
          📖 Tableau
        </button>
        <button onClick={() => { setView('ecrire'); setShowPicker(false); }}
          className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-bold ${view === 'ecrire' ? 'bg-stone text-white' : 'bg-white border-2 border-s2 text-s6'}`}>
          ✍️ Écrire
        </button>
        {onStartPractice && (
          <button onClick={() => onStartPractice('verbes_avoir_etre')}
            className="flex-1 rounded-xl px-3 py-2.5 text-sm font-bold bg-white border-2 border-s2 text-s6 hover:border-lava hover:text-lava">
            ▶ Choix multiple
          </button>
        )}
      </div>

      {view === 'tableau' && <Tableau verbs={sel.verbs} tenses={orderedTenses} />}
      {view === 'ecrire' && (
        <Drill key={items.map((i) => i.key).join('|')} profile={profile} items={items} onHome={onHome} onAnswer={() => setMasteryTick((t) => t + 1)} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------- Tableau
function Tableau({ verbs, tenses }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-s4 text-center">Touche une forme pour l'entendre. 🔊</p>
      {tenses.map((tid) => {
        const t = tenseById[tid];
        return (
          <div key={tid} className="bg-white rounded-2xl border-2 border-s1 p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-heading font-extrabold text-stone">{t.mode} — {t.label}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${LEVEL_STYLE[t.level]}`}>{LEVEL_LABEL[t.level]}</span>
            </div>
            <p className="text-xs font-semibold text-s4 mb-3">{t.tip}</p>
            <div className={`grid gap-3 ${verbs.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {verbs.map((v) => (
                <div key={v}>
                  <p className="font-heading font-extrabold text-fox-d text-sm uppercase tracking-wide mb-1">{VERBES[v].label}</p>
                  {personsFor(tid).map((p) => {
                    const full = display(v, tid, p);
                    return (
                      <button key={p} onClick={() => speak(full)}
                        className="w-full text-left px-2 py-1 rounded-lg hover:bg-orange-50 flex items-baseline gap-1">
                        {t.imperatif && <span className="text-[10px] text-s4 font-bold">({p})</span>}
                        <span className="font-semibold text-stone text-sm">{full}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Formes non personnelles */}
      <div className="bg-cream rounded-2xl border-2 border-s1 p-4">
        <h3 className="font-heading font-extrabold text-stone mb-2">Infinitif &amp; participe</h3>
        <div className={`grid gap-3 ${verbs.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {verbs.map((v) => {
            const { infinitif, participe } = VERBES[v];
            return (
              <div key={v} className="text-sm">
                <p className="font-heading font-extrabold text-fox-d text-sm uppercase tracking-wide mb-1">{VERBES[v].label}</p>
                <p><span className="text-s4 font-bold">Infinitif présent:</span> <b>{infinitif.present}</b></p>
                <p><span className="text-s4 font-bold">Infinitif passé:</span> <b>{infinitif.passe}</b></p>
                <p><span className="text-s4 font-bold">Participe présent:</span> <b>{participe.present}</b></p>
                <p><span className="text-s4 font-bold">Participe passé:</span> <b>{participe.passe}</b></p>
                <p><span className="text-s4 font-bold">Participe passé composé:</span> <b>{participe.passeCompose}</b></p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Écrire
const SESSION_SIZES = [10, 20, 40];

function Drill({ profile, items, onHome, onAnswer }) {
  const [size, setSize] = useState(20);
  const [started, setStarted] = useState(false);
  const [round, setRound] = useState(1);
  const [queue, setQueue] = useState([]);
  const [missed, setMissed] = useState([]);
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const inputRef = useRef(null);

  const item = queue[idx];

  useEffect(() => {
    if (item && !revealed) setTimeout(() => inputRef.current?.focus(), 100);
  }, [item, revealed]);

  function start() {
    // buildSmartQueue trie par priorité (nouvelles / ratées d'abord); on garde les N premières
    const q = buildSmartQueue(profile, MASTERY_KEY, items).slice(0, size);
    setQueue(q);
    setMissed([]);
    setIdx(0);
    setRound(1);
    setTyped('');
    setRevealed(false);
    setDone(false);
    setStats({ correct: 0, total: 0 });
    setStarted(true);
  }

  function check(e) {
    e?.preventDefault();
    if (revealed) return next();
    if (!typed.trim()) return;
    const ok = isCorrectAnswer(typed, item.verb, item.tense, item.pronoun);
    setStats((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }));
    recordAnswer(profile, MASTERY_KEY, item.correct, ok);
    onAnswer && onAnswer();
    if (!ok) setMissed((m) => [...m, item]);
    setRevealed(true);
    speak(item.correct);
  }

  function skip() {
    setMissed((m) => [...m, item]);
    setStats((s) => ({ ...s, total: s.total + 1 }));
    recordAnswer(profile, MASTERY_KEY, item.correct, false);
    onAnswer && onAnswer();
    setRevealed(true);
    speak(item.correct);
  }

  function next() {
    if (idx + 1 < queue.length) {
      setIdx(idx + 1);
      setTyped('');
      setRevealed(false);
      return;
    }
    if (missed.length === 0) {
      setDone(true);
      saveSession('verbes_avoir_etre_ecrire', stats.total, stats.correct,
        [{ category: 'verbes_avoir_etre', correct: true }]);
      notifySessionResult({
        profile, mode: 'verbes avoir & être (écrire)',
        correct: stats.correct, total: stats.total, streak: 0, results: [],
      });
      return;
    }
    setRound((r) => r + 1);
    setQueue(shuffle(missed));
    setMissed([]);
    setIdx(0);
    setTyped('');
    setRevealed(false);
  }

  if (!started) {
    return (
      <div className="bg-white rounded-2xl border-2 border-s1 p-5 text-center">
        <div className="text-4xl mb-2">✍️</div>
        <h3 className="font-heading text-xl font-extrabold text-stone mb-1">Écris la bonne forme</h3>
        <p className="text-sm font-semibold text-s4 mb-4">
          Comme au test: on te donne le verbe, le temps et la personne, tu écris la forme.
          Les accents comptent (eut ≠ eût). Les formes ratées reviennent au tour suivant.
        </p>
        <p className="text-xs font-bold text-s4 uppercase tracking-wide mb-2">Combien de formes?</p>
        <div className="flex gap-2 justify-center mb-4">
          {SESSION_SIZES.map((n) => (
            <button key={n} onClick={() => setSize(n)}
              className={`px-4 py-2 rounded-xl font-bold border-2 ${size === n ? 'bg-stone text-white border-stone' : 'bg-white text-s6 border-s2'}`}>
              {n}
            </button>
          ))}
          <button onClick={() => setSize(items.length)}
            className={`px-4 py-2 rounded-xl font-bold border-2 ${size === items.length ? 'bg-stone text-white border-stone' : 'bg-white text-s6 border-s2'}`}>
            Tout ({items.length})
          </button>
        </div>
        <button onClick={start}
          className="w-full py-3 rounded-xl font-bold text-white text-lg"
          style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
          Commencer
        </button>
      </div>
    );
  }

  if (done) {
    const pct = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0;
    return (
      <div className="bg-white rounded-2xl border-2 border-s1 p-6 text-center">
        <div className="text-6xl mb-3">🏆</div>
        <h3 className="font-heading text-2xl font-extrabold text-ok mb-1">Toutes les formes réussies!</h3>
        <p className="text-stone font-semibold mb-5">
          {stats.correct}/{stats.total} du premier coup ({pct}%) · {round} tour{round > 1 ? 's' : ''}
        </p>
        <div className="space-y-2">
          <button onClick={start}
            className="w-full py-3 rounded-xl font-bold text-white"
            style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
            Encore une série
          </button>
          <button onClick={onHome} className="w-full py-3 rounded-xl font-bold text-s6 bg-white border-2 border-s2">← Menu</button>
        </div>
      </div>
    );
  }

  if (!item) return null;

  const t = tenseById[item.tense];
  const ok = revealed && isCorrectAnswer(typed, item.verb, item.tense, item.pronoun);
  const promptPronoun = promptPrefix(item.pronoun, item.tense);
  const diff = revealed && !ok ? diffChars(typed.trim(), item.form) : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-xs font-bold text-s4">
        <span>Tour {round} · {idx + 1}/{queue.length}</span>
        <span>{stats.correct} ✓ · {stats.total - stats.correct} ✗ · {missed.length} à revoir</span>
      </div>

      <div className="bg-white rounded-2xl p-6 border-2 border-s1 border-l-4 border-l-lava">
        <div className="flex items-center justify-between mb-3">
          <span className="font-heading font-extrabold text-fox-d text-2xl uppercase">{VERBES[item.verb].label}</span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${LEVEL_STYLE[t.level]}`}>{tenseLabel(item.tense)}</span>
        </div>
        <p className="font-heading text-3xl font-extrabold text-stone mb-4">
          {promptPronoun} <span className="text-s3">______</span>
        </p>

        <form onSubmit={check}>
          <input
            ref={inputRef}
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            disabled={revealed}
            placeholder="Écris la forme du verbe..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className={`w-full px-4 py-3 rounded-xl border-2 font-heading text-2xl font-bold text-center focus:outline-none ${
              !revealed ? 'border-s2 text-stone focus:border-lava' :
              ok ? 'bg-green-50 border-green-500 text-green-700' :
              'bg-red-50 border-red-400 text-red-600'
            }`}
          />

          {revealed && (
            <div className="mt-3 p-3 bg-cream rounded-xl border-2 border-s1">
              <p className="text-xs font-bold text-s4 uppercase mb-1">Réponse:</p>
              <div className="font-heading text-2xl font-extrabold text-stone flex items-center gap-2">
                {item.correct}
                <button type="button" onClick={() => speak(item.correct)} className="text-base">🔊</button>
              </div>
              {ok ? (
                <p className="text-xs font-bold text-ok mt-2">✓ Bravo!</p>
              ) : (
                <>
                  {typed.trim() && (
                    <>
                      <p className="text-xs font-bold text-s4 uppercase mt-2 mb-1">Ta réponse:</p>
                      <div className="font-heading text-xl font-bold">
                        {diff.map((d, i) => (
                          <span key={i} className={
                            d.status === 'ok' ? 'text-green-700' :
                            d.status === 'wrong' ? 'text-red-600 underline' :
                            d.status === 'extra' ? 'text-red-600 line-through' :
                            'text-orange-500 underline'
                          }>{d.char}</span>
                        ))}
                      </div>
                    </>
                  )}
                  <p className="text-xs text-s4 font-semibold mt-2">💡 {t.tip} Tu la reverras au prochain tour.</p>
                </>
              )}
            </div>
          )}

          {!revealed ? (
            <div className="flex gap-2 mt-3">
              <button type="submit" disabled={!typed.trim()}
                className="flex-1 py-3 rounded-xl font-bold text-white disabled:opacity-40"
                style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
                ✓ Vérifier
              </button>
              <button type="button" onClick={skip}
                className="px-4 py-3 rounded-xl font-bold text-s4 bg-white border-2 border-s2">
                Je ne sais pas
              </button>
            </div>
          ) : (
            <button type="button" onClick={next}
              className="w-full mt-3 py-3 rounded-xl font-bold text-white"
              style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
              {idx + 1 < queue.length ? 'Suivante →' : (missed.length === 0 ? 'Terminer 🏆' : `Tour suivant (${missed.length} à revoir)`)}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
