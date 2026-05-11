// Pluriel / Féminin cas particuliers — Ryan 2e année (Pomélo p.22, 24)
// Simpler than Cayla's: focus on the common 2e année patterns.
// Pluriel: +s régulier, -eau→-eaux, -al→-aux, the famous 7 -oux, +x stays
// Féminin: +e régulier, -eur→-euse, -eux→-euse, -er→-ère, doubles consonnes
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

// ===== PLURIEL — 2e année level =====
const pluriels = [
  // Régulier +s
  { sing: 'chat', plur: 'chats', rule: 'régulier (+s)' },
  { sing: 'maison', plur: 'maisons', rule: 'régulier (+s)' },
  { sing: 'livre', plur: 'livres', rule: 'régulier (+s)' },
  { sing: 'sport', plur: 'sports', rule: 'régulier (+s)' },
  // -eau → -eaux
  { sing: 'chapeau', plur: 'chapeaux', rule: '-eau → -eaux (+x)' },
  { sing: 'bateau', plur: 'bateaux', rule: '-eau → -eaux (+x)' },
  { sing: 'gâteau', plur: 'gâteaux', rule: '-eau → -eaux (+x)' },
  { sing: 'oiseau', plur: 'oiseaux', rule: '-eau → -eaux (+x)' },
  { sing: 'château', plur: 'châteaux', rule: '-eau → -eaux (+x)' },
  // -eu → -eux
  { sing: 'jeu', plur: 'jeux', rule: '-eu → -eux (+x)' },
  { sing: 'feu', plur: 'feux', rule: '-eu → -eux (+x)' },
  { sing: 'cheveu', plur: 'cheveux', rule: '-eu → -eux (+x)' },
  // -al → -aux
  { sing: 'cheval', plur: 'chevaux', rule: '-al → -aux' },
  { sing: 'animal', plur: 'animaux', rule: '-al → -aux' },
  { sing: 'journal', plur: 'journaux', rule: '-al → -aux' },
  // Les 7 -oux
  { sing: 'chou', plur: 'choux', rule: '-ou → -oux (les 7: bijou, caillou, chou, genou, hibou, joujou, pou)' },
  { sing: 'genou', plur: 'genoux', rule: '-ou → -oux (les 7 exceptions)' },
  { sing: 'hibou', plur: 'hiboux', rule: '-ou → -oux (les 7 exceptions)' },
  { sing: 'bijou', plur: 'bijoux', rule: '-ou → -oux (les 7 exceptions)' },
  // -ou régulier
  { sing: 'trou', plur: 'trous', rule: '-ou → +s régulier (sauf les 7 exceptions)' },
  { sing: 'clou', plur: 'clous', rule: '-ou → +s régulier' },
  // Invariables -s -x -z
  { sing: 'souris', plur: 'souris', rule: 'finit par -s → ne change pas' },
  { sing: 'voix', plur: 'voix', rule: 'finit par -x → ne change pas' },
  { sing: 'nez', plur: 'nez', rule: 'finit par -z → ne change pas' },
];

function buildPlurielDistractors(item) {
  const set = new Set();
  if (item.sing + 's' !== item.plur) set.add(item.sing + 's');
  if (item.sing + 'x' !== item.plur) set.add(item.sing + 'x');
  if (item.sing.endsWith('al')) set.add(item.sing.replace(/al$/, 'als'));
  if (item.sing.endsWith('eau')) set.add(item.sing.replace(/eau$/, 'eaus'));
  if (item.sing.endsWith('ou')) set.add(item.sing + (item.plur.endsWith('x') ? 's' : 'x'));
  set.delete(item.plur);
  set.delete(item.sing);
  return [...set].slice(0, 3);
}

function generatePluriel() {
  const item = pick(pluriels);
  const distractors = buildPlurielDistractors(item);
  while (distractors.length < 3) distractors.push(item.sing + 's' + distractors.length);
  const options = shuffle([item.plur, ...distractors.slice(0, 3)]);
  return {
    category: 'pluriels_ryan',
    type: 'pluriel',
    text: `Quel est le PLURIEL de « ${item.sing} »?`,
    correct: item.plur,
    options,
    explanation: `${item.sing} → ${item.plur}.\nRègle: ${item.rule}.`,
    hint: 'Regarde la TERMINAISON du mot au singulier.',
  };
}

// ===== FÉMININ — 2e année level =====
const feminins = [
  // Régulier +e
  { masc: 'grand', fem: 'grande', rule: 'régulier (+e)' },
  { masc: 'petit', fem: 'petite', rule: 'régulier (+e)' },
  { masc: 'vert', fem: 'verte', rule: 'régulier (+e)' },
  { masc: 'noir', fem: 'noire', rule: 'régulier (+e)' },
  { masc: 'gentil', fem: 'gentille', rule: 'double la consonne + e' },
  // -eur → -euse
  { masc: 'menteur', fem: 'menteuse', rule: '-eur → -euse' },
  { masc: 'chanteur', fem: 'chanteuse', rule: '-eur → -euse' },
  { masc: 'danseur', fem: 'danseuse', rule: '-eur → -euse' },
  // -eux → -euse
  { masc: 'heureux', fem: 'heureuse', rule: '-eux → -euse' },
  { masc: 'courageux', fem: 'courageuse', rule: '-eux → -euse' },
  { masc: 'peureux', fem: 'peureuse', rule: '-eux → -euse' },
  // -er → -ère
  { masc: 'premier', fem: 'première', rule: '-er → -ère' },
  { masc: 'dernier', fem: 'dernière', rule: '-er → -ère' },
  { masc: 'fier', fem: 'fière', rule: '-er → -ère' },
  // Double la consonne + e
  { masc: 'bon', fem: 'bonne', rule: 'double la consonne (-n → -nne)' },
  { masc: 'gros', fem: 'grosse', rule: 'double la consonne (-s → -sse)' },
  // -f → -ve
  { masc: 'neuf', fem: 'neuve', rule: '-f → -ve' },
  { masc: 'sportif', fem: 'sportive', rule: '-f → -ve' },
  // Mots invariables
  { masc: 'jeune', fem: 'jeune', rule: 'finit déjà par -e → ne change pas' },
  { masc: 'rouge', fem: 'rouge', rule: 'finit déjà par -e → ne change pas' },
  // Irrégulier connu
  { masc: 'beau', fem: 'belle', rule: 'irrégulier (à mémoriser)' },
  { masc: 'nouveau', fem: 'nouvelle', rule: 'irrégulier (à mémoriser)' },
  { masc: 'vieux', fem: 'vieille', rule: 'irrégulier (à mémoriser)' },
  { masc: 'long', fem: 'longue', rule: '+ue (cas particulier)' },
  { masc: 'blanc', fem: 'blanche', rule: 'irrégulier (-c → -che)' },
];

function buildFemininDistractors(item) {
  const set = new Set();
  if (item.masc + 'e' !== item.fem) set.add(item.masc + 'e');
  if (item.masc.endsWith('eur')) set.add(item.masc.replace(/eur$/, 'rice'));
  if (item.masc.endsWith('eux')) set.add(item.masc.replace(/x$/, 'sse'));
  if (item.masc.endsWith('er')) set.add(item.masc + 'e');
  set.add(item.masc + 'es');
  set.delete(item.fem);
  set.delete(item.masc);
  return [...set].slice(0, 3);
}

function generateFeminin() {
  const item = pick(feminins);
  const distractors = buildFemininDistractors(item);
  while (distractors.length < 3) distractors.push(item.masc + 'e' + distractors.length);
  const options = shuffle([item.fem, ...distractors.slice(0, 3)]);
  return {
    category: 'pluriels_ryan',
    type: 'feminin',
    text: `Quel est le FÉMININ de « ${item.masc} »?`,
    correct: item.fem,
    options,
    explanation: `${item.masc} → ${item.fem}.\nRègle: ${item.rule}.`,
    hint: 'Regarde la TERMINAISON du masculin.',
  };
}

function buildOne() {
  return Math.random() < 0.55 ? generatePluriel() : generateFeminin();
}

export function generatePlurielsRyan() {
  return withFresh('pluriels_ryan', buildOne, 80, 25, (q) => `${q.type}|${q.text}`);
}
