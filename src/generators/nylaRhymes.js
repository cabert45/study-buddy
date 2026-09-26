// Nyla — Les rimes et les sons (maternelle 5 ans)
//
// ⚠️ Deux problèmes corrigés dans cette réécriture:
//
// 1. Des rimes fausses. L'ancienne liste mettait « tapis » avec chat/rat/plat
//    et « ours » avec tour/four/jour. Ça ne rime pas — l'app apprenait donc
//    quelque chose de faux. Chaque famille est maintenant vérifiée sur le SON
//    final, pas sur les lettres.
// 2. Toujours les mêmes questions. La clé anti-répétition ne retenait que le
//    mot de départ: ~44 questions possibles en tout, et la même revenait 4
//    fois sur 60 tirages. Plus de familles, trois formats, et la clé tient
//    maintenant compte de la bonne réponse.
//
// Chaque mot porte son image: elle ne lit pas encore, alors les choix de
// réponse s'affichent « 🐱 chat » — elle reconnaît le dessin, dit le mot tout
// haut, et écoute si ça rime.
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

// Familles de rimes — regroupées par SON final entendu.
const rhymeFamilies = [
  { son: '[a]', mots: [{ m: 'chat', i: '🐱' }, { m: 'rat', i: '🐀' }, { m: 'chocolat', i: '🍫' }, { m: 'lilas', i: '🌸' }] },
  { son: '[o]', mots: [{ m: 'bateau', i: '⛵' }, { m: 'gâteau', i: '🍰' }, { m: 'chapeau', i: '🎩' }, { m: 'manteau', i: '🧥' }, { m: 'cadeau', i: '🎁' }, { m: 'vélo', i: '🚲' }] },
  { son: '[on]', mots: [{ m: 'ballon', i: '⚽' }, { m: 'maison', i: '🏠' }, { m: 'poisson', i: '🐟' }, { m: 'cochon', i: '🐷' }, { m: 'bonbon', i: '🍬' }, { m: 'mouton', i: '🐑' }] },
  { son: '[in]', mots: [{ m: 'lapin', i: '🐰' }, { m: 'sapin', i: '🌲' }, { m: 'jardin', i: '🌷' }, { m: 'main', i: '✋' }, { m: 'pain', i: '🍞' }, { m: 'train', i: '🚂' }] },
  { son: '[ine]', mots: [{ m: 'copine', i: '👭' }, { m: 'cuisine', i: '🍳' }, { m: 'machine', i: '🧺' }, { m: 'racine', i: '🌱' }] },
  { son: '[our]', mots: [{ m: 'tour', i: '🗼' }, { m: 'four', i: '🔥' }, { m: 'jour', i: '🌞' }, { m: 'amour', i: '❤️' }, { m: 'tambour', i: '🥁' }] },
  { son: '[ille]', mots: [{ m: 'fille', i: '👧' }, { m: 'famille', i: '👨‍👩‍👧' }, { m: 'chenille', i: '🐛' }, { m: 'coquille', i: '🐚' }, { m: 'quille', i: '🎳' }] },
  { son: '[é]', mots: [{ m: 'fée', i: '🧚' }, { m: 'thé', i: '🍵' }, { m: 'café', i: '☕' }, { m: 'bébé', i: '👶' }, { m: 'épée', i: '🗡️' }, { m: 'nez', i: '👃' }] },
  { son: '[ou]', mots: [{ m: 'hibou', i: '🦉' }, { m: 'genou', i: '🦵' }, { m: 'chou', i: '🥬' }, { m: 'loup', i: '🐺' }, { m: 'bijou', i: '💍' }] },
  { son: '[an]', mots: [{ m: 'maman', i: '👩' }, { m: 'enfant', i: '🧒' }, { m: 'éléphant', i: '🐘' }, { m: 'gant', i: '🧤' }, { m: 'dent', i: '🦷' }] },
  { son: '[ar]', mots: [{ m: 'canard', i: '🦆' }, { m: 'renard', i: '🦊' }, { m: 'foulard', i: '🧣' }, { m: 'guitare', i: '🎸' }] },
  { son: '[i]', mots: [{ m: 'souris', i: '🐭' }, { m: 'tapis', i: '🧶' }, { m: 'lit', i: '🛏️' }, { m: 'nid', i: '🪹' }, { m: 'fourmi', i: '🐜' }, { m: 'midi', i: '🕛' }] },
  { son: '[ur]', mots: [{ m: 'voiture', i: '🚗' }, { m: 'confiture', i: '🍯' }, { m: 'peinture', i: '🎨' }, { m: 'nature', i: '🌳' }] },
  { son: '[el]', mots: [{ m: 'soleil', i: '☀️' }, { m: 'abeille', i: '🐝' }, { m: 'bouteille', i: '🍾' }, { m: 'oreille', i: '👂' }] },
  { son: '[om]', mots: [{ m: 'pomme', i: '🍎' }, { m: 'homme', i: '👨' }, { m: 'gomme', i: '🧽' }] },
  { son: '[ache]', mots: [{ m: 'vache', i: '🐮' }, { m: 'tache', i: '🎨' }, { m: 'hache', i: '🪓' }, { m: 'moustache', i: '👨' }] },
];

// Familles par son de DÉBUT — pour l'allitération (« commence pareil »).
const debutFamilies = [
  { son: '[m]', mots: [{ m: 'maison', i: '🏠' }, { m: 'maman', i: '👩' }, { m: 'main', i: '✋' }, { m: 'mouton', i: '🐑' }, { m: 'moto', i: '🏍️' }] },
  { son: '[p]', mots: [{ m: 'papa', i: '👨' }, { m: 'pomme', i: '🍎' }, { m: 'poule', i: '🐔' }, { m: 'pizza', i: '🍕' }, { m: 'porte', i: '🚪' }] },
  { son: '[l]', mots: [{ m: 'lune', i: '🌙' }, { m: 'lapin', i: '🐰' }, { m: 'lion', i: '🦁' }, { m: 'lit', i: '🛏️' }, { m: 'livre', i: '📖' }] },
  { son: '[s]', mots: [{ m: 'soleil', i: '☀️' }, { m: 'souris', i: '🐭' }, { m: 'sac', i: '🎒' }, { m: 'sapin', i: '🌲' }] },
  { son: '[b]', mots: [{ m: 'bateau', i: '⛵' }, { m: 'bébé', i: '👶' }, { m: 'ballon', i: '⚽' }, { m: 'banane', i: '🍌' }] },
  { son: '[ch]', mots: [{ m: 'chat', i: '🐱' }, { m: 'chien', i: '🐶' }, { m: 'cheval', i: '🐴' }, { m: 'chapeau', i: '🎩' }] },
  { son: '[t]', mots: [{ m: 'tortue', i: '🐢' }, { m: 'tomate', i: '🍅' }, { m: 'table', i: '🪑' }, { m: 'train', i: '🚂' }] },
  { son: '[f]', mots: [{ m: 'fleur', i: '🌸' }, { m: 'feu', i: '🔥' }, { m: 'fille', i: '👧' }, { m: 'fourmi', i: '🐜' }] },
  { son: '[v]', mots: [{ m: 'vache', i: '🐮' }, { m: 'vélo', i: '🚲' }, { m: 'voiture', i: '🚗' }, { m: 'valise', i: '🧳' }] },
  { son: '[r]', mots: [{ m: 'robot', i: '🤖' }, { m: 'renard', i: '🦊' }, { m: 'rat', i: '🐀' }, { m: 'route', i: '🛣️' }] },
];

const etiquette = (w) => `${w.i} ${w.m}`;

// 1. Quel mot RIME avec celui-ci?
function buildRime() {
  const famille = pick(rhymeFamilies);
  const [cible, bon] = shuffle([...famille.mots]);
  const autres = shuffle(rhymeFamilies.filter((f) => f.son !== famille.son))
    .slice(0, 3)
    .map((f) => pick(f.mots));
  if (autres.length < 3) return null;
  return {
    category: 'nyla_rhymes',
    type: 'rime',
    text: `Quel mot RIME avec « ${cible.m} »?\n\n${cible.i}`,
    correct: etiquette(bon),
    options: shuffle([etiquette(bon), ...autres.map(etiquette)]),
    explanation: `« ${cible.m} » et « ${bon.m} » finissent par le même son ${famille.son}.`,
    hint: 'Dis chaque mot tout fort. Écoute seulement la FIN du mot.',
    spokenWord: cible.m,
  };
}

// 2. Lequel NE rime PAS avec les autres?
function buildIntrusRime() {
  const famille = pick(rhymeFamilies.filter((f) => f.mots.length >= 3));
  const memes = shuffle([...famille.mots]).slice(0, 3);
  const autre = pick(shuffle(rhymeFamilies.filter((f) => f.son !== famille.son)).map((f) => pick(f.mots)));
  return {
    category: 'nyla_rhymes',
    type: 'intrus_rime',
    text: `Trois mots riment ensemble. Lequel NE rime PAS?`,
    correct: etiquette(autre),
    options: shuffle([etiquette(autre), ...memes.map(etiquette)]),
    explanation: `${memes.map((w) => w.m).join(', ')} finissent tous par ${famille.son}. Mais « ${autre.m} », non.`,
    hint: 'Dis les quatre mots tout haut, un après l\'autre. Trois sonnent pareil à la fin.',
  };
}

// 3. Quel mot COMMENCE par le même son?
function buildDebut() {
  const famille = pick(debutFamilies);
  const [cible, bon] = shuffle([...famille.mots]);
  const autres = shuffle(debutFamilies.filter((f) => f.son !== famille.son))
    .slice(0, 3)
    .map((f) => pick(f.mots));
  if (autres.length < 3) return null;
  return {
    category: 'nyla_rhymes',
    type: 'debut',
    text: `Quel mot COMMENCE par le même son que « ${cible.m} »?\n\n${cible.i}`,
    correct: etiquette(bon),
    options: shuffle([etiquette(bon), ...autres.map(etiquette)]),
    explanation: `« ${cible.m} » et « ${bon.m} » commencent tous les deux par le son ${famille.son}.`,
    hint: 'Écoute seulement le PREMIER son de chaque mot.',
    spokenWord: cible.m,
  };
}

function buildOne() {
  const r = Math.random();
  if (r < 0.45) return buildRime();
  if (r < 0.7) return buildIntrusRime();
  return buildDebut() || buildRime();
}

export function generateNylaRhymes() {
  return withFresh('nyla_rhymes', buildOne, 80, 25, (q) => `${q.type}|${q.text}|${q.correct}`);
}
