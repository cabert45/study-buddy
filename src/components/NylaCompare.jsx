import React, { useState, useEffect, useCallback } from 'react';
import { speak } from '../utils/speech';
import { saveSession } from '../utils/storage';

// Nyla — Plus ou moins? She can't read, so there are NO word choices.
// Two groups of pictures are shown big; the voice says "Touche le groupe qui a
// le PLUS" (or le moins) and she taps the group itself.

const ICONS = ['🍎', '⭐', '🐠', '🌸', '🦋', '🍓', '🎈', '🐝', '🌻', '🍰'];
const ROUND = 10;

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function buildQuestion() {
  const icon = pick(ICONS);
  const more = Math.random() < 0.5; // ask for "le plus" or "le moins"
  let a = rand(1, 7);
  let b = rand(1, 7);
  while (b === a) b = rand(1, 7);
  // correct side
  const leftIsCorrect = more ? a > b : a < b;
  return {
    icon, more,
    left: a, right: b,
    correct: leftIsCorrect ? 'L' : 'R',
    say: more ? 'Touche le groupe qui a le plus.' : 'Touche le groupe qui a le moins.',
  };
}

export default function NylaCompare({ onHome }) {
  const [q, setQ] = useState(buildQuestion);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(0);
  const [flash, setFlash] = useState(null); // {side, ok}
  const [over, setOver] = useState(false);

  const ask = useCallback((nq) => {
    setTimeout(() => speak(nq.say, 'fr', 0.85), 150);
  }, []);

  useEffect(() => { const t = setTimeout(() => speak(q.say, 'fr', 0.85), 500); return () => clearTimeout(t); }, []); // eslint-disable-line

  function answer(side) {
    if (flash || over) return;
    const ok = side === q.correct;
    setFlash({ side, ok });
    if (ok) setScore((s) => s + 1);
    const nextDone = done + 1;
    setTimeout(() => {
      if (nextDone >= ROUND) {
        setOver(true);
        speak(`Bravo Nyla! Tu as ${score + (ok ? 1 : 0)} bonnes réponses!`, 'fr', 0.85);
        saveSession('nyla_compare', ROUND, score + (ok ? 1 : 0), [{ category: 'nyla_compare', correct: true }]);
        return;
      }
      setDone(nextDone);
      const nq = buildQuestion();
      setQ(nq);
      setFlash(null);
      ask(nq);
    }, ok ? 750 : 1100);
  }

  if (over) {
    return (
      <div className="max-w-xl mx-auto px-4 pt-12 text-center">
        <div className="text-7xl mb-4 animate-bounce">🌟</div>
        <h2 className="font-heading text-3xl font-extrabold text-stone mb-2">Bravo Nyla!</h2>
        <p className="text-stone font-semibold mb-6 text-lg">{score} / {ROUND} bonnes réponses!</p>
        <button onClick={() => { setQ(buildQuestion()); setScore(0); setDone(0); setFlash(null); setOver(false); }}
          className="w-full py-4 rounded-xl font-bold text-white text-lg"
          style={{ background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }}>
          🔁 Encore!
        </button>
        <button onClick={onHome} className="w-full mt-3 py-3 rounded-xl font-bold text-s6 bg-white border-2 border-s2">← Menu</button>
      </div>
    );
  }

  const groupCard = (side, count) => {
    const isFlash = flash && flash.side === side;
    const showCorrect = flash && side === q.correct;
    return (
      <button onClick={() => answer(side)}
        className={`rounded-3xl p-4 border-4 min-h-[200px] flex items-center justify-center transition-all active:scale-95 ${
          showCorrect ? 'bg-green-50 border-green-500' :
          isFlash && !flash.ok ? 'bg-red-50 border-red-400' :
          'bg-white border-purple-200 hover:border-purple-500'
        }`}>
        <div className="break-words" style={{ fontSize: '2.75rem', letterSpacing: '0.18em', lineHeight: 1.5 }}>
          {q.icon.repeat(count)}
        </div>
      </button>
    );
  };

  return (
    <div className="max-w-xl mx-auto px-4 pt-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onHome} className="text-s4 font-bold text-sm hover:text-lava">← Menu</button>
        <div className="text-sm font-bold text-purple-600">⚖️ Plus ou moins?</div>
        <div className="text-xs font-bold text-s4">{done + 1}/{ROUND}</div>
      </div>

      {/* Spoken instruction */}
      <button onClick={() => speak(q.say, 'fr', 0.85)}
        className="w-full mb-4 py-3 rounded-2xl font-heading font-extrabold text-lg text-white"
        style={{ background: q.more ? 'linear-gradient(90deg, #2d7a3a, #6cc24a)' : 'linear-gradient(90deg, #e8622a, #fdcb6e)' }}>
        🔊 {q.more ? 'Touche le groupe qui a le PLUS' : 'Touche le groupe qui a le MOINS'}
      </button>

      {/* Two groups to tap */}
      <div className="grid grid-cols-2 gap-3">
        {groupCard('L', q.left)}
        {groupCard('R', q.right)}
      </div>
    </div>
  );
}
