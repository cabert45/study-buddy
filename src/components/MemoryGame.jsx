import React, { useState, useEffect } from 'react';
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

function generatePairs() {
  const pairs = [];
  const used = new Set();

  while (pairs.length < 6) {
    const type = rand(0, 2);
    let expr, answer;
    if (type === 0) {
      const a = rand(2, 30);
      const b = rand(2, 30);
      if (a + b > 60) continue;
      expr = `${a} + ${b}`;
      answer = a + b;
    } else if (type === 1) {
      const a = rand(15, 60);
      const b = rand(2, a - 2);
      expr = `${a} − ${b}`;
      answer = a - b;
    } else {
      const a = rand(3, 40);
      expr = `${a} + 9`;
      answer = a + 9;
    }
    const key = `${expr}=${answer}`;
    if (!used.has(key) && !used.has(String(answer))) {
      used.add(key);
      used.add(String(answer));
      pairs.push({ expr, answer });
    }
  }

  // Create cards: one with expression, one with answer
  const cards = [];
  pairs.forEach((pair, idx) => {
    cards.push({ id: idx * 2, pairId: idx, display: pair.expr, type: 'expr' });
    cards.push({ id: idx * 2 + 1, pairId: idx, display: String(pair.answer), type: 'answer' });
  });

  return shuffle(cards);
}

const cardColors = ['from-blue-500/30 to-blue-600/20', 'from-purple-500/30 to-purple-600/20',
  'from-pink-500/30 to-pink-600/20', 'from-green-500/30 to-green-600/20',
  'from-cyan-500/30 to-cyan-600/20', 'from-orange-500/30 to-orange-600/20'];

export default function MemoryGame({ onHome, onFinish }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    const c = generatePairs();
    setCards(c);
    speak('Mémorise les cartes!');
    // Show all cards briefly at start
    setTimeout(() => setShowAll(false), 3000);
  }, []);

  useEffect(() => {
    if (matched.size === cards.length && cards.length > 0) {
      setGameOver(true);
      speak(`Bravo! Tu as trouvé toutes les paires en ${attempts} essais!`);
      saveSession('memory', 6, Math.max(1, 6 - Math.floor(attempts / 3)),
        [{ category: 'memory', correct: true }]);
    }
  }, [matched, cards.length, attempts]);

  function flipCard(idx) {
    if (showAll || flipped.length >= 2 || flipped.includes(idx) || matched.has(idx)) return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setAttempts(a => a + 1);
      const [first, second] = newFlipped;
      const card1 = cards[first];
      const card2 = cards[second];

      if (card1.pairId === card2.pairId) {
        // Match!
        setTimeout(() => {
          setMatched(prev => {
            const next = new Set(prev);
            next.add(first);
            next.add(second);
            return next;
          });
          setFlipped([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  }

  if (gameOver) {
    const stars = attempts <= 8 ? 5 : attempts <= 12 ? 4 : attempts <= 16 ? 3 : attempts <= 20 ? 2 : 1;
    return (
      <div className="max-w-md mx-auto px-4 pt-6 text-center">
        <div className="text-5xl mb-4">🎴</div>
        <h2 className="text-2xl font-extrabold text-white mb-2">Toutes les paires trouvées!</h2>
        <div className="bg-white/10 rounded-2xl p-6 mb-4 border border-white/10">
          <div className="text-3xl mb-2">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i}>{i < stars ? '⭐' : '☆'}</span>
            ))}
          </div>
          <div className="text-lg font-bold text-white">{attempts} essais</div>
          <div className="text-sm text-purple-300">
            {stars >= 4 ? 'Excellente mémoire!' : stars >= 3 ? 'Bien joué!' : 'Continue à pratiquer!'}
          </div>
        </div>
        <div className="space-y-3">
          <button onClick={() => {
            onFinish({
              results: [{ category: 'memory', correct: true, question: 'Memory Match', userAnswer: `${attempts} essais`, correctAnswer: '6 paires' }],
              correct: Math.max(1, 6 - Math.floor(attempts / 3)), total: 6, mode: 'memory', streak: 0,
            });
          }} className="w-full py-3 rounded-xl font-bold text-white"
            style={{ background: 'linear-gradient(90deg, #e84393, #6c5ce7)' }}>
            Résultats 🏆
          </button>
          <button onClick={onHome}
            className="w-full py-3 rounded-xl font-bold text-purple-300 bg-white/10">
            ← Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={onHome} className="text-purple-400 font-bold text-sm">← Menu</button>
        <div className="text-sm font-bold text-pink-300">🎴 Mémoire</div>
        <div className="text-sm text-purple-400">Essais: {attempts}</div>
      </div>

      {showAll && (
        <div className="text-center mb-3 text-sm font-bold text-star animate-pulse">
          👀 Mémorise les cartes!
        </div>
      )}

      {/* Pairs found counter */}
      <div className="text-center mb-3">
        <span className="text-sm font-bold text-purple-300">
          Paires: {matched.size / 2} / {cards.length / 2}
        </span>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-3 gap-2">
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.has(idx) || showAll;
          const isMatched = matched.has(idx);
          const colorIdx = card.pairId % cardColors.length;

          return (
            <button
              key={card.id}
              onClick={() => flipCard(idx)}
              className={`rounded-xl transition-all duration-300 flex items-center justify-center ${
                isMatched
                  ? 'bg-green-500/20 border-2 border-green-400/50 scale-95'
                  : isFlipped
                    ? `bg-gradient-to-br ${cardColors[colorIdx]} border-2 border-white/30`
                    : 'bg-white/10 border-2 border-white/15 hover:bg-white/15 active:scale-95'
              }`}
              style={{ height: 80 }}
            >
              {isFlipped ? (
                <span className={`font-extrabold ${card.type === 'expr' ? 'text-base' : 'text-xl'} ${
                  isMatched ? 'text-green-300' : 'text-white'
                }`}>
                  {card.display}
                </span>
              ) : (
                <span className="text-2xl">❓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
