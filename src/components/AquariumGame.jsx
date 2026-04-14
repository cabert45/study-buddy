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
  const usedExpressions = new Set();
  let attempts = 0;

  while (fish.filter(f => f.isCorrect).length < rand(3, 4) && attempts < 50) {
    attempts++;
    const type = rand(0, 1);
    let display;
    if (type === 0) { const a = rand(1, target - 1); display = `${a} + ${target - a}`; }
    else { const a = rand(target + 1, target + 10); display = `${a} − ${a - target}`; }
    if (!usedExpressions.has(display)) { usedExpressions.add(display); fish.push({ display, isCorrect: true }); }
  }

  attempts = 0;
  while (fish.filter(f => !f.isCorrect).length < 5 && attempts < 50) {
    attempts++;
    const w = rand(2, 18);
    if (w === target) continue;
    const type = rand(0, 1);
    let display;
    if (type === 0) { const a = rand(1, w - 1); if (a < 1) continue; display = `${a} + ${w - a}`; }
    else { const a = rand(w + 1, w + 10); display = `${a} − ${a - w}`; }
    if (!usedExpressions.has(display)) { usedExpressions.add(display); fish.push({ display, isCorrect: false }); }
  }

  return { target, fish: shuffle(fish) };
}

const fishEmojis = ['🐟', '🐠', '🐡', '🦈', '🐙', '🦀', '🐳', '🐚', '🦑', '🐢'];
const TOTAL_ROUNDS = 6;

export default function AquariumGame({ onHome, onFinish }) {
  const [round, setRound] = useState(null);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState(new Set());
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState([]);

  const newRound = useCallback(() => {
    setRound(generateRound());
    setSelected(new Set());
    setRevealed(false);
  }, []);

  useEffect(() => { newRound(); }, [newRound]);
  useEffect(() => { if (round) speak(`Trouve les résultats qui font ${round.target}!`); }, [round]);

  if (!round) return null;

  function toggleFish(idx) {
    if (revealed) return;
    setSelected(prev => { const n = new Set(prev); if (n.has(idx)) n.delete(idx); else n.add(idx); return n; });
  }

  function checkAnswers() {
    setRevealed(true);
    const correctFish = round.fish.filter(f => f.isCorrect);
    const ok = [...selected].filter(i => round.fish[i].isCorrect);
    const bad = [...selected].filter(i => !round.fish[i].isCorrect);
    const isGood = bad.length === 0 && ok.length === correctFish.length;
    setResults(prev => [...prev, { category: 'aquarium', correct: isGood,
      question: `Résultats = ${round.target}`, userAnswer: `${ok.length}/${correctFish.length}`,
      correctAnswer: correctFish.map(f => f.display).join(', ') }]);
    speak(isGood ? 'Bravo!' : 'Pas tout à fait!');
  }

  function nextRound() {
    if (roundIndex + 1 >= TOTAL_ROUNDS) {
      const c = results.filter(r => r.correct).length;
      saveSession('aquarium', results.length, c, results.map(r => ({ category: 'aquarium', correct: r.correct })));
      onFinish({ results, correct: c, total: results.length, mode: 'aquarium', streak: 0 });
      return;
    }
    setRoundIndex(i => i + 1);
    newRound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={onHome} className="text-s4 font-bold text-sm hover:text-lava">← Menu</button>
        <div className="text-sm font-heading font-bold text-stone">🐟 Aquarium</div>
        <div className="text-sm font-bold text-s4">{roundIndex + 1}/{TOTAL_ROUNDS}</div>
      </div>

      <div className="text-center bg-white rounded-2xl p-4 mb-4 border-2 border-blue-200 shadow-sm">
        <p className="text-xs font-bold text-blue-500 mb-1">Trouve les résultats qui font:</p>
        <div className="font-heading text-5xl font-extrabold text-stone">{round.target}</div>
        <p className="text-xs font-bold text-s4 mt-1">{round.fish.filter(f => f.isCorrect).length} à trouver</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {round.fish.map((fish, idx) => {
          const emoji = fishEmojis[idx % fishEmojis.length];
          const isSel = selected.has(idx);
          let cls = 'bg-white border-2 border-s2 text-stone shadow-sm';
          if (revealed) {
            if (fish.isCorrect && isSel) cls = 'bg-green-50 border-2 border-green-500 text-green-700';
            else if (fish.isCorrect && !isSel) cls = 'bg-yellow-50 border-2 border-yellow-400 text-yellow-700 animate-pulse';
            else if (!fish.isCorrect && isSel) cls = 'bg-red-50 border-2 border-red-400 text-red-600';
            else cls = 'bg-gray-50 border-2 border-gray-200 text-gray-400';
          } else if (isSel) {
            cls = 'bg-orange-50 border-2 border-lava text-lava shadow-md scale-105';
          }
          return (
            <button key={idx} onClick={() => toggleFish(idx)} disabled={revealed}
              className={`rounded-2xl p-3 text-center transition-all active:scale-95 ${cls}`}
              style={{ minHeight: 75 }}>
              <div className="text-xl mb-1">{emoji}</div>
              <div className="text-sm font-extrabold">{fish.display}</div>
            </button>
          );
        })}
      </div>

      {!revealed ? (
        <button onClick={checkAnswers} disabled={selected.size === 0}
          className="w-full py-3.5 rounded-xl font-bold text-white disabled:opacity-40"
          style={{ background: 'linear-gradient(90deg, #0891b2, #06b6d4)' }}>
          ✓ Vérifier
        </button>
      ) : (
        <div>
          <div className="text-center mb-2">
            {results[results.length - 1]?.correct
              ? <p className="font-bold text-ok text-lg">Parfait! 🌟</p>
              : <p className="text-sm font-bold text-fox">
                  Réponses: {round.fish.filter(f => f.isCorrect).map(f => f.display).join(', ')}
                </p>}
          </div>
          <button onClick={nextRound}
            className="w-full py-3.5 rounded-xl font-bold text-white"
            style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
            {roundIndex + 1 >= TOTAL_ROUNDS ? 'Résultats 🏆' : 'Suivant →'}
          </button>
        </div>
      )}
    </div>
  );
}
