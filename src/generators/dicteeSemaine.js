// Dictée de la semaine — drills the EXACT words from this week's test
// Knows in advance what Tuesday's test will contain

import { getCurrentWeekWords } from '../data/dicteeWeekly';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let currentWeekKey = 'theme6_s1';

export function setCurrentWeek(key) {
  currentWeekKey = key;
}

export function generateDicteeSemaine() {
  const week = getCurrentWeekWords(currentWeekKey);
  const word = week.words[Math.floor(Math.random() * week.words.length)];

  // Build options: correct + wrongs, ensure 4 unique
  const wrongOptions = word.wrongs.filter(w => w !== word.correct);
  while (wrongOptions.length < 3) {
    wrongOptions.push(word.correct + 'e');
  }
  const options = shuffle([word.correct, ...wrongOptions.slice(0, 3)]);

  return {
    category: 'dictee_semaine',
    type: 'dictee_semaine',
    text: `${week.rule}`,
    spokenWord: word.correct,
    correct: word.correct,
    options,
    explanation: `La bonne orthographe est: ${word.correct}`,
    weekName: week.name,
  };
}
