// Mots savants — Ryan 2e année (accompany the Jean Rostand biographie)
// Unit: Les insectes. Les fleurs.
// CRITIQUE: past mots savants tests scored 2.75/15. Comes with the biographie test.
// Test pattern (from memory ryan_biographie_exams.md):
//   - match definitions, write the expression, define a word
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

// The 4 mots + 1 expression from his cahier
const items = [
  {
    word: 'le symbole',
    definition: 'un signe, une représentation',
    example: "L'humble violette symbolise la modestie; le lis symbolise la pureté.",
    visual: 'Le papillon est le symbole de la transformation.',
  },
  {
    word: 'ciseler',
    definition: 'découper avec art, sculpter',
    example: 'Avril cisèle les pétales des fleurs printanières.',
    visual: 'Le papillon a des ailes ciselées (= découpées avec art).',
  },
  {
    word: 'discret',
    definition: 'délicat',
    example: 'Le parfum discret des touffes de violettes.',
    visual: 'Le parfum discret des fleurs sauvages.',
  },
  {
    word: 'prospérer',
    definition: 'se multiplier',
    example: 'Les fleurs prospèrent au printemps.',
    visual: 'Le jardin prospère: les plantes se multiplient.',
  },
];

// The famous expression
const expression = {
  full: 'Écriture en pattes de mouche',
  meaning: 'Une écriture fine et peu lisible',
  missing: 'pattes de mouche',
};

const RULE = `Unité: Les insectes. Les fleurs.

le symbole = un signe, une représentation
ciseler = découper avec art, sculpter
discret = délicat
prospérer = se multiplier

Expression: « Écriture en PATTES DE MOUCHE »
= une écriture fine et peu lisible`;

// === Type 1: definition → mot ===
function generateDefToWord() {
  const item = pick(items);
  const distractors = items.filter((x) => x.word !== item.word).map((x) => x.word);
  const options = shuffle([item.word, ...distractors]);
  return {
    category: 'mots_savants_jr',
    rule: RULE,
    type: 'def_to_word',
    text: `Quel mot signifie « ${item.definition} »?`,
    correct: item.word,
    options,
    explanation: `${item.word} = ${item.definition}.\nExemple: ${item.example}`,
    hint: 'Pense aux mots de ton cahier sur la nature.',
  };
}

// === Type 2: mot → definition ===
function generateWordToDef() {
  const item = pick(items);
  const distractors = items.filter((x) => x.definition !== item.definition).map((x) => x.definition);
  const options = shuffle([item.definition, ...distractors]);
  return {
    category: 'mots_savants_jr',
    rule: RULE,
    type: 'word_to_def',
    text: `Que veut dire « ${item.word} »?`,
    correct: item.definition,
    options,
    explanation: `${item.word} = ${item.definition}.\nExemple: ${item.example}`,
    hint: 'Pense à l\'exemple dans ton cahier.',
  };
}

// === Type 3: complete the expression ===
function generateCompleteExpression() {
  const correct = expression.missing;
  const distractors = ['pieds de souris', 'doigts de fourmi', 'griffes de chat'];
  const options = shuffle([correct, ...distractors]);
  return {
    category: 'mots_savants_jr',
    rule: RULE,
    type: 'expression',
    text: `Complète l'expression: « Écriture en _____ »`,
    correct,
    options,
    explanation: `« Écriture en PATTES DE MOUCHE » = ${expression.meaning}.\n\n(C'est quand l'écriture est si petite et fine qu'on dirait des pattes d'insecte!)`,
    hint: 'Pense à un petit insecte qui a beaucoup de pattes très fines.',
  };
}

// === Type 4: what does the expression mean? ===
function generateExpressionMeaning() {
  const correct = expression.meaning;
  const distractors = [
    'Une belle écriture en couleurs',
    'Une écriture rapide et claire',
    "Une écriture qui ressemble à un dessin d'insecte",
  ];
  const options = shuffle([correct, ...distractors]);
  return {
    category: 'mots_savants_jr',
    rule: RULE,
    type: 'expression_meaning',
    text: `Que veut dire « ${expression.full} »?`,
    correct,
    options,
    explanation: `« ${expression.full} » = ${expression.meaning}.\n(L'écriture est si petite qu'elle ressemble à des pattes d'insecte minuscules.)`,
    hint: 'C\'est une écriture difficile à lire.',
  };
}

// === Type 5: pick the right example sentence ===
function generateRightExample() {
  const item = pick(items);
  // Build wrong examples by swapping the right word from another item
  const otherItem = pick(items.filter((x) => x.word !== item.word));
  const wrongExample = item.example.replace(item.word.replace(/^l[ae] /, ''), otherItem.word.replace(/^l[ae] /, ''));
  const distractors = [
    `${otherItem.example}`,
    wrongExample,
    `Le ${item.word} est rouge et bleu.`, // generic non-example
  ].filter((d) => d !== item.example).slice(0, 3);
  const options = shuffle([item.example, ...distractors]);
  return {
    category: 'mots_savants_jr',
    rule: RULE,
    type: 'right_example',
    text: `Quel est le BON exemple pour le mot « ${item.word} »?`,
    correct: item.example,
    options,
    explanation: `Le bon exemple est: « ${item.example} »`,
    hint: `Cherche la phrase qui utilise correctement le mot « ${item.word} ».`,
  };
}

function buildOne() {
  const r = Math.random();
  if (r < 0.30) return generateDefToWord();
  if (r < 0.55) return generateWordToDef();
  if (r < 0.75) return generateCompleteExpression();
  if (r < 0.90) return generateExpressionMeaning();
  return generateRightExample();
}

export function generateMotsSavantsJr() {
  return withFresh('mots_savants_jr', buildOne, 60, 20, (q) => `${q.type}|${q.text}`);
}
