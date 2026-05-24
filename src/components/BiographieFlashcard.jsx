import { useState, useEffect, useRef } from 'react';
import { speak } from '../utils/speech';
import { saveSession } from '../utils/storage';
import { biographieQuestions } from '../generators/biographieJr';
import { notifySessionResult } from '../utils/notifications';

// Smart string compare — tolerates accents, case, punctuation, extra whitespace
function normalize(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[''`´]/g, "'")
    .replace(/[^a-z0-9\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isCloseEnough(typed, correct) {
  const a = normalize(typed);
  const b = normalize(correct);
  if (a === b) return true;
  // Allow if the typed answer contains the key part of the correct answer
  // (useful for long quotes — Ryan can paraphrase if the key words are there)
  if (b.length <= 20) return false;
  // For long answers, accept if typed has ≥70% of the words from correct
  const wordsA = new Set(a.split(' '));
  const wordsB = b.split(' ');
  const matched = wordsB.filter((w) => w.length >= 3 && wordsA.has(w)).length;
  return matched / wordsB.length >= 0.7;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function BiographieFlashcard({ onHome, onFinish }) {
  const [round, setRound] = useState(1);
  const [queue, setQueue] = useState(() => shuffle(biographieQuestions));
  const [missedThisRound, setMissedThisRound] = useState([]);
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [selfGrade, setSelfGrade] = useState(null); // 'right' | 'wrong' | null
  const [allDone, setAllDone] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const inputRef = useRef(null);

  const q = queue[idx];

  useEffect(() => {
    if (q) {
      setTimeout(() => speak(q.text, 0.95), 300);
      setTimeout(() => inputRef.current?.focus(), 600);
    }
  }, [q]);

  if (allDone) {
    const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    return (
      <div className="max-w-3xl mx-auto px-4 pt-6 text-center">
        <div className="text-6xl mb-3">🏆</div>
        <h2 className="font-heading text-3xl font-extrabold text-ok mb-2">
          Toutes les questions maîtrisées!
        </h2>
        <p className="text-stone font-semibold mb-2">
          {stats.correct}/{stats.total} bonnes réponses · {round - 1} tour{round > 2 ? 's' : ''}
        </p>
        <p className={`text-2xl font-extrabold mb-6 ${pct >= 90 ? 'text-emerald-600' : pct >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
          {pct}%
        </p>
        <div className="space-y-3">
          <button onClick={onFinish}
            className="w-full py-4 rounded-xl font-bold text-white text-lg"
            style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
            Voir les résultats
          </button>
          <button onClick={onHome}
            className="w-full py-3 rounded-xl font-bold text-s6 bg-white border-2 border-s2">
            ← Menu
          </button>
        </div>
      </div>
    );
  }

  if (!q) return null;

  function handleSubmit(e) {
    e?.preventDefault();
    if (showResult) return nextQuestion();
    const auto = isCloseEnough(typed, q.correct);
    setShowResult(true);
    if (auto) {
      // Auto-mark right and continue — no need for self-grade
      handleGrade('right');
    }
  }

  function handleGrade(grade) {
    setSelfGrade(grade);
    const isRight = grade === 'right';
    setStats((s) => ({ correct: s.correct + (isRight ? 1 : 0), total: s.total + 1 }));
    if (!isRight) {
      setMissedThisRound((prev) => [...prev, q]);
    }
    // Brief pause to show feedback, then advance
    setTimeout(() => {
      goToNextOrEndRound(isRight);
    }, isRight ? 600 : 1500);
  }

  function goToNextOrEndRound(wasRight) {
    if (idx + 1 < queue.length) {
      setIdx(idx + 1);
      setTyped('');
      setShowResult(false);
      setSelfGrade(null);
      return;
    }
    // End of round
    const missed = wasRight ? missedThisRound : [...missedThisRound, q];
    const uniqueMissed = Array.from(new Set(missed.map((m) => m.id))).map((id) => missed.find((m) => m.id === id));
    if (uniqueMissed.length === 0) {
      setAllDone(true);
      const profile = localStorage.getItem('sb_profile') || 'ryan';
      saveSession('biographie_jr_flashcard', stats.total + 1, stats.correct + (wasRight ? 1 : 0),
        [{ category: 'biographie_jr', correct: true }]);
      notifySessionResult({
        profile, mode: 'biographie flashcard',
        correct: stats.correct + (wasRight ? 1 : 0),
        total: stats.total + 1, streak: 0, results: [],
      });
      return;
    }
    // Re-queue missed ones for another round
    setQueue(shuffle(uniqueMissed));
    setMissedThisRound([]);
    setIdx(0);
    setTyped('');
    setShowResult(false);
    setSelfGrade(null);
    setRound((r) => r + 1);
  }

  function nextQuestion() {
    if (!selfGrade) return; // wait for grading
  }

  function speakQuestion() {
    speak(q.text, 0.9);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-4 pb-12">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onHome}
          className="bg-white border-2 border-s2 rounded-xl px-3 py-1.5 text-sm font-bold text-s6">
          ← Menu
        </button>
        <div className="text-xs font-bold text-s5">
          Tour {round} · Question {idx + 1}/{queue.length} · {stats.correct}/{stats.total}
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border-2 border-s2 shadow-sm p-5">
        <div className="text-[10px] font-extrabold uppercase tracking-wide text-fox mb-2">
          📖 Biographie — Jean Rostand · Écris la réponse
        </div>

        {/* Question */}
        <div className="bg-orange-50 rounded-xl p-4 mb-3 border-2 border-orange-200">
          <p className="text-lg font-heading font-bold text-stone leading-snug">{q.text}</p>
          <button onClick={speakQuestion}
            className="mt-2 text-xs font-bold text-fox hover:underline">
            🔊 Réécouter
          </button>
        </div>

        {/* Typing area */}
        <form onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            disabled={showResult}
            placeholder="Écris ta réponse ici..."
            rows={q.correct.length > 30 ? 3 : 2}
            className="w-full px-4 py-3 rounded-xl border-2 border-s2 focus:border-lava focus:outline-none text-lg font-semibold text-stone resize-none"
            style={{ background: showResult ? '#f6f6f6' : 'white' }}
          />

          {!showResult && (
            <button type="submit" disabled={!typed.trim()}
              className="w-full mt-3 py-3 rounded-xl font-bold text-white text-lg disabled:opacity-40"
              style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
              Vérifier ma réponse
            </button>
          )}
        </form>

        {/* Result + self-grade */}
        {showResult && (
          <div className="mt-4">
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 mb-3">
              <div className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 mb-1">Bonne réponse</div>
              <div className="text-base font-bold text-stone">{q.correct}</div>
              {q.explanation && (
                <div className="text-xs text-s6 mt-1">{q.explanation}</div>
              )}
            </div>

            {selfGrade === null && (
              <div>
                <div className="text-xs font-bold text-stone text-center mb-2">Ta réponse était-elle bonne?</div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => handleGrade('right')}
                    className="py-3 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600">
                    ✓ Oui, j'ai bon
                  </button>
                  <button onClick={() => handleGrade('wrong')}
                    className="py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600">
                    ✗ Non, j'ai faux
                  </button>
                </div>
              </div>
            )}

            {selfGrade === 'right' && (
              <div className="text-center text-emerald-700 font-bold">Bravo! Question suivante...</div>
            )}
            {selfGrade === 'wrong' && (
              <div className="text-center text-red-600 font-bold">Pas grave! On va la revoir au prochain tour.</div>
            )}
          </div>
        )}
      </div>

      {/* Round info */}
      {round > 1 && (
        <div className="text-xs text-s5 text-center mt-3">
          🔄 Tour {round} — tu revois les questions que tu as manquées au tour précédent
        </div>
      )}
    </div>
  );
}
