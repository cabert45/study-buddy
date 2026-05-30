// Nyla — Mots-étoiles (banque de mots maternelle)
// Quebec maternelle teaches reading by sight first — kids recognize whole
// word shapes ("ça ressemble à maison") before decoding letters.
// Two formats mixed:
//   1. Word shown → pick the matching picture
//   2. Picture shown → pick the matching word
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

// The "banque de mots" — mots-étoiles a 5yo would see in maternelle.
// Each entry has an emoji so she can match visual ↔ word.
const bank = [
  { word: 'papa', icon: '👨' },
  { word: 'maman', icon: '👩' },
  { word: 'bébé', icon: '👶' },
  { word: 'chat', icon: '🐱' },
  { word: 'chien', icon: '🐶' },
  { word: 'oiseau', icon: '🐦' },
  { word: 'poisson', icon: '🐟' },
  { word: 'lapin', icon: '🐰' },
  { word: 'ours', icon: '🐻' },
  { word: 'vache', icon: '🐮' },
  { word: 'maison', icon: '🏠' },
  { word: 'école', icon: '🏫' },
  { word: 'voiture', icon: '🚗' },
  { word: 'vélo', icon: '🚲' },
  { word: 'avion', icon: '✈️' },
  { word: 'bateau', icon: '⛵' },
  { word: 'ballon', icon: '⚽' },
  { word: 'livre', icon: '📖' },
  { word: 'crayon', icon: '✏️' },
  { word: 'ciseaux', icon: '✂️' },
  { word: 'pomme', icon: '🍎' },
  { word: 'banane', icon: '🍌' },
  { word: 'gâteau', icon: '🍰' },
  { word: 'pizza', icon: '🍕' },
  { word: 'lait', icon: '🥛' },
  { word: 'soleil', icon: '☀️' },
  { word: 'lune', icon: '🌙' },
  { word: 'étoile', icon: '⭐' },
  { word: 'fleur', icon: '🌸' },
  { word: 'arbre', icon: '🌳' },
  { word: 'feu', icon: '🔥' },
  { word: 'cœur', icon: '❤️' },
];

// Word → pick the matching picture (emoji)
function generateWordToPicture() {
  const item = pick(bank);
  const distractors = shuffle(bank.filter((b) => b.word !== item.word)).slice(0, 3);
  return {
    category: 'nyla_sight_words',
    type: 'word_to_picture',
    text: `Quel dessin va avec le mot « ${item.word} »?`,
    correct: item.icon,
    options: shuffle([item.icon, ...distractors.map((d) => d.icon)]),
    explanation: `« ${item.word} » → ${item.icon}.`,
    hint: 'Lis le mot tout fort. Quel dessin tu vois dans ta tête?',
    spokenWord: item.word,
  };
}

// Picture → pick the matching word
function generatePictureToWord() {
  const item = pick(bank);
  const distractors = shuffle(bank.filter((b) => b.word !== item.word)).slice(0, 3);
  return {
    category: 'nyla_sight_words',
    type: 'picture_to_word',
    text: `Quel mot va avec ce dessin?\n\n${item.icon}`,
    correct: item.word,
    options: shuffle([item.word, ...distractors.map((d) => d.word)]),
    explanation: `${item.icon} → « ${item.word} ».`,
    hint: 'Regarde bien chaque mot. Lequel commence comme le dessin?',
    spokenWord: item.word,
  };
}

function buildOne() {
  return Math.random() < 0.5 ? generateWordToPicture() : generatePictureToWord();
}

export function generateNylaSightWords() {
  return withFresh('nyla_sight_words', buildOne, 60, 25, (q) => `${q.type}|${q.text}`);
}
