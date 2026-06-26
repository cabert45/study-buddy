// Nyla — Reconnaître les formes (5 ans)
// She can't read yet, so the prompt is SPOKEN ("Trouve le carré") and every
// answer choice is a PICTURE of a shape — never a word to read.
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

// Clear, distinct emoji shapes (dropped rectangle ▭ — too close to carré).
const shapes = [
  { name: 'cercle', icon: '⭕', det: 'le' },
  { name: 'carré', icon: '🟦', det: 'le' },
  { name: 'triangle', icon: '🔺', det: 'le' },
  { name: 'étoile', icon: '⭐', det: "l'" },
  { name: 'cœur', icon: '❤️', det: 'le' },
  { name: 'losange', icon: '🔶', det: 'le' },
];

function det(s) {
  return s.det === "l'" ? "l'" : s.det + ' ';
}

// Hear the shape name → tap the matching picture.
function buildOne() {
  const item = pick(shapes);
  const distractors = shuffle(shapes.filter((s) => s.name !== item.name)).slice(0, 3).map((s) => s.icon);
  return {
    category: 'nyla_shapes',
    type: 'name_to_shape',
    text: `Trouve : ${item.name}`,
    correct: item.icon,
    options: shuffle([item.icon, ...distractors]),
    explanation: `${item.icon} c'est ${det(item)}${item.name}.`,
    hint: `Écoute bien : ${det(item)}${item.name}.`,
    spokenWord: `Trouve ${det(item)}${item.name}.`,
  };
}

export function generateNylaShapes() {
  return withFresh('nyla_shapes', buildOne, 40, 15, (q) => q.text);
}
