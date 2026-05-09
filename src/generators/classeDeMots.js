// Classe de mots — Cayla 6e année
// She scored 43/57 (75%) on the May 5 test. Goal: drill the exact confusion pairs.
// Categories: nom propre, nom commun, déterminant, adjectif, pronom, verbe, préposition, adverbe, conjonction
// Common confusions seen in her test:
//   - déterminant ↔ adjectif (which precedes a noun?)
//   - préposition ↔ conjonction (de/à/avec vs et/mais/ou/car)
//   - pronom ↔ adverbe ("se" is pronom, not adverbe)
//   - nom propre ↔ nom commun
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

const ALL_CLASSES = [
  'nom propre', 'nom commun', 'déterminant', 'adjectif',
  'pronom', 'verbe', 'préposition', 'adverbe', 'conjonction',
];

// ===== TYPE 1: definition → classe =====
// "Qui suis-je?" — these are exactly the items from her test
const definitions = [
  { def: 'Je remplace souvent un mot ou un groupe de mots.', correct: 'pronom', distractors: ['déterminant', 'adverbe', 'nom commun'] },
  { def: 'Je désigne un ensemble de réalités (objets, personnes, idées).', correct: 'nom commun', distractors: ['nom propre', 'adverbe', 'verbe'] },
  { def: 'Je commence toujours par une lettre majuscule.', correct: 'nom propre', distractors: ['nom commun', 'déterminant', 'pronom'] },
  { def: 'Je peux être conjugué.', correct: 'verbe', distractors: ['adjectif', 'pronom', 'adverbe'] },
  { def: 'Je possède ces mots: et, car, ni, parce que…', correct: 'conjonction', distractors: ['préposition', 'adverbe', 'pronom'] },
  { def: "J'accompagne un nom (le, la, mon, ces, un…).", correct: 'déterminant', distractors: ['adjectif', 'pronom', 'préposition'] },
  { def: 'Je possède ces mots: de, chez, à, avec, dans, sur…', correct: 'préposition', distractors: ['conjonction', 'adverbe', 'déterminant'] },
  { def: 'Je précise un nom ou un pronom.', correct: 'adjectif', distractors: ['déterminant', 'adverbe', 'verbe'] },
  { def: "Je suis souvent précédé d'un déterminant.", correct: 'nom commun', distractors: ['adjectif', 'verbe', 'pronom'] },
  { def: 'Je peux être encadré par « ne… pas ».', correct: 'verbe', distractors: ['adjectif', 'nom commun', 'adverbe'] },
  { def: "Je modifie ou précise le sens d'un verbe ou d'un adjectif.", correct: 'adverbe', distractors: ['déterminant', 'adjectif', 'préposition'] },
  // Extra clue items not on her test but reinforce the rules
  { def: "Je peux varier en genre et en nombre selon le nom que j'accompagne.", correct: 'adjectif', distractors: ['déterminant', 'verbe', 'pronom'] },
  { def: 'Je désigne une personne, un lieu ou une chose unique (ex: Montréal, Cayla, Pomélo).', correct: 'nom propre', distractors: ['nom commun', 'pronom', 'adjectif'] },
  { def: 'Je relie deux mots, deux groupes de mots ou deux phrases (ex: et, mais, ou, donc, car).', correct: 'conjonction', distractors: ['préposition', 'adverbe', 'verbe'] },
  { def: 'Je suis souvent invariable et je donne une information (où, quand, comment).', correct: 'adverbe', distractors: ['adjectif', 'préposition', 'pronom'] },
];

function generateDefinitionQ() {
  const item = pick(definitions);
  const options = shuffle([item.correct, ...item.distractors]).slice(0, 4);
  return {
    category: 'classe_de_mots',
    type: 'definition',
    text: `Qui suis-je?\n« ${item.def} »`,
    correct: item.correct,
    options,
    explanation: `« ${item.def} » → ${item.correct}.`,
    hint: 'Lis lentement et pense à ce que le mot FAIT dans la phrase.',
  };
}

// ===== TYPE 2: classify a word in context =====
// Sentence-based: word has a class, identify it
// Drawn from her actual test sentences + similar ones
const sentenceItems = [
  // From her test: "Mélodie et Vincent escaladent la rocheuse..."
  { sentence: "Mélodie et Vincent escaladent la montagne.", target: 'Mélodie', correct: 'nom propre' },
  { sentence: "Mélodie et Vincent escaladent la montagne.", target: 'et', correct: 'conjonction' },
  { sentence: "Mélodie et Vincent escaladent la montagne.", target: 'Vincent', correct: 'nom propre' },
  { sentence: "Mélodie et Vincent escaladent la montagne.", target: 'escaladent', correct: 'verbe' },
  { sentence: "Mélodie et Vincent escaladent la montagne.", target: 'la', correct: 'déterminant' },
  { sentence: "Mélodie et Vincent escaladent la montagne.", target: 'montagne', correct: 'nom commun' },
  // "ils se rocheuse"-type
  { sentence: "Ils se cachent dans la forêt rocheuse.", target: 'Ils', correct: 'pronom' },
  { sentence: "Ils se cachent dans la forêt rocheuse.", target: 'se', correct: 'pronom' }, // ← her common error: she said adverbe
  { sentence: "Ils se cachent dans la forêt rocheuse.", target: 'cachent', correct: 'verbe' },
  { sentence: "Ils se cachent dans la forêt rocheuse.", target: 'dans', correct: 'préposition' },
  { sentence: "Ils se cachent dans la forêt rocheuse.", target: 'la', correct: 'déterminant' },
  { sentence: "Ils se cachent dans la forêt rocheuse.", target: 'forêt', correct: 'nom commun' },
  { sentence: "Ils se cachent dans la forêt rocheuse.", target: 'rocheuse', correct: 'adjectif' },
  // From her test: "retrouvent au sommet pour admirer le soleil rouge se coucher"
  { sentence: "Ils retrouvent au sommet pour admirer le soleil.", target: 'retrouvent', correct: 'verbe' },
  { sentence: "Ils retrouvent au sommet pour admirer le soleil.", target: 'au', correct: 'déterminant' },
  { sentence: "Ils retrouvent au sommet pour admirer le soleil.", target: 'sommet', correct: 'nom commun' },
  { sentence: "Ils retrouvent au sommet pour admirer le soleil.", target: 'pour', correct: 'préposition' },
  { sentence: "Ils retrouvent au sommet pour admirer le soleil.", target: 'admirer', correct: 'verbe' },
  { sentence: "Ils retrouvent au sommet pour admirer le soleil.", target: 'le', correct: 'déterminant' },
  { sentence: "Ils retrouvent au sommet pour admirer le soleil.", target: 'soleil', correct: 'nom commun' },
  { sentence: "Le soleil rouge se couche.", target: 'rouge', correct: 'adjectif' },
  { sentence: "Le soleil rouge se couche.", target: 'se', correct: 'pronom' },
  { sentence: "Le soleil rouge se couche.", target: 'couche', correct: 'verbe' },
  // "C'est magnifique. Les derniers rayons disparaissent derrière les montagnes voisines."
  { sentence: "C'est magnifique.", target: "C'", correct: 'pronom' },
  { sentence: "C'est magnifique.", target: 'est', correct: 'verbe' },
  { sentence: "C'est magnifique.", target: 'magnifique', correct: 'adjectif' },
  { sentence: "Les derniers rayons disparaissent derrière les montagnes.", target: 'Les', correct: 'déterminant' },
  { sentence: "Les derniers rayons disparaissent derrière les montagnes.", target: 'derniers', correct: 'adjectif' },
  { sentence: "Les derniers rayons disparaissent derrière les montagnes.", target: 'rayons', correct: 'nom commun' },
  { sentence: "Les derniers rayons disparaissent derrière les montagnes.", target: 'disparaissent', correct: 'verbe' },
  { sentence: "Les derniers rayons disparaissent derrière les montagnes.", target: 'derrière', correct: 'préposition' },
  { sentence: "Les derniers rayons disparaissent derrière les montagnes.", target: 'montagnes', correct: 'nom commun' },
  // "Ensuite, l'obscurité s'installe doucement."
  { sentence: "Ensuite, l'obscurité s'installe doucement.", target: 'Ensuite', correct: 'adverbe' },
  { sentence: "Ensuite, l'obscurité s'installe doucement.", target: "l'", correct: 'déterminant' },
  { sentence: "Ensuite, l'obscurité s'installe doucement.", target: 'obscurité', correct: 'nom commun' },
  { sentence: "Ensuite, l'obscurité s'installe doucement.", target: "s'", correct: 'pronom' },
  { sentence: "Ensuite, l'obscurité s'installe doucement.", target: 'installe', correct: 'verbe' },
  { sentence: "Ensuite, l'obscurité s'installe doucement.", target: 'doucement', correct: 'adverbe' },
  // "Ces jeunes escaladeurs sont heureux de vivre cet instant."
  { sentence: "Ces jeunes escaladeurs sont heureux.", target: 'Ces', correct: 'déterminant' },
  { sentence: "Ces jeunes escaladeurs sont heureux.", target: 'jeunes', correct: 'adjectif' },
  { sentence: "Ces jeunes escaladeurs sont heureux.", target: 'escaladeurs', correct: 'nom commun' },
  { sentence: "Ces jeunes escaladeurs sont heureux.", target: 'sont', correct: 'verbe' },
  { sentence: "Ces jeunes escaladeurs sont heureux.", target: 'heureux', correct: 'adjectif' },
  { sentence: "Heureux de vivre cet instant.", target: 'de', correct: 'préposition' },
  { sentence: "Heureux de vivre cet instant.", target: 'vivre', correct: 'verbe' },
  { sentence: "Heureux de vivre cet instant.", target: 'cet', correct: 'déterminant' },
  { sentence: "Heureux de vivre cet instant.", target: 'instant', correct: 'nom commun' },
  // Extra drills on her confusion pairs
  { sentence: 'Le chien dort tranquillement.', target: 'tranquillement', correct: 'adverbe' },
  { sentence: 'Le chien dort tranquillement.', target: 'dort', correct: 'verbe' },
  { sentence: 'Le chien dort tranquillement.', target: 'Le', correct: 'déterminant' },
  { sentence: 'Le chien dort tranquillement.', target: 'chien', correct: 'nom commun' },
  { sentence: 'Marie chante mais Pierre dort.', target: 'mais', correct: 'conjonction' },
  { sentence: 'Marie chante mais Pierre dort.', target: 'Marie', correct: 'nom propre' },
  { sentence: 'Marie chante mais Pierre dort.', target: 'Pierre', correct: 'nom propre' },
  { sentence: 'Je vais à la piscine avec mes amis.', target: 'Je', correct: 'pronom' },
  { sentence: 'Je vais à la piscine avec mes amis.', target: 'à', correct: 'préposition' },
  { sentence: 'Je vais à la piscine avec mes amis.', target: 'avec', correct: 'préposition' },
  { sentence: 'Je vais à la piscine avec mes amis.', target: 'mes', correct: 'déterminant' },
  { sentence: 'Elle court vite et grimpe haut.', target: 'Elle', correct: 'pronom' },
  { sentence: 'Elle court vite et grimpe haut.', target: 'vite', correct: 'adverbe' },
  { sentence: 'Elle court vite et grimpe haut.', target: 'et', correct: 'conjonction' },
  { sentence: 'Elle court vite et grimpe haut.', target: 'haut', correct: 'adverbe' },
  { sentence: 'Hier, nous sommes allés au parc.', target: 'Hier', correct: 'adverbe' },
  { sentence: 'Hier, nous sommes allés au parc.', target: 'nous', correct: 'pronom' },
  { sentence: 'Hier, nous sommes allés au parc.', target: 'au', correct: 'déterminant' },
  { sentence: 'Une vieille maison dans la forêt.', target: 'Une', correct: 'déterminant' },
  { sentence: 'Une vieille maison dans la forêt.', target: 'vieille', correct: 'adjectif' },
  { sentence: 'Une vieille maison dans la forêt.', target: 'maison', correct: 'nom commun' },
  { sentence: 'Une vieille maison dans la forêt.', target: 'dans', correct: 'préposition' },
  { sentence: 'Le ciel est bleu et clair.', target: 'bleu', correct: 'adjectif' },
  { sentence: 'Le ciel est bleu et clair.', target: 'clair', correct: 'adjectif' },
  { sentence: 'Le ciel est bleu et clair.', target: 'est', correct: 'verbe' },
  { sentence: 'Mon père travaille car il aime son métier.', target: 'Mon', correct: 'déterminant' },
  { sentence: 'Mon père travaille car il aime son métier.', target: 'père', correct: 'nom commun' },
  { sentence: 'Mon père travaille car il aime son métier.', target: 'car', correct: 'conjonction' },
  { sentence: 'Mon père travaille car il aime son métier.', target: 'il', correct: 'pronom' },
];

// Common distractor classes by correct class — pick the ones she confuses
const confusionPairs = {
  'pronom': ['adverbe', 'déterminant', 'nom commun'],
  'déterminant': ['adjectif', 'pronom', 'préposition'],
  'adjectif': ['déterminant', 'adverbe', 'nom commun'],
  'adverbe': ['adjectif', 'préposition', 'conjonction'],
  'préposition': ['conjonction', 'adverbe', 'déterminant'],
  'conjonction': ['préposition', 'adverbe', 'pronom'],
  'nom propre': ['nom commun', 'pronom', 'adjectif'],
  'nom commun': ['nom propre', 'adjectif', 'verbe'],
  'verbe': ['adjectif', 'nom commun', 'adverbe'],
};

function highlightTarget(sentence, target) {
  // Bold the target word in the sentence (multi-step rendering uses plain text — use ___target___ markers)
  // We return the sentence unchanged but separately surface the target.
  return sentence;
}

function generateSentenceQ() {
  const item = pick(sentenceItems);
  const distractors = (confusionPairs[item.correct] || ALL_CLASSES.filter(c => c !== item.correct)).slice(0, 3);
  const options = shuffle([item.correct, ...distractors]).slice(0, 4);
  return {
    category: 'classe_de_mots',
    type: 'sentence',
    text: `Dans la phrase suivante, quelle est la classe de mot de « ${item.target} »?\n\n« ${highlightTarget(item.sentence, item.target)} »`,
    correct: item.correct,
    options,
    explanation: `« ${item.target} » est un(e) ${item.correct}.`,
    hint: 'Demande-toi: quel est le rôle du mot? (remplace? précède un nom? précise un nom? relie?)',
  };
}

function buildOne() {
  // 60% sentence-based (her main weakness in the test), 40% definition
  return Math.random() < 0.6 ? generateSentenceQ() : generateDefinitionQ();
}

export function generateClasseDeMots() {
  return withFresh('classe_de_mots', buildOne, 80, 25, (q) => `${q.type}|${q.text}`);
}
