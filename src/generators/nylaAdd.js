// Nyla — Petites additions (1+1 à 5+5)
// Pre-K maternelle: combining two small groups. Visual emoji support so
// she can count to verify.
import { withFresh } from '../utils/antiRepeat';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const icons = ['🍎', '⭐', '🐠', '🌸', '🦋', '🍓', '🎈', '🧁', '🐝', '🐞'];

function buildOne() {
  const icon = icons[Math.floor(Math.random() * icons.length)];
  const a = 1 + Math.floor(Math.random() * 5); // 1-5
  const b = 1 + Math.floor(Math.random() * 5); // 1-5
  const correct = a + b;
  const wrongs = new Set();
  wrongs.add(correct - 1);
  wrongs.add(correct + 1);
  wrongs.add(Math.abs(a - b));
  const distractors = [...wrongs].filter((w) => w >= 0 && w <= 10 && w !== correct).slice(0, 3);
  while (distractors.length < 3) {
    const r = Math.floor(Math.random() * 11);
    if (r !== correct && !distractors.includes(r)) distractors.push(r);
  }
  return {
    category: 'nyla_add',
    type: 'add',
    text: `Combien y en a-t-il en tout?\n\n${icon.repeat(a)}    ${icon.repeat(b)}`,
    correct: String(correct),
    options: shuffle([correct, ...distractors]).map(String),
    explanation: `${a} + ${b} = ${correct}. Compte tous les ${icon} ensemble!`,
    hint: 'Compte d\'abord le premier groupe, puis continue avec le deuxième.',
  };
}

export function generateNylaAdd() {
  return withFresh('nyla_add', buildOne, 50, 20, (q) => q.text);
}
