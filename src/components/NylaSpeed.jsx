import React, { useState, useEffect, useRef, useCallback } from 'react';
import { speak } from '../utils/speech';
import { saveSession } from '../utils/storage';

// Nyla's "calcul rapide" — same idea as Ryan's SpeedGame (timed, streak, big
// answer buttons) but with 5-year-old visual math: counting, +1, what comes
// next, more/less. Gentle 60s round with lots of encouragement.

const EMOJIS = ['🍎', '⭐', '❤️', '🌸', '🦋', '🐟', '🎈', '🍰', '🐱', '🌙'];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function numberOptions(correct, lo = 0, hi = 10) {
  const opts = new Set([correct]);
  while (opts.size < 4) {
    const fake = correct + rand(-2, 2);
    if (fake !== correct && fake >= lo && fake <= hi) opts.add(fake);
  }
  return shuffle([...opts]);
}

function buildQuestion() {
  const type = rand(0, 3);

  // 1) Count the objects
  if (type === 0) {
    const n = rand(1, 10);
    const icon = pick(EMOJIS);
    return {
      say: 'Combien y en a-t-il?',
      display: icon.repeat(n),
      answer: n,
      options: numberOptions(n).map(String),
      kind: 'count',
    };
  }

  // 2) One more (n + 1)
  if (type === 1) {
    const n = rand(1, 9);
    const icon = pick(EMOJIS);
    return {
      say: `${n} et encore un, ça fait combien?`,
      display: `${icon.repeat(n)}  ➕  ${icon}`,
      answer: n + 1,
      options: numberOptions(n + 1).map(String),
      kind: 'plus1',
    };
  }

  // 3) What number comes after
  if (type === 2) {
    const n = rand(0, 9);
    return {
      say: `Quel nombre vient après ${n}?`,
      display: `${n} … ?`,
      big: true,
      answer: n + 1,
      options: numberOptions(n + 1).map(String),
      kind: 'after',
    };
  }

  // 4) Which group has MORE
  const icon = pick(EMOJIS);
  let a = rand(1, 8);
  let b = rand(1, 8);
  while (a === b) b = rand(1, 8);
  const moreIsA = a > b;
  return {
    say: 'Où y a-t-il le plus?',
    compare: { a: icon.repeat(a), b: icon.repeat(b) },
    answer: moreIsA ? 'A' : 'B',
    options: ['A', 'B'],
    kind: 'more',
  };
}

const GAME_DURATION = 60;

export default function NylaSpeed({ onHome }) {
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [q, setQ] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [flash, setFlash] = useState(null);
  const [over, setOver] = useState(false);
  const timerRef = useRef(null);

  const next = useCallback(() => {
    const nq = buildQuestion();
    setQ(nq);
    setFlash(null);
    setTimeout(() => speak(nq.say, 'fr', 0.85), 150);
  }, []);

  useEffect(() => {
    next();
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); setOver(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  useEffect(() => {
    if (over) {
      speak(`Bravo Nyla! Tu as ${score} bonnes réponses!`, 'fr', 0.85);
      saveSession('nyla_speed', total, score, [{ category: 'nyla_count', correct: true }]);
    }
  }, [over]);

  function answer(value) {
    if (over || flash) return;
    const correct = String(value) === String(q.answer);
    setTotal((t) => t + 1);
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => { const n = s + 1; setBest((b) => Math.max(b, n)); return n; });
      setFlash('correct');
    } else {
      setStreak(0);
      setFlash('wrong');
    }
    setTimeout(next, 550);
  }

  if (over) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    return (
      <div className="max-w-xl mx-auto px-4 pt-8 text-center">
        <div className="text-7xl mb-3 animate-bounce">🌟</div>
        <h2 className="font-heading text-3xl font-extrabold text-stone mb-3">Bravo Nyla!</h2>
        <div className="bg-white rounded-3xl p-6 mb-4 border-2 border-s1">
          <div className="font-heading text-6xl font-extrabold text-purple-600 mb-1">{score}</div>
          <div className="text-sm font-semibold text-s4">bonnes réponses</div>
          <div className="flex justify-around mt-4">
            <div><div className="text-xl font-extrabold text-stone">{total}</div><div className="text-xs text-s4">en tout</div></div>
            <div><div className="text-xl font-extrabold text-ok">{pct}%</div><div className="text-xs text-s4">réussite</div></div>
            <div><div className="text-xl font-extrabold text-fox">{best}🔥</div><div className="text-xs text-s4">série</div></div>
          </div>
        </div>
        <div className="space-y-3">
          <button onClick={() => { setTimeLeft(GAME_DURATION); setScore(0); setTotal(0); setStreak(0); setBest(0); setOver(false); next(); timerRef.current = setInterval(() => setTimeLeft((t) => { if (t <= 1) { clearInterval(timerRef.current); setOver(true); return 0; } return t - 1; }), 1000); }}
            className="w-full py-4 rounded-xl font-bold text-white text-lg"
            style={{ background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }}>
            🔁 Encore!
          </button>
          <button onClick={onHome} className="w-full py-3 rounded-xl font-bold text-s6 bg-white border-2 border-s2">← Menu</button>
        </div>
      </div>
    );
  }

  if (!q) return null;

  const timerPct = (timeLeft / GAME_DURATION) * 100;
  const timerColor = timeLeft > 20 ? '#00b894' : timeLeft > 10 ? '#fdcb6e' : '#e84393';

  return (
    <div className="max-w-xl mx-auto px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onHome} className="text-s4 font-bold text-sm hover:text-lava">← Menu</button>
        <div className="text-sm font-bold text-purple-600">⚡ Calcul rapide</div>
        <div className="text-lg font-extrabold text-stone">{score}</div>
      </div>

      {/* Timer */}
      <div className="w-full bg-s1 rounded-full h-3 mb-3 overflow-hidden">
        <div className="h-3 rounded-full transition-all duration-1000" style={{ width: `${timerPct}%`, background: timerColor }} />
      </div>
      <div className="flex justify-between mb-4">
        <div className="text-2xl font-extrabold" style={{ color: timerColor }}>{timeLeft}s</div>
        {streak >= 2 && <div className="text-lg font-bold text-fox">🔥 {streak}</div>}
      </div>

      {/* Question */}
      <div className={`rounded-3xl p-6 mb-4 text-center border-2 transition-all duration-200 ${
        flash === 'correct' ? 'bg-green-50 border-green-500' :
        flash === 'wrong' ? 'bg-red-50 border-red-400' :
        'bg-white border-s1'
      }`}>
        <button onClick={() => speak(q.say, 'fr', 0.85)} className="text-sm font-bold text-purple-600 mb-3 hover:underline">
          🔊 {q.say}
        </button>
        {q.compare ? (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => answer('A')}
              className="rounded-2xl p-4 bg-purple-50 border-2 border-purple-200 hover:border-purple-500 active:scale-95 transition-all">
              <div className="text-3xl leading-snug break-words">{q.compare.a}</div>
              <div className="font-heading font-extrabold text-purple-700 mt-2">Ici 👈</div>
            </button>
            <button onClick={() => answer('B')}
              className="rounded-2xl p-4 bg-purple-50 border-2 border-purple-200 hover:border-purple-500 active:scale-95 transition-all">
              <div className="text-3xl leading-snug break-words">{q.compare.b}</div>
              <div className="font-heading font-extrabold text-purple-700 mt-2">Ici 👈</div>
            </button>
          </div>
        ) : (
          <div className="font-extrabold text-stone break-words"
            style={{
              fontSize: q.big ? '4rem' : (q.kind === 'count' || q.kind === 'plus1') ? '3.25rem' : '2.5rem',
              letterSpacing: (q.kind === 'count' || q.kind === 'plus1') ? '0.18em' : undefined,
              lineHeight: 1.4,
            }}>
            {q.display}
          </div>
        )}
      </div>

      {/* Number options (not for compare) */}
      {!q.compare && (
        <div className="grid grid-cols-2 gap-3">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => answer(opt)}
              className="py-6 rounded-2xl font-extrabold text-4xl text-stone bg-white border-2 border-s2
                hover:border-purple-500 hover:text-purple-600 active:scale-95 transition-all">
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
