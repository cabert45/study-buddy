// L'accord de l'adjectif placé après le verbe être
// Friday May 8 test — EXACT preparation worksheet (shared by another mom!)
// Aide-Mémoire Pomélo p.25
// Rule: Quand l'adjectif suit le verbe être, il s'accorde avec le SUJET

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// === EXERCICE 1: Choisis le bon adjectif (from the actual worksheet) ===
const choixAdjectif = [
  { phrase: 'Le petit chat est ___', options: ['mignon', 'mignonne'], correct: 'mignon', why: 'chat = masculin singulier → mignon' },
  { phrase: 'Ma maman est ___', options: ['content', 'contente'], correct: 'contente', why: 'maman = féminin singulier → contente' },
  { phrase: 'Les pommes sont ___', options: ['rouge', 'rouges'], correct: 'rouges', why: 'pommes = féminin pluriel → rouges' },
  { phrase: 'Les élèves sont ___', options: ['calme', 'calmes'], correct: 'calmes', why: 'élèves = pluriel → calmes' },
  { phrase: 'La soupe est ___', options: ['chaud', 'chaude'], correct: 'chaude', why: 'soupe = féminin singulier → chaude' },
];

// === EXERCICE 2: Accorde l'adjectif entre parenthèses ===
const accordeParenthese = [
  { phrase: 'Mon vélo est bleu. Ma bicyclette est ___', baseAdj: 'bleu', correct: 'bleue', wrongs: ['bleu', 'bleus', 'bleues'], why: 'bicyclette = féminin singulier → bleue' },
  { phrase: 'Le ciel est gris. Les nuages sont ___', baseAdj: 'gris', correct: 'gris', wrongs: ['grise', 'grises', 'griss'], why: 'nuages = masculin pluriel. ATTENTION: "gris" ne change pas au pluriel masculin!' },
  { phrase: 'L\'ours est fort. La lionne est ___', baseAdj: 'fort', correct: 'forte', wrongs: ['fort', 'forts', 'fortes'], why: 'lionne = féminin singulier → forte' },
  { phrase: 'Le gâteau est sucré. Les fraises sont ___', baseAdj: 'sucré', correct: 'sucrées', wrongs: ['sucré', 'sucrés', 'sucrée'], why: 'fraises = féminin pluriel → sucrées' },
  { phrase: 'Mon ami est gentil. Mes amies sont ___', baseAdj: 'gentil', correct: 'gentilles', wrongs: ['gentils', 'gentile', 'gentil'], why: 'amies = féminin pluriel → gentilles (double L)' },
  { phrase: 'La maison est ___', baseAdj: 'grand', correct: 'grande', wrongs: ['grand', 'grands', 'grandes'], why: 'maison = féminin singulier → grande' },
  { phrase: 'Les bonbons sont ___', baseAdj: 'sucré', correct: 'sucrés', wrongs: ['sucré', 'sucrée', 'sucrées'], why: 'bonbons = masculin pluriel → sucrés' },
  { phrase: 'Mon frère est ___', baseAdj: 'content', correct: 'content', wrongs: ['contente', 'contents', 'contentes'], why: 'frère = masculin singulier → content (pas de e)' },
  { phrase: 'Les filles sont ___', baseAdj: 'fatigué', correct: 'fatiguées', wrongs: ['fatigué', 'fatigués', 'fatiguée'], why: 'filles = féminin pluriel → fatiguées' },
  { phrase: 'La fleur est ___', baseAdj: 'blanc', correct: 'blanche', wrongs: ['blanc', 'blancs', 'blanches'], why: 'fleur = féminin singulier → blanche (pas blanc!)' },
];

// === EXERCICE 3: Réécris en changeant le sujet ===
const reecrirePhrase = [
  { original: 'Le chien est noir.', newSubj: 'La chienne', correct: 'est noire', wrongs: ['est noir', 'sont noires', 'est noires'], why: 'chienne = féminin singulier → est noire' },
  { original: 'Le sac est lourd.', newSubj: 'Les sacs', correct: 'sont lourds', wrongs: ['est lourds', 'sont lourd', 'sont lourdes'], why: 'sacs = masculin pluriel → sont lourds (verbe + adjectif au pluriel)' },
  { original: 'La fleur est belle.', newSubj: 'Les fleurs', correct: 'sont belles', wrongs: ['est belles', 'sont belle', 'sont beaux'], why: 'fleurs = féminin pluriel → sont belles' },
];

// === EXERCICE: Transforme le groupe nominal → être + adjectif ===
const transformeGN = [
  { gn: 'Un chien méchant', subj: 'Le chien', correct: 'est méchant', wrongs: ['est méchante', 'sont méchants', 'est méchants'], why: 'chien = masculin singulier → est méchant' },
  { gn: 'Des pommes rouges', subj: 'Les pommes', correct: 'sont rouges', wrongs: ['est rouges', 'sont rouge', 'sont rouge'], why: 'pommes = féminin pluriel → sont rouges' },
  { gn: 'Une tarte délicieuse', subj: 'La tarte', correct: 'est délicieuse', wrongs: ['est délicieux', 'sont délicieuses', 'est délicieuses'], why: 'tarte = féminin singulier → est délicieuse' },
  { gn: 'Des enfants sages', subj: 'Les enfants', correct: 'sont sages', wrongs: ['est sages', 'sont sage', 'est sage'], why: 'enfants = pluriel → sont sages' },
];

// === EXERCICE: Complète avec joli/jolie/jolies/gentil/gentils/gentille/gentilles ===
const choixJoliGentil = [
  { phrase: 'La poupée est ___', correct: 'jolie', wrongs: ['joli', 'jolies', 'jolis'], why: 'poupée = f.s. → jolie' },
  { phrase: 'Les enfants sont ___', correct: 'gentils', wrongs: ['gentil', 'gentilles', 'gentille'], why: 'enfants = m.pl. → gentils' },
  { phrase: 'Les fleurs sont ___', correct: 'jolies', wrongs: ['joli', 'jolie', 'jolis'], why: 'fleurs = f.pl. → jolies' },
  { phrase: 'Marie est ___', correct: 'gentille', wrongs: ['gentil', 'gentils', 'gentilles'], why: 'Marie = f.s. → gentille (double L)' },
  { phrase: 'Le bébé est ___', correct: 'joli', wrongs: ['jolie', 'jolies', 'jolis'], why: 'bébé = m.s. → joli' },
  { phrase: 'Les garçons sont ___', correct: 'gentils', wrongs: ['gentil', 'gentilles', 'gentille'], why: 'garçons = m.pl. → gentils' },
  { phrase: 'Ma sœur est ___', correct: 'gentille', wrongs: ['gentil', 'gentils', 'gentilles'], why: 'sœur = f.s. → gentille' },
  { phrase: 'Les princesses sont ___', correct: 'jolies', wrongs: ['joli', 'jolie', 'jolis'], why: 'princesses = f.pl. → jolies' },
];

function ex1() {
  const q = choixAdjectif[Math.floor(Math.random() * choixAdjectif.length)];
  return {
    category: 'accord_etre',
    type: 'choix',
    text: q.phrase,
    correct: q.correct,
    options: shuffle(q.options),
    explanation: q.why,
  };
}

function ex2() {
  const q = accordeParenthese[Math.floor(Math.random() * accordeParenthese.length)];
  return {
    category: 'accord_etre',
    type: 'accorde',
    text: `${q.phrase} (${q.baseAdj})`,
    correct: q.correct,
    options: shuffle([q.correct, ...q.wrongs.slice(0, 3)]),
    explanation: q.why,
  };
}

function ex3() {
  const q = reecrirePhrase[Math.floor(Math.random() * reecrirePhrase.length)];
  return {
    category: 'accord_etre',
    type: 'reecrit',
    text: `${q.original} → ${q.newSubj} ___`,
    correct: q.correct,
    options: shuffle([q.correct, ...q.wrongs.slice(0, 3)]),
    explanation: q.why,
  };
}

function ex4() {
  const q = transformeGN[Math.floor(Math.random() * transformeGN.length)];
  return {
    category: 'accord_etre',
    type: 'transforme',
    text: `Transforme: "${q.gn}" → "${q.subj} ___"`,
    correct: q.correct,
    options: shuffle([q.correct, ...q.wrongs.slice(0, 3)]),
    explanation: q.why,
  };
}

function ex5() {
  const q = choixJoliGentil[Math.floor(Math.random() * choixJoliGentil.length)];
  return {
    category: 'accord_etre',
    type: 'joli_gentil',
    text: `${q.phrase} (joli / jolie / jolies / jolis / gentil / gentille / gentils / gentilles)`,
    correct: q.correct,
    options: shuffle([q.correct, ...q.wrongs.slice(0, 3)]),
    explanation: q.why,
  };
}

export function generateAccordEtre() {
  const r = Math.random();
  if (r < 0.20) return ex1();
  if (r < 0.50) return ex2();
  if (r < 0.65) return ex3();
  if (r < 0.80) return ex4();
  return ex5();
}
