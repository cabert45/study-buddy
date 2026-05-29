// Probabilité — Ryan 2e année (Pomélo p.40-41 / Nougat probabilité)
// Score 6.5/13 on his test — confused certain/possible/impossible.
// Common mistake from his test:
//   - Marked "impossible" for an event that was actually possible (fourmi ON the die)
//   - Marked both "certain" AND "possible" for the same event
// Test format: bag/dice/wheel with known contents; ask if drawing X is
// certain / possible / impossible.
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

const OPTIONS = ['certain', 'possible', 'impossible'];

// Things we can put in a bag / on a die / wheel
const fruitsRouges = ['une pomme rouge', 'une cerise', 'une fraise'];
const fruitsJaunes = ['une banane', 'un citron'];
const fruitsVerts = ['une pomme verte', 'un kiwi', 'un raisin vert'];
const fruitsAutres = ['une orange', 'un melon', 'un raisin violet'];

const insectes = ['une chenille', 'un papillon', 'une fourmi', 'une coccinelle', 'une libellule', 'une abeille'];
const animauxNonInsectes = ['un chat', 'un chien', 'un poisson', 'un oiseau'];

const billesColors = ['rouge', 'bleue', 'verte', 'jaune', 'noire', 'blanche'];

// ===== Type 1: Bag of fruits — certain (all same color) =====
function bagCertain() {
  const color = pick(['rouge', 'jaune', 'verte']);
  const fruits = color === 'rouge' ? fruitsRouges : color === 'jaune' ? fruitsJaunes : fruitsVerts;
  const fruit = pick(fruits);
  const n = 3 + Math.floor(Math.random() * 4); // 3-6 same fruit
  return {
    category: 'probabilite',
    type: 'bag_certain',
    text: `Dans un sac, il y a ${n} fruits, tous des « ${fruit} ». Tu pioches un fruit sans regarder. Qu'est-ce qui est ${color === 'verte' ? 'CERTAIN' : 'CERTAIN'} d'arriver?`,
    correct: 'certain',
    // For this format we ask which classification fits
    options: OPTIONS,
    altText: `Sac: ${n} × ${fruit}. Tu pioches « ${fruit} ». C'est...`,
    explanation: `CERTAIN — tous les fruits dans le sac sont « ${fruit} », donc tu vas forcément piocher « ${fruit} ».`,
    hint: 'Si TOUS les objets dans le sac sont pareils, le résultat est certain.',
  };
}

// ===== Type 2: Bag with mixed — drawing an item that IS in the bag =====
function bagPossible() {
  const cat = pick(['fruits', 'billes', 'insectes']);
  let contents = '';
  let target = '';
  if (cat === 'fruits') {
    const a = pick(fruitsRouges);
    const b = pick(fruitsJaunes);
    const c = pick(fruitsVerts);
    contents = `${2 + Math.floor(Math.random() * 3)} × « ${a} », ${1 + Math.floor(Math.random() * 3)} × « ${b} », ${1 + Math.floor(Math.random() * 3)} × « ${c} »`;
    target = pick([a, b, c]);
  } else if (cat === 'billes') {
    const ca = pick(billesColors);
    let cb = pick(billesColors);
    while (cb === ca) cb = pick(billesColors);
    contents = `${3 + Math.floor(Math.random() * 4)} billes ${ca}s et ${2 + Math.floor(Math.random() * 4)} billes ${cb}s`;
    target = `une bille ${pick([ca, cb])}`;
  } else {
    const i1 = pick(insectes);
    let i2 = pick(insectes);
    while (i2 === i1) i2 = pick(insectes);
    contents = `${2 + Math.floor(Math.random() * 3)} × « ${i1} » et ${2 + Math.floor(Math.random() * 3)} × « ${i2} »`;
    target = pick([i1, i2]);
  }
  return {
    category: 'probabilite',
    type: 'bag_possible',
    text: `Dans un sac, il y a ${contents}. Tu pioches un objet sans regarder. Piocher « ${target} » est...`,
    correct: 'possible',
    options: OPTIONS,
    explanation: `POSSIBLE — « ${target} » est dans le sac, mais il y a aussi d'autres objets. Ça peut arriver, ou non.`,
    hint: 'POSSIBLE = ça peut arriver, mais ce n\'est pas garanti.',
  };
}

// ===== Type 3: Bag with mixed — drawing item NOT in the bag =====
function bagImpossible() {
  const cat = pick(['fruits', 'billes', 'insectes']);
  let contents = '';
  let target = '';
  if (cat === 'fruits') {
    const a = pick(fruitsRouges);
    const b = pick(fruitsJaunes);
    contents = `${3 + Math.floor(Math.random() * 3)} × « ${a} » et ${2 + Math.floor(Math.random() * 3)} × « ${b} »`;
    target = pick(fruitsAutres);
  } else if (cat === 'billes') {
    const ca = pick(billesColors);
    let cb = pick(billesColors);
    while (cb === ca) cb = pick(billesColors);
    contents = `${4 + Math.floor(Math.random() * 4)} billes ${ca}s et ${3 + Math.floor(Math.random() * 3)} billes ${cb}s`;
    let cc = pick(billesColors);
    while (cc === ca || cc === cb) cc = pick(billesColors);
    target = `une bille ${cc}`;
  } else {
    const i1 = pick(insectes);
    let i2 = pick(insectes);
    while (i2 === i1) i2 = pick(insectes);
    contents = `${3 + Math.floor(Math.random() * 3)} × « ${i1} » et ${2 + Math.floor(Math.random() * 3)} × « ${i2} »`;
    target = pick(animauxNonInsectes);
  }
  return {
    category: 'probabilite',
    type: 'bag_impossible',
    text: `Dans un sac, il y a ${contents}. Tu pioches un objet sans regarder. Piocher « ${target} » est...`,
    correct: 'impossible',
    options: OPTIONS,
    explanation: `IMPOSSIBLE — il n'y a PAS de « ${target} » dans le sac, donc ça ne peut pas arriver.`,
    hint: 'Si l\'objet n\'est PAS dans le sac, c\'est impossible de le piocher.',
  };
}

// ===== Type 4: Dice with insects (matches his exam) =====
function diceInsects() {
  // 6-faced die, each face shows a different insect
  const faces = shuffle(insectes).slice(0, 6);
  const scenario = pick([
    {
      target: () => pick(faces),
      classification: 'possible',
      template: (t) => `Un dé a 6 faces, chacune avec un insecte différent: ${faces.join(', ')}. Tu lances le dé. Tomber sur « ${t} » est...`,
      explain: (t) => `POSSIBLE — « ${t} » est sur une des 6 faces. Ça peut tomber dessus, ou non (5 autres faces).`,
    },
    {
      target: () => pick(animauxNonInsectes),
      classification: 'impossible',
      template: (t) => `Un dé a 6 faces, chacune avec un insecte différent: ${faces.join(', ')}. Tu lances le dé. Tomber sur « ${t} » est...`,
      explain: (t) => `IMPOSSIBLE — « ${t} » n'est PAS un insecte et n'est pas sur le dé. Tu ne peux pas tomber dessus.`,
    },
    {
      target: () => 'un insecte',
      classification: 'certain',
      template: () => `Un dé a 6 faces, chacune avec un insecte différent: ${faces.join(', ')}. Tu lances le dé. Tomber sur UN INSECTE est...`,
      explain: () => `CERTAIN — TOUTES les faces du dé sont des insectes. Tu vas forcément tomber sur un insecte.`,
    },
  ]);
  const t = scenario.target();
  return {
    category: 'probabilite',
    type: 'dice',
    text: scenario.template(t),
    correct: scenario.classification,
    options: OPTIONS,
    explanation: scenario.explain(t),
    hint: 'Vérifie si l\'objet est sur le dé. Si OUI mais pas tout le temps → possible. Si NON → impossible. Si TOUJOURS → certain.',
  };
}

// ===== Type 5: Spinner / roulette =====
function spinner() {
  const colors = shuffle(['rouge', 'bleu', 'vert', 'jaune', 'violet', 'orange']).slice(0, 4);
  const scenario = pick([
    { target: pick(colors), classification: 'possible' },
    { target: 'noir', classification: 'impossible' }, // not in spinner
    { target: 'une des couleurs', classification: 'certain' },
  ]);
  return {
    category: 'probabilite',
    type: 'spinner',
    text: `Une roulette est divisée en 4 sections égales: ${colors.join(', ')}. Tu la fais tourner. Obtenir « ${scenario.target} » est...`,
    correct: scenario.classification,
    options: OPTIONS,
    explanation: scenario.classification === 'certain'
      ? `CERTAIN — la roulette n'a que ces couleurs, donc tu obtiens forcément une de ces couleurs.`
      : scenario.classification === 'impossible'
      ? `IMPOSSIBLE — « ${scenario.target} » n'est PAS sur la roulette.`
      : `POSSIBLE — « ${scenario.target} » est une des 4 sections, mais il y en a 3 autres aussi.`,
    hint: 'Regarde les sections de la roulette. L\'objet demandé y est-il?',
  };
}

// ===== Type 6: Compare predictions (his test had this!) =====
function comparePredictions() {
  // Setup: a bag/spinner with known content, 3 kids predict.
  const fruits = ['pommes rouges', 'pommes vertes'];
  const nA = 4 + Math.floor(Math.random() * 4);
  const nB = 3 + Math.floor(Math.random() * 4);
  const setup = `Dans un sac, il y a ${nA} ${fruits[0]} et ${nB} ${fruits[1]}.`;
  // Three predictions
  const kids = shuffle(['Magali', 'Étienne', 'Tristan', 'Léa', 'Mathis']).slice(0, 3);
  const predictions = [
    { kid: kids[0], target: fruits[0], says: 'certain' },     // wrong — only possible
    { kid: kids[1], target: fruits[0], says: 'possible' },    // RIGHT
    { kid: kids[2], target: 'des bananes', says: 'impossible' }, // RIGHT (bananas not in bag)
  ];
  // We want exactly one RIGHT answer — Étienne (possible). Tristan is also right (impossible bananas). Hmm.
  // Let's force: only middle prediction is right.
  predictions[2].target = fruits[1]; // pommes vertes
  predictions[2].says = 'impossible'; // WRONG — pommes vertes ARE in bag
  // Now: Magali says "certain" (wrong), Étienne says "possible" (right), Tristan says "impossible" (wrong)
  const text = `${setup} Trois enfants prédisent ce qui peut arriver si tu pioches sans regarder.\n\n` +
    `• ${predictions[0].kid} dit: "C'est CERTAIN que je vais piocher des ${predictions[0].target}."\n` +
    `• ${predictions[1].kid} dit: "C'est POSSIBLE de piocher des ${predictions[1].target}."\n` +
    `• ${predictions[2].kid} dit: "C'est IMPOSSIBLE de piocher des ${predictions[2].target}."\n\n` +
    `Qui a raison?`;
  return {
    category: 'probabilite',
    type: 'compare_predictions',
    text,
    correct: predictions[1].kid,
    options: shuffle([predictions[0].kid, predictions[1].kid, predictions[2].kid, 'Personne']),
    explanation: `${predictions[1].kid} a raison. Il y a ${nA} ${fruits[0]} ET ${nB} ${fruits[1]} dans le sac, donc piocher « ${fruits[0]} » est POSSIBLE (pas certain, car il y a aussi des ${fruits[1]}). ${predictions[0].kid} a tort: ce n'est pas CERTAIN car on peut piocher l'autre fruit. ${predictions[2].kid} a tort: « ${predictions[2].target} » EST dans le sac, donc ce n'est pas impossible.`,
    hint: 'Vérifie chaque prédiction: l\'objet est-il dans le sac? Et est-il SEUL?',
  };
}

// ===== Type 7: Multiple events — same/different result =====
function multipleDice() {
  const items = ['rouges', 'bleues', 'vertes'];
  const counts = [2 + Math.floor(Math.random() * 3), 2 + Math.floor(Math.random() * 3), 2 + Math.floor(Math.random() * 3)];
  const setup = `Tu lances 2 dés. Chaque dé a 6 faces avec des billes colorées: ${items[0]}, ${items[1]} et ${items[2]}.`;
  const scenario = pick([
    {
      ask: `Obtenir DEUX billes ${items[0]} (une sur chaque dé)`,
      classification: 'possible',
      explain: `POSSIBLE — chaque dé peut tomber sur ${items[0]}, mais pas forcément en même temps.`,
    },
    {
      ask: `Obtenir au moins une bille (n'importe quelle couleur)`,
      classification: 'certain',
      explain: `CERTAIN — chaque dé a SEULEMENT des billes sur ses faces, donc tu obtiens forcément 2 billes.`,
    },
    {
      ask: `Obtenir une bille rose`,
      classification: 'impossible',
      explain: `IMPOSSIBLE — il n'y a PAS de bille rose sur les dés.`,
    },
  ]);
  return {
    category: 'probabilite',
    type: 'multiple_dice',
    text: `${setup}\n\n${scenario.ask}, c'est...`,
    correct: scenario.classification,
    options: OPTIONS,
    explanation: scenario.explain,
    hint: 'Pense à toutes les couleurs sur les dés. Est-ce que ça peut/doit/ne peut pas arriver?',
  };
}

function buildOne() {
  const r = Math.random();
  if (r < 0.15) return bagCertain();
  if (r < 0.35) return bagPossible();
  if (r < 0.55) return bagImpossible();
  if (r < 0.70) return diceInsects();
  if (r < 0.82) return spinner();
  if (r < 0.92) return comparePredictions();
  return multipleDice();
}

export function generateProbabilite() {
  return withFresh('probabilite', buildOne, 80, 25, (q) => `${q.type}|${q.text}`);
}
