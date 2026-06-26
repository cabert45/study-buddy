import React, { useState, useEffect, useCallback } from 'react';
import { speak } from '../utils/speech';
import { saveSession } from '../utils/storage';

// Nyla — Additions façon "Numberblocks": add two groups of blocks, count the
// total. Untimed (learning, not racing). She levels up AUTOMATICALLY once she
// masters a level — the app tracks her mastery on-device and advances. Her
// level is saved so she always resumes where she left off.

const NUMBERBLOCKS_VIDEO = 'https://www.youtube.com/results?search_query=numberblocks+adding';

const ADD_LEVELS = [
  { label: "jusqu'à 5", max: 5 },
  { label: "jusqu'à 10", max: 10 },
  { label: "jusqu'à 20", max: 20 },
];
const TO_ADVANCE = 6; // correct answers needed to master a level

function loadLevel() {
  const v = parseInt(localStorage.getItem('sb_nyla_addlevel') || '0', 10);
  if (isNaN(v)) return 0;
  return Math.max(0, Math.min(ADD_LEVELS.length - 1, v));
}
function saveLevel(l) { try { localStorage.setItem('sb_nyla_addlevel', String(l)); } catch {} }

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestion(level) {
  const max = ADD_LEVELS[level].max;
  const a = rand(1, Math.min(9, max - 1));
  const b = rand(1, Math.min(9, max - a));
  const answer = a + b;
  const opts = new Set([answer]);
  while (opts.size < 4) {
    const fake = answer + rand(-2, 2);
    if (fake !== answer && fake >= 0 && fake <= max) opts.add(fake);
  }
  return { a, b, answer, options: shuffle([...opts]).map(String) };
}

export default function NylaAddition({ onHome }) {
  const [level, setLevel] = useState(loadLevel);
  const [q, setQ] = useState(() => buildQuestion(loadLevel()));
  const [mastered, setMastered] = useState(0); // correct at current level
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [flash, setFlash] = useState(null);
  const [levelUp, setLevelUp] = useState(false);
  const [allDone, setAllDone] = useState(false);

  const next = useCallback((lvl) => {
    const nq = buildQuestion(lvl);
    setQ(nq);
    setFlash(null);
    setTimeout(() => speak(`${nq.a} plus ${nq.b}, ça fait combien?`, 'fr', 0.85), 150);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => speak(`${q.a} plus ${q.b}, ça fait combien?`, 'fr', 0.85), 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function answer(value) {
    if (flash || levelUp || allDone) return;
    const correct = String(value) === String(q.answer);
    setTotal((t) => t + 1);
    if (!correct) {
      setFlash('wrong');
      setTimeout(() => next(level), 900);
      return;
    }
    setScore((s) => s + 1);
    setFlash('correct');
    const newMastered = mastered + 1;
    setMastered(newMastered);

    if (newMastered >= TO_ADVANCE) {
      saveSession('nyla_addition', total + 1, score + 1, [{ category: 'nyla_add', correct: true }]);
      if (level < ADD_LEVELS.length - 1) {
        const nl = level + 1;
        saveLevel(nl);
        setTimeout(() => setLevelUp(true), 700);
      } else {
        setTimeout(() => setAllDone(true), 700);
      }
      return;
    }
    setTimeout(() => next(level), 700);
  }

  // Level-up celebration → continue at next level
  if (levelUp) {
    const nl = level + 1;
    return (
      <div className="max-w-xl mx-auto px-4 pt-12 text-center">
        <div className="text-7xl mb-4 animate-bounce">🎉</div>
        <h2 className="font-heading text-3xl font-extrabold text-purple-600 mb-2">Niveau réussi!</h2>
        <p className="text-stone font-semibold mb-6 text-lg">On additionne maintenant {ADD_LEVELS[nl].label}!</p>
        <button onClick={() => { setLevel(nl); setMastered(0); setLevelUp(false); next(nl); }}
          className="w-full py-4 rounded-xl font-bold text-white text-lg"
          style={{ background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }}>
          Continue → {ADD_LEVELS[nl].label}
        </button>
        <button onClick={onHome} className="w-full mt-3 py-3 rounded-xl font-bold text-s6 bg-white border-2 border-s2">
          ← Menu (on garde ta place)
        </button>
      </div>
    );
  }

  if (allDone) {
    return (
      <div className="max-w-xl mx-auto px-4 pt-12 text-center">
        <div className="text-7xl mb-4 animate-bounce">🏆</div>
        <h2 className="font-heading text-3xl font-extrabold text-ok mb-2">Bravo Nyla!</h2>
        <p className="text-stone font-semibold mb-6 text-lg">Tu sais additionner jusqu'à 20! 🌟</p>
        <button onClick={() => { setLevel(0); saveLevel(0); setMastered(0); setScore(0); setTotal(0); setAllDone(false); next(0); }}
          className="w-full py-4 rounded-xl font-bold text-white text-lg"
          style={{ background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }}>
          🔁 Recommencer au début
        </button>
        <button onClick={onHome} className="w-full mt-3 py-3 rounded-xl font-bold text-s6 bg-white border-2 border-s2">← Menu</button>
      </div>
    );
  }

  const blocksA = '🟦'.repeat(q.a);
  const blocksB = '🟥'.repeat(q.b);

  return (
    <div className="max-w-xl mx-auto px-4 pt-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onHome} className="text-s4 font-bold text-sm hover:text-lava">← Menu</button>
        <div className="text-sm font-bold text-purple-600">➕ Additions · {ADD_LEVELS[level].label}</div>
        <a href={NUMBERBLOCKS_VIDEO} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-pink-500">🎬 Numberblocks</a>
      </div>

      {/* Progress to next level */}
      <div className="mb-1 flex justify-between text-xs font-bold text-s4">
        <span>Vers le niveau suivant</span><span>{Math.min(mastered, TO_ADVANCE)}/{TO_ADVANCE}</span>
      </div>
      <div className="w-full bg-s1 rounded-full h-3 mb-4 overflow-hidden">
        <div className="h-3 rounded-full transition-all" style={{ width: `${(Math.min(mastered, TO_ADVANCE) / TO_ADVANCE) * 100}%`, background: '#7c3aed' }} />
      </div>

      {/* Question — blocks to count */}
      <div className={`rounded-3xl p-6 mb-4 text-center border-2 transition-all duration-200 ${
        flash === 'correct' ? 'bg-green-50 border-green-500' :
        flash === 'wrong' ? 'bg-red-50 border-red-400' :
        'bg-white border-s1'
      }`}>
        <button onClick={() => speak(`${q.a} plus ${q.b}, ça fait combien?`, 'fr', 0.85)}
          className="text-sm font-bold text-purple-600 mb-3 hover:underline">
          🔊 {q.a} plus {q.b}, ça fait combien?
        </button>
        <div className="break-words" style={{ fontSize: '3rem', letterSpacing: '0.12em', lineHeight: 1.5 }}>
          {blocksA} <span className="font-extrabold text-stone">+</span> {blocksB}
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => answer(opt)}
            className="py-6 rounded-2xl font-extrabold text-4xl text-stone bg-white border-2 border-s2
              hover:border-purple-500 hover:text-purple-600 active:scale-95 transition-all">
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
