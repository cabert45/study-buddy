// Mesure en centimètres — Ryan 2e année (Nougat p.43)
// Skills: estimate, compare, read a ruler, choose appropriate unit
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
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// ===== Type 1: Choose the right unit =====
const unitItems = [
  { obj: 'un crayon', correct: 'cm', why: 'Un crayon est petit (environ 17 cm).' },
  { obj: 'une voiture', correct: 'm', why: 'Une voiture est grande (environ 4 m).' },
  { obj: 'la longueur d\'une table', correct: 'cm', why: 'Une table mesure entre 100 et 200 cm.' },
  { obj: 'la hauteur d\'une porte', correct: 'm', why: 'Une porte mesure environ 2 m.' },
  { obj: 'une fourmi', correct: 'mm', why: 'Une fourmi est très petite (1-2 mm).' },
  { obj: 'un terrain de soccer', correct: 'm', why: 'Un terrain de soccer mesure plus de 50 m.' },
  { obj: 'une gomme à effacer', correct: 'cm', why: 'Une gomme mesure 3-5 cm.' },
  { obj: 'la longueur de ta chambre', correct: 'm', why: 'Une chambre mesure quelques mètres.' },
  { obj: 'la largeur d\'un livre', correct: 'cm', why: 'Un livre mesure environ 15-20 cm.' },
  { obj: 'la distance entre Montréal et Québec', correct: 'km', why: 'Très grande distance (environ 250 km).' },
];

function generateUnit() {
  const item = pick(unitItems);
  const options = shuffle(['mm', 'cm', 'm', 'km']);
  return {
    category: 'mesure',
    type: 'unit',
    text: `Quelle est la MEILLEURE unité pour mesurer ${item.obj}?`,
    correct: item.correct,
    options,
    explanation: `${item.correct} — ${item.why}\n\nRappel: mm = très petit · cm = petit (crayon, main) · m = grand (porte, voiture) · km = très grand (distance entre villes).`,
    hint: 'Petit objet = cm. Grand objet = m. Très grand (distance) = km.',
  };
}

// ===== Type 2: Estimate length in cm =====
const estimateItems = [
  { obj: 'un crayon neuf', correct: 18 },
  { obj: 'une règle d\'école', correct: 30 },
  { obj: 'un livre de classe', correct: 25 },
  { obj: 'une main d\'enfant', correct: 12 },
  { obj: 'un téléphone cellulaire', correct: 15 },
  { obj: 'une feuille de papier', correct: 28 },
  { obj: 'une cuillère', correct: 18 },
  { obj: 'une chaussure d\'enfant', correct: 20 },
  { obj: 'une pomme', correct: 8 },
  { obj: 'un crayon usé', correct: 8 },
];

function generateEstimate() {
  const item = pick(estimateItems);
  const correct = item.correct;
  const distractors = new Set();
  distractors.add(correct + 10);
  distractors.add(correct - 5);
  distractors.add(correct * 2);
  distractors.add(correct + 100);
  distractors.delete(correct);
  const dArr = [...distractors].filter((x) => x > 0).slice(0, 3);
  const options = shuffle([correct, ...dArr]);
  return {
    category: 'mesure',
    type: 'estimate',
    text: `Combien de cm mesure environ ${item.obj}?`,
    correct,
    options,
    explanation: `${item.obj} mesure environ ${correct} cm.\nAstuce: la largeur d'un doigt = 1 cm, la largeur d'une main = 8-10 cm.`,
    hint: 'Pense à la taille de ta main (8-10 cm) ou d\'une règle (30 cm).',
  };
}

// ===== Type 3: Compare two lengths =====
function generateCompare() {
  const a = rand(5, 50);
  let b = rand(5, 50);
  while (b === a) b = rand(5, 50);
  const correct = `${Math.max(a, b)} cm`;
  const options = shuffle([`${a} cm`, `${b} cm`, 'Ils sont égaux', 'Impossible à savoir']);
  return {
    category: 'mesure',
    type: 'compare',
    text: `Quelle longueur est la PLUS GRANDE: ${a} cm ou ${b} cm?`,
    correct,
    options,
    explanation: `${Math.max(a, b)} > ${Math.min(a, b)}, donc ${correct} est plus grand.`,
    hint: 'Compare les deux nombres comme des nombres normaux.',
  };
}

// ===== Type 4: Read a ruler =====
function generateRuler() {
  const start = rand(0, 8);
  const length = rand(3, 15);
  const end = start + length;
  if (end > 30) return generateRuler();
  const correct = length;
  const distractors = new Set([end, start, length + start, length - 1]);
  distractors.delete(correct);
  const dArr = [...distractors].filter((x) => x > 0).slice(0, 3);
  const options = shuffle([correct, ...dArr]);
  return {
    category: 'mesure',
    type: 'ruler',
    text: `Sur une règle, un crayon commence au ${start} cm et finit au ${end} cm. Quelle est sa longueur?`,
    correct,
    options,
    explanation: `Longueur = fin − début = ${end} − ${start} = ${correct} cm.\nATTENTION: ne PAS lire le ${end}! C'est la position, pas la longueur.`,
    hint: 'Soustrais la position de FIN moins la position de DÉBUT.',
  };
}

// ===== Type 5: Unit conversion (basic) =====
function generateConversion() {
  // 1 m = 100 cm
  const meters = rand(1, 5);
  const correct = meters * 100;
  const distractors = new Set([meters * 10, meters * 1000, meters + 100, correct + 10]);
  distractors.delete(correct);
  const dArr = [...distractors].slice(0, 3);
  const options = shuffle([correct, ...dArr]);
  return {
    category: 'mesure',
    type: 'conversion',
    text: `Combien de cm dans ${meters} m?`,
    correct,
    options,
    explanation: `1 m = 100 cm.\n${meters} m × 100 = ${correct} cm.`,
    hint: 'Rappel: 1 m = 100 cm. Multiplie par 100.',
  };
}

function buildOne() {
  const r = Math.random();
  if (r < 0.30) return generateUnit();
  if (r < 0.55) return generateEstimate();
  if (r < 0.70) return generateCompare();
  if (r < 0.88) return generateRuler();
  return generateConversion();
}

export function generateMesure() {
  return withFresh('mesure', buildOne, 80, 25, (q) => `${q.type}|${q.text}`);
}
