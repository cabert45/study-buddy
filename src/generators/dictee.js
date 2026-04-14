// Dictée generator — spelling from hearing
// Ryan scored 3/10 — critical weakness
// App speaks the word, Ryan picks the correct spelling

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Words with common misspellings (based on Ryan's actual errors)
const words = [
  // Silent letter words — Ryan's exam errors
  { correct: 'le drap', wrongs: ['le drat', 'le draps', 'le dra'] },
  { correct: "l'enfant", wrongs: ["l'anfent", "l'anfant", "l'enfent"] },
  { correct: 'surpris', wrongs: ['suppris', 'surpis', 'surpri'] },
  { correct: 'une dent', wrongs: ['une dan', 'une dant', 'une dend'] },
  { correct: 'le serpent', wrongs: ['le serpont', 'le serpan', 'le serpen'] },
  { correct: 'vivant', wrongs: ['vivent', 'vivont', 'vivan'] },
  { correct: 'un renard', wrongs: ['un renar', 'un renart', 'un rennard'] },
  { correct: 'ouvert', wrongs: ['ouver', 'ouvère', 'ouvert'] },
  { correct: 'un tapis', wrongs: ['un tapie', 'un tapi', 'un tappi'] },
  { correct: 'la nuit', wrongs: ['la nui', 'la nuis', 'la nuie'] },

  // Common 2e année words with silent letters
  { correct: 'le chat', wrongs: ['le cha', 'le chats', 'le chatt'] },
  { correct: 'le lait', wrongs: ['le lai', 'le lais', 'le lé'] },
  { correct: 'petit', wrongs: ['peti', 'petis', 'petite'] },
  { correct: 'grand', wrongs: ['gran', 'grans', 'grande'] },
  { correct: 'le temps', wrongs: ['le temp', 'le tan', 'le tamps'] },
  { correct: 'blanc', wrongs: ['blan', 'blans', 'blanque'] },
  { correct: 'le bras', wrongs: ['le bra', 'le brâs', 'le braz'] },
  { correct: 'le dos', wrongs: ['le do', 'le doss', 'le dot'] },
  { correct: 'le riz', wrongs: ['le ri', 'le ris', 'le rize'] },
  { correct: 'gris', wrongs: ['gri', 'griss', 'grise'] },
  { correct: 'le prix', wrongs: ['le pri', 'le pris', 'le priz'] },
  { correct: 'le bruit', wrongs: ['le brui', 'le bruis', 'le bruie'] },
  { correct: 'le fruit', wrongs: ['le frui', 'le fruis', 'le fruie'] },
  { correct: 'le lit', wrongs: ['le li', 'le lis', 'le lie'] },

  // Words with tricky spellings
  { correct: 'beaucoup', wrongs: ['bocoup', 'beaucou', 'baucoup'] },
  { correct: 'toujours', wrongs: ['toujour', 'toujourss', 'toujour'] },
  { correct: 'maintenant', wrongs: ['maintenan', 'mentenant', 'maintnant'] },
  { correct: 'ensemble', wrongs: ['ansemble', 'ensamble', 'ensembles'] },
  { correct: 'aussi', wrongs: ['ossi', 'ausi', 'aussie'] },
  { correct: 'combien', wrongs: ['conbien', 'combein', 'combient'] },
  { correct: 'pendant', wrongs: ['pandan', 'pandant', 'pendan'] },
  { correct: 'comment', wrongs: ['commen', 'coment', 'commant'] },

  // Feminine agreement words
  { correct: 'belle', wrongs: ['bel', 'bele', 'bell'] },
  { correct: 'nouvelle', wrongs: ['nouvel', 'nouvele', 'novel'] },
  { correct: 'favorite', wrongs: ['favori', 'favorit', 'favourit'] },
  { correct: 'première', wrongs: ['premier', 'prèmiere', 'premièr'] },
  { correct: 'blanche', wrongs: ['blanch', 'blanc', 'blanche'] },
  { correct: 'grosse', wrongs: ['gros', 'gross', 'groce'] },
];

export function generateDictee() {
  const word = words[Math.floor(Math.random() * words.length)];

  // Filter out wrongs that are same as correct, ensure 3 unique wrongs
  const uniqueWrongs = word.wrongs.filter(w => w !== word.correct);
  while (uniqueWrongs.length < 3) {
    uniqueWrongs.push(word.correct + 's');
  }

  const options = shuffle([word.correct, ...uniqueWrongs.slice(0, 3)]);

  return {
    category: 'dictee',
    type: 'dictee',
    text: `Écoute bien et choisis la bonne orthographe:`,
    spokenWord: word.correct,
    correct: word.correct,
    options,
    explanation: `La bonne orthographe est: ${word.correct}`,
  };
}
