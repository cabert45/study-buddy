// Nyla — Suites logiques (patterns)
// Maternelle: AB, ABB, ABC patterns. Show a sequence with a missing item,
// she picks what comes next.
import { withFresh } from '../utils/antiRepeat';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Categories of items for patterns — visual contrast matters
const itemGroups = [
  ['🍎', '🍌'],          // fruits
  ['⭐', '🌙'],          // sky
  ['❤️', '💙'],         // hearts
  ['🐶', '🐱'],          // pets
  ['🔴', '🔵'],          // colors
  ['🌸', '🌻'],          // flowers
  ['☀️', '🌧'],         // weather
  ['🐢', '🐇'],          // animals
];

function buildPatternAB() {
  const [x, y] = pick(itemGroups);
  // Show 6 items, ask for the 7th. Pattern: x y x y x y → next is x
  const seq = `${x} ${y} ${x} ${y} ${x} ${y}`;
  const correct = x;
  const distractors = [y, '🌸', '⭐'].filter((d) => d !== correct).slice(0, 3);
  return {
    category: 'nyla_patterns',
    type: 'AB',
    text: `Qu'est-ce qui vient ensuite?\n\n${seq}  ?`,
    correct,
    options: shuffle([correct, ...distractors]),
    explanation: `La suite est ${x} ${y} ${x} ${y}... Donc après ${y} vient ${x}.`,
    hint: 'Regarde le motif: deux objets qui se répètent encore et encore.',
  };
}

function buildPatternABB() {
  const [x, y] = pick(itemGroups);
  // Pattern: x y y x y y → next is x
  const seq = `${x} ${y} ${y} ${x} ${y} ${y}`;
  const correct = x;
  const distractors = [y, '🌸', '⭐'].filter((d) => d !== correct).slice(0, 3);
  return {
    category: 'nyla_patterns',
    type: 'ABB',
    text: `Qu'est-ce qui vient ensuite?\n\n${seq}  ?`,
    correct,
    options: shuffle([correct, ...distractors]),
    explanation: `Le motif est ${x} ${y} ${y}... Après deux ${y}, on recommence avec ${x}.`,
    hint: `Compte: 1 ${x}, puis 2 ${y}. Recommence: 1 ${x}, puis 2 ${y}...`,
  };
}

function buildPatternABC() {
  const g1 = pick(itemGroups);
  const g2 = pick(itemGroups.filter((g) => g !== g1));
  const x = g1[0];
  const y = g1[1];
  const z = g2[0];
  // Pattern: x y z x y z → next is x
  const seq = `${x} ${y} ${z} ${x} ${y} ${z}`;
  const correct = x;
  const distractors = [y, z, '⭐'].filter((d) => d !== correct).slice(0, 3);
  return {
    category: 'nyla_patterns',
    type: 'ABC',
    text: `Qu'est-ce qui vient ensuite?\n\n${seq}  ?`,
    correct,
    options: shuffle([correct, ...distractors]),
    explanation: `Trois objets qui se répètent: ${x} ${y} ${z}. Après ${z}, on recommence avec ${x}.`,
    hint: 'Trois objets différents qui forment un petit groupe qui se répète.',
  };
}

function buildOne() {
  const r = Math.random();
  if (r < 0.5) return buildPatternAB();
  if (r < 0.85) return buildPatternABB();
  return buildPatternABC();
}

export function generateNylaPatterns() {
  return withFresh('nyla_patterns', buildOne, 50, 20, (q) => `${q.type}|${q.text}`);
}
