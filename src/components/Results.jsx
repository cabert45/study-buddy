import React from 'react';
import { speak } from '../utils/speech';
import { getVideosForCategory } from '../data/videoLinks';

function getReaction(pct) {
  if (pct >= 90) return { emoji: '🏆', text: 'Champion!' };
  if (pct >= 70) return { emoji: '⭐', text: 'Bravo!' };
  if (pct >= 50) return { emoji: '💪', text: 'Tu progresses!' };
  return { emoji: '🌋', text: 'Continue, tu vas y arriver!' };
}

// Analyze session and decide what to do next
function analyzeSession(results) {
  if (!results || !results.results) return { decision: 'done', reason: '' };

  const total = results.total;
  const correct = results.correct;
  const pct = total > 0 ? (correct / total) * 100 : 0;

  // Group errors by category
  const errorsByCategory = {};
  results.results.forEach(r => {
    if (!r.correct) {
      errorsByCategory[r.category] = (errorsByCategory[r.category] || 0) + 1;
    }
  });

  const errorCategories = Object.entries(errorsByCategory).sort((a, b) => b[1] - a[1]);
  const worstCategory = errorCategories[0]?.[0];
  const worstCategoryErrors = errorCategories[0]?.[1] || 0;

  // 90%+ → done, celebrate
  if (pct >= 90) {
    return {
      decision: 'mastered',
      reason: 'Tu maîtrises bien cette matière!',
      worstCategory,
    };
  }

  // 70-89% → one more session, light practice
  if (pct >= 70) {
    return {
      decision: 'light_more',
      reason: 'Tu y es presque! Une autre session pour bien maîtriser.',
      worstCategory,
    };
  }

  // 50-69% → focus on weak category + suggest video
  if (pct >= 50) {
    return {
      decision: 'focus_weak',
      reason: worstCategory
        ? `Tu as eu des difficultés avec "${worstCategory}". Concentrons-nous là-dessus.`
        : "Tu as besoin de plus de pratique.",
      worstCategory,
      suggestVideo: true,
    };
  }

  // Below 50% → STOP, suggest video first, then retry
  return {
    decision: 'video_first',
    reason: worstCategoryErrors >= 3
      ? `Tu sembles bloqué sur "${worstCategory}". Regarde une vidéo d'abord.`
      : 'Regarde une vidéo pour mieux comprendre, puis réessaie.',
    worstCategory,
    suggestVideo: true,
  };
}

const categoryLabels = {
  calcul: 'Calcul',
  terme: 'Terme manquant',
  multi_step: 'Problèmes',
  relational: 'De plus / de moins',
  compare: 'Compare',
  pair_impair: 'Pair / Impair',
  mental: 'Calcul mental',
  statistique: 'Statistique',
  determinant: 'Déterminants',
  verbes: 'Verbes',
  adjectif: 'Adjectifs',
  pemdas: 'PEMDAS',
  conjugaison: 'Conjugaison',
  dictee: 'Dictée',
  dictee_semaine: 'Dictée de la semaine',
  on_ont: 'ON / ONT',
  groupe_nom: 'Groupe du nom',
  passe_compose: 'Passé composé',
  aquarium: 'Aquarium',
  speed: 'Course',
  memory: 'Mémoire',
};

export default function Results({ results, onHome, onRetry, onContinueFocused }) {
  if (!results) return null;

  const { correct, total, streak } = results;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const reaction = getReaction(pct);
  const analysis = analyzeSession(results);

  const wrongAnswers = results.results
    .filter((r) => !r.correct)
    .slice(0, 4);

  const videos = analysis.worstCategory ? getVideosForCategory(analysis.worstCategory) : [];

  React.useEffect(() => {
    speak(`${reaction.text} Tu as ${correct} sur ${total}!`);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 pt-6 pb-8">
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
            🔥 Meilleure série: {streak}!
          </div>
        )}
      </div>

      {/* AI Tutor Decision */}
      <div className={`rounded-2xl p-5 mb-4 border-2 ${
        analysis.decision === 'mastered' ? 'bg-green-50 border-green-300' :
        analysis.decision === 'light_more' ? 'bg-orange-50 border-orange-300' :
        analysis.decision === 'focus_weak' ? 'bg-orange-50 border-orange-300' :
        'bg-red-50 border-red-300'
      }`}>
        <div className="flex items-start gap-3">
          <span className="text-3xl flex-shrink-0">
            {analysis.decision === 'mastered' ? '🏆' :
             analysis.decision === 'light_more' ? '💪' :
             analysis.decision === 'focus_weak' ? '🎯' : '📺'}
          </span>
          <div className="flex-1">
            <div className="font-heading text-sm font-bold uppercase tracking-wide text-s4 mb-1">
              Recommandation du tuteur
            </div>
            <p className="font-heading font-bold text-stone leading-snug">
              {analysis.reason}
            </p>
          </div>
        </div>
      </div>

      {/* Wrong answers review */}
      {wrongAnswers.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 border-2 border-s1">
          <h3 className="font-heading font-bold text-stone mb-3">📝 À revoir:</h3>
          <div className="space-y-3">
            {wrongAnswers.map((item, i) => (
              <div key={i} className="bg-red-50 rounded-xl p-3 border-l-4 border-red-400">
                <p className="font-semibold text-stone text-sm">{item.question}</p>
                <div className="flex gap-4 mt-1 text-sm">
                  <span className="text-red-500">Ta réponse: {item.userAnswer}</span>
                  <span className="text-green-600 font-bold">Bonne réponse: {item.correctAnswer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons — driven by AI decision */}
      <div className="space-y-3">
        {analysis.decision === 'mastered' && (
          <>
            <button onClick={onHome}
              className="w-full py-4 rounded-xl font-bold text-lg text-white"
              style={{ background: 'linear-gradient(90deg, #2d7a3a, #4ca65b)' }}>
              🏆 Excellent! Retour au menu
            </button>
            <button onClick={onRetry}
              className="w-full py-3 rounded-xl font-bold text-s6 bg-white border-2 border-s2">
              🔄 Encore une session
            </button>
          </>
        )}

        {analysis.decision === 'light_more' && (
          <>
            <button onClick={onRetry}
              className="w-full py-4 rounded-xl font-bold text-lg text-white"
              style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
              ▶ Continue! Une autre session
            </button>
            <button onClick={onHome}
              className="w-full py-3 rounded-xl font-bold text-s6 bg-white border-2 border-s2">
              ← Pause / Menu
            </button>
          </>
        )}

        {analysis.decision === 'focus_weak' && (
          <>
            {videos.length > 0 && (
              <button onClick={() => window.open(videos[0].url, '_blank')}
                className="w-full py-3 rounded-xl font-bold text-white text-base"
                style={{ background: 'linear-gradient(90deg, #3a5bc7, #5b4ad4)' }}>
                📺 Regarder la vidéo: {categoryLabels[analysis.worstCategory] || analysis.worstCategory}
              </button>
            )}
            <button onClick={() => onContinueFocused ? onContinueFocused(analysis.worstCategory) : onRetry()}
              className="w-full py-4 rounded-xl font-bold text-lg text-white"
              style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
              🎯 Plus de pratique sur {categoryLabels[analysis.worstCategory] || 'ce sujet'}
            </button>
            <button onClick={onHome}
              className="w-full py-3 rounded-xl font-bold text-s6 bg-white border-2 border-s2">
              ← Pause / Menu
            </button>
          </>
        )}

        {analysis.decision === 'video_first' && (
          <>
            {videos.length > 0 && (
              <button onClick={() => window.open(videos[0].url, '_blank')}
                className="w-full py-4 rounded-xl font-bold text-white text-lg"
                style={{ background: 'linear-gradient(90deg, #3a5bc7, #5b4ad4)' }}>
                📺 1. Regarde cette vidéo d'abord
              </button>
            )}
            <button onClick={() => onContinueFocused ? onContinueFocused(analysis.worstCategory) : onRetry()}
              className="w-full py-3 rounded-xl font-bold text-white text-base"
              style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
              🎯 2. Pratique encore (focus: {categoryLabels[analysis.worstCategory] || 'ce sujet'})
            </button>
            <button onClick={onHome}
              className="w-full py-3 rounded-xl font-bold text-s6 bg-white border-2 border-s2">
              ← Pause / Menu
            </button>
          </>
        )}
      </div>
    </div>
  );
}
