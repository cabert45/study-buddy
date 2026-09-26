// Nyla — 1re année (rentrée septembre 2026).
//
// Elle passe de la maternelle (reconnaître les lettres et quelques mots) à la
// 1re année: elle DÉCODE. Le programme du Québec en 1re année, c'est d'abord
// un son par semaine, la fusion des syllabes, les mots fréquents, puis lire
// une vraie phrase. Ce fichier est la matière; les générateurs s'en servent.
//
// L'ordre des sons suit la progression habituelle en 1re année (voyelles →
// consonnes continues → consonnes occlusives → sons complexes). Si son
// enseignante donne un autre ordre, il suffit de réordonner `sonsProgression`:
// rien d'autre ne dépend de l'ordre.

// ===== Le son de la semaine =====
// `graphemes` = toutes les façons d'écrire le son (o / au / eau).
// `mots` = mots qui contiennent le son, avec l'image pour qu'elle valide seule.
// `pieges` = mots qui NE contiennent PAS le son (distracteurs honnêtes).
export const sonsProgression = [
  {
    id: 'son_a', son: 'a', graphemes: ['a'], label: 'le son [a]',
    mots: [
      { mot: 'ami', icon: '🧒' }, { mot: 'chat', icon: '🐱' }, { mot: 'papa', icon: '👨' },
      { mot: 'sac', icon: '🎒' }, { mot: 'lama', icon: '🦙' }, { mot: 'banane', icon: '🍌' },
    ],
    pieges: ['lit', 'menu', 'vélo', 'loup'],
  },
  {
    id: 'son_i', son: 'i', graphemes: ['i', 'y'], label: 'le son [i]',
    mots: [
      { mot: 'lit', icon: '🛏️' }, { mot: 'ami', icon: '🧒' }, { mot: 'souris', icon: '🐭' },
      { mot: 'midi', icon: '🕛' }, { mot: 'nid', icon: '🪹' }, { mot: 'pizza', icon: '🍕' },
    ],
    pieges: ['chat', 'porte', 'lune', 'route'],
  },
  {
    id: 'son_o', son: 'o', graphemes: ['o', 'au', 'eau'], label: 'le son [o]',
    mots: [
      { mot: 'moto', icon: '🏍️' }, { mot: 'vélo', icon: '🚲' }, { mot: 'bateau', icon: '⛵' },
      { mot: 'chapeau', icon: '🎩' }, { mot: 'auto', icon: '🚗' }, { mot: 'gâteau', icon: '🍰' },
    ],
    pieges: ['lune', 'chat', 'souris', 'fille'],
  },
  {
    id: 'son_u', son: 'u', graphemes: ['u'], label: 'le son [u]',
    mots: [
      { mot: 'lune', icon: '🌙' }, { mot: 'jupe', icon: '👗' }, { mot: 'mur', icon: '🧱' },
      { mot: 'tortue', icon: '🐢' }, { mot: 'usine', icon: '🏭' }, { mot: 'plume', icon: '🪶' },
    ],
    pieges: ['moto', 'chat', 'nid', 'porte'],
  },
  {
    id: 'son_e_accent', son: 'é', graphemes: ['é', 'er', 'ez'], label: 'le son [é]',
    mots: [
      { mot: 'école', icon: '🏫' }, { mot: 'bébé', icon: '👶' }, { mot: 'vélo', icon: '🚲' },
      { mot: 'épée', icon: '🗡️' }, { mot: 'étoile', icon: '⭐' }, { mot: 'nez', icon: '👃' },
    ],
    pieges: ['lune', 'chat', 'souris', 'moto'],
  },
  {
    id: 'son_l', son: 'l', graphemes: ['l', 'll'], label: 'le son [l]',
    mots: [
      { mot: 'lune', icon: '🌙' }, { mot: 'lit', icon: '🛏️' }, { mot: 'lapin', icon: '🐰' },
      { mot: 'lion', icon: '🦁' }, { mot: 'école', icon: '🏫' }, { mot: 'salade', icon: '🥗' },
    ],
    pieges: ['chat', 'moto', 'sac', 'nid'],
  },
  {
    id: 'son_m', son: 'm', graphemes: ['m', 'mm'], label: 'le son [m]',
    mots: [
      { mot: 'maman', icon: '👩' }, { mot: 'maison', icon: '🏠' }, { mot: 'main', icon: '✋' },
      { mot: 'mouton', icon: '🐑' }, { mot: 'pomme', icon: '🍎' }, { mot: 'midi', icon: '🕛' },
    ],
    pieges: ['chat', 'lit', 'vélo', 'sac'],
  },
  {
    id: 'son_r', son: 'r', graphemes: ['r', 'rr'], label: 'le son [r]',
    mots: [
      { mot: 'robot', icon: '🤖' }, { mot: 'rat', icon: '🐀' }, { mot: 'renard', icon: '🦊' },
      { mot: 'route', icon: '🛣️' }, { mot: 'souris', icon: '🐭' }, { mot: 'carotte', icon: '🥕' },
    ],
    pieges: ['maison', 'lune', 'bébé', 'jupe'],
  },
  {
    id: 'son_s', son: 's', graphemes: ['s', 'ss', 'c', 'ç'], label: 'le son [s]',
    mots: [
      { mot: 'soleil', icon: '☀️' }, { mot: 'sac', icon: '🎒' }, { mot: 'souris', icon: '🐭' },
      { mot: 'poisson', icon: '🐟' }, { mot: 'ciseaux', icon: '✂️' }, { mot: 'sapin', icon: '🌲' },
    ],
    pieges: ['lune', 'maman', 'vélo', 'robot'],
  },
  {
    id: 'son_p', son: 'p', graphemes: ['p', 'pp'], label: 'le son [p]',
    mots: [
      { mot: 'papa', icon: '👨' }, { mot: 'pomme', icon: '🍎' }, { mot: 'pizza', icon: '🍕' },
      { mot: 'poule', icon: '🐔' }, { mot: 'porte', icon: '🚪' }, { mot: 'jupe', icon: '👗' },
    ],
    pieges: ['lune', 'chat', 'renard', 'école'],
  },
  {
    id: 'son_t', son: 't', graphemes: ['t', 'tt'], label: 'le son [t]',
    mots: [
      { mot: 'tortue', icon: '🐢' }, { mot: 'tomate', icon: '🍅' }, { mot: 'table', icon: '🪑' },
      { mot: 'auto', icon: '🚗' }, { mot: 'carotte', icon: '🥕' }, { mot: 'étoile', icon: '⭐' },
    ],
    pieges: ['maison', 'lune', 'sac', 'vélo'],
  },
  {
    id: 'son_f', son: 'f', graphemes: ['f', 'ff', 'ph'], label: 'le son [f]',
    mots: [
      { mot: 'fleur', icon: '🌸' }, { mot: 'feu', icon: '🔥' }, { mot: 'fille', icon: '👧' },
      { mot: 'girafe', icon: '🦒' }, { mot: 'fromage', icon: '🧀' }, { mot: 'éléphant', icon: '🐘' },
    ],
    pieges: ['lune', 'chat', 'robot', 'pomme'],
  },
  {
    id: 'son_v', son: 'v', graphemes: ['v'], label: 'le son [v]',
    mots: [
      { mot: 'vélo', icon: '🚲' }, { mot: 'vache', icon: '🐮' }, { mot: 'voiture', icon: '🚗' },
      { mot: 'avion', icon: '✈️' }, { mot: 'valise', icon: '🧳' }, { mot: 'livre', icon: '📖' },
    ],
    pieges: ['maison', 'chat', 'sac', 'pomme'],
  },
  {
    id: 'son_n', son: 'n', graphemes: ['n', 'nn'], label: 'le son [n]',
    mots: [
      { mot: 'nid', icon: '🪹' }, { mot: 'nuage', icon: '☁️' }, { mot: 'nez', icon: '👃' },
      { mot: 'banane', icon: '🍌' }, { mot: 'lune', icon: '🌙' }, { mot: 'animal', icon: '🐾' },
    ],
    pieges: ['chat', 'vélo', 'papa', 'sac'],
  },
  {
    id: 'son_d', son: 'd', graphemes: ['d'], label: 'le son [d]',
    mots: [
      { mot: 'dé', icon: '🎲' }, { mot: 'dauphin', icon: '🐬' }, { mot: 'douche', icon: '🚿' },
      { mot: 'salade', icon: '🥗' }, { mot: 'dinosaure', icon: '🦕' }, { mot: 'dent', icon: '🦷' },
    ],
    pieges: ['maison', 'lune', 'chat', 'pomme'],
  },
  {
    id: 'son_b', son: 'b', graphemes: ['b'], label: 'le son [b]',
    mots: [
      { mot: 'bébé', icon: '👶' }, { mot: 'ballon', icon: '⚽' }, { mot: 'bateau', icon: '⛵' },
      { mot: 'banane', icon: '🍌' }, { mot: 'robot', icon: '🤖' }, { mot: 'bol', icon: '🥣' },
    ],
    pieges: ['lune', 'chat', 'école', 'nid'],
  },
  {
    id: 'son_ch', son: 'ch', graphemes: ['ch'], label: 'le son [ch]',
    mots: [
      { mot: 'chat', icon: '🐱' }, { mot: 'chien', icon: '🐶' }, { mot: 'cheval', icon: '🐴' },
      { mot: 'chapeau', icon: '🎩' }, { mot: 'vache', icon: '🐮' }, { mot: 'douche', icon: '🚿' },
    ],
    pieges: ['lune', 'sac', 'vélo', 'pomme'],
  },
  {
    id: 'son_ou', son: 'ou', graphemes: ['ou'], label: 'le son [ou]',
    mots: [
      { mot: 'loup', icon: '🐺' }, { mot: 'souris', icon: '🐭' }, { mot: 'poule', icon: '🐔' },
      { mot: 'bouche', icon: '👄' }, { mot: 'mouton', icon: '🐑' }, { mot: 'route', icon: '🛣️' },
    ],
    pieges: ['lune', 'chat', 'vélo', 'nid'],
  },
  {
    id: 'son_on', son: 'on', graphemes: ['on', 'om'], label: 'le son [on]',
    mots: [
      { mot: 'ballon', icon: '⚽' }, { mot: 'maison', icon: '🏠' }, { mot: 'mouton', icon: '🐑' },
      { mot: 'cochon', icon: '🐷' }, { mot: 'pont', icon: '🌉' }, { mot: 'bonbon', icon: '🍬' },
    ],
    pieges: ['chat', 'lune', 'vélo', 'souris'],
  },
  {
    id: 'son_an', son: 'an', graphemes: ['an', 'en', 'am', 'em'], label: 'le son [an]',
    mots: [
      { mot: 'maman', icon: '👩' }, { mot: 'dent', icon: '🦷' }, { mot: 'enfant', icon: '🧒' },
      { mot: 'éléphant', icon: '🐘' }, { mot: 'chanson', icon: '🎵' }, { mot: 'gant', icon: '🧤' },
    ],
    pieges: ['chat', 'lune', 'souris', 'vélo'],
  },
  {
    id: 'son_oi', son: 'oi', graphemes: ['oi'], label: 'le son [oi]',
    mots: [
      { mot: 'oiseau', icon: '🐦' }, { mot: 'étoile', icon: '⭐' }, { mot: 'poisson', icon: '🐟' },
      { mot: 'voiture', icon: '🚗' }, { mot: 'noix', icon: '🌰' }, { mot: 'boîte', icon: '📦' },
    ],
    pieges: ['chat', 'lune', 'pomme', 'mouton'],
  },
  {
    id: 'son_in', son: 'in', graphemes: ['in', 'ain', 'ein'], label: 'le son [in]',
    mots: [
      { mot: 'lapin', icon: '🐰' }, { mot: 'main', icon: '✋' }, { mot: 'sapin', icon: '🌲' },
      { mot: 'pain', icon: '🍞' }, { mot: 'train', icon: '🚂' }, { mot: 'jardin', icon: '🌷' },
    ],
    pieges: ['chat', 'lune', 'mouton', 'vélo'],
  },
  {
    id: 'son_eu', son: 'eu', graphemes: ['eu', 'œu'], label: 'le son [eu]',
    mots: [
      { mot: 'fleur', icon: '🌸' }, { mot: 'feu', icon: '🔥' }, { mot: 'cœur', icon: '❤️' },
      { mot: 'jeu', icon: '🎲' }, { mot: 'beurre', icon: '🧈' }, { mot: 'chevreuil', icon: '🦌' },
    ],
    pieges: ['chat', 'lune', 'maison', 'pomme'],
  },
  {
    id: 'son_gn', son: 'gn', graphemes: ['gn'], label: 'le son [gn]',
    mots: [
      { mot: 'montagne', icon: '⛰️' }, { mot: 'araignée', icon: '🕷️' }, { mot: 'champignon', icon: '🍄' },
      { mot: 'agneau', icon: '🐑' }, { mot: 'cygne', icon: '🦢' }, { mot: 'peigne', icon: '💇' },
    ],
    pieges: ['chat', 'lune', 'vélo', 'pomme'],
  },
];

export const sonsList = sonsProgression.map((s) => ({
  id: s.id,
  label: s.label,
  desc: s.mots.slice(0, 4).map((m) => m.mot).join(', ') + '…',
}));

export function sonById(id) {
  return sonsProgression.find((s) => s.id === id) || null;
}

// ===== Les mots fréquents (mots-étoiles) =====
// Ceux qu'on ne décode pas: on les reconnaît d'un coup d'œil. Cinq séries,
// dans l'ordre où on les voit en 1re année.
export const motsFrequents = [
  {
    id: 'mf1', label: 'Série 1 — les petits mots',
    mots: ['le', 'la', 'les', 'un', 'une', 'des', 'je', 'tu', 'il', 'elle'],
  },
  {
    id: 'mf2', label: 'Série 2 — où et avec quoi',
    mots: ['est', 'et', 'a', 'à', 'dans', 'sur', 'sous', 'avec', 'pour', 'mon'],
  },
  {
    id: 'mf3', label: 'Série 3 — à qui c’est',
    mots: ['ma', 'mes', 'ton', 'ta', 'son', 'sa', 'ses', 'nous', 'vous', 'ils'],
  },
  {
    id: 'mf4', label: 'Série 4 — pour faire des phrases',
    mots: ['c’est', 'il y a', 'qui', 'que', 'mais', 'très', 'aussi', 'beaucoup', 'encore', 'toujours'],
  },
  {
    id: 'mf5', label: 'Série 5 — mon monde',
    mots: ['papa', 'maman', 'ami', 'école', 'maison', 'chat', 'chien', 'oui', 'non', 'bonjour'],
  },
];

export const motsFrequentsTous = motsFrequents.flatMap((s) => s.mots);

// ===== Lire une phrase =====
// Des phrases courtes et décodables: elle les lit, puis choisit l'image.
// `icon` = la bonne image, `pieges` = trois images plausibles.
export const phrasesLecture = [
  { phrase: 'Le chat dort sur le lit.', icon: '🐱', pieges: ['🐶', '🐭', '🛏️'] },
  { phrase: 'Papa mange une pomme.', icon: '🍎', pieges: ['🍌', '🍕', '👨'] },
  { phrase: 'Le lapin saute dans le jardin.', icon: '🐰', pieges: ['🐢', '🌷', '🐸'] },
  { phrase: 'Maman lit un livre.', icon: '📖', pieges: ['👩', '✏️', '🎒'] },
  { phrase: 'Le soleil brille dans le ciel.', icon: '☀️', pieges: ['🌙', '☁️', '⭐'] },
  { phrase: 'Nyla va à l’école avec son sac.', icon: '🎒', pieges: ['🏫', '🚌', '📚'] },
  { phrase: 'Le poisson nage dans l’eau.', icon: '🐟', pieges: ['🐦', '🐢', '💧'] },
  { phrase: 'Le chien joue avec un ballon.', icon: '⚽', pieges: ['🐶', '🎈', '🦴'] },
  { phrase: 'La souris mange du fromage.', icon: '🧀', pieges: ['🐭', '🍞', '🥛'] },
  { phrase: 'Le bébé dort dans son lit.', icon: '👶', pieges: ['🛏️', '🍼', '🧸'] },
  { phrase: 'L’oiseau chante dans l’arbre.', icon: '🐦', pieges: ['🌳', '🦋', '🎵'] },
  { phrase: 'Je mets mon chapeau sur ma tête.', icon: '🎩', pieges: ['🧤', '🧣', '👟'] },
  { phrase: 'La voiture roule sur la route.', icon: '🚗', pieges: ['🚲', '🚂', '🛣️'] },
  { phrase: 'Le gâteau est sur la table.', icon: '🍰', pieges: ['🍪', '🪑', '🎂'] },
  { phrase: 'La tortue marche très lentement.', icon: '🐢', pieges: ['🐇', '🐌', '🦎'] },
  { phrase: 'Il y a une étoile dans la nuit.', icon: '⭐', pieges: ['🌙', '☀️', '☁️'] },
  { phrase: 'Le mouton est dans le champ.', icon: '🐑', pieges: ['🐮', '🐷', '🌾'] },
  { phrase: 'Je bois un verre de lait.', icon: '🥛', pieges: ['🧃', '💧', '🍎'] },
];

// ===== Écrire une phrase =====
// En 1re année, une phrase = une majuscule au début et un point à la fin.
export const phrasesAEcrire = [
  { bonne: 'Le chat dort.', mots: ['chat', 'Le', 'dort'] },
  { bonne: 'Papa lit un livre.', mots: ['livre', 'Papa', 'un', 'lit'] },
  { bonne: 'Nyla joue avec Ryan.', mots: ['avec', 'Nyla', 'Ryan', 'joue'] },
  { bonne: 'Le soleil est jaune.', mots: ['jaune', 'est', 'Le', 'soleil'] },
  { bonne: 'Maman mange une pomme.', mots: ['pomme', 'une', 'Maman', 'mange'] },
  { bonne: 'Mon chien court vite.', mots: ['vite', 'chien', 'Mon', 'court'] },
  { bonne: 'La lune est ronde.', mots: ['ronde', 'La', 'est', 'lune'] },
  { bonne: 'Je vais à l’école.', mots: ['l’école', 'Je', 'à', 'vais'] },
];
