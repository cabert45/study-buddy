// L'apostrophe generator — Friday May 8 test
// Rule: le/la → l' devant voyelle (a, e, i, o, u) ou h muet
// Also: je/me/te/se/ne/que → j'/m'/t'/s'/n'/qu' devant voyelle
// Pomélo p.25

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const startsWithVowelOrSilentH = (word) => {
  const w = word.toLowerCase();
  return /^[aeiouéèêëâàäîïôöûüh]/.test(w);
};

// Word lists
const masculineNouns = ['ami', 'arbre', 'oiseau', 'éléphant', 'hôpital', 'homme', 'enfant', 'autobus', 'orange', 'igloo', 'avion', 'écureuil', 'hôtel', 'oncle', 'ouvrier', 'âne', 'insecte', 'œuf'];
const feminineNouns = ['école', 'amie', 'image', 'arme', 'oreille', 'heure', 'histoire', 'éponge', 'idée', 'odeur', 'eau', 'hirondelle', 'aiguille', 'auto', 'enveloppe'];
const masculineConsonant = ['chien', 'livre', 'crayon', 'chevalier', 'roi', 'jardin', 'bus', 'château', 'sac', 'lit', 'pied', 'nez', 'visage', 'soulier'];
const feminineConsonant = ['chaise', 'table', 'pomme', 'fleur', 'maison', 'porte', 'fenêtre', 'chambre', 'voiture', 'bouche', 'jambe', 'main', 'mère', 'sœur'];

// Verbs starting with vowel
const vowelVerbs = ['ai', 'aime', 'aimes', 'écoute', 'écoutes', 'arrive', 'arrives', 'entend', 'entends', 'observe', 'observes', 'apprends', 'apprend', 'invite', 'invites', 'oublie', 'oublies'];
const consonantVerbs = ['mange', 'manges', 'parle', 'parles', 'cours', 'court', 'sais', 'sait', 'fais', 'fait'];

function generateLeLaQuestion() {
  // Mix of all noun types
  const allNouns = [
    ...masculineNouns.map(n => ({ noun: n, det: "l'", baseDet: 'le' })),
    ...feminineNouns.map(n => ({ noun: n, det: "l'", baseDet: 'la' })),
    ...masculineConsonant.map(n => ({ noun: n, det: 'le' })),
    ...feminineConsonant.map(n => ({ noun: n, det: 'la' })),
  ];
  const item = allNouns[Math.floor(Math.random() * allNouns.length)];

  return {
    category: 'apostrophe',
    type: 'le_la',
    text: `Quel déterminant va avec "${item.noun}"?`,
    correct: item.det,
    options: shuffle(["l'", 'le', 'la', 'les']),
    explanation: item.det === "l'"
      ? `${item.noun} commence par une voyelle (ou h muet) → on utilise l' (apostrophe)`
      : `${item.noun} commence par une consonne → on garde ${item.det}`,
  };
}

function generatePronounQuestion() {
  // je/j', me/m', te/t', se/s', ne/n', que/qu'
  const pronouns = [
    { full: 'je', short: "j'", verb: 'aime' },
    { full: 'je', short: "j'", verb: 'écoute' },
    { full: 'je', short: "j'", verb: 'arrive' },
    { full: 'je', short: "j'", verb: 'observe' },
    { full: 'je', short: 'je', verb: 'mange' },
    { full: 'je', short: 'je', verb: 'parle' },
    { full: 'me', short: "m'", verb: 'appelle' },
    { full: 'me', short: "m'", verb: 'amuse' },
    { full: 'me', short: 'me', verb: 'parle' },
    { full: 'te', short: "t'", verb: 'aime' },
    { full: 'te', short: "t'", verb: 'invite' },
    { full: 'te', short: 'te', verb: 'donne' },
    { full: 'se', short: "s'", verb: 'amuse' },
    { full: 'se', short: "s'", verb: 'arrête' },
    { full: 'se', short: 'se', verb: 'lave' },
    { full: 'ne', short: "n'", verb: 'aime' },
    { full: 'ne', short: "n'", verb: 'écoute' },
    { full: 'ne', short: 'ne', verb: 'parle' },
    { full: 'que', short: "qu'", verb: 'il' },
    { full: 'que', short: "qu'", verb: 'elle' },
    { full: 'que', short: 'que', verb: 'tu' },
  ];
  const p = pronouns[Math.floor(Math.random() * pronouns.length)];
  const useApos = startsWithVowelOrSilentH(p.verb);
  const correct = useApos ? p.short : p.full;
  const wrong = useApos ? p.full : p.short;

  return {
    category: 'apostrophe',
    type: 'pronoun',
    text: `Choisis: "___ ${p.verb}"`,
    correct,
    options: shuffle([correct, wrong, p.full, p.short].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4)),
    explanation: useApos
      ? `"${p.verb}" commence par une voyelle → on met l'apostrophe: ${correct} ${p.verb}`
      : `"${p.verb}" commence par une consonne → pas d'apostrophe: ${correct} ${p.verb}`,
  };
}

function generateSentenceQuestion() {
  // Pick a missing word in a sentence
  const sentences = [
    { sentence: '___ avion vole haut', correct: "L'", options: ['Le', "L'", 'La'] },
    { sentence: '___ pomme est rouge', correct: 'La', options: ['Le', 'La', "L'"] },
    { sentence: '___ enfant joue', correct: "L'", options: ['Le', 'La', "L'"] },
    { sentence: '___ chien aboie', correct: 'Le', options: ['Le', "L'", 'La'] },
    { sentence: 'Je ___ aime beaucoup', correct: "t'", options: ['te', "t'", "j'"] },
    { sentence: 'Tu ___ amuses bien', correct: "t'", options: ['te', "t'", 'tu'] },
    { sentence: 'Elle ___ écoute attentivement', correct: "n'", options: ['ne', "n'", 'pas'] },
    { sentence: 'Je ___ mange une pomme', correct: 'me', options: ['me', "m'", "j'"] },
    { sentence: '___ école est fermée', correct: "L'", options: ['Le', 'La', "L'"] },
    { sentence: '___ heure du dîner', correct: "L'", options: ['Le', 'La', "L'"] },
  ];
  const q = sentences[Math.floor(Math.random() * sentences.length)];
  return {
    category: 'apostrophe',
    type: 'sentence',
    text: `Complète: "${q.sentence}"`,
    correct: q.correct,
    options: shuffle(q.options),
    explanation: `La bonne réponse est: ${q.sentence.replace('___', q.correct)}`,
  };
}

export function generateApostrophe() {
  const r = Math.random();
  if (r < 0.45) return generateLeLaQuestion();
  if (r < 0.80) return generatePronounQuestion();
  return generateSentenceQuestion();
}
