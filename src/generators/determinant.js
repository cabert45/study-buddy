import { fillOptions } from './options.js';
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
  { sentence: '___ mère fait de la raquette.', correct: 'Ma', options: ['Ma', 'Mon', 'Mes'] },
  { sentence: '___ père boit un chocolat chaud.', correct: 'Mon', options: ['Ta', 'Mon', 'Nos'] },
  { sentence: '___ chat dort sur le sofa.', correct: 'Mon', options: ['Ta', 'Mon', 'Ses'] },
  // « son amie » (et non « sa amie ») devant une voyelle — Mon serait aussi correct, donc pas dans les choix
  { sentence: '___ amie joue dehors.', correct: 'Son', options: ['Son', 'Sa', 'Ses'] },
  { sentence: '___ livres sont sur la table.', correct: 'Ses', options: ['Son', 'Ses', 'Mon'] },
  { sentence: '___ soeur est gentille.', correct: 'Sa', options: ['Sa', 'Son', 'Ses'] },
  { sentence: '___ parents arrivent bientôt.', correct: 'Ses', options: ['Son', 'Sa', 'Ses'] },
];

// Sentence completion with du/des, son/ses
const sentenceQuestions = [
  { sentence: 'Tu fais ___ patin.', correct: 'du', options: ['du', 'des', 'de la'] },
  { sentence: 'Shany apporte ___ skis.', correct: 'ses', options: ['son', 'sa', 'ses'] },
  { sentence: 'Ryan mange ___ pommes.', correct: 'des', options: ['du', 'une', 'des'] },
  { sentence: 'Elle lit ___ livre.', correct: 'son', options: ['son', 'sa', 'ses'] },
  { sentence: 'Nous avons ___ crayons.', correct: 'des', options: ['du', 'un', 'des'] },
  { sentence: 'Il prend ___ manteau.', correct: 'son', options: ['son', 'sa', 'ses'] },
];

// Commence par une voyelle ou un h muet → élision (l')
const commenceParVoyelle = (mot) => /^[aeiouyàâéèêëîïôûh]/i.test(mot);

// Tous les déterminants corrects pour ce nom (même genre, même nombre)
function determinantsValides({ noun, gender, number }) {
  if (number === 'p') return ['les', 'des'];
  const defini = commenceParVoyelle(noun) ? "l'" : gender === 'f' ? 'la' : 'le';
  return [defini, gender === 'f' ? 'une' : 'un'];
}

const avec = (det, noun) => (det === "l'" ? `l'${noun}` : `${det} ${noun}`);

export function generateDeterminant() {
  const r = Math.random();

  if (r < 0.45) {
    // Basic determiner matching.
    // Plusieurs déterminants sont corrects pour un même nom: « la princesse » ET
    // « une princesse », « le château » ET « un château », « les pommes » ET
    // « des pommes ». Avant, un seul était accepté et l'autre apparaissait comme
    // mauvais choix — Ryan se faisait compter faux avec le bon genre. On retire
    // donc des distracteurs toutes les formes valides: les mauvais choix sont
    // seulement ceux qui se trompent de genre, de nombre ou d'élision.
    const item = nouns[Math.floor(Math.random() * nouns.length)];
    const valides = determinantsValides(item);
    const allDets = ['le', 'la', "l'", 'les', 'un', 'une', 'des'];
    const options = new Set([item.det]);
    fillOptions(options, allDets.filter((d) => !valides.includes(d)));
    const autre = valides.find((d) => d !== item.det);
    const genre = `${item.gender === 'f' ? 'féminin' : 'masculin'} ${item.number === 's' ? 'singulier' : 'pluriel'}`;
    return {
      category: 'determinant',
      type: 'determinant',
      text: `Quel déterminant va avec "${item.noun}"?`,
      correct: item.det,
      options: shuffle([...options]),
      explanation: `${item.noun} est ${genre} → ${avec(item.det, item.noun)}`
        + (autre ? ` (on peut aussi dire ${avec(autre, item.noun)})` : ''),
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
    options: shuffle(q.options),
    explanation: `La bonne réponse est: ${q.sentence.replace('___', q.correct)}`,
  };
}
