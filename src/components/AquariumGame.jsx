import React, { useState, useEffect, useCallback } from 'react';
import { speak } from '../utils/speech';
import { saveSession } from '../utils/storage';

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateRound() {
  const target = rand(5, 15);
  const fish = [];
  const correctCount = rand(3, 4);

  const usedExpressions = new Set();

  // Correct fish
  let attempts = 0;
  while (fish.filter(f => f.isCorrect).length < correctCount && attempts < 50) {
    attempts++;
    const type = rand(0, 1);
    let display;
    if (type === 0) {
      const a = rand(1, target - 1);
      const b = target - a;
      display = `${a} + ${b}`;
    } else {
      const a = rand(target + 1, target + 10);
      const b = a - target;
      display = `${a} − ${b}`;
    }
    if (!usedExpressions.has(display)) {
      usedExpressions.add(display);
      fish.push({ display, value: target, isCorrect: true });
    }
  }

  // Wrong fish
  attempts = 0;
  while (fish.filter(f => !f.isCorrect).length < 5 && attempts < 50) {
    attempts++;
    const wrongTarget = rand(2, 18);
    if (wrongTarget === target) continue;
    const type = rand(0, 1);
    let display;
    if (type === 0) {
      const a = rand(1, wrongTarget - 1);
      if (a < 1) continue;
      const b = wrongTarget - a;
      display = `${a} + ${b}`;
    } else {
      const a = rand(wrongTarget + 1, wrongTarget + 10);
      const b = a - wrongTarget;
      display = `${a} − ${b}`;
    }
    if (!usedExpressions.has(display)) {
      usedExpressions.add(display);
      fish.push({ display, value: wrongTarget, isCorrect: false });
    }
  }

  return { target, fish: shuffle(fish) };
}

const fishEmojis = ['🐟', '🐠', '🐡', '🦈', '🐙', '🦀', '🐳', '🐚', '🦑', '🐢'];

// Grid positions — no overlap
const gridPositions = [
  { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 },
  { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 },
  { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 },
];

const TOTAL_ROUNDS = 6;

export default function AquariumGame({ onHome, onFinish }) {
  const [round, setRound] = useState(null);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState(new Set());
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState([]);

  const newRound = useCallback(() => {
    const r = generateRound();
    setRound(r);
    setSelected(new Set());
    setRevealed(false);
    speak(`Trouve les résultats qui font ${r.target}!`);
  }, []);

  useEffect(() => { newRound(); }, [newRound]);

  if (!round) return null;

  function toggleFish(idx) {
    if (revealed) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  }

  function checkAnswers() {
    setRevealed(true);
    const correctFish = round.fish.filter(f => f.isCorrect);
    const selectedCorrectly = [...selected].filter(i => round.fish[i].isCorrect);
    const selectedWrongly = [...selected].filter(i => !round.fish[i].isCorrect);
    const isGood = selectedWrongly.length === 0 && selectedCorrectly.length === correctFish.length;

    setResults(prev => [...prev, {
      category: 'aquarium', correct: isGood,
      question: `Résultats qui font ${round.target}`,
      userAnswer: `${selectedCorrectly.length}/${correctFish.length}`,
      correctAnswer: correctFish.map(f => f.display).join(', '),
    }]);

    speak(isGood ? 'Bravo! Tous trouvés!' : 'Pas tout à fait!');
  }

  function nextRound() {
    if (roundIndex + 1 >= TOTAL_ROUNDS) {
      const correct = results.filter(r => r.correct).length;
      saveSession('aquarium', results.length, correct,
        results.map(r => ({ category: r.category, correct: r.correct })));
      onFinish({ results, correct, total: results.length, mode: 'aquarium', streak: 0 });
      return;
    }
    setRoundIndex(i => i + 1);
    newRound();
  }

  const correctCount = round.fish.filter(f => f.isCorrect).length;

  return (
    <div className="max-w-md mx-auto px-4 pt-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={onHome} className="text-purple-400 font-bold text-sm">← Menu</button>
        <div className="text-sm font-bold text-cyan-300">🐟 Aquarium</div>
        <div className="text-sm text-purple-400">{roundIndex + 1}/{TOTAL_ROUNDS}</div>
      </div>

      {/* Target */}
      <div className="text-center bg-cyan-500/20 rounded-2xl p-3 mb-4 border border-cyan-400/30">
        <p className="text-xs font-bold text-cyan-300 mb-1">Trouve les résultats qui font:</p>
        <div className="text-4xl font-extrabold text-white">{round.target}</div>
        <p className="text-xs text-cyan-400 mt-1">{correctCount} à trouver</p>
      </div>

      {/* Fish grid — no overlap */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {round.fish.map((fish, idx) => {
          const emoji = fishEmojis[idx % fishEmojis.length];
          const isSelected = selected.has(idx);
          let style = 'bg-white/10 border-2 border-white/20 text-white';
          if (revealed) {
            if (fish.isCorrect && isSelected) style = 'bg-green-500/25 border-2 border-green-400 text-green-200';
            else if (fish.isCorrect && !isSelected) style = 'bg-yellow-500/25 border-2 border-yellow-400 text-yellow-200 animate-pulse';
            else if (!fish.isCorrect && isSelected) style = 'bg-red-500/25 border-2 border-red-400 text-red-200';
            else style = 'bg-white/5 border-2 border-white/10 text-white/30';
          } else if (isSelected) {
            style = 'bg-star/20 border-2 border-star text-white scale-105 shadow-lg shadow-star/20';
          }

          return (
            <button
              key={idx}
              onClick={() => toggleFish(idx)}
              disabled={revealed}
              className={`rounded-xl p-3 font-bold text-center transition-all active:scale-95 ${style}`}
              style={{ minHeight: 60, animation: !revealed ? `swim ${2 + idx * 0.3}s ease-in-out infinite` : 'none' }}
            >
              <div className="text-lg mb-0.5">{emoji}</div>
              <div className="text-sm font-extrabold">{fish.display}</div>
            </button>
          );
        })}
      </div>

      {!revealed ? (
        <button
          onClick={checkAnswers}
          disabled={selected.size === 0}
          className="w-full py-3 rounded-xl font-bold text-white disabled:opacity-40"
          style={{ background: 'linear-gradient(90deg, #0891b2, #06b6d4)' }}
        >
          ✓ Vérifier
        </button>
      ) : (
        <div>
          <div className="text-center mb-2">
            {results[results.length - 1]?.correct
              ? <p className="text-green-300 font-bold">Parfait! 🌟</p>
              : <p className="text-sm text-yellow-300">
                  Réponses: {round.fish.filter(f => f.isCorrect).map(f => f.display).join(', ')}
                </p>
            }
          </div>
          <button onClick={nextRound}
            className="w-full py-3 rounded-xl font-bold text-white"
            style={{ background: 'linear-gradient(90deg, #0891b2, #06b6d4)' }}>
            {roundIndex + 1 >= TOTAL_ROUNDS ? 'Résultats 🏆' : 'Suivant →'}
          </button>
        </div>
      )}

      <style>{`
        @keyframes swim {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
