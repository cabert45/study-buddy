// Représenter et décomposer un nombre — Ryan 2e année (Nougat p.6, 7, 17, 18, 22)
// 2e année: positional value (dizaines + unités), expanded form, equivalent expressions.
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

// ===== Type 1: Décomposition en dizaines + unités =====
// "Le nombre 47 = ? dizaines + ? unités"
function generateDizUnit() {
  const n = rand(11, 99);
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  const correct = `${tens} dizaine${tens > 1 ? 's' : ''} + ${ones} unité${ones > 1 ? 's' : ''}`;
  // Distractors: swap, off-by-one
  const distractors = [
    `${ones} dizaine${ones > 1 ? 's' : ''} + ${tens} unité${tens > 1 ? 's' : ''}`,
    `${tens + 1} dizaines + ${ones} unité${ones > 1 ? 's' : ''}`,
    `${tens} dizaine${tens > 1 ? 's' : ''} + ${ones + 1} unités`,
    `${n} unités + 0 dizaine`,
  ].filter((d) => d !== correct).slice(0, 3);
  const options = shuffle([correct, ...distractors]);
  return {
    category: 'representer',
    type: 'diz_unit',
    text: `Décompose le nombre ${n} en dizaines et unités.`,
    correct,
    options,
    explanation: `${n} = ${tens} dizaine${tens > 1 ? 's' : ''} + ${ones} unité${ones > 1 ? 's' : ''}.\n(Le ${tens} est dans la position des dizaines, le ${ones} dans les unités.)`,
    hint: 'Le chiffre de GAUCHE = dizaines (×10). Le chiffre de DROITE = unités.',
  };
}

// ===== Type 2: Forme développée =====
// "47 = 40 + 7"
function generateDeveloppee() {
  const n = rand(11, 99);
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  const correct = ones === 0 ? `${tens * 10}` : `${tens * 10} + ${ones}`;
  const distractors = [
    `${tens} + ${ones}`,
    `${tens * 10} + ${ones * 10}`,
    `${tens} + ${ones * 10}`,
    `${n + 10} − ${10 - ones}`,
  ].filter((d) => d !== correct).slice(0, 3);
  const options = shuffle([correct, ...distractors]);
  return {
    category: 'representer',
    type: 'developpee',
    text: `Quelle est la forme DÉCOMPOSÉE (développée) de ${n}?`,
    correct,
    options,
    explanation: `${n} = ${correct}\nLa valeur du ${tens} = ${tens * 10}. La valeur du ${ones} = ${ones}.`,
    hint: `Pense à la valeur de chaque chiffre (le ${tens} vaut ${tens * 10}, pas ${tens}!).`,
  };
}

// ===== Type 3: Identify positional value =====
// "Dans 47, quelle est la valeur du chiffre 4?"
function generatePositionalValue() {
  const n = rand(11, 99);
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  const askTens = Math.random() < 0.5;
  if ((askTens && tens === 0) || (!askTens && ones === 0)) return generatePositionalValue();
  const targetDigit = askTens ? tens : ones;
  const correct = askTens ? tens * 10 : ones;
  const distractors = new Set();
  distractors.add(targetDigit);
  distractors.add(askTens ? ones : tens * 10);
  distractors.add(targetDigit * 10);
  distractors.add(n);
  distractors.delete(correct);
  const dArr = [...distractors].slice(0, 3);
  const options = shuffle([correct, ...dArr]);
  return {
    category: 'representer',
    type: 'positional_value',
    text: `Dans le nombre ${n}, quelle est la VALEUR du chiffre ${targetDigit}?`,
    correct,
    options,
    explanation: `Le chiffre ${targetDigit} est dans la position des ${askTens ? 'DIZAINES' : 'UNITÉS'}, donc sa valeur = ${correct}.`,
    hint: `Position des dizaines (à GAUCHE): chaque chiffre vaut ×10. Position des unités (à DROITE): chaque chiffre vaut sa valeur.`,
  };
}

// ===== Type 4: Équivalences (different decomps of same number) =====
// "Lequel est égal à 47?"
function generateEquivalence() {
  const n = rand(11, 99);
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  // Equivalent decompositions
  const eqs = [
    `${tens * 10} + ${ones}`,
    `${(tens - 1) * 10} + ${ones + 10}`,
    `${tens} dizaines + ${ones} unités`,
  ].filter((e) => !e.includes('-1') && !/^-/.test(e));
  if (eqs.length === 0) return generateEquivalence();
  const correct = pick(eqs);
  const distractors = [
    `${tens} + ${ones}`,
    `${tens * 10} + ${ones * 10}`,
    `${n + 1}`,
    `${tens} dizaines + ${ones + 1} unités`,
  ].filter((d) => d !== correct).slice(0, 3);
  const options = shuffle([correct, ...distractors]);
  return {
    category: 'representer',
    type: 'equivalence',
    text: `Quelle expression est ÉGALE à ${n}?`,
    correct,
    options,
    explanation: `${correct} = ${n}.\n(Plusieurs expressions peuvent représenter le même nombre.)`,
    hint: 'Calcule chaque option pour voir laquelle donne le bon nombre.',
  };
}

// ===== Type 5: Build the number from parts =====
// "5 dizaines + 8 unités = ?"
function generateBuild() {
  const tens = rand(1, 9);
  const ones = rand(0, 9);
  const correct = tens * 10 + ones;
  const distractors = new Set();
  distractors.add(tens + ones);
  distractors.add(ones * 10 + tens);
  distractors.add(correct + 10);
  distractors.add(correct - 1);
  distractors.delete(correct);
  const dArr = [...distractors].slice(0, 3);
  const options = shuffle([correct, ...dArr]);
  return {
    category: 'representer',
    type: 'build',
    text: `Quel nombre est formé par ${tens} dizaine${tens > 1 ? 's' : ''} et ${ones} unité${ones > 1 ? 's' : ''}?`,
    correct,
    options,
    explanation: `${tens} dizaines = ${tens * 10}, plus ${ones} unités = ${correct}.`,
    hint: 'Dizaines = ×10, unités = +1 chacune.',
  };
}

function buildOne() {
  const r = Math.random();
  if (r < 0.25) return generateDizUnit();
  if (r < 0.50) return generateDeveloppee();
  if (r < 0.70) return generatePositionalValue();
  if (r < 0.85) return generateEquivalence();
  return generateBuild();
}

export function generateRepresenter() {
  return withFresh('representer', buildOne, 80, 25, (q) => `${q.type}|${q.text}`);
}
