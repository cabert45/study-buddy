// Nyla — Les rimes (rhyming words)
// Maternelle: phonological awareness — recognize words that end the same way.
// Show a target word, pick the rhyming option.
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

// Rhyme families — words that rhyme grouped together. End sound in [].
const rhymeFamilies = [
  { end: '-at', icon: '🐱', words: ['chat', 'rat', 'plat', 'tapis'] },
  { end: '-eau', icon: '🚗', words: ['bateau', 'château', 'gâteau', 'manteau', 'chapeau'] },
  { end: '-on', icon: '🎈', words: ['ballon', 'maison', 'poisson', 'avion', 'cochon'] },
  { end: '-ine', icon: '🏫', words: ['copine', 'cuisine', 'machine', 'racine'] },
  { end: '-our', icon: '🐻', words: ['ours', 'tour', 'four', 'amour', 'jour'] },
  { end: '-ille', icon: '🌸', words: ['fille', 'famille', 'chenille', 'coquille'] },
  { end: '-é', icon: '🎂', words: ['fée', 'thé', 'café', 'bébé', 'épée'] },
  { end: '-oux', icon: '🐶', words: ['doux', 'roux', 'genoux', 'hibou'] },
  { end: '-an', icon: '☀️', words: ['blanc', 'maman', 'enfant', 'volant'] },
  { end: '-ar', icon: '🚗', words: ['canard', 'renard', 'foulard', 'cauchemar'] },
];

function buildOne() {
  const family = pick(rhymeFamilies);
  // Pick target + one other word from same family
  const shuffled = shuffle([...family.words]);
  const target = shuffled[0];
  const correct = shuffled[1];
  // Distractors from OTHER families
  const otherFamilies = rhymeFamilies.filter((f) => f.end !== family.end);
  const distractors = shuffle(otherFamilies).slice(0, 3).map((f) => pick(f.words));
  return {
    category: 'nyla_rhymes',
    type: 'rhyme',
    text: `Quel mot RIME avec « ${target} »?`,
    correct,
    options: shuffle([correct, ...distractors]),
    explanation: `« ${target} » et « ${correct} » riment — ils finissent par le même son (${family.end}).`,
    hint: 'Dis chaque mot tout fort. Lequel finit par le même son?',
    spokenWord: target,
  };
}

export function generateNylaRhymes() {
  return withFresh('nyla_rhymes', buildOne, 60, 20, (q) => q.text);
}
