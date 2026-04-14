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

// Generate fish with expressions, some matching the target
function generateRound() {
  const target = rand(5, 15);
  const fish = [];
  const correctCount = rand(3, 5);

  // Generate correct fish (expressions that equal target)
  const correctExpressions = new Set();
  while (correctExpressions.size < correctCount) {
    const type = rand(0, 2);
    let expr, display;
    if (type === 0) {
      // a + b = target
      const a = rand(0, target);
      const b = target - a;
      display = `${a} + ${b}`;
      expr = display;
    } else if (type === 1 && target <= 15) {
      // a - b = target
      const a = rand(target + 1, target + 10);
      const b = a - target;
      display = `${a} − ${b}`;
      expr = display;
    } else {
      // just the number
      display = `${target}`;
      expr = display;
    }
    if (!correctExpressions.has(display)) {
      correctExpressions.add(display);
      fish.push({ display, value: target, isCorrect: true });
    }
  }

  // Generate wrong fish
  const wrongCount = rand(4, 6);
  const wrongExpressions = new Set();
  while (wrongExpressions.size < wrongCount) {
    const wrongTarget = rand(1, 18);
    if (wrongTarget === target) continue;
    const type = rand(0, 2);
    let display;
    if (type === 0) {
      const a = rand(0, wrongTarget);
      const b = wrongTarget - a;
      display = `${a} + ${b}`;
    } else if (type === 1) {
      const a = rand(wrongTarget + 1, wrongTarget + 10);
      const b = a - wrongTarget;
      display = `${a} − ${b}`;
    } else {
      display = `${wrongTarget}`;
    }
    if (!wrongExpressions.has(display) && !correctExpressions.has(display)) {
      wrongExpressions.add(display);
      fish.push({ display, value: wrongTarget, isCorrect: false });
    }
  }

  return { target, fish: shuffle(fish) };
}

// Fish shapes with different colors
const fishStyles = [
  { bg: 'bg-blue-400', shape: '🐟' },
  { bg: 'bg-yellow-400', shape: '🐠' },
  { bg: 'bg-pink-400', shape: '🐡' },
  { bg: 'bg-green-400', shape: '🐢' },
  { bg: 'bg-purple-400', shape: '🐙' },
  { bg: 'bg-orange-400', shape: '🦀' },
  { bg: 'bg-cyan-400', shape: '🐳' },
  { bg: 'bg-red-400', shape: '⭐' },
  { bg: 'bg-indigo-400', shape: '🐚' },
];

const TOTAL_ROUNDS = 6;

export default function AquariumGame({ onHome, onFinish }) {
  const [round, setRound] = useState(null);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState(new Set());
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState([]);
  const [fishPositions, setFishPositions] = useState([]);

  const newRound = useCallback(() => {
    const r = generateRound();
    setRound(r);
    setSelected(new Set());
    setRevealed(false);
    // Random positions for fish
    const positions = r.fish.map(() => ({
      top: rand(15, 75),
      left: rand(5, 80),
      delay: Math.random() * 2,
      styleIdx: rand(0, fishStyles.length - 1),
    }));
    setFishPositions(positions);
    speak(`Trouve les résultats qui font ${r.target}!`);
  }, []);

  useEffect(() => {
    newRound();
  }, [newRound]);

  if (!round) return null;

  function toggleFish(idx) {
    if (revealed) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  function checkAnswers() {
    setRevealed(true);
    const correctFish = round.fish.filter((f) => f.isCorrect);
    const selectedCorrectly = [...selected].filter((i) => round.fish[i].isCorrect);
    const selectedWrongly = [...selected].filter((i) => !round.fish[i].isCorrect);
    const missedCorrect = correctFish.length - selectedCorrectly.length;
    const isGood = selectedWrongly.length === 0 && missedCorrect === 0;

    setResults((prev) => [
      ...prev,
      {
        category: 'aquarium',
        correct: isGood,
        question: `Trouve les résultats qui font ${round.target}`,
        userAnswer: `${selectedCorrectly.length}/${correctFish.length} trouvés, ${selectedWrongly.length} erreurs`,
        correctAnswer: correctFish.map((f) => f.display).join(', '),
      },
    ]);

    if (isGood) {
      speak('Bravo! Tous trouvés!');
    } else if (selectedWrongly.length > 0) {
      speak('Attention, il y a des erreurs!');
    } else {
      speak(`Il en manque ${missedCorrect}!`);
    }
  }

  function nextRound() {
    if (roundIndex + 1 >= TOTAL_ROUNDS) {
      // Finish game
      const correct = results.filter((r) => r.correct).length;
      const details = results.map((r) => ({ category: r.category, correct: r.correct }));
      saveSession('aquarium', results.length, correct, details);
      onFinish({
        results,
        correct,
        total: results.length,
        mode: 'aquarium',
        streak: 0,
      });
      return;
    }
    setRoundIndex((i) => i + 1);
    newRound();
  }

  const correctCount = round.fish.filter((f) => f.isCorrect).length;

  return (
    <div className="max-w-md mx-auto px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onHome} className="text-purple-400 font-bold text-sm">← Menu</button>
        <div className="text-sm font-bold text-cyan-300">🐟 Aquarium</div>
        <div className="text-sm text-purple-400">{roundIndex + 1}/{TOTAL_ROUNDS}</div>
      </div>

      {/* Target */}
      <div className="text-center bg-cyan-500/20 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-cyan-400/30">
        <p className="text-sm font-bold text-cyan-300 mb-1">Trouve tous les résultats qui font:</p>
        <div className="text-5xl font-extrabold text-white">{round.target}</div>
        <p className="text-xs text-cyan-400 mt-1">Clique sur les bons poissons! ({correctCount} à trouver)</p>
      </div>

      {/* Aquarium */}
      <div
        className="relative rounded-2xl border-2 border-cyan-400/30 overflow-hidden mb-4"
        style={{
          height: 320,
          background: 'linear-gradient(180deg, rgba(6,78,130,0.6) 0%, rgba(2,40,80,0.8) 100%)',
        }}
      >
        {/* Bubbles decoration */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={`bubble-${i}`}
            className="absolute rounded-full bg-white/10"
            style={{
              width: rand(4, 12),
              height: rand(4, 12),
              left: `${rand(5, 90)}%`,
              bottom: `${rand(5, 60)}%`,
              animation: `float ${rand(3, 6)}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}

        {/* Fish */}
        {round.fish.map((fish, idx) => {
          const pos = fishPositions[idx] || { top: 50, left: 50, delay: 0, styleIdx: 0 };
          const style = fishStyles[pos.styleIdx];
          const isSelected = selected.has(idx);

          let borderColor = 'border-white/20';
          let bgExtra = '';
          if (revealed) {
            if (fish.isCorrect && isSelected) {
              borderColor = 'border-green-400';
              bgExtra = 'ring-2 ring-green-400';
            } else if (fish.isCorrect && !isSelected) {
              borderColor = 'border-yellow-400';
              bgExtra = 'ring-2 ring-yellow-400 animate-pulse';
            } else if (!fish.isCorrect && isSelected) {
              borderColor = 'border-red-400';
              bgExtra = 'ring-2 ring-red-400';
            }
          } else if (isSelected) {
            borderColor = 'border-star';
            bgExtra = 'ring-2 ring-star scale-110';
          }

          return (
            <button
              key={idx}
              onClick={() => toggleFish(idx)}
              disabled={revealed}
              className={`absolute rounded-xl px-3 py-2 font-bold text-sm transition-all duration-200
                bg-white/15 backdrop-blur-sm border-2 ${borderColor} ${bgExtra}
                ${!revealed ? 'hover:scale-110 active:scale-95' : ''}`}
              style={{
                top: `${pos.top}%`,
                left: `${pos.left}%`,
                animation: !revealed ? `swim ${rand(3, 5)}s ease-in-out infinite` : 'none',
                animationDelay: `${pos.delay}s`,
              }}
            >
              <span className="mr-1">{style.shape}</span>
              <span className="text-white">{fish.display}</span>
              {revealed && fish.isCorrect && !isSelected && (
                <span className="ml-1 text-yellow-300">!</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Action button */}
      {!revealed ? (
        <button
          onClick={checkAnswers}
          disabled={selected.size === 0}
          className="w-full py-4 rounded-xl font-bold text-lg text-white disabled:opacity-40"
          style={{ background: 'linear-gradient(90deg, #0891b2, #06b6d4)' }}
        >
          ✓ Vérifier mes réponses
        </button>
      ) : (
        <div>
          <div className="text-center mb-3">
            {results[results.length - 1]?.correct ? (
              <p className="text-green-300 font-bold text-lg">Parfait! Tous trouvés! 🌟</p>
            ) : (
              <p className="text-yellow-300 font-bold text-lg">
                Réponses: {round.fish.filter((f) => f.isCorrect).map((f) => f.display).join(', ')}
              </p>
            )}
          </div>
          <button
            onClick={nextRound}
            className="w-full py-4 rounded-xl font-bold text-lg text-white"
            style={{ background: 'linear-gradient(90deg, #0891b2, #06b6d4)' }}
          >
            {roundIndex + 1 >= TOTAL_ROUNDS ? 'Voir mes résultats 🏆' : 'Suivant →'}
          </button>
        </div>
      )}

      <style>{`
        @keyframes swim {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
