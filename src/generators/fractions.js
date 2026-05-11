// Fractions — Ryan 2e année (p. 26 de Nougat)
// Niveau 2e année: fractions simples (1/2, 1/3, 1/4, 1/5, 1/6, 1/8, 2/3, 3/4, etc)
// Concepts: identifier la fraction d'une figure colorée, fraction d'un nombre,
// comparer fractions à mêmes dénominateurs, lire le nom de la fraction
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

const fractionNames = {
  '1/2': 'un demi',
  '1/3': 'un tiers',
  '2/3': 'deux tiers',
  '1/4': 'un quart',
  '2/4': 'deux quarts',
  '3/4': 'trois quarts',
  '1/5': 'un cinquième',
  '2/5': 'deux cinquièmes',
  '3/5': 'trois cinquièmes',
  '4/5': 'quatre cinquièmes',
  '1/6': 'un sixième',
  '5/6': 'cinq sixièmes',
  '1/8': 'un huitième',
  '3/8': 'trois huitièmes',
  '1/10': 'un dixième',
};

// ===== Type 1: Read a fraction (visual count) =====
// "Si une pizza est coupée en 4 et qu'on en prend 1, quelle fraction?"
function generateFromContext() {
  const contexts = [
    { obj: 'pizza', verb: 'On en mange' },
    { obj: 'gâteau', verb: 'On en mange' },
    { obj: 'chocolat', verb: 'On en prend' },
    { obj: 'tarte', verb: 'On en mange' },
    { obj: 'sandwich', verb: 'On en prend' },
  ];
  const ctx = pick(contexts);
  const den = pick([2, 3, 4, 5, 6, 8]);
  const num = rand(1, den - 1);
  const correct = `${num}/${den}`;
  const distractors = new Set();
  distractors.add(`${den}/${num}`); // inverse
  distractors.add(`${num}/${num + den}`); // off by sum
  distractors.add(`${num + 1}/${den}`); // off by one numerator
  distractors.add(`${num}/${den + 1}`); // off by one denominator
  distractors.delete(correct);
  const dArr = [...distractors].slice(0, 3);
  const options = shuffle([correct, ...dArr]);
  return {
    category: 'fractions',
    type: 'context',
    text: `Une ${ctx.obj} est coupée en ${den} parts égales. ${ctx.verb} ${num} part${num > 1 ? 's' : ''}. Quelle fraction?`,
    correct,
    options,
    explanation: `${num} parts mangées sur ${den} parts totales = ${num}/${den}${fractionNames[correct] ? ' (' + fractionNames[correct] + ')' : ''}.\nLe NUMÉRATEUR (en haut) = nombre de parts mangées. Le DÉNOMINATEUR (en bas) = nombre total de parts.`,
    hint: 'Numérateur (haut) = parts prises. Dénominateur (bas) = parts en tout.',
  };
}

// ===== Type 2: Name of a fraction =====
function generateName() {
  const fracs = Object.keys(fractionNames);
  const frac = pick(fracs);
  const correct = fractionNames[frac];
  const otherNames = Object.values(fractionNames).filter((n) => n !== correct);
  const options = shuffle([correct, ...shuffle(otherNames).slice(0, 3)]);
  return {
    category: 'fractions',
    type: 'name',
    text: `Comment lit-on la fraction "${frac}"?`,
    correct,
    options,
    explanation: `${frac} se lit « ${correct} ».\nRappel: 1/2 = demi, 1/3 = tiers, 1/4 = quart, 1/5+ = cinquième, sixième, septième...`,
    hint: 'Pense au dénominateur: 2→demi, 3→tiers, 4→quart, sinon -ième.',
  };
}

// ===== Type 3: Fraction of a number (simple) =====
function generateOfNumber() {
  // 1/2 de 8 = 4, 1/3 de 9 = 3, 1/4 de 12 = 3
  const den = pick([2, 3, 4, 5]);
  const multiplier = rand(2, 6);
  const num = 1;
  const total = den * multiplier;
  const correct = multiplier;
  const distractors = new Set();
  distractors.add(total - correct); // common error
  distractors.add(total / 2);
  distractors.add(correct + 1);
  distractors.add(correct - 1);
  distractors.add(total - 1);
  distractors.delete(correct);
  distractors.delete(0);
  const dArr = [...distractors].filter(x => x > 0).slice(0, 3);
  const options = shuffle([correct, ...dArr]);
  return {
    category: 'fractions',
    type: 'of_number',
    text: `Combien font ${num}/${den} de ${total}?`,
    correct,
    options,
    explanation: `${num}/${den} de ${total} = on divise ${total} en ${den} parts égales: ${total} ÷ ${den} = ${correct}.`,
    hint: `Divise ${total} en ${den} parts égales. La réponse = 1 part.`,
  };
}

// ===== Type 4: Compare fractions (same denominator) =====
function generateCompare() {
  const den = pick([3, 4, 5, 6, 8]);
  let a = rand(1, den - 1);
  let b = rand(1, den - 1);
  while (b === a) b = rand(1, den - 1);
  const aFrac = `${a}/${den}`;
  const bFrac = `${b}/${den}`;
  const correct = a > b ? aFrac : bFrac;
  const options = shuffle([aFrac, bFrac, 'Ils sont égaux', 'Impossible']);
  return {
    category: 'fractions',
    type: 'compare',
    text: `Quelle fraction est la PLUS GRANDE: ${aFrac} ou ${bFrac}?`,
    correct,
    options,
    explanation: `Même dénominateur (${den}) → on compare les numérateurs: ${Math.max(a, b)} > ${Math.min(a, b)}. Donc ${correct} est plus grand.`,
    hint: 'Si le dénominateur est pareil, regarde juste le numérateur (en haut).',
  };
}

// ===== Type 5: What does the numerator / denominator mean? =====
function generateConcept() {
  const den = pick([3, 4, 5, 6]);
  const num = rand(1, den - 1);
  const which = pick(['num', 'den']);

  if (which === 'num') {
    return {
      category: 'fractions',
      type: 'concept_num',
      text: `Dans la fraction ${num}/${den}, que représente le NUMÉRATEUR (le nombre du haut, "${num}")?`,
      correct: `Le nombre de parts prises (ou colorées)`,
      options: shuffle([
        `Le nombre de parts prises (ou colorées)`,
        `Le nombre total de parts`,
        `Le résultat de la division`,
        `Le nom de la fraction`,
      ]),
      explanation: 'Le NUMÉRATEUR (en haut) = nombre de parts qu\'on prend. Le DÉNOMINATEUR (en bas) = nombre total de parts.',
      hint: 'Numérateur = en haut = parts PRISES.',
    };
  }
  return {
    category: 'fractions',
    type: 'concept_den',
    text: `Dans la fraction ${num}/${den}, que représente le DÉNOMINATEUR (le nombre du bas, "${den}")?`,
    correct: `Le nombre total de parts égales`,
    options: shuffle([
      `Le nombre total de parts égales`,
      `Le nombre de parts prises`,
      `La couleur de la fraction`,
      `Le résultat de l'addition`,
    ]),
    explanation: 'Le DÉNOMINATEUR (en bas) = nombre TOTAL de parts égales. Le NUMÉRATEUR (en haut) = parts prises.',
    hint: 'Dénominateur = en bas = nombre TOTAL.',
  };
}

function buildOne() {
  const r = Math.random();
  if (r < 0.30) return generateFromContext();
  if (r < 0.55) return generateName();
  if (r < 0.80) return generateOfNumber();
  if (r < 0.92) return generateCompare();
  return generateConcept();
}

export function generateFractions() {
  return withFresh('fractions', buildOne, 80, 25, (q) => `${q.type}|${q.text}`);
}
