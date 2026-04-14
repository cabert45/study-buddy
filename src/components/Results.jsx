import React from 'react';
import { speak } from '../utils/speech';

function getReaction(pct) {
  if (pct >= 90) return { emoji: '🏆', text: 'Champion!' };
  if (pct >= 70) return { emoji: '⭐', text: 'Bravo!' };
  if (pct >= 50) return { emoji: '💪', text: 'Tu progresses!' };
  return { emoji: '🌋', text: 'Continue, tu vas y arriver!' };
}

export default function Results({ results, onHome, onRetry }) {
  if (!results) return null;

  const { correct, total, streak } = results;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const reaction = getReaction(pct);

  const wrongAnswers = results.results
    .filter((r) => !r.correct)
    .slice(0, 4);

  React.useEffect(() => {
    speak(`${reaction.text} Tu as ${correct} sur ${total}!`);
  }, []);

  return (
    <div className="max-w-md mx-auto px-4 pt-6">
      {/* Score header */}
      <div className="text-center bg-white rounded-2xl shadow-sm p-6 mb-4 border-2 border-s1">
        <div className="text-6xl mb-3">{reaction.emoji}</div>
        <h2 className="font-heading text-2xl font-extrabold text-lava mb-2">{reaction.text}</h2>
        <div className="font-heading text-4xl font-extrabold text-stone">
          {correct} / {total}
        </div>
        <div className="text-lg text-s4 font-bold">{pct}%</div>

        {/* Stars */}
        <div className="mt-3 text-3xl">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i}>{i < Math.ceil(pct / 20) ? '⭐' : '☆'}</span>
          ))}
        </div>

        {streak >= 3 && (
          <div className="mt-2 text-fox font-bold">
            🔥 Meilleure serie: {streak}!
          </div>
        )}
      </div>

      {/* Wrong answers review */}
      {wrongAnswers.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 border-2 border-s1">
          <h3 className="font-heading font-bold text-stone mb-3">📝 A revoir:</h3>
          <div className="space-y-3">
            {wrongAnswers.map((item, i) => (
              <div key={i} className="bg-red-50 rounded-xl p-3 border-l-4 border-red-400">
                <p className="font-semibold text-stone text-sm">{item.question}</p>
                <div className="flex gap-4 mt-1 text-sm">
                  <span className="text-red-500">Ta reponse: {item.userAnswer}</span>
                  <span className="text-green-600 font-bold">Bonne reponse: {item.correctAnswer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="space-y-3">
        <button
          onClick={onRetry}
          className="w-full py-4 rounded-xl font-bold text-lg text-white"
          style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}
        >
          🔄 Encore une session!
        </button>
        <button
          onClick={onHome}
          className="w-full py-4 rounded-xl font-bold text-lg text-s6 bg-white border-2 border-s2"
        >
          ← Menu
        </button>
      </div>
    </div>
  );
}
