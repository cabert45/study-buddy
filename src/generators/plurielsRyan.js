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
  // Plausible mistakes:
  // 1. Singular itself (forgot to pluralize)
  if (item.sing !== item.plur) set.add(item.sing);
  // 2. Regular +s when irregular is needed
  if (item.sing + 's' !== item.plur) set.add(item.sing + 's');
  // 3. +x when +s is needed (or vice versa)
  if (item.sing + 'x' !== item.plur) set.add(item.sing + 'x');
  // 4. Pattern-specific wrong attempts
  if (item.sing.endsWith('al')) {
    set.add(item.sing.replace(/al$/, 'als'));  // wrong: most -al → -aux
    set.add(item.sing.replace(/al$/, 'aus'));  // wrong stem
  }
  if (item.sing.endsWith('eau')) {
    set.add(item.sing + 's');                  // wrong: -eau → -eaux not -eaus
    set.add(item.sing.replace(/eau$/, 'aux')); // wrong stem
  }
  if (item.sing.endsWith('eu')) {
    set.add(item.sing + 's');                  // wrong for most -eu
  }
  if (item.sing.endsWith('ou')) {
    set.add(item.sing + (item.plur.endsWith('x') ? 's' : 'x'));
  }
  // 5. Plural-of-plural over-correction
  set.add(item.plur + 's');
  // Remove correct
  set.delete(item.plur);
  return shuffle([...set]).slice(0, 3);
}

function generatePluriel() {
  const item = pick(pluriels);
  const distractors = buildPlurielDistractors(item);
  // If somehow we still don't have 3 distractors, fall back to other words' plurals
  while (distractors.length < 3) {
    const fallback = pick(pluriels);
    if (fallback.plur !== item.plur && !distractors.includes(fallback.plur)) {
      distractors.push(fallback.plur);
    }
  }
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
  // 1. The masculine itself (didn't change anything — common mistake)
  if (item.masc !== item.fem) set.add(item.masc);
  // 2. fem + s (plural confusion)
  set.add(item.fem + 's');
  // 3. masc + s (gave the masc plural instead)
  if (item.masc !== item.fem) set.add(item.masc + 's');
  // 4. just added -e (wrong for irregulars)
  if (item.masc + 'e' !== item.fem && !item.masc.endsWith('e')) set.add(item.masc + 'e');
  // 5. Pattern-specific common errors
  if (item.masc.endsWith('eux')) {
    set.add(item.masc + 'e');                       // didn't change x
    set.add(item.masc.replace(/eux$/, 'eus'));      // wrong final
    set.add(item.masc.replace(/eux$/, 'euxe'));     // added e after x
  }
  if (item.masc.endsWith('eur')) {
    set.add(item.masc + 'e');                       // just added -e
    set.add(item.masc.replace(/eur$/, 'euresse'));  // wrong feminizer
    set.add(item.masc.replace(/eur$/, 'rice'));     // -rice instead of -euse
  }
  if (item.masc.endsWith('er')) {
    set.add(item.masc + 'e');                       // no accent
    set.add(item.masc + 'es');                      // pluriel pattern
  }
  if (item.masc.endsWith('f')) {
    set.add(item.masc + 'e');                       // f stays
    set.add(item.masc.replace(/f$/, 've') + 's');   // pluriel
  }
  if (item.masc.endsWith('n') && !item.masc.endsWith('en')) {
    set.add(item.masc + 'e');                       // single -ne (wrong, should be -nne)
  }
  if (item.masc.endsWith('s')) {
    set.add(item.masc + 'e');                       // single -se (wrong, should be -sse)
  }
  // 6. Generic fallback: fem with wrong ending swap
  if (item.fem.endsWith('e')) set.add(item.fem.slice(0, -1));  // dropped -e
  // Remove the correct answer
  set.delete(item.fem);
  return shuffle([...set]).slice(0, 3);
}

function generateFeminin() {
  const item = pick(feminins);
  const distractors = buildFemininDistractors(item);
  // If somehow still under 3, pull féminins from OTHER items as distractors
  while (distractors.length < 3) {
    const fallback = pick(feminins);
    if (fallback.fem !== item.fem && !distractors.includes(fallback.fem)) {
      distractors.push(fallback.fem);
    }
  }
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
