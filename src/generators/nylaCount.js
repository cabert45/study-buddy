// Nyla — Compte les objets (1-10)
// Pre-K (maternelle 5 ans): visual counting with emoji groups.
// Question shows a row of objects; she picks the correct count.
import { withFresh } from '../utils/antiRepeat';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const themes = [
  { name: 'pommes', icon: '🍎' },
  { name: 'étoiles', icon: '⭐' },
  { name: 'cœurs', icon: '❤️' },
  { name: 'fleurs', icon: '🌸' },
  { name: 'papillons', icon: '🦋' },
  { name: 'soleils', icon: '☀️' },
  { name: 'lunes', icon: '🌙' },
  { name: 'poissons', icon: '🐟' },
  { name: 'oiseaux', icon: '🐦' },
  { name: 'arbres', icon: '🌳' },
  { name: 'ballons', icon: '🎈' },
  { name: 'gâteaux', icon: '🍰' },
];

function buildOne() {
  const theme = themes[Math.floor(Math.random() * themes.length)];
  const n = 1 + Math.floor(Math.random() * 10); // 1 to 10
  // Build distractors close to the answer
  const allWrongs = [n - 2, n - 1, n + 1, n + 2].filter((x) => x >= 1 && x <= 10 && x !== n);
  const wrongs = shuffle(allWrongs).slice(0, 3);
  while (wrongs.length < 3) {
    const r = 1 + Math.floor(Math.random() * 10);
    if (r !== n && !wrongs.includes(r)) wrongs.push(r);
  }
  const options = shuffle([n, ...wrongs]).map(String);
  return {
    category: 'nyla_count',
    type: 'count',
    text: `Combien de ${theme.name}?\n\n${theme.icon.repeat(n)}`,
    correct: String(n),
    options,
    explanation: `Il y en a ${n}. Compte un par un: ${Array.from({ length: n }, (_, i) => i + 1).join(', ')}.`,
    hint: 'Pointe chaque objet avec ton doigt et compte un par un.',
  };
}

export function generateNylaCount() {
  return withFresh('nyla_count', buildOne, 50, 20, (q) => q.text);
}
