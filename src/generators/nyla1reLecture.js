// Nyla — Je me prépare pour la 1re année: les mots fréquents et lire une phrase
//
// Ce n'est pas au programme de la maternelle 5 ans, c'est le pont juste après.
// On le garde à part dans le menu pour que ce soit clair: c'est du bonus, pas
// ce qu'on attend d'elle cette année.
//
//   • Les mots fréquents (« le », « dans », « c'est »): on ne les décode pas,
//     on les reconnaît d'un coup d'œil. C'est ce qui débloque la lecture.
//   • Lire une phrase courte, puis montrer l'image qui va avec — la première
//     vraie compréhension de lecture.
import { pickAdaptive } from '../utils/skillStats';
import { motsFrequents, motsFrequentsTous, phrasesLecture } from '../data/nyla1reAnnee';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// 1. Le mot qu'on entend — elle écoute, puis montre le mot écrit.
function buildEcouteLeMot() {
  const serie = pick(motsFrequents);
  const bon = pick(serie.mots);
  // Les distracteurs viennent de la MÊME série: des petits mots qui se
  // ressemblent. Sinon la forme du mot suffit à répondre.
  const autres = shuffle(serie.mots.filter((m) => m !== bon)).slice(0, 3);
  if (autres.length < 3) return null;
  return {
    category: 'nyla_1re_lecture',
    type: 'ecoute_mot',
    text: `Touche le mot « ${bon} ».`,
    correct: bon,
    options: shuffle([bon, ...autres]),
    explanation: `C'est « ${bon} ». Ces petits mots-là, on les apprend par cœur.`,
    hint: 'Regarde la forme du mot: sa longueur, ses lettres.',
    spokenWord: bon,
  };
}

// 2. Le mot qui manque dans la phrase.
const PHRASES_TROU = [
  { avant: 'Le chat dort', mot: 'sur', apres: 'le lit.', icon: '🐱' },
  { avant: 'Je joue', mot: 'avec', apres: 'mon ami.', icon: '🧒' },
  { avant: 'La pomme est', mot: 'dans', apres: 'le sac.', icon: '🍎' },
  { avant: 'Papa', mot: 'est', apres: 'à la maison.', icon: '👨' },
  { avant: 'Voici', mot: 'mon', apres: 'chien.', icon: '🐶' },
  { avant: 'Le ballon est', mot: 'sous', apres: 'la table.', icon: '⚽' },
  { avant: 'Maman', mot: 'et', apres: 'moi, on marche.', icon: '👩' },
  { avant: 'C’est', mot: 'pour', apres: 'toi!', icon: '🎁' },
  { avant: 'Regarde', mot: 'les', apres: 'oiseaux.', icon: '🐦' },
  { avant: 'Nyla a', mot: 'une', apres: 'fleur.', icon: '🌸' },
];

function buildMotManquant() {
  const p = pick(PHRASES_TROU);
  const autres = shuffle([...new Set(motsFrequentsTous)].filter((m) => m !== p.mot && m.length <= 5)).slice(0, 3);
  if (autres.length < 3) return null;
  return {
    category: 'nyla_1re_lecture',
    type: 'mot_manquant',
    text: `Quel petit mot manque?\n\n${p.icon} ${p.avant} ____ ${p.apres}`,
    correct: p.mot,
    options: shuffle([p.mot, ...autres]),
    explanation: `${p.avant} ${p.mot} ${p.apres}`,
    hint: 'Lis la phrase tout haut en essayant chaque mot. Lequel sonne bien?',
    spokenWord: `${p.avant} ... ${p.apres}`,
  };
}

// 3. Lire une phrase, puis montrer l'image.
function buildPhraseVersImage() {
  const p = pick(phrasesLecture);
  return {
    category: 'nyla_1re_lecture',
    type: 'phrase_image',
    text: `Lis la phrase, puis touche la bonne image.\n\n${p.phrase}`,
    correct: p.icon,
    options: shuffle([p.icon, ...p.pieges]),
    explanation: `« ${p.phrase} » → ${p.icon}`,
    hint: 'Lis la phrase mot par mot, sans te presser.',
    spokenWord: p.phrase,
  };
}

export function generateNyla1reLecture() {
  return pickAdaptive('nyla_1re_lecture', [
    { type: 'ecoute_mot', w: 3, build: buildEcouteLeMot },
    { type: 'mot_manquant', w: 2.5, build: buildMotManquant },
    { type: 'phrase_image', w: 3, build: buildPhraseVersImage },
  ], (q) => `${q.type}|${q.text}|${q.correct}`);
}
