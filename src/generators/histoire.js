// Parties d'une histoire — Ryan 2e année (Pomélo p.13)
// Rédaction prep (May 27 exam): structure of a story = début, milieu, fin
// + élément déclencheur, personnages, lieu, temps
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

// ===== Type 1: Identify which part =====
const partItems = [
  { sentence: 'Il était une fois une petite fille qui s\'appelait Léa.', part: 'début (situation initiale)', why: 'On présente le personnage et la situation de départ.' },
  { sentence: 'Soudain, un loup apparaît dans la forêt!', part: 'élément déclencheur', why: 'Un événement surprenant change tout — ça commence le problème.' },
  { sentence: 'Léa court vite et grimpe dans un arbre pour se cacher.', part: 'milieu (les actions)', why: 'Le personnage essaie de résoudre le problème.' },
  { sentence: 'Finalement, le loup s\'en va et Léa rentre chez elle.', part: 'fin (situation finale)', why: 'Le problème est résolu, l\'histoire se termine.' },
  { sentence: 'C\'était la fin d\'une grande aventure. Léa était fière d\'elle.', part: 'fin (situation finale)', why: 'L\'histoire se conclut.' },
  { sentence: 'Un jour, Tom trouva une carte au trésor sous son lit.', part: 'élément déclencheur', why: 'Quelque chose d\'inattendu lance l\'aventure.' },
  { sentence: 'Dans un petit village, vivait un garçon nommé Max.', part: 'début (situation initiale)', why: 'On présente le lieu et le personnage.' },
  { sentence: 'Max et son chien Patou cherchaient le trésor partout dans la maison.', part: 'milieu (les actions)', why: 'Les actions principales se déroulent.' },
  { sentence: 'À la fin, ils découvrirent un coffre rempli de pièces dorées.', part: 'fin (situation finale)', why: 'La quête est complète.' },
  { sentence: 'Lily habitait dans une grande maison près de la mer.', part: 'début (situation initiale)', why: 'Présentation du personnage et du lieu.' },
];

function generatePart() {
  const item = pick(partItems);
  const allParts = ['début (situation initiale)', 'élément déclencheur', 'milieu (les actions)', 'fin (situation finale)'];
  const distractors = allParts.filter((p) => p !== item.part);
  const options = shuffle([item.part, ...distractors]);
  return {
    category: 'histoire',
    type: 'identify_part',
    text: `À quelle PARTIE de l'histoire appartient cette phrase?\n\n« ${item.sentence} »`,
    correct: item.part,
    options,
    explanation: `${item.part} — ${item.why}`,
    hint: 'Début = présentation. Déclencheur = un événement surprenant. Milieu = les actions. Fin = la résolution.',
  };
}

// ===== Type 2: Order of events =====
function generateOrder() {
  // Pre-made mini-stories
  const stories = [
    {
      title: 'L\'histoire du chaton perdu',
      ordered: [
        'Un petit chaton vivait avec sa famille dans une maison.',
        'Un jour, il sortit par la fenêtre et se perdit dans le quartier.',
        'Il chercha partout et finit par trouver le chemin du retour.',
        'Le chaton retrouva sa famille et fut très heureux.',
      ],
    },
    {
      title: 'L\'histoire du gâteau',
      ordered: [
        'Maman préparait un gâteau pour la fête.',
        'Tout à coup, le chien sauta sur la table!',
        'Maman attrapa le chien juste à temps avant qu\'il ne mange tout.',
        'Le gâteau fut sauvé et tout le monde le mangea ensemble.',
      ],
    },
    {
      title: 'L\'histoire du parc',
      ordered: [
        'Léo jouait dans le parc avec son ami.',
        'Soudain, il commença à pleuvoir très fort!',
        'Les deux amis coururent vers la cabane pour s\'abriter.',
        'La pluie s\'arrêta et ils purent rentrer chez eux.',
      ],
    },
  ];
  const story = pick(stories);
  // Pick two random positions and ask which comes first
  const i = Math.floor(Math.random() * 4);
  let j = Math.floor(Math.random() * 4);
  while (j === i) j = Math.floor(Math.random() * 4);
  const first = i < j ? story.ordered[i] : story.ordered[j];
  const second = i < j ? story.ordered[j] : story.ordered[i];
  const options = shuffle([
    `« ${first} » d'abord, puis « ${second} »`,
    `« ${second} » d'abord, puis « ${first} »`,
    'Les deux phrases ne vont pas ensemble',
    'L\'ordre n\'a pas d\'importance',
  ]);
  return {
    category: 'histoire',
    type: 'order',
    text: `Dans « ${story.title} », quelle phrase vient EN PREMIER?\n\nA) « ${first} »\nB) « ${second} »`,
    correct: `« ${first} » d'abord, puis « ${second} »`,
    options,
    explanation: `L'ordre est: début → déclencheur → milieu → fin. La phrase qui présente la situation initiale vient avant celle qui montre une action ou la fin.`,
    hint: 'Une histoire suit l\'ordre: début → milieu → fin.',
  };
}

// ===== Type 3: Vocabulary =====
const vocabItems = [
  { def: 'C\'est la personne principale dans l\'histoire.', correct: 'personnage' },
  { def: 'C\'est l\'endroit où se passe l\'histoire (ex: la forêt, la maison).', correct: 'lieu' },
  { def: 'C\'est le moment où se passe l\'histoire (ex: le matin, l\'hiver).', correct: 'temps' },
  { def: 'C\'est un événement surprenant qui change tout au début.', correct: 'élément déclencheur' },
  { def: 'C\'est la première partie qui présente le personnage et la situation.', correct: 'début (situation initiale)' },
  { def: 'C\'est la dernière partie qui montre comment ça finit.', correct: 'fin (situation finale)' },
];

function generateVocab() {
  const item = pick(vocabItems);
  const allAnswers = ['personnage', 'lieu', 'temps', 'élément déclencheur', 'début (situation initiale)', 'fin (situation finale)', 'milieu (les actions)'];
  const distractors = allAnswers.filter((a) => a !== item.correct).slice(0, 3);
  const options = shuffle([item.correct, ...distractors]);
  return {
    category: 'histoire',
    type: 'vocab',
    text: `« ${item.def} » Qu'est-ce que c'est?`,
    correct: item.correct,
    options,
    explanation: `${item.correct} — ${item.def}`,
    hint: 'Pense aux mots qu\'on utilise pour décrire une histoire.',
  };
}

function buildOne() {
  const r = Math.random();
  if (r < 0.50) return generatePart();
  if (r < 0.80) return generateVocab();
  return generateOrder();
}

export function generateHistoire() {
  return withFresh('histoire', buildOne, 80, 25, (q) => `${q.type}|${q.text}`);
}
