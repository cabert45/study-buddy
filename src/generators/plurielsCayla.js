// Pluriels — cas particuliers (Cayla 6e année)
// From her dictée correction sheet: chevreuil, corail, sport, votes
// Test items showed she needs: -ail → -aux, -eu/-eul singulier→pluriel, simple +s
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

// === Words organized by plural rule ===
// 1. -ail → -aux (irregular)
const ailAux = [
  { sing: 'corail', plur: 'coraux', rule: '-ail → -aux' },
  { sing: 'travail', plur: 'travaux', rule: '-ail → -aux' },
  { sing: 'vitrail', plur: 'vitraux', rule: '-ail → -aux' },
  { sing: 'émail', plur: 'émaux', rule: '-ail → -aux' },
  { sing: 'soupirail', plur: 'soupiraux', rule: '-ail → -aux' },
];

// 1b. -ail → -ails (regular exceptions to learn)
const ailRegular = [
  { sing: 'détail', plur: 'détails', rule: '-ail → -ails (exception)' },
  { sing: 'rail', plur: 'rails', rule: '-ail → -ails (exception)' },
  { sing: 'éventail', plur: 'éventails', rule: '-ail → -ails (exception)' },
  { sing: 'gouvernail', plur: 'gouvernails', rule: '-ail → -ails (exception)' },
  { sing: 'chandail', plur: 'chandails', rule: '-ail → -ails (exception)' },
];

// 2. -eu / -eau / -au → -x (irregular)
const eauEux = [
  { sing: 'chapeau', plur: 'chapeaux', rule: '-eau → -eaux' },
  { sing: 'bateau', plur: 'bateaux', rule: '-eau → -eaux' },
  { sing: 'gâteau', plur: 'gâteaux', rule: '-eau → -eaux' },
  { sing: 'château', plur: 'châteaux', rule: '-eau → -eaux' },
  { sing: 'oiseau', plur: 'oiseaux', rule: '-eau → -eaux' },
  { sing: 'cheveu', plur: 'cheveux', rule: '-eu → -eux' },
  { sing: 'jeu', plur: 'jeux', rule: '-eu → -eux' },
  { sing: 'feu', plur: 'feux', rule: '-eu → -eux' },
  { sing: 'cheveu', plur: 'cheveux', rule: '-eu → -eux' },
  { sing: 'noyau', plur: 'noyaux', rule: '-au → -aux' },
  { sing: 'tuyau', plur: 'tuyaux', rule: '-au → -aux' },
];

// 2b. -eu exceptions → -eus
const euRegular = [
  { sing: 'pneu', plur: 'pneus', rule: '-eu → -eus (exception: pneu, bleu, lieu de poisson)' },
  { sing: 'bleu', plur: 'bleus', rule: '-eu → -eus (exception)' },
];

// 3. -ou → +s (regular) BUT 7 exceptions take -oux
const ouRegular = [
  { sing: 'trou', plur: 'trous', rule: '-ou → -ous (régulier)' },
  { sing: 'clou', plur: 'clous', rule: '-ou → -ous (régulier)' },
  { sing: 'sou', plur: 'sous', rule: '-ou → -ous (régulier)' },
  { sing: 'cou', plur: 'cous', rule: '-ou → -ous (régulier)' },
];

// 3b. The famous 7: bijou, caillou, chou, genou, hibou, joujou, pou
const ouX = [
  { sing: 'bijou', plur: 'bijoux', rule: '-ou → -oux (les 7 exceptions: bijou, caillou, chou, genou, hibou, joujou, pou)' },
  { sing: 'caillou', plur: 'cailloux', rule: '-ou → -oux (les 7 exceptions)' },
  { sing: 'chou', plur: 'choux', rule: '-ou → -oux (les 7 exceptions)' },
  { sing: 'genou', plur: 'genoux', rule: '-ou → -oux (les 7 exceptions)' },
  { sing: 'hibou', plur: 'hiboux', rule: '-ou → -oux (les 7 exceptions)' },
  { sing: 'joujou', plur: 'joujoux', rule: '-ou → -oux (les 7 exceptions)' },
  { sing: 'pou', plur: 'poux', rule: '-ou → -oux (les 7 exceptions)' },
];

// 4. -al → -aux (irregular)
const alAux = [
  { sing: 'cheval', plur: 'chevaux', rule: '-al → -aux' },
  { sing: 'animal', plur: 'animaux', rule: '-al → -aux' },
  { sing: 'journal', plur: 'journaux', rule: '-al → -aux' },
  { sing: 'général', plur: 'généraux', rule: '-al → -aux' },
  { sing: 'hôpital', plur: 'hôpitaux', rule: '-al → -aux' },
  { sing: 'signal', plur: 'signaux', rule: '-al → -aux' },
];

// 4b. -al exceptions → -als
const alRegular = [
  { sing: 'bal', plur: 'bals', rule: '-al → -als (exception: bal, carnaval, festival, récital, régal)' },
  { sing: 'carnaval', plur: 'carnavals', rule: '-al → -als (exception)' },
  { sing: 'festival', plur: 'festivals', rule: '-al → -als (exception)' },
  { sing: 'récital', plur: 'récitals', rule: '-al → -als (exception)' },
];

// 5. -s, -x, -z stay invariable
const invariables = [
  { sing: 'souris', plur: 'souris', rule: 'finit par -s, -x ou -z → ne change pas au pluriel' },
  { sing: 'nez', plur: 'nez', rule: 'finit par -z → ne change pas' },
  { sing: 'voix', plur: 'voix', rule: 'finit par -x → ne change pas' },
  { sing: 'prix', plur: 'prix', rule: 'finit par -x → ne change pas' },
  { sing: 'tas', plur: 'tas', rule: 'finit par -s → ne change pas' },
  { sing: 'gaz', plur: 'gaz', rule: 'finit par -z → ne change pas' },
];

// 6. Chevreuil-style: -euil → +s (Cayla's specific item from her test)
const euilRegular = [
  { sing: 'chevreuil', plur: 'chevreuils', rule: '-euil → -euils (régulier, +s)' },
  { sing: 'écureuil', plur: 'écureuils', rule: '-euil → -euils (régulier, +s)' },
  { sing: 'fauteuil', plur: 'fauteuils', rule: '-euil → -euils (régulier, +s)' },
  { sing: 'deuil', plur: 'deuils', rule: '-euil → -euils (régulier, +s)' },
];

// 7. Regular +s
const regular = [
  { sing: 'sport', plur: 'sports', rule: 'régulier (+s)' },
  { sing: 'vote', plur: 'votes', rule: 'régulier (+s)' },
  { sing: 'maison', plur: 'maisons', rule: 'régulier (+s)' },
  { sing: 'livre', plur: 'livres', rule: 'régulier (+s)' },
  { sing: 'table', plur: 'tables', rule: 'régulier (+s)' },
  { sing: 'fille', plur: 'filles', rule: 'régulier (+s)' },
];

const allWords = [
  ...ailAux, ...ailRegular, ...eauEux, ...euRegular,
  ...ouRegular, ...ouX, ...alAux, ...alRegular,
  ...invariables, ...euilRegular, ...regular,
];

// Build distractors that are PLAUSIBLE wrong forms
function buildDistractors(item) {
  const { sing, plur } = item;
  const set = new Set();
  // +s
  if (sing + 's' !== plur) set.add(sing + 's');
  // -aux
  if (/[ae]l$/.test(sing) || /[ae]il$/.test(sing)) {
    const root = sing.replace(/(ail|al|eau|au|eu|ou)$/, '');
    set.add(root + 'aux');
  }
  // -x
  if (sing + 'x' !== plur) set.add(sing + 'x');
  // -ous → -oux confusion
  if (/ou$/.test(sing)) set.add(sing + 'x');
  if (/ou$/.test(sing)) set.add(sing + 's');
  // remove correct from distractors
  set.delete(plur);
  // remove duplicates of singular
  set.delete(sing);
  return [...set].slice(0, 3);
}

// ===== Two question types =====
// 1) Singular → plural (multiple choice)
function generateSingToPlur() {
  const item = pick(allWords);
  const distractors = buildDistractors(item);
  while (distractors.length < 3) {
    distractors.push(item.sing + 's' + (distractors.length + 1));
  }
  const options = shuffle([item.plur, ...distractors.slice(0, 3)]);
  return {
    category: 'pluriels',
    type: 'sing_to_plur',
    text: `Quel est le pluriel de « ${item.sing} »?`,
    correct: item.plur,
    options,
    explanation: `${item.sing} → ${item.plur}. Règle: ${item.rule}.`,
    hint: 'Pense à la terminaison du mot et à sa règle de pluriel.',
  };
}

// 2) Plural → singular (multiple choice)
function generatePlurToSing() {
  const item = pick(allWords);
  if (item.sing === item.plur) return generateSingToPlur(); // skip invariables here
  const distractors = new Set();
  // -x → drop x
  if (item.plur.endsWith('x')) distractors.add(item.plur.slice(0, -1));
  // -aux → -al
  if (item.plur.endsWith('aux')) distractors.add(item.plur.replace(/aux$/, 'al'));
  // -aux → -ail
  if (item.plur.endsWith('aux')) distractors.add(item.plur.replace(/aux$/, 'ail'));
  // -s → drop s
  if (item.plur.endsWith('s') && !item.plur.endsWith('us') && !item.plur.endsWith('os')) {
    distractors.add(item.plur.slice(0, -1));
  }
  distractors.delete(item.sing);
  const dArr = [...distractors].slice(0, 3);
  while (dArr.length < 3) dArr.push(item.sing + dArr.length);
  const options = shuffle([item.sing, ...dArr]);
  return {
    category: 'pluriels',
    type: 'plur_to_sing',
    text: `Quel est le singulier de « ${item.plur} »?`,
    correct: item.sing,
    options,
    explanation: `${item.plur} → ${item.sing}. Règle: ${item.rule}.`,
    hint: 'Trouve la forme de base (singulier) du mot.',
  };
}

function buildOne() {
  return Math.random() < 0.65 ? generateSingToPlur() : generatePlurToSing();
}

export function generatePlurielsCayla() {
  return withFresh('pluriels_cayla', buildOne, 80, 25, (q) => `${q.type}|${q.text}`);
}
