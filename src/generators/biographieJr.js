// Biographie — Jean Rostand
// CRITIQUE: Ryan échoue cette biographie. Il doit obtenir 90%+
// Facts from cahier vert (image captured 2026-05-09)
// Test pattern from past exams (Frédéric Back, Eddy Merckx):
//   pensée, mot-clé, personne, où né, profession, famille, œuvres

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// All the questions, each with correct answer + plausible distractors.
// Exported so the BiographieFlashcard component can reuse the same data.
export const biographieQuestions = [
  // ----- PENSÉE -----
  {
    id: 'pensee',
    text: 'Quelle est la PENSÉE de cette unité?',
    correct: 'On a besoin d\'un plus petit que soi',
    options: [
      'On a besoin d\'un plus petit que soi',
      'Rien ne sert de courir, il faut partir à point',
      'Tout flatteur vit aux dépens de celui qui l\'écoute',
      'Vous chantiez? Eh bien, dansez maintenant!',
    ],
    explanation: '« On a besoin d\'un plus petit que soi » — Jean de La Fontaine (du fable Le Lion et le Rat).',
  },
  {
    id: 'auteur_pensee',
    text: 'Qui a écrit la pensée « On a besoin d\'un plus petit que soi »?',
    correct: 'Jean de La Fontaine',
    options: [
      'Jean de La Fontaine',
      'Jean Rostand',
      'Edmond Rostand',
      'Frédéric Back',
    ],
    explanation: 'Jean de La Fontaine — célèbre auteur de fables (à ne pas confondre avec Jean Rostand!).',
  },
  // ----- MOT-CLÉ -----
  {
    id: 'mot_cle',
    text: 'Quel est le MOT-CLÉ de l\'unité?',
    correct: 'valeur',
    options: ['valeur', 'nature', 'amitié', 'courage'],
    explanation: 'Le mot-clé est « valeur ».',
  },
  // ----- PERSONNE -----
  {
    id: 'personne',
    text: 'Qui as-tu étudié dans cette biographie?',
    correct: 'Jean Rostand',
    options: ['Jean Rostand', 'Edmond Rostand', 'Frédéric Back', 'Jean de La Fontaine'],
    explanation: 'Jean Rostand — c\'est lui le sujet de la biographie.',
  },
  // ----- THÈME -----
  {
    id: 'theme',
    text: 'Quel est le THÈME de l\'unité?',
    correct: 'Les insectes, les fleurs',
    options: [
      'Les insectes, les fleurs',
      'L\'environnement',
      'Le monde des sports',
      'Les arts et la culture',
    ],
    explanation: 'Le thème est « Les insectes, les fleurs ».',
  },
  // ----- NÉ OÙ -----
  {
    id: 'ne_ou',
    text: 'Où est né Jean Rostand?',
    correct: 'À Paris',
    options: ['À Paris', 'À Lyon', 'À Marseille', 'En Allemagne'],
    explanation: 'Jean Rostand est né à Paris.',
  },
  // ----- PROFESSION -----
  {
    id: 'profession',
    text: 'Quel est le métier de Jean Rostand?',
    correct: 'Biologiste',
    options: ['Biologiste', 'Poète', 'Romancier', 'Peintre'],
    explanation: 'Jean Rostand est un BIOLOGISTE (un scientifique qui étudie les êtres vivants).',
  },
  // ----- PÈRE: NOM -----
  {
    id: 'pere_nom',
    text: 'Comment s\'appelle le père de Jean Rostand?',
    correct: 'Edmond Rostand',
    options: ['Edmond Rostand', 'Jean de La Fontaine', 'Jean Rostand', 'Frédéric Rostand'],
    explanation: 'Son père est Edmond Rostand, un poète célèbre.',
  },
  // ----- PÈRE: ŒUVRE -----
  {
    id: 'pere_oeuvre',
    text: 'Qu\'a écrit le père de Jean Rostand (Edmond Rostand)?',
    correct: 'Cyrano de Bergerac',
    options: ['Cyrano de Bergerac', 'Le Petit Prince', 'Les Misérables', 'La cigale et la fourmi'],
    explanation: 'Edmond Rostand est l\'auteur de la pièce célèbre « Cyrano de Bergerac ».',
  },
  // ----- PÈRE: MÉTIER -----
  {
    id: 'pere_metier',
    text: 'Quel était le métier du père de Jean Rostand?',
    correct: 'Poète',
    options: ['Poète', 'Biologiste', 'Médecin', 'Peintre'],
    explanation: 'Le père, Edmond Rostand, était poète (il a aussi écrit Cyrano de Bergerac).',
  },
  // ----- MÈRE -----
  {
    id: 'mere',
    text: 'Que faisait la MÈRE de Jean Rostand?',
    correct: 'Elle écrivait des poésies',
    options: [
      'Elle écrivait des poésies',
      'Elle était biologiste',
      'Elle était peintre',
      'Elle jouait au théâtre',
    ],
    explanation: 'Sa mère écrivait des poésies.',
  },
  // ----- FRÈRE -----
  {
    id: 'frere',
    text: 'Que faisait le FRÈRE de Jean Rostand?',
    correct: 'Poète et romancier',
    options: [
      'Poète et romancier',
      'Biologiste',
      'Médecin',
      'Acteur',
    ],
    explanation: 'Son frère était poète et romancier.',
  },
  // ----- AIMAIT QUOI -----
  {
    id: 'aimait',
    text: 'Qu\'est-ce que Jean Rostand aimait?',
    correct: 'Le calme de la nature',
    options: [
      'Le calme de la nature',
      'Les voyages en ville',
      'Le bruit des foules',
      'La danse et la musique',
    ],
    explanation: 'Jean Rostand aimait le calme de la nature.',
  },
  // ----- VIE CONSACRÉE À -----
  {
    id: 'vie',
    text: 'À quoi Jean Rostand a-t-il consacré sa vie?',
    correct: 'À la recherche, aux études et à l\'expérimentation',
    options: [
      'À la recherche, aux études et à l\'expérimentation',
      'À l\'écriture de poèmes',
      'À jouer au théâtre',
      'À voyager dans le monde',
    ],
    explanation: 'Sa vie fut consacrée à la recherche, aux études et à l\'expérimentation.',
  },
  // ----- TRICKY: distinguer les deux Jean -----
  {
    id: 'distinguer_jean',
    text: 'Qui est BIOLOGISTE: Jean Rostand ou Jean de La Fontaine?',
    correct: 'Jean Rostand',
    options: ['Jean Rostand', 'Jean de La Fontaine', 'Les deux', 'Aucun des deux'],
    explanation: 'Jean ROSTAND est le biologiste. Jean de La Fontaine est l\'auteur de fables.',
  },
  {
    id: 'distinguer_jean2',
    text: 'Qui a écrit « La cigale et la fourmi »?',
    correct: 'Jean de La Fontaine',
    options: ['Jean de La Fontaine', 'Jean Rostand', 'Edmond Rostand', 'Frédéric Back'],
    explanation: 'Jean de La FONTAINE a écrit les fables. Jean ROSTAND est le biologiste qu\'on étudie.',
  },
];

export function generateBiographieJr() {
  const q = pick(biographieQuestions);
  return {
    category: 'biographie_jr',
    type: 'biographie',
    text: q.text,
    correct: q.correct,
    options: shuffle([...q.options]),
    explanation: q.explanation,
    hint: 'Pense aux fiches de ton cahier vert. Sois précis!',
  };
}
