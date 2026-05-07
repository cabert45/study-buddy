// Le m devant b, m, p generator — Friday May 8 test
// Rule: n becomes m devant b, m, p (sauf bonbon, embonpoint, néanmoins, etc.)
// Pomélo p.23

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const correctWords = [
  // Devant B
  'campagne', 'compote', 'concombre', 'compost', 'tombe', 'tombée', 'rambardes', 'jambon', 'embarquer', 'jambe',
  'ambulance', 'membre', 'décembre', 'novembre', 'septembre', 'chambre', 'sombre', 'humble', 'ensemble',
  'embarras', 'tambour', 'bombe', 'colombe', 'bambou', 'symbole', 'plombier', 'rembourser',
  // Devant M
  'pomme', 'gamme', 'femme', 'flamme', 'comme', 'commenter', 'gomme', 'somme', 'homme', 'emmener',
  'immense', 'immobile', 'communiquer', 'commander', 'recommencer',
  'emmêler', 'emménager', 'sommet', 'commun', 'sommeil', 'pommier', 'communauté',
  // Devant P
  'temps', 'printemps', 'tempête', 'champion', 'champ', 'compter', 'compagnon', 'sympa', 'sympathique',
  'lampe', 'pompier', 'simple', 'campement', 'emporter', 'empire', 'emploi', 'important', 'imposer',
  'tomber', 'trompette', 'trombone',
  'pompe', 'rampe', 'crampe', 'tampon', 'champignon', 'compagnie', 'comparer', 'complet',
  'employer', 'empêcher', 'temple', 'simple', 'exemple', 'symbole', 'compote',
  // Exceptions (still need m before voyelle but not before b/m/p)
  'cinéma', 'antenne',
];

// Common errors (n instead of m)
function makeWrong(word) {
  // Replace m with n before b, m, p
  return word.replace(/m([bmp])/g, 'n$1');
}

function generateSpellingQuestion() {
  const word = correctWords[Math.floor(Math.random() * correctWords.length)];
  const wrong = makeWrong(word);

  if (wrong === word) {
    // Word doesn't have m+b/m/p pattern — pick another
    return generateSpellingQuestion();
  }

  const options = new Set([word, wrong]);
  // Add 2 more variations
  options.add(word.replace(/m/g, 'n'));
  options.add(word + 'e');
  while (options.size < 4) {
    options.add(word.slice(0, -1));
  }

  return {
    category: 'm_devant_bmp',
    type: 'spelling',
    text: `Écris bien le mot que tu entends`,
    spokenWord: word,
    correct: word,
    options: shuffle([...options].slice(0, 4)),
    explanation: `${word} → on écrit M (et non N) devant B, M, P. Règle: m devant b/m/p.`,
  };
}

function generateFillBlankQuestion() {
  // Show word with blank where the n/m goes
  const word = correctWords[Math.floor(Math.random() * correctWords.length)];
  const match = word.match(/([nm])([bmp])/);
  if (!match) return generateSpellingQuestion();

  const idx = word.indexOf(match[0]);
  const before = word.slice(0, idx);
  const after = word.slice(idx + 1);
  const display = `${before}__${after}`;

  return {
    category: 'm_devant_bmp',
    type: 'fill_blank',
    text: `Dans "${display}" — N ou M?`,
    spokenWord: `Quelle lettre manque dans le mot ${word}? N ou M?`,
    correct: 'M',
    options: ['M', 'N'],
    explanation: `Devant ${match[2].toUpperCase()} → on met M! Le mot s'écrit "${word}".`,
  };
}

function generateRuleQuestion() {
  const questions = [
    { sentence: 'On met M (au lieu de N) devant quelles lettres?', spoken: 'On met M au lieu de N devant quelles lettres?', correct: 'B, M, P', wrongs: ['A, E, I', 'T, D, S', 'B, T, P'] },
    { sentence: 'Choisis la bonne orthographe pour "jambe"', spoken: 'Quelle est la bonne orthographe du mot jambe?', correct: 'jambe', wrongs: ['janbe', 'jamb', 'janb'] },
    { sentence: 'Choisis la bonne orthographe pour "tempête"', spoken: 'Quelle est la bonne orthographe du mot tempête?', correct: 'tempête', wrongs: ['tenpête', 'tempete', 'tampête'] },
    { sentence: 'Choisis la bonne orthographe pour "impossible"', spoken: 'Quelle est la bonne orthographe du mot impossible?', correct: 'impossible', wrongs: ['inpossible', 'imposible', 'impasible'] },
    { sentence: 'Choisis la bonne orthographe pour "nombre"', spoken: 'Quelle est la bonne orthographe du mot nombre?', correct: 'nombre', wrongs: ['nonbre', 'nomber', 'nombr'] },
    { sentence: 'Choisis la bonne orthographe pour "campagne"', spoken: 'Quelle est la bonne orthographe du mot campagne?', correct: 'campagne', wrongs: ['canpagne', 'campagn', 'compagne'] },
    { sentence: 'Choisis la bonne orthographe pour "compter"', spoken: 'Quelle est la bonne orthographe du mot compter?', correct: 'compter', wrongs: ['conpter', 'compter', 'campter'].filter((v, i, a) => a.indexOf(v) === i) },
  ];
  const q = questions[Math.floor(Math.random() * questions.length)];
  const wrongs = q.wrongs.filter(w => w !== q.correct).slice(0, 3);
  while (wrongs.length < 3) wrongs.push(q.correct + 's');

  return {
    category: 'm_devant_bmp',
    type: 'rule',
    text: q.sentence,
    spokenWord: q.spoken,
    correct: q.correct,
    options: shuffle([q.correct, ...wrongs].slice(0, 4)),
    explanation: `${q.correct} — la règle: m devant b, m, p.`,
  };
}

export function generateMDevantBmp() {
  const r = Math.random();
  if (r < 0.40) return generateFillBlankQuestion();
  if (r < 0.75) return generateRuleQuestion();
  return generateSpellingQuestion();
}
