import React, { useState, useEffect, useRef, useCallback } from 'react';
import { speak } from '../utils/speech';
import { saveSession } from '../utils/storage';

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
  const type = rand(0, 3);
  if (type === 0) {
    const a = rand(2, 40);
    const b = rand(2, 40);
    if (a + b > 80) return generateQuestion();
    return { text: `${a} + ${b}`, answer: a + b };
  }
  if (type === 1) {
    const a = rand(12, 80);
    const b = rand(2, a - 1);
    return { text: `${a} − ${b}`, answer: a - b };
  }
  if (type === 2) {
    // +9 / -9 strategy
    const a = rand(5, 80);
    return { text: `${a} + 9`, answer: a + 9 };
  }
  const a = rand(15, 90);
  return { text: `${a} − 10`, answer: a - 10 };
}

function generateOptions(correct) {
  const opts = new Set([correct]);
  while (opts.size < 4) {
    const fake = correct + rand(-5, 5);
    if (fake !== correct && fake >= 0 && fake <= 99) opts.add(fake);
  }
  const arr = [...opts];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const GAME_DURATION = 60;

export default function SpeedGame({ onHome, onFinish }) {
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [flash, setFlash] = useState(null); // 'correct' or 'wrong'
  const [gameOver, setGameOver] = useState(false);
  const [results, setResults] = useState([]);
  const timerRef = useRef(null);

  const nextQuestion = useCallback(() => {
    const q = generateQuestion();
    setQuestion(q);
    setOptions(generateOptions(q.answer));
    setFlash(null);
  }, []);

  useEffect(() => {
    nextQuestion();
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [nextQuestion]);

  useEffect(() => {
    if (gameOver) {
      speak(`Terminé! Tu as ${score} bonnes réponses!`);
      saveSession('speed', total, score,
        results.map(r => ({ category: 'speed', correct: r.correct })));
    }
  }, [gameOver]);

  function handleAnswer(value) {
    if (gameOver) return;
    const isCorrect = value === question.answer;
    setTotal(t => t + 1);
    setResults(prev => [...prev, {
      category: 'speed', correct: isCorrect,
      question: question.text, userAnswer: value, correctAnswer: question.answer,
    }]);

    if (isCorrect) {
      setScore(s => s + 1);
      setStreak(s => {
        const newS = s + 1;
        setBestStreak(b => Math.max(b, newS));
        return newS;
      });
      setFlash('correct');
    } else {
      setStreak(0);
      setFlash('wrong');
    }

    setTimeout(() => nextQuestion(), 300);
  }

  if (gameOver) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    return (
      <div className="max-w-3xl mx-auto px-4 pt-6 text-center">
        <div className="text-5xl mb-4">⏱️</div>
        <h2 className="text-2xl font-extrabold text-white mb-2">Temps écoulé!</h2>
        <div className="bg-white/10 rounded-2xl p-6 mb-4 border border-white/10">
          <div className="text-4xl font-extrabold text-star mb-1">{score}</div>
          <div className="text-sm text-purple-300">bonnes réponses en {GAME_DURATION}s</div>
          <div className="flex justify-around mt-4">
            <div>
              <div className="text-xl font-bold text-white">{total}</div>
              <div className="text-xs text-purple-400">Total</div>
            </div>
            <div>
              <div className="text-xl font-bold text-green-400">{pct}%</div>
              <div className="text-xs text-purple-400">Précision</div>
            </div>
            <div>
              <div className="text-xl font-bold text-star">{bestStreak}🔥</div>
              <div className="text-xs text-purple-400">Série</div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <button onClick={() => {
            onFinish({ results, correct: score, total, mode: 'speed', streak: bestStreak });
          }} className="w-full py-3 rounded-xl font-bold text-white"
            style={{ background: 'linear-gradient(90deg, #e84393, #6c5ce7)' }}>
            Voir les résultats 🏆
          </button>
          <button onClick={onHome}
            className="w-full py-3 rounded-xl font-bold text-purple-300 bg-white/10">
            ← Menu
          </button>
        </div>
      </div>
    );
  }

  if (!question) return null;

  const timerPct = (timeLeft / GAME_DURATION) * 100;
  const timerColor = timeLeft > 20 ? '#00b894' : timeLeft > 10 ? '#fdcb6e' : '#e84393';

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onHome} className="text-s4 font-bold text-sm hover:text-lava">← Menu</button>
        <div className="text-sm font-bold text-rocket">⚡ Course</div>
        <div className="text-lg font-extrabold text-white">{score}</div>
      </div>

      {/* Timer bar */}
      <div className="w-full bg-white/10 rounded-full h-3 mb-4 overflow-hidden">
        <div className="h-3 rounded-full transition-all duration-1000"
          style={{ width: `${timerPct}%`, background: timerColor }} />
      </div>

      {/* Time + streak */}
      <div className="flex justify-between mb-4">
        <div className="text-2xl font-extrabold" style={{ color: timerColor }}>{timeLeft}s</div>
        {streak >= 2 && <div className="text-lg font-bold text-star">🔥 {streak}</div>}
      </div>

      {/* Question */}
      <div className={`rounded-2xl p-8 mb-4 text-center border-2 transition-all duration-200 ${
        flash === 'correct' ? 'bg-green-500/20 border-green-400' :
        flash === 'wrong' ? 'bg-red-500/20 border-red-400' :
        'bg-white/10 border-white/10'
      }`}>
        <div className="text-4xl font-extrabold text-white">
          {question.text} = ?
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(opt)}
            className="py-5 rounded-xl font-extrabold text-2xl text-white bg-white/10 border-2 border-white/20
              active:scale-95 active:bg-white/20 transition-all"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
