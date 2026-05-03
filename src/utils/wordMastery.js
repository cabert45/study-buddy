// Per-word mastery tracking with spaced repetition
// Tracks each word's success rate per profile, weights selection so
// struggling words appear MORE and mastered words appear LESS.

const KEY_PREFIX = 'sb_mastery_';

function key(profile, weekKey) {
  return `${KEY_PREFIX}${profile}_${weekKey}`;
}

export function loadMastery(profile, weekKey) {
  try {
    return JSON.parse(localStorage.getItem(key(profile, weekKey)) || '{}');
  } catch {
    return {};
  }
}

export function saveMastery(profile, weekKey, data) {
  try {
    localStorage.setItem(key(profile, weekKey), JSON.stringify(data));
  } catch {}
}

// Record a single answer for a word
export function recordAnswer(profile, weekKey, word, isCorrect) {
  const data = loadMastery(profile, weekKey);
  const w = data[word] || { correct: 0, wrong: 0, streak: 0, lastSeen: 0, attempts: 0 };
  w.attempts = (w.attempts || 0) + 1;
  w.lastSeen = Date.now();
  if (isCorrect) {
    w.correct = (w.correct || 0) + 1;
    w.streak = (w.streak || 0) + 1;
  } else {
    w.wrong = (w.wrong || 0) + 1;
    w.streak = 0;
  }
  data[word] = w;
  saveMastery(profile, weekKey, data);
  return w;
}

// Word status: 'new', 'learning', 'practicing', 'mastered'
export function wordStatus(stats) {
  if (!stats || stats.attempts === 0) return 'new';
  if (stats.streak >= 5 && stats.attempts >= 5) return 'mastered';
  if (stats.attempts < 3) return 'learning';
  const pct = stats.correct / (stats.correct + stats.wrong);
  if (pct >= 0.8) return 'practicing';
  return 'learning'; // struggling
}

// Priority score — higher = more urgent to show
// new words: 100
// streak 0 (just got wrong): 90
// learning (low attempts): 70
// practicing (good but not mastered): 30
// mastered: 5
function priorityScore(stats) {
  if (!stats || stats.attempts === 0) return 100;
  const status = wordStatus(stats);
  if (status === 'mastered') return 5;
  if (stats.streak === 0) return 90; // just missed it
  if (status === 'learning') {
    const pct = stats.correct / (stats.correct + stats.wrong);
    return 80 - (pct * 30); // worse pct = higher priority
  }
  if (status === 'practicing') return 30;
  return 50;
}

// Build a smart queue of words to show, weighted by priority
// Returns shuffled but priority-biased list
export function buildSmartQueue(profile, weekKey, allWords) {
  const data = loadMastery(profile, weekKey);

  // Score each word
  const scored = allWords.map(w => ({
    word: w,
    stats: data[w.correct],
    priority: priorityScore(data[w.correct]),
  }));

  // Weighted shuffle: words with higher priority appear earlier more often
  // We do a soft sort with randomness so it's not always identical
  scored.sort((a, b) => {
    const noise = (Math.random() - 0.5) * 30; // ±15 priority noise
    return (b.priority + noise) - a.priority;
  });

  return scored.map(s => s.word);
}

// Get summary stats for a week
export function getWeekSummary(profile, weekKey, allWords) {
  const data = loadMastery(profile, weekKey);
  let mastered = 0, practicing = 0, learning = 0, new_ = 0;
  for (const w of allWords) {
    const status = wordStatus(data[w.correct]);
    if (status === 'mastered') mastered++;
    else if (status === 'practicing') practicing++;
    else if (status === 'learning') learning++;
    else new_++;
  }
  return { mastered, practicing, learning, new: new_, total: allWords.length };
}

// Get per-word details for display (sorted by priority)
export function getWordDetails(profile, weekKey, allWords) {
  const data = loadMastery(profile, weekKey);
  return allWords.map(w => {
    const stats = data[w.correct] || { correct: 0, wrong: 0, streak: 0, attempts: 0 };
    return {
      word: w.correct,
      stats,
      status: wordStatus(stats),
      pct: stats.attempts > 0 ? Math.round((stats.correct / (stats.correct + stats.wrong)) * 100) : 0,
    };
  }).sort((a, b) => priorityScore(b.stats) - priorityScore(a.stats));
}
