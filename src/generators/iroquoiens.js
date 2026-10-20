// Univers social — « Les Iroquoiens vers 1500 » (Terminus p. 6 à 18).
// Test le jeudi 22 oct. 2026. Le détail de ses erreurs est dans
// data/terminusIroquoiens.js; les poids les suivent:
//   • le MOT, pas la définition (p. 11, 0/4) — tapé, comme sur la feuille;
//   • les plantes servent à se soigner (raté deux fois);
//   • une ressource peut avoir plusieurs utilités (les animaux).
import { pickAdaptive } from '../utils/skillStats';
import {
  MOTS, RESSOURCES, ATOUTS, CONTRAINTES, ETE, HIVER, FEUILLUS, CONIFERES, IMG,
} from '../data/terminusIroquoiens';

const CATEGORY = 'us_iroquoiens';

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const maj = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const q = (type, text, correct, options, explanation, hint) => ({
  category: CATEGORY, type, text, correct, options: options && shuffle(options), explanation, hint,
});

const RELIEF = MOTS.filter((m) => m.relief);
const avecImage = (x, nom, alt) => (nom ? { ...x, image: IMG(nom), imageAlt: alt } : x);

// ===== 1. Le mot de la définition (tapé) — son erreur de la page 11 =====
function motRelief() {
  const m = pick(RELIEF);
  // Comme la page 11: une image, et on écrit le MOT dessous. Une fois sur
  // deux, la définition est là pour aider — c'est elle qu'il recopiait.
  const aide = Math.random() < 0.5 ? `\nAide: « ${m.def} »` : '';
  return {
    ...avecImage(q('mot_relief',
      `Écris le bon MOT sous l'image.${aide}\n(colline · plaine · vallée · fleuve)`,
      m.mot, null,
      `${maj(m.mot)}.\n\n« ${maj(m.def)} », c'est sa définition — l'explication. `
      + `Sous l'image, on écrit le MOT: ${m.mot}.`,
      'Un seul mot, pris dans la liste entre parenthèses.'), m.img, 'Un paysage'),
    tape: 'mot',
    // Son erreur exacte de la page 11: un morceau de la définition.
    presque: {
      [m.piege]: `« ${m.piege} », c'est un morceau de la définition. Le cahier veut le MOT: un seul, dans la liste.`,
      [m.def]: `Ça, c'est la définition au complet. Le cahier veut le MOT: un seul, dans la liste.`,
    },
  };
}

// ===== 2. Le mot ou un morceau de la définition? =====
// Pas de calcul ici: on lui montre son propre réflexe et on le fait choisir.
function motOuDefinition() {
  const m = pick(RELIEF);
  // L'image d'abord, comme dans le cahier. (Le 20 oct., le parent l'a vue à
  // l'écran SANS image: la question décrivait le paysage avec sa définition —
  // elle répétait exactement ce qu'on veut qu'il cesse de recopier.)
  return avecImage(q('mot_ou_def',
    `Le cahier dit: « Écris le bon MOT sous l'image. »\n\nQu'est-ce que j'écris?`,
    m.mot,
    [m.mot, m.piege, m.def],
    `J'écris ${m.mot}.\n\n« ${m.piege} », c'est un morceau de la définition. `
    + "La définition m'AIDE à trouver le mot — ce n'est pas la réponse.",
    'La réponse, c’est un seul mot: celui qui est en gras dans la définition.'), m.img, 'Un paysage');
}

// ===== 3. Les autres mots du cahier (choix) =====
function motVocab() {
  const autres = MOTS.filter((m) => !m.relief);
  const m = pick(autres);
  const leurres = shuffle(autres.filter((x) => x.mot !== m.mot)).slice(0, 3).map((x) => x.mot);
  return avecImage(q('mot_vocab',
    `« ${maj(m.def)} » — quel est le mot?`,
    m.mot, [m.mot, ...leurres],
    `${maj(m.mot)}: ${m.def}.`,
    'Relis bien chaque mot du cahier: lequel veut dire exactement ça?'), m.img, 'Une illustration du mot');
}

// ===== 4. À quoi sert cette ressource? — les plantes, deux fois ratées =====
function ressource() {
  // Les plantes et le bois sortent plus souvent: ce sont ses deux erreurs.
  const r = Math.random() < 0.55
    ? pick(RESSOURCES.filter((x) => x.nom === 'les plantes' || x.nom.startsWith('le bois')))
    : pick(RESSOURCES.filter((x) => x.utilites.length === 1 || x.nom.startsWith('le bois')));
  const bonne = r.utilites[0];
  const toutes = ['se soigner', 'se nourrir', 'se vêtir', 'faire des feux'];
  // L'image raconte la réponse (la grand-mère qui soigne un genou avec une
  // plante): le but est qu'il s'en SOUVIENNE, pas qu'il devine.
  const img = r.nom === 'les plantes' ? 'plantes-soigner'
    : r.nom.startsWith('les petits fruits') ? 'cueillette'
      : r.nom.startsWith('le bois') ? 'maison-longue' : null;
  return avecImage(q('ressource',
    `À quoi servent ${r.nom} aux Iroquoiens?`,
    bonne, [bonne, ...toutes.filter((t) => !r.utilites.includes(t))].slice(0, 4),
    `${maj(r.nom)}: ${r.utilites.join(' ET ')}.\n\n`
      + 'Le bois et l’écorce → feux et habitations · les plantes → SE SOIGNER · '
      + 'fruits, noix, champignons, poissons → se nourrir · animaux → se nourrir ET se vêtir.',
    r.nom === 'les plantes' ? 'Quand on est malade, qu’est-ce qu’on cherche?' : 'Pense à ce qu’on en fait dans la page du cahier.'),
  img, maj(r.nom));
}

// ===== 5. Plusieurs utilités — les animaux, page 15 =====
function plusieurs() {
  const r = pick(RESSOURCES.filter((x) => x.utilites.length > 1));
  const tout = r.utilites.join(' ET ');
  const leurres = r.nom === 'les animaux'
    ? ['se nourrir seulement', 'se vêtir seulement', 'se soigner']
    : ['faire des feux seulement', 'se soigner', 'se nourrir'];
  return avecImage(q('plusieurs',
    `Attention: une ressource peut avoir PLUS D'UNE utilité. Les Iroquoiens utilisent ${r.nom} pour…`,
    tout, [tout, ...leurres],
    `${tout}.\n\n`
      + (r.nom === 'les animaux'
        ? 'Ils chassent pour manger la viande, et les peaux, les fourrures et les plumes deviennent des vêtements et des bijoux.'
        : 'Le bois et l’écorce font des feux, et aussi les maisons longues et les canots.'),
    'Une seule case cochée, c’est souvent trop peu.'),
  r.nom === 'les animaux' ? 'peaux-fourrures' : 'maison-longue',
  r.nom === 'les animaux' ? 'Des vêtements faits de peaux, de fourrures et de plumes' : 'Une maison longue en bois et en écorce');
}

// ===== 6. Atout ou contrainte? =====
function atoutContrainte() {
  const atout = Math.random() < 0.5;
  const e = pick(atout ? ATOUTS : CONTRAINTES);
  // L'image de l'énoncé: les rapides, la chute, le fleuve, la plaine, l'hiver.
  const img = /rapides/.test(e) ? 'rapides' : /chute/i.test(e) ? 'chute'
    : /hiver|gelés/.test(e) ? 'hiver' : /été/.test(e) ? 'ete'
      : /fertile/.test(e) ? 'plaine' : /cours d'eau/.test(e) ? 'fleuve' : null;
  return avecImage(q('atout',
    `« ${e} » — c'est un atout ou une contrainte?`,
    atout ? 'un atout' : 'une contrainte', ['un atout', 'une contrainte'],
    `${atout ? 'Un atout = un avantage' : 'Une contrainte = un inconvénient'}.\n\n`
      + (atout ? 'Ça AIDE les Iroquoiens à vivre sur le territoire.' : 'Ça rend la vie PLUS DIFFICILE aux Iroquoiens.'),
    'Est-ce que ça aide, ou est-ce que ça complique la vie?'), img, 'Le territoire iroquoien');
}

// ===== 7. Été ou hiver? =====
function saison() {
  const ete = Math.random() < 0.5;
  const e = pick(ete ? ETE : HIVER);
  // Pas d'image dans la question (elle donnerait la réponse): l'image de la
  // bonne saison s'affiche dans la correction, pour qu'il s'en souvienne.
  return {
    ...q('saison',
      `« ${e} » — c'est l'été ou l'hiver sur le territoire iroquoien?`,
      ete ? "l'été" : "l'hiver", ["l'été", "l'hiver"],
      ete ? "L'été: chaud et court, pluie abondante, déplacements plus faciles, agriculture possible. C'est un ATOUT."
        : "L'hiver: long et froid, neige abondante, cours d'eau et sols gelés, déplacements difficiles, agriculture impossible. C'est une CONTRAINTE.",
      'Le climat a quatre saisons, mais le cahier compare surtout l’été et l’hiver.'),
    imageCorrection: IMG(ete ? 'ete' : 'hiver'),
  };
}

// ===== 8. Nomade ou sédentaire — et la carte d'identité de la p. 8 =====
const MODE_DE_VIE = [
  ['Les premiers Autochtones qui traversent la Béringie sont…', 'nomades', ['nomades', 'sédentaires'],
    'Nomades: ils suivent les animaux (mammouth, bison, caribou) pour se nourrir.'],
  ['Vers 1500, les Iroquoiens sont…', 'sédentaires', ['nomades', 'sédentaires'],
    'Sédentaires: ils vivent longtemps au même endroit, dans des villages, et pratiquent l’agriculture.'],
  ['Où vivent les Iroquoiens vers 1500?', 'dans des villages', ['dans des villages', 'dans des villes', 'dans des tentes qu’ils déplacent'],
    'Dans des villages de maisons longues. Pas des villes: les villes viendront bien plus tard.'],
  ['Comment les Iroquoiens se nourrissent-ils surtout?', 'l’agriculture', ['l’agriculture', 'les animaux de la ferme', 'les magasins'],
    'L’agriculture (ils cultivent la terre), plus la chasse, la pêche et la cueillette. Ils n’ont PAS d’animaux de la ferme.'],
  ['Dans quelle région vivent les Iroquoiens vers 1500?', 'la vallée du Saint-Laurent et les Grands Lacs',
    ['la vallée du Saint-Laurent et les Grands Lacs', 'les Appalaches', 'la Baie d’Hudson'],
    'La vallée du Saint-Laurent et la région des Grands Lacs.'],
];
function modeDeVie() {
  const [t, c, o, e] = pick(MODE_DE_VIE);
  // Les deux images côte à côte dans sa tête: ceux qui marchent derrière les
  // caribous (nomades), le village et ses champs (sédentaires).
  return {
    ...q('mode_vie', t, c, o, e, 'Nomade = se déplace souvent · sédentaire = reste au même endroit.'),
    imageCorrection: IMG(c === 'nomades' ? 'nomades' : 'village'),
  };
}

// ===== 9. La ligne du temps et la Béringie (p. 6-7) =====
const TEMPS = [
  ['Il y a environ combien d’années les Autochtones traversent-ils la Béringie?', '30 000 ans', ['30 000 ans', '10 000 ans', '1 500 ans', '500 ans']],
  ['Il y a environ combien d’années les chasseurs s’installent-ils sur le territoire du Québec actuel?', '10 000 ans', ['30 000 ans', '10 000 ans', '1 500 ans', '100 ans']],
  ['Qu’est-ce que la Béringie?', 'une bande de terre gelée qui relie l’Asie à l’Amérique',
    ['une bande de terre gelée qui relie l’Asie à l’Amérique', 'un océan', 'un village iroquoien', 'un grand lac']],
  ['Pourquoi les chasseurs peuvent-ils s’installer au Québec il y a 10 000 ans?', 'le climat se réchauffe et les glaces fondent',
    ['le climat se réchauffe et les glaces fondent', 'ils construisent des bateaux', 'les animaux disparaissent']],
];
function temps() {
  const [t, c, o] = pick(TEMPS);
  return q('temps', t, c, o,
    `${maj(c)}.\n\nD'abord la Béringie (il y a 30 000 ans), puis le Québec quand les glaces fondent (il y a 10 000 ans), puis les Iroquoiens sédentaires vers 1500.`,
    'Le plus vieux d’abord: 30 000, puis 10 000, puis 1500.');
}

// ===== 10. Les Grands Lacs du territoire (p. 8) — « Érié », pas « érière » =====
function lacs() {
  if (Math.random() < 0.5) {
    return q('lacs', 'Lequel de ces Grands Lacs ne fait PAS partie du territoire iroquoien?',
      'le lac Supérieur', ['le lac Supérieur', 'le lac Huron', 'le lac Érié', 'le lac Ontario'],
      'Les trois Grands Lacs du territoire iroquoien: Huron, Érié et Ontario. Le lac Supérieur et le lac Michigan sont plus à l’ouest.',
      'Trois lacs: Huron, É…, Ontario.');
  }
  return q('lacs', 'Les trois Grands Lacs du territoire iroquoien sont le lac Huron, le lac Ontario et le lac… Comment s’écrit-il?',
    'Érié', ['Érié', 'Érière', 'Érier', 'Éri'],
    'Érié: quatre lettres, deux é. Les trois lacs: Huron, Érié, Ontario.',
    'Il est court: 4 lettres.');
}

// ===== 11. La forêt (p. 13) =====
function foret() {
  const genre = pick(['arbre', 'arbre', 'ou', 'image']);
  if (genre === 'image') {
    const f = Math.random() < 0.5;
    return avecImage(q('foret', 'Ces arbres sont des…',
      f ? 'feuillus' : 'conifères', ['feuillus', 'conifères'],
      f ? 'Des feuillus: des feuilles larges qui poussent au printemps et tombent à l’automne (érable, chêne, bouleau).'
        : 'Des conifères: des aiguilles et des cocottes (sapin, épinette, cèdre). Ils restent verts l’hiver.',
      'Des feuilles, ou des aiguilles?'), f ? 'feuillus' : 'coniferes', 'Trois arbres');
  }
  if (genre === 'ou') {
    return q('foret', 'Au SUD du territoire iroquoien, les forêts se composent surtout…',
      'de feuillus', ['de feuillus', 'de conifères', 'de palmiers'],
      'Au sud: surtout des feuillus (érables, chênes, bouleaux). Plus au nord: des forêts MIXTES, feuillus + conifères.',
      'Plus au nord, c’est mixte.');
  }
  const feuillu = Math.random() < 0.5;
  const a = pick(feuillu ? FEUILLUS : CONIFERES);
  return q('foret', `${maj(a)}, c'est un feuillu ou un conifère?`,
    feuillu ? 'un feuillu' : 'un conifère', ['un feuillu', 'un conifère'],
    feuillu ? 'Un feuillu: ses feuilles poussent au printemps et tombent à l’automne. Érable, chêne, bouleau.'
      : 'Un conifère: des aiguilles et des cocottes (cônes). Sapin, épinette, cèdre.',
    'Des feuilles qui tombent, ou des aiguilles?');
}

// ===== 12. Le village et la maison longue (p. 16 à 18) =====
// [question, réponse, choix, POURQUOI, image]. Le « pourquoi » est ce qui
// reste: une réponse sans raison se reperd au test suivant.
const VILLAGE = [
  ['Hochelaga, un village iroquoien, se trouvait où est aujourd’hui la ville de…', 'Montréal', ['Montréal', 'Québec', 'Laval', 'Toronto'],
    'Hochelaga → Montréal, tout près de Laval, chez nous. Le quartier Hochelaga existe encore aujourd’hui à Montréal!', null],
  ['Stadaconé, un village iroquoien, se trouvait où est aujourd’hui la ville de…', 'Québec', ['Montréal', 'Québec', 'Trois-Rivières', 'Ottawa'],
    'Stadaconé → la ville de Québec, plus loin sur le fleuve. Hochelaga, c’est Montréal.', null],
  ['Pourquoi appelle-t-on la maison iroquoienne une « maison longue »?', 'elle est beaucoup plus longue que large',
    ['elle est beaucoup plus longue que large', 'elle est très haute', 'on met longtemps à la construire'],
    'Regarde l’image: environ 25 mètres de long et seulement 10 de large — aussi longue qu’une piscine de quartier. Le nom dit sa forme.', 'maison-longue'],
  ['De quoi est recouvert l’extérieur d’une maison longue?', 'd’écorce', ['d’écorce', 'de pierres', 'de neige', 'de peaux'],
    'La structure est en BOIS, et on la recouvre de grandes feuilles d’ÉCORCE d’arbre — la forêt donne tout.', 'maison-longue'],
  ['Combien de personnes vivent dans une maison longue?', '25 à 60 personnes (plusieurs familles)',
    ['25 à 60 personnes (plusieurs familles)', 'une seule famille', '2 000 personnes'],
    'Plusieurs familles ensemble: 25 à 60 personnes. 2 000, c’est un village entier (plusieurs maisons longues).', 'interieur'],
  ['À quoi sert le foyer dans la maison longue?', 'à la cuisson et au chauffage',
    ['à la cuisson et au chauffage', 'à dormir', 'à entreposer les objets'],
    'Le feu au milieu (le foyer) fait cuire la nourriture ET réchauffe la maison. On dort sur les plateformes, sur les côtés.', 'interieur'],
  ['À quoi servent les ouvertures dans le toit?', 'à évacuer la fumée', ['à évacuer la fumée', 'à entrer', 'à regarder les étoiles'],
    'Il y a un feu dans la maison: la fumée doit sortir par en haut, sinon on ne pourrait plus respirer.', 'maison-longue'],
  ['À quoi sert la palissade autour du village?', 'à protéger du vent, des animaux et des ennemis',
    ['à protéger du vent, des animaux et des ennemis', 'à garder les enfants', 'à faire sécher la viande'],
    'La palissade, c’est la grande clôture de troncs pointus tout autour: elle protège du vent, des animaux et des ennemis. On peut y grimper pour surveiller.', 'village'],
  ['Combien d’entrées y a-t-il dans un village iroquoien?', 'une seule', ['une seule', 'deux', 'une par maison'],
    'Une seule entrée: c’est plus facile à surveiller et à défendre.', 'village'],
  ['Pourquoi les Iroquoiens construisent-ils leur village près d’un cours d’eau?', 'pour boire, pêcher, se laver, arroser les champs et se déplacer',
    ['pour boire, pêcher, se laver, arroser les champs et se déplacer', 'pour la vue', 'parce qu’il fait plus chaud'],
    'L’eau sert à tout: boire, pêcher, se laver, arroser les champs, et se déplacer en canot. « Les cours d’eau, ce sont les routes des Autochtones. »', 'village'],
  ['Comment contourner une chute ou des rapides en canot?', 'faire du portage: porter le canot',
    ['faire du portage: porter le canot', 'sauter la chute', 'attendre l’hiver'],
    'En canot, on ne peut pas passer une chute ni la plupart des rapides. Alors on sort de l’eau et on PORTE le canot à pied: c’est le portage.', 'portage'],
];
function village() {
  const [t, c, o, pourquoi, img] = pick(VILLAGE);
  return avecImage(q('village', t, c, o, `${maj(c)}.\n\n${pourquoi}`, 'Repense à l’image du village et de la maison longue.'),
    img, 'Le village iroquoien');
}

function buildOne() {
  return pickAdaptive(CATEGORY, [
    // Ses trois trous d'abord.
    { type: 'mot_relief', w: 18, build: motRelief },
    { type: 'mot_ou_def', w: 8, build: motOuDefinition },
    { type: 'ressource', w: 16, build: ressource },
    { type: 'plusieurs', w: 10, build: plusieurs },
    { type: 'village', w: 14, build: village },
    { type: 'mot_vocab', w: 12, build: motVocab },
    { type: 'atout', w: 10, build: atoutContrainte },
    { type: 'mode_vie', w: 10, build: modeDeVie },
    { type: 'saison', w: 6, build: saison },
    { type: 'temps', w: 8, build: temps },
    { type: 'lacs', w: 6, build: lacs },
    { type: 'foret', w: 8, build: foret },
  ], (x) => `${x.type}|${x.text}`);
}

// Même garde que les sciences: le répertoire est étroit, mais jamais deux
// fois la même question de suite.
let dernierTexte = null;
export function generateIroquoiens() {
  let x = buildOne();
  for (let i = 0; i < 6 && x && x.text === dernierTexte; i++) {
    const autre = buildOne();
    if (autre) x = autre;
  }
  dernierTexte = x ? x.text : null;
  return x;
}

export default generateIroquoiens;
