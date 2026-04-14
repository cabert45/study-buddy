// Déterminant generator — Theme 4, Mini leçon 11
// Match the correct determiner to the noun (gender + number)

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Each noun with its correct determiners and properties
const nouns = [
  // Feminine singular
  { noun: 'patinoire', det: 'la', gender: 'f', number: 's' },
  { noun: 'saison', det: 'la', gender: 'f', number: 's' },
  { noun: 'maison', det: 'la', gender: 'f', number: 's' },
  { noun: 'pomme', det: 'la', gender: 'f', number: 's' },
  { noun: 'table', det: 'la', gender: 'f', number: 's' },
  { noun: 'fleur', det: 'la', gender: 'f', number: 's' },
  { noun: 'reine', det: 'la', gender: 'f', number: 's' },
  { noun: 'princesse', det: 'la', gender: 'f', number: 's' },
  { noun: 'école', det: "l'", gender: 'f', number: 's' },
  { noun: 'étoile', det: "l'", gender: 'f', number: 's' },
  // Masculine singular
  { noun: 'fort', det: 'le', gender: 'm', number: 's' },
  { noun: 'château', det: 'le', gender: 'm', number: 's' },
  { noun: 'jardin', det: 'le', gender: 'm', number: 's' },
  { noun: 'chevalier', det: 'le', gender: 'm', number: 's' },
  { noun: 'roi', det: 'le', gender: 'm', number: 's' },
  { noun: 'livre', det: 'le', gender: 'm', number: 's' },
  { noun: 'hiver', det: "l'", gender: 'm', number: 's' },
  { noun: 'arbre', det: "l'", gender: 'm', number: 's' },
  { noun: 'oiseau', det: "l'", gender: 'm', number: 's' },
  // Feminine plural
  { noun: 'cheminées', det: 'les', gender: 'f', number: 'p' },
  { noun: 'fleurs', det: 'les', gender: 'f', number: 'p' },
  { noun: 'pommes', det: 'les', gender: 'f', number: 'p' },
  { noun: 'étoiles', det: 'les', gender: 'f', number: 'p' },
  // Masculine plural
  { noun: 'plaisirs', det: 'les', gender: 'm', number: 'p' },
  { noun: 'chevaliers', det: 'les', gender: 'm', number: 'p' },
  { noun: 'jardins', det: 'les', gender: 'm', number: 'p' },
  { noun: 'amis', det: 'les', gender: 'm', number: 'p' },
  // With un/une
  { noun: 'château', det: 'un', gender: 'm', number: 's' },
  { noun: 'jardin', det: 'un', gender: 'm', number: 's' },
  { noun: 'livre', det: 'un', gender: 'm', number: 's' },
  { noun: 'princesse', det: 'une', gender: 'f', number: 's' },
  { noun: 'maison', det: 'une', gender: 'f', number: 's' },
  { noun: 'fleur', det: 'une', gender: 'f', number: 's' },
  // With des
  { noun: 'flocons', det: 'des', gender: 'm', number: 'p' },
  { noun: 'billes', det: 'des', gender: 'f', number: 'p' },
  { noun: 'cailloux', det: 'des', gender: 'm', number: 'p' },
];

// Possessive determiners
const possessiveQuestions = [
  { sentence: '___ amis patinent sur le lac gelé.', correct: 'Nos', options: ['Ta', 'Mon', 'Nos'] },
  { sentence: '___ mère fait de la raquette.', correct: 'Mon', options: ['Ta', 'Mon', 'Nos'] },
  { sentence: '___ père boit un chocolat chaud.', correct: 'Mon', options: ['Ta', 'Mon', 'Nos'] },
  { sentence: '___ chat dort sur le sofa.', correct: 'Mon', options: ['Ta', 'Mon', 'Ses'] },
  { sentence: '___ amie joue dehors.', correct: 'Son', options: ['Son', 'Ses', 'Mon'] },
  { sentence: '___ livres sont sur la table.', correct: 'Ses', options: ['Son', 'Ses', 'Mon'] },
  { sentence: '___ soeur est gentille.', correct: 'Sa', options: ['Sa', 'Son', 'Ses'] },
  { sentence: '___ parents arrivent bientôt.', correct: 'Ses', options: ['Son', 'Sa', 'Ses'] },
];

// Sentence completion with du/des, son/ses
const sentenceQuestions = [
  { sentence: 'Tu fais ___ patin.', correct: 'du', options: ['du', 'des'] },
  { sentence: 'Shany apporte ___ skis.', correct: 'ses', options: ['son', 'ses'] },
  { sentence: 'Ryan mange ___ pommes.', correct: 'des', options: ['du', 'des'] },
  { sentence: 'Elle lit ___ livre.', correct: 'son', options: ['son', 'ses'] },
  { sentence: 'Nous avons ___ crayons.', correct: 'des', options: ['du', 'des'] },
  { sentence: 'Il prend ___ manteau.', correct: 'son', options: ['son', 'ses'] },
];

export function generateDeterminant() {
  const r = Math.random();

  if (r < 0.45) {
    // Basic determiner matching
    const item = nouns[Math.floor(Math.random() * nouns.length)];
    const allDets = ['le', 'la', "l'", 'les', 'un', 'une', 'des'];
    const options = new Set([item.det]);
    while (options.size < 4) {
      const fake = allDets[Math.floor(Math.random() * allDets.length)];
      if (fake !== item.det) options.add(fake);
    }
    return {
      category: 'determinant',
      type: 'determinant',
      text: `Quel déterminant va avec "${item.noun}"?`,
      correct: item.det,
      options: shuffle([...options]),
      explanation: `${item.noun} est ${item.gender === 'f' ? 'féminin' : 'masculin'} ${item.number === 's' ? 'singulier' : 'pluriel'} → ${item.det} ${item.noun}`,
    };
  }

  if (r < 0.75) {
    // Possessive determiners
    const q = possessiveQuestions[Math.floor(Math.random() * possessiveQuestions.length)];
    return {
      category: 'determinant',
      type: 'possessif',
      text: q.sentence.replace('___', '?'),
      correct: q.correct,
      options: shuffle([...new Set(q.options)].slice(0, 4).length >= 3 ? [...new Set(q.options)] : [...new Set(q.options), 'Leur']),
      explanation: `La bonne réponse est: ${q.correct} ${q.sentence.replace('___', '').trim()}`,
    };
  }

  // Sentence completion
  const q = sentenceQuestions[Math.floor(Math.random() * sentenceQuestions.length)];
  return {
    category: 'determinant',
    type: 'determinant_phrase',
    text: q.sentence.replace('___', '?'),
    correct: q.correct,
    options: shuffle([...q.options, ...['le', 'la'].filter(o => !q.options.includes(o))].slice(0, 4)),
    explanation: `La bonne réponse est: ${q.sentence.replace('___', q.correct)}`,
  };
}
