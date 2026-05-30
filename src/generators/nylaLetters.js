// Nyla — Reconnaître les lettres
// Pre-K maternelle: alphabet recognition. Two modes mixed:
//   1. Show a letter, pick its name (M → "M")
//   2. Show a name, pick the matching letter ("trouve le B")
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

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

// Simple words starting with each letter — for beginning-sound exercises
const startsWith = {
  A: ['avion', 'ananas'], B: ['ballon', 'bateau'], C: ['canard', 'chat'],
  D: ['dinosaure', 'dauphin'], E: ['éléphant', 'étoile'], F: ['fleur', 'fraise'],
  G: ['girafe', 'gâteau'], H: ['hibou', 'hippopotame'], I: ['île', 'igloo'],
  J: ['jardin', 'jaune'], K: ['kangourou', 'koala'], L: ['lion', 'lune'],
  M: ['maman', 'maison'], N: ['nuage', 'neige'], O: ['oiseau', 'orange'],
  P: ['poisson', 'pomme'], Q: ['quatre', 'queue'], R: ['rouge', 'robot'],
  S: ['soleil', 'singe'], T: ['tortue', 'tomate'], U: ['une', 'usine'],
  V: ['voiture', 'vache'], W: ['wagon', 'wifi'], X: ['xylophone', 'six'],
  Y: ['yaourt', 'yo-yo'], Z: ['zèbre', 'zoo'],
};

// Show letter, pick the matching word
function generateLetterToWord() {
  const letter = pick(alphabet);
  const correct = pick(startsWith[letter]);
  const others = alphabet.filter((l) => l !== letter);
  const distractors = shuffle(others).slice(0, 3).map((l) => pick(startsWith[l]));
  return {
    category: 'nyla_letters',
    type: 'letter_to_word',
    text: `Quel mot commence par « ${letter} »?`,
    correct,
    options: shuffle([correct, ...distractors]),
    explanation: `« ${correct} » commence par la lettre ${letter}.`,
    hint: `Dis le son de la lettre ${letter} tout fort, puis cherche le mot qui commence pareil.`,
    spokenWord: letter,
  };
}

// Show word, pick the first letter
function generateWordToLetter() {
  const letter = pick(alphabet);
  const word = pick(startsWith[letter]);
  const others = shuffle(alphabet.filter((l) => l !== letter)).slice(0, 3);
  return {
    category: 'nyla_letters',
    type: 'word_to_letter',
    text: `Par quelle lettre commence « ${word} »?`,
    correct: letter,
    options: shuffle([letter, ...others]),
    explanation: `« ${word} » commence par la lettre ${letter}.`,
    hint: `Dis le mot tout fort. Quel son entends-tu en premier?`,
    spokenWord: word,
  };
}

// Identify the letter shown (just recognition)
function generateRecognizeLetter() {
  const letter = pick(alphabet);
  const others = shuffle(alphabet.filter((l) => l !== letter)).slice(0, 3);
  return {
    category: 'nyla_letters',
    type: 'recognize',
    text: `Quelle est cette lettre?\n\n${letter}`,
    correct: letter,
    options: shuffle([letter, ...others]),
    explanation: `C'est la lettre ${letter}.`,
    hint: 'Regarde bien la forme de la lettre.',
  };
}

function buildOne() {
  const r = Math.random();
  if (r < 0.4) return generateRecognizeLetter();
  if (r < 0.75) return generateWordToLetter();
  return generateLetterToWord();
}

export function generateNylaLetters() {
  return withFresh('nyla_letters', buildOne, 50, 20, (q) => q.text);
}
