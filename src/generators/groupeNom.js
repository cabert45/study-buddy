// Groupe du nom (GN) generator
// Ryan scored 9.5/17 — "À pratiquer!!"
// Identify GN structure: nom seul, dét+nom, dét+nom+adj

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// GN examples with their structure type
const gnExamples = [
  // Nom seul (proper nouns)
  { gn: 'Pomélo', type: 'nom_seul', explanation: 'Pomélo est un nom propre → nom seul' },
  { gn: 'Léonard', type: 'nom_seul', explanation: 'Léonard est un nom propre → nom seul' },
  { gn: 'Ryan', type: 'nom_seul', explanation: 'Ryan est un nom propre → nom seul' },
  { gn: 'Montréal', type: 'nom_seul', explanation: 'Montréal est un nom propre → nom seul' },
  { gn: 'Nougat', type: 'nom_seul', explanation: 'Nougat est un nom propre → nom seul' },

  // Dét + nom
  { gn: 'des lucioles', type: 'det_nom', explanation: 'des (déterminant) + lucioles (nom) → dét + nom' },
  { gn: 'la mésange', type: 'det_nom', explanation: 'la (déterminant) + mésange (nom) → dét + nom' },
  { gn: "l'abeille", type: 'det_nom', explanation: "l' (déterminant) + abeille (nom) → dét + nom" },
  { gn: 'le château', type: 'det_nom', explanation: 'le (déterminant) + château (nom) → dét + nom' },
  { gn: 'une fourmi', type: 'det_nom', explanation: 'une (déterminant) + fourmi (nom) → dét + nom' },
  { gn: 'les oiseaux', type: 'det_nom', explanation: 'les (déterminant) + oiseaux (nom) → dét + nom' },
  { gn: 'mon livre', type: 'det_nom', explanation: 'mon (déterminant) + livre (nom) → dét + nom' },
  { gn: 'ses amis', type: 'det_nom', explanation: 'ses (déterminant) + amis (nom) → dét + nom' },

  // Dét + nom + adj (or dét + adj + nom)
  { gn: 'une tomate géante', type: 'det_nom_adj', explanation: 'une (dét) + tomate (nom) + géante (adj) → dét + nom + adj' },
  { gn: 'les étoiles filantes', type: 'det_nom_adj', explanation: 'les (dét) + étoiles (nom) + filantes (adj) → dét + nom + adj' },
  { gn: 'un grand chapeau', type: 'det_nom_adj', explanation: 'un (dét) + grand (adj) + chapeau (nom) → dét + adj + nom' },
  { gn: 'le précieux pollen', type: 'det_nom_adj', explanation: 'le (dét) + précieux (adj) + pollen (nom) → dét + adj + nom' },
  { gn: 'deux gros nids', type: 'det_nom_adj', explanation: 'deux (dét) + gros (adj) + nids (nom) → dét + adj + nom' },
  { gn: 'ma bicyclette neuve', type: 'det_nom_adj', explanation: 'ma (dét) + bicyclette (nom) + neuve (adj) → dét + nom + adj' },
  { gn: 'une belle journée', type: 'det_nom_adj', explanation: 'une (dét) + belle (adj) + journée (nom) → dét + adj + nom' },
  { gn: 'des petits cornichons', type: 'det_nom_adj', explanation: 'des (dét) + petits (adj) + cornichons (nom) → dét + adj + nom' },
];

const typeLabels = {
  nom_seul: 'Nom seul',
  det_nom: 'Dét. + nom',
  det_nom_adj: 'Dét. + nom + adj.',
};

// Sentences with GN to identify — what is the core noun (noyau)?
const noyauQuestions = [
  { sentence: 'Pomélo observe la mésange.', gn: 'la mésange', noyau: 'mésange' },
  { sentence: 'Les abeilles apportent le précieux pollen.', gn: 'le précieux pollen', noyau: 'pollen' },
  { sentence: 'Il y a deux gros nids dans l\'arbre.', gn: 'deux gros nids', noyau: 'nids' },
  { sentence: 'Le chevalier porte une grande épée.', gn: 'une grande épée', noyau: 'épée' },
  { sentence: 'Les petites fourmis travaillent fort.', gn: 'Les petites fourmis', noyau: 'fourmis' },
  { sentence: 'Mon meilleur ami habite à côté.', gn: 'Mon meilleur ami', noyau: 'ami' },
  { sentence: 'La jolie princesse danse au bal.', gn: 'La jolie princesse', noyau: 'princesse' },
  { sentence: 'Un vieux renard chasse dans la forêt.', gn: 'Un vieux renard', noyau: 'renard' },
];

// Det+adj agreement — pick the right determiner and adjective for a noun
const agreementQuestions = [
  { sentence: "J'adore observer ___ étoiles ___.", correct_det: 'les', correct_adj: 'filantes',
    det_options: ['le', 'les'], adj_options: ['filante', 'filantes'],
    answer: 'les étoiles filantes', gender: 'f', number: 'pl' },
  { sentence: 'Mirna porte ___ ___ chapeau.', correct_det: 'un', correct_adj: 'grand',
    det_options: ['un', 'une'], adj_options: ['grand', 'grande'],
    answer: 'un grand chapeau', gender: 'm', number: 's' },
  { sentence: 'Je me promène sur ___ bicyclette ___.', correct_det: 'ma', correct_adj: 'neuve',
    det_options: ['ma', 'mon'], adj_options: ['neuf', 'neuve'],
    answer: 'ma bicyclette neuve', gender: 'f', number: 's' },
  { sentence: 'Il regarde ___ ___ oiseaux.', correct_det: 'les', correct_adj: 'beaux',
    det_options: ['le', 'les'], adj_options: ['beau', 'beaux'],
    answer: 'les beaux oiseaux', gender: 'm', number: 'pl' },
];

export function generateGroupeNom() {
  const r = Math.random();

  if (r < 0.40) {
    // Classify GN by structure
    const gn = gnExamples[Math.floor(Math.random() * gnExamples.length)];
    const types = Object.keys(typeLabels);

    return {
      category: 'groupe_nom',
      type: 'classify_gn',
      text: `Quelle est la construction de "${gn.gn}"?`,
      correct: typeLabels[gn.type],
      options: shuffle(types.map(t => typeLabels[t])),
      explanation: gn.explanation,
    };
  }

  if (r < 0.70) {
    // Find the noyau (core noun) in a GN
    const q = noyauQuestions[Math.floor(Math.random() * noyauQuestions.length)];
    // Generate wrong options from other nouns
    const otherNouns = noyauQuestions
      .filter(n => n.noyau !== q.noyau)
      .map(n => n.noyau);
    const options = [q.noyau];
    while (options.length < 4 && otherNouns.length > 0) {
      const pick = otherNouns.splice(Math.floor(Math.random() * otherNouns.length), 1)[0];
      if (!options.includes(pick)) options.push(pick);
    }

    return {
      category: 'groupe_nom',
      type: 'find_noyau',
      text: `Quel est le noyau (nom principal) dans: "${q.gn}"?`,
      correct: q.noyau,
      options: shuffle(options),
      explanation: `Dans "${q.gn}", le nom principal est "${q.noyau}". Les autres mots l'accompagnent.`,
    };
  }

  // Agreement in GN — pick correct det+adj
  const q = agreementQuestions[Math.floor(Math.random() * agreementQuestions.length)];
  const correct = q.answer;
  const wrong1 = `${q.det_options.find(d => d !== q.correct_det) || q.correct_det} ${q.correct_adj}`;
  const wrong2 = `${q.correct_det} ${q.adj_options.find(a => a !== q.correct_adj) || q.correct_adj}`;
  const wrong3 = `${q.det_options.find(d => d !== q.correct_det) || q.correct_det} ${q.adj_options.find(a => a !== q.correct_adj) || q.correct_adj}`;

  const options = new Set([correct, wrong1, wrong2, wrong3]);

  return {
    category: 'groupe_nom',
    type: 'gn_agreement',
    text: `Complète: ${q.sentence}`,
    correct,
    options: shuffle([...options].slice(0, 4)),
    explanation: `Le nom est ${q.gender === 'f' ? 'féminin' : 'masculin'} ${q.number === 'pl' ? 'pluriel' : 'singulier'} → ${correct}`,
  };
}
