// Nyla (5 ans) — flashcard decks.
// Tap-to-reveal cards: she reads/recognizes the card, reveals the picture,
// then she or a parent marks "Je le sais" / "Pas encore". Missed cards cycle
// (same round logic as Ryan's dictée flashcards), but visual instead of typed.

// ===== Alphabet — uppercase + lowercase + an example word/picture =====
export const nylaLetters = [
  { letter: 'A', word: 'avion', icon: '✈️' },
  { letter: 'B', word: 'ballon', icon: '⚽' },
  { letter: 'C', word: 'canard', icon: '🦆' },
  { letter: 'D', word: 'dauphin', icon: '🐬' },
  { letter: 'E', word: 'éléphant', icon: '🐘' },
  { letter: 'F', word: 'fleur', icon: '🌸' },
  { letter: 'G', word: 'girafe', icon: '🦒' },
  { letter: 'H', word: 'hibou', icon: '🦉' },
  { letter: 'I', word: 'iguane', icon: '🦎' },
  { letter: 'J', word: 'jouet', icon: '🧸' },
  { letter: 'K', word: 'kangourou', icon: '🦘' },
  { letter: 'L', word: 'lion', icon: '🦁' },
  { letter: 'M', word: 'maison', icon: '🏠' },
  { letter: 'N', word: 'nuage', icon: '☁️' },
  { letter: 'O', word: 'oiseau', icon: '🐦' },
  { letter: 'P', word: 'pomme', icon: '🍎' },
  { letter: 'Q', word: 'quilles', icon: '🎳' },
  { letter: 'R', word: 'robot', icon: '🤖' },
  { letter: 'S', word: 'soleil', icon: '☀️' },
  { letter: 'T', word: 'tortue', icon: '🐢' },
  { letter: 'U', word: 'usine', icon: '🏭' },
  { letter: 'V', word: 'voiture', icon: '🚗' },
  { letter: 'W', word: 'wagon', icon: '🚃' },
  { letter: 'X', word: 'xylophone', icon: '🎶' },
  { letter: 'Y', word: 'yo-yo', icon: '🪀' },
  { letter: 'Z', word: 'zèbre', icon: '🦓' },
];

// ===== Mots de la semaine — 5 mots/semaine à reconnaître visuellement =====
// Semaine 1 = les mots du quotidien (maman, papa, école, maison + bébé).
// Ensuite, des mots de 2 syllabes par thème.
export const nylaWordWeeks = {
  s1: {
    label: 'Semaine 1 — ma famille',
    desc: 'maman, papa, école, maison, bébé',
    words: [
      { word: 'maman', icon: '👩' },
      { word: 'papa', icon: '👨' },
      { word: 'école', icon: '🏫' },
      { word: 'maison', icon: '🏠' },
      { word: 'bébé', icon: '👶' },
    ],
  },
  s2: {
    label: 'Semaine 2 — les animaux',
    desc: 'lapin, cochon, mouton, girafe, tortue',
    words: [
      { word: 'lapin', icon: '🐰' },
      { word: 'cochon', icon: '🐷' },
      { word: 'mouton', icon: '🐑' },
      { word: 'girafe', icon: '🦒' },
      { word: 'tortue', icon: '🐢' },
    ],
  },
  s3: {
    label: 'Semaine 3 — la nourriture',
    desc: 'banane, pomme, gâteau, carotte, fromage',
    words: [
      { word: 'banane', icon: '🍌' },
      { word: 'pomme', icon: '🍎' },
      { word: 'gâteau', icon: '🍰' },
      { word: 'carotte', icon: '🥕' },
      { word: 'fromage', icon: '🧀' },
    ],
  },
  s4: {
    label: 'Semaine 4 — dehors',
    desc: 'soleil, bateau, ballon, nuage, étoile',
    words: [
      { word: 'soleil', icon: '☀️' },
      { word: 'bateau', icon: '⛵' },
      { word: 'ballon', icon: '⚽' },
      { word: 'nuage', icon: '☁️' },
      { word: 'étoile', icon: '⭐' },
    ],
  },
  s5: {
    label: 'Semaine 5 — les objets',
    desc: 'voiture, cadeau, chapeau, crayon, sapin',
    words: [
      { word: 'voiture', icon: '🚗' },
      { word: 'cadeau', icon: '🎁' },
      { word: 'chapeau', icon: '🎩' },
      { word: 'crayon', icon: '✏️' },
      { word: 'sapin', icon: '🌲' },
    ],
  },
  s6: {
    label: 'Semaine 6 — je m\'habille',
    desc: 'soulier, manteau, mitaine, foulard, chandail',
    words: [
      { word: 'soulier', icon: '👟' },
      { word: 'manteau', icon: '🧥' },
      { word: 'mitaine', icon: '🧤' },
      { word: 'foulard', icon: '🧣' },
      { word: 'chandail', icon: '👕' },
    ],
  },
};

export const nylaWeekList = Object.entries(nylaWordWeeks).map(([id, w]) => ({ id, ...w }));
