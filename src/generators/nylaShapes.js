// Nyla — Reconnaître les formes
// Maternelle: carré, cercle, triangle, rectangle, étoile, cœur.
// Show a shape (emoji), ask its name OR show a name, ask which shape.
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

const shapes = [
  { name: 'cercle', icon: '⭕' },
  { name: 'carré', icon: '🟦' },
  { name: 'triangle', icon: '🔺' },
  { name: 'rectangle', icon: '▭' },
  { name: 'étoile', icon: '⭐' },
  { name: 'cœur', icon: '❤️' },
  { name: 'losange', icon: '🔶' },
];

// Show shape, pick the name
function shapeToName() {
  const item = pick(shapes);
  const distractors = shuffle(shapes.filter((s) => s.name !== item.name)).slice(0, 3).map((s) => s.name);
  return {
    category: 'nyla_shapes',
    type: 'shape_to_name',
    text: `Quelle est cette forme?\n\n${item.icon}`,
    correct: item.name,
    options: shuffle([item.name, ...distractors]),
    explanation: `C'est un ${item.name}.`,
    hint: 'Compte les côtés ou regarde la forme.',
    spokenWord: item.name,
  };
}

// Show name, pick the shape
function nameToShape() {
  const item = pick(shapes);
  const distractors = shuffle(shapes.filter((s) => s.name !== item.name)).slice(0, 3).map((s) => s.icon);
  return {
    category: 'nyla_shapes',
    type: 'name_to_shape',
    text: `Quelle est l'image d'un « ${item.name} »?`,
    correct: item.icon,
    options: shuffle([item.icon, ...distractors]),
    explanation: `${item.icon} est un ${item.name}.`,
    hint: 'Pense à la forme dans ta tête.',
    spokenWord: item.name,
  };
}

function buildOne() {
  return Math.random() < 0.5 ? shapeToName() : nameToShape();
}

export function generateNylaShapes() {
  return withFresh('nyla_shapes', buildOne, 50, 20, (q) => `${q.type}|${q.text}`);
}
