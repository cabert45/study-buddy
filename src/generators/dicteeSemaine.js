// Dictée de la semaine — drills the EXACT words from this week's test
// Knows in advance what Tuesday's test will contain

import { dicteeWeeks, getCurrentWeekWords, setCurrentWeek as setWeek } from '../data/dicteeWeekly';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function setCurrentWeek(key) {
  setWeek(key);
}

function buildQuestionFromWord(word, weekName) {
  const wrongOptions = word.wrongs.filter(w => w !== word.correct);
  while (wrongOptions.length < 3) {
    wrongOptions.push(word.correct + 'e');
  }
  const options = shuffle([word.correct, ...wrongOptions.slice(0, 3)]);

  return {
    category: 'dictee_semaine',
    type: 'dictee_semaine',
    text: weekName,
    spokenWord: word.correct,
    correct: word.correct,
    options,
    explanation: `La bonne orthographe est: ${word.correct}`,
    weekName,
  };
}

export function generateDicteeSemaine() {
  const week = getCurrentWeekWords();
  const word = week.words[Math.floor(Math.random() * week.words.length)];
  return buildQuestionFromWord(word, week.name);
}

// Cumulative — pulls from ALL weeks, with focus on past failures
export function generateDicteeCumulative() {
  const allWeeks = Object.entries(dicteeWeeks);
  const week = allWeeks[Math.floor(Math.random() * allWeeks.length)][1];
  const word = week.words[Math.floor(Math.random() * week.words.length)];
  return buildQuestionFromWord(word, `Révision: ${week.name}`);
}
