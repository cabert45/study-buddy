// Figures planes et solides — Ryan 2e année (Nougat p.37-38)
// Plane shapes: carré, rectangle, triangle, cercle, losange
// Solids: cube, sphère, cylindre, cône, pyramide, prisme rectangulaire
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

// ===== Figures planes (2D) =====
const planeShapes = [
  { name: 'carré', sides: 4, desc: '4 côtés ÉGAUX, 4 coins droits (angles droits)', emoji: '⬜' },
  { name: 'rectangle', sides: 4, desc: '4 côtés (2 longs, 2 courts), 4 coins droits', emoji: '▭' },
  { name: 'triangle', sides: 3, desc: '3 côtés, 3 coins', emoji: '🔺' },
  { name: 'cercle', sides: 0, desc: 'aucun côté, tout rond', emoji: '⭕' },
  { name: 'losange', sides: 4, desc: '4 côtés ÉGAUX, mais les coins ne sont pas droits', emoji: '🔶' },
];

// ===== Solides (3D) =====
const solidShapes = [
  { name: 'cube', faces: 6, desc: '6 faces carrées identiques (ex: un dé)', example: 'un dé, une boîte à jus carrée' },
  { name: 'sphère', faces: 0, desc: 'aucune face plate, tout rond (ex: ballon)', example: 'un ballon, une balle, une orange' },
  { name: 'cylindre', faces: 3, desc: '2 cercles + 1 surface roulée (ex: canette)', example: 'une canette, un rouleau, une boîte de conserve' },
  { name: 'cône', faces: 2, desc: '1 cercle + 1 pointe (ex: cornet de crème glacée)', example: 'un cornet de crème glacée, un chapeau de fête' },
  { name: 'pyramide', faces: 5, desc: 'plusieurs triangles qui se rejoignent en pointe', example: 'les pyramides d\'Égypte' },
  { name: 'prisme rectangulaire', faces: 6, desc: '6 faces rectangulaires (ex: brique)', example: 'une brique, une boîte de céréales' },
];

// ===== Type 1: From description, identify plane shape =====
function generatePlaneFromDesc() {
  const shape = pick(planeShapes);
  const distractors = planeShapes.filter((s) => s.name !== shape.name).slice(0, 3).map((s) => s.name);
  const options = shuffle([shape.name, ...distractors]);
  return {
    category: 'figures',
    type: 'plane_desc',
    text: `Quelle figure plane a: ${shape.desc}?`,
    correct: shape.name,
    options,
    explanation: `${shape.emoji} Le ${shape.name}: ${shape.desc}.`,
    hint: 'Compte les côtés et regarde s\'ils sont tous égaux ou non.',
  };
}

// ===== Type 2: From description, identify solid =====
function generateSolidFromDesc() {
  const solid = pick(solidShapes);
  const distractors = solidShapes.filter((s) => s.name !== solid.name).slice(0, 3).map((s) => s.name);
  const options = shuffle([solid.name, ...distractors]);
  return {
    category: 'figures',
    type: 'solid_desc',
    text: `Quel solide a: ${solid.desc}?`,
    correct: solid.name,
    options,
    explanation: `Le ${solid.name}: ${solid.desc}.\nExemples: ${solid.example}.`,
    hint: 'Compte les faces et regarde leur forme.',
  };
}

// ===== Type 3: From real-world example, identify solid =====
function generateSolidFromExample() {
  const examples = [
    { obj: 'un dé', correct: 'cube' },
    { obj: 'un ballon de soccer', correct: 'sphère' },
    { obj: 'une canette de jus', correct: 'cylindre' },
    { obj: 'un cornet de crème glacée', correct: 'cône' },
    { obj: 'une boîte de céréales', correct: 'prisme rectangulaire' },
    { obj: 'une brique', correct: 'prisme rectangulaire' },
    { obj: 'une orange', correct: 'sphère' },
    { obj: 'un rouleau de papier de toilette', correct: 'cylindre' },
    { obj: 'un chapeau de fête en pointe', correct: 'cône' },
    { obj: 'une boîte de Rubik (cube de jeu)', correct: 'cube' },
  ];
  const ex = pick(examples);
  const allSolids = solidShapes.map((s) => s.name);
  const distractors = allSolids.filter((s) => s !== ex.correct).slice(0, 3);
  const options = shuffle([ex.correct, ...distractors]);
  return {
    category: 'figures',
    type: 'solid_example',
    text: `Quelle est la forme de ${ex.obj}?`,
    correct: ex.correct,
    options,
    explanation: `${ex.obj} est un ${ex.correct}.`,
    hint: 'Imagine l\'objet. Est-il pointu? Rond? Carré?',
  };
}

// ===== Type 4: Count sides/faces =====
function generateCount() {
  const which = Math.random() < 0.5 ? 'plane' : 'solid';
  if (which === 'plane') {
    const shape = pick(planeShapes.filter((s) => s.sides > 0));
    const correct = shape.sides;
    const options = shuffle([correct, correct + 1, correct - 1, correct + 2].filter((x) => x >= 0));
    return {
      category: 'figures',
      type: 'plane_count',
      text: `Combien de côtés a un ${shape.name}?`,
      correct,
      options,
      explanation: `Le ${shape.name} a ${correct} côtés. ${shape.desc}.`,
      hint: 'Compte les côtés (les lignes droites).',
    };
  }
  const solid = pick(solidShapes.filter((s) => s.faces > 0));
  const correct = solid.faces;
  const options = shuffle([correct, correct + 1, correct - 1, correct + 2].filter((x) => x >= 0));
  return {
    category: 'figures',
    type: 'solid_count',
    text: `Combien de faces a un ${solid.name}?`,
    correct,
    options,
    explanation: `Le ${solid.name} a ${correct} faces. ${solid.desc}.`,
    hint: 'Les faces sont les surfaces plates du solide.',
  };
}

// ===== Type 5: Plane vs solid =====
function generatePlaneVsSolid() {
  const choices = [
    { name: 'cube', type: 'solide' },
    { name: 'carré', type: 'figure plane' },
    { name: 'cercle', type: 'figure plane' },
    { name: 'sphère', type: 'solide' },
    { name: 'triangle', type: 'figure plane' },
    { name: 'cylindre', type: 'solide' },
    { name: 'rectangle', type: 'figure plane' },
    { name: 'cône', type: 'solide' },
  ];
  const item = pick(choices);
  const options = shuffle(['figure plane (2D)', 'solide (3D)', 'ligne droite', 'rien de tout ça']);
  const correctLong = item.type === 'solide' ? 'solide (3D)' : 'figure plane (2D)';
  if (!options.includes(correctLong)) {
    options[0] = correctLong;
    options.sort(() => Math.random() - 0.5);
  }
  return {
    category: 'figures',
    type: 'plane_vs_solid',
    text: `Le ${item.name} est-il une figure plane (2D) ou un solide (3D)?`,
    correct: correctLong,
    options,
    explanation: `Le ${item.name} est ${item.type === 'solide' ? 'un SOLIDE (3D) — on peut le tenir dans nos mains.' : 'une FIGURE PLANE (2D) — c\'est sur une feuille ou un écran.'}`,
    hint: '2D = sur une feuille (plat). 3D = on peut le tenir.',
  };
}

function buildOne() {
  const r = Math.random();
  if (r < 0.20) return generatePlaneFromDesc();
  if (r < 0.40) return generateSolidFromDesc();
  if (r < 0.65) return generateSolidFromExample();
  if (r < 0.85) return generateCount();
  return generatePlaneVsSolid();
}

export function generateFigures() {
  return withFresh('figures', buildOne, 80, 25, (q) => `${q.type}|${q.text}`);
}
