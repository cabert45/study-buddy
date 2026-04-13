import React from 'react';
import { speak } from '../utils/speech';

function getReaction(pct) {
  if (pct >= 90) return { emoji: '🏆', text: 'Champion Ryan!' };
  if (pct >= 70) return { emoji: '⭐', text: 'Bravo Ryan!' };
  if (pct >= 50) return { emoji: '💪', text: 'Tu progresses!' };
  return { emoji: '🚀', text: 'Continue, tu vas y arriver!' };
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
      <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-4 border border-white/10">
        <div className="text-6xl mb-3">{reaction.emoji}</div>
        <h2 className="text-2xl font-extrabold text-star mb-2">{reaction.text}</h2>
        <div className="text-4xl font-extrabold text-white">
          {correct} / {total}
        </div>
        <div className="text-lg text-purple-300 font-semibold">{pct}%</div>

        {/* Stars */}
        <div className="mt-3 text-3xl">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i}>{i < Math.ceil(pct / 20) ? '⭐' : '☆'}</span>
          ))}
        </div>

        {streak >= 3 && (
          <div className="mt-2 text-star font-bold">
            🌟 Meilleure serie: {streak}!
          </div>
        )}
      </div>

      {/* Wrong answers review (max 3-4) */}
      {wrongAnswers.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-sm p-4 mb-4 border border-white/10">
          <h3 className="font-bold text-purple-200 mb-3">📝 A revoir:</h3>
          <div className="space-y-3">
            {wrongAnswers.map((item, i) => (
              <div key={i} className="bg-red-500/10 rounded-xl p-3 border-l-4 border-red-400/50">
                <p className="font-semibold text-white text-sm">{item.question}</p>
                <div className="flex gap-4 mt-1 text-sm">
                  <span className="text-red-300">Ta reponse: {item.userAnswer}</span>
                  <span className="text-green-300 font-bold">Bonne reponse: {item.correctAnswer}</span>
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
          style={{ background: 'linear-gradient(90deg, #6c5ce7, #e84393)' }}
        >
          🔄 Encore une session!
        </button>
        <button
          onClick={onHome}
          className="w-full py-4 rounded-xl font-bold text-lg text-purple-300 bg-white/10"
        >
          ← Menu
        </button>
      </div>
    </div>
  );
}
