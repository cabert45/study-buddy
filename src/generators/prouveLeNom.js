// « Clique sur le nom. Pour PROUVER ta réponse, clique sur… »
//
// Le format des exercices interactifs i+ (iplusinteractif.com), captures du
// 29 sept. 2026, activité 9354_J3_T1_02 — le cahier Jazz de sa classe. Trois
// consignes, toujours bâties pareil: trouve le mot, PUIS prouve-le.
//
//   1. « Clique sur le nom parmi les mots suivants. Pour prouver ta réponse,
//      clique sur le déterminant que tu peux ajouter avant le nom. »
//      espionne / honnête / mange  →  un · une · des
//
//   2. « …clique sur l'adjectif que tu peux ajouter avant ou après le nom. »
//      « Le caméléon de Josiane sourit. »  →  grand · grande · grands
//
//   3. « …clique sur le nom qui peut remplacer le nom commun. »
//      « Je mets mon casque pour me protéger. »  →  chapeau · tuque · mitaines
//
// Pourquoi c'est mieux que « quelle est la classe de ce mot »: la preuve EST
// la leçon. Un enfant qui devine juste sans raison reperd la réponse au test
// suivant; ici, il ne peut pas prouver sans appliquer le test. Et les choix de
// la preuve portent l'ACCORD (grand/grande/grands), donc il travaille deux
// choses d'un coup — exactement ce que la classe lui demande.
import { pickAdaptive } from '../utils/skillStats';

const CATEGORY = 'prouve_nom';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// g = genre (m/f), n = nombre (s/p). Le déterminant et l'adjectif en découlent.
const NOMS = [
  { mot: 'caméléon', g: 'm', n: 's', remplace: [['lézard','m','s'], ['tortue','f','s'], ['grenouilles','f','p']] },
  { mot: 'casque', g: 'm', n: 's', remplace: [['chapeau','m','s'], ['tuque','f','s'], ['mitaines','f','p']] },
  { mot: 'légumes', g: 'm', n: 'p', remplace: [['fruits','m','p'], ['carotte','f','s'], ['pomme','f','s']] },
  { mot: 'sports', g: 'm', n: 'p', remplace: [['jeux','m','p'], ['danse','f','s'], ['défi','m','s']] },
  { mot: 'espionne', g: 'f', n: 's', remplace: [['voleuse','f','s'], ['policier','m','s'], ['gardiens','m','p']] },
  { mot: 'ballon', g: 'm', n: 's', remplace: [['frisbee','m','s'], ['rondelle','f','s'], ['balles','f','p']] },
  { mot: 'maison', g: 'f', n: 's', remplace: [['cabane','f','s'], ['chalet','m','s'], ['tentes','f','p']] },
  { mot: 'chien', g: 'm', n: 's', remplace: [['chat','m','s'], ['souris','f','s'], ['oiseaux','m','p']] },
  { mot: 'école', g: 'f', n: 's', remplace: [['classe','f','s'], ['gymnase','m','s'], ['cours','m','p']] },
  { mot: 'crayons', g: 'm', n: 'p', remplace: [['stylos','m','p'], ['gomme','f','s'], ['règle','f','s']] },
  { mot: 'sœur', g: 'f', n: 's', remplace: [['cousine','f','s'], ['frère','m','s'], ['parents','m','p']] },
  { mot: 'bottes', g: 'f', n: 'p', remplace: [['sandales','f','p'], ['tuque','f','s'], ['manteau','m','s']] },
];

// Les mots qui NE SONT PAS des noms, pour la première consigne: un verbe
// conjugué et un adjectif, comme dans le cahier (mange, honnête).
const PAS_NOMS = ['mange', 'honnête', 'court', 'dort', 'rapide', 'chante', 'joyeux', 'saute'];

const DETERMINANTS = { ms: 'un', fs: 'une', mp: 'des', fp: 'des' };

// Adjectifs à quatre formes, pour la preuve par l'adjectif.
const ADJECTIFS = [
  { m: 'grand', f: 'grande', mp: 'grands', fp: 'grandes' },
  { m: 'vert', f: 'verte', mp: 'verts', fp: 'vertes' },
  { m: 'petit', f: 'petite', mp: 'petits', fp: 'petites' },
  { m: 'joli', f: 'jolie', mp: 'jolis', fp: 'jolies' },
  { m: 'noir', f: 'noire', mp: 'noirs', fp: 'noires' },
];

const formeAdj = (a, g, n) => (n === 'p' ? (g === 'f' ? a.fp : a.mp) : (g === 'f' ? a.f : a.m));

const PHRASES = {
  caméléon: 'Le caméléon de Josiane sourit.',
  casque: 'Je mets mon casque pour me protéger.',
  légumes: 'Il aime manger des légumes.',
  sports: "J'adore les sports extrêmes.",
  espionne: "L'espionne entre sans faire de bruit.",
  ballon: 'Ryan lance le ballon très loin.',
  maison: 'La maison de mes cousins est en brique.',
  chien: 'Mon chien garde la porte.',
  école: "L'école ouvre à huit heures.",
  crayons: 'Mes crayons sont dans mon étui.',
  sœur: 'Ma sœur chante dans sa chambre.',
  bottes: 'Mes bottes sont pleines de boue.',
};

// ===== 1. Trouve le nom, parmi trois mots isolés =====
function trouveLeNom() {
  const n = pick(NOMS);
  const autres = shuffle(PAS_NOMS).slice(0, 2);
  const det = DETERMINANTS[`${n.g}${n.n}`];
  return {
    category: CATEGORY,
    type: 'trouve_nom',
    text: 'Clique sur le NOM parmi ces mots.',
    correct: n.mot,
    options: shuffle([n.mot, ...autres]),
    explanation: `« ${det} ${n.mot} » — ça se dit, donc ${n.mot} est un nom.\n`
      + `${autres.map((a) => `« un ${a} » ne se dit pas`).join(' · ')}.`,
    hint: 'Essaie de mettre « un », « une » ou « des » devant chaque mot. Celui qui accepte, c\'est le nom.',
  };
}

// ===== 2. Prouve-le avec le déterminant =====
function preuveDeterminant() {
  const n = pick(NOMS);
  const correct = DETERMINANTS[`${n.g}${n.n}`];
  const options = n.n === 'p' ? ['des', 'un', 'une'] : ['un', 'une', 'des'];
  return {
    category: CATEGORY,
    type: 'preuve_determinant',
    text: `Prouve que « ${n.mot} » est un nom.\n\nQuel déterminant peux-tu mettre devant?`,
    correct,
    options: shuffle([...new Set(options)]),
    explanation: `On dit « ${correct} ${n.mot} ».\n`
      + (n.n === 'p'
        ? `${n.mot} est au PLURIEL: c'est « des ».`
        : `${n.mot} est ${n.g === 'f' ? 'féminin' : 'masculin'} singulier: c'est « ${correct} ».`),
    hint: 'Un seul ou plusieurs? Masculin ou féminin? Le déterminant suit le nom.',
  };
}

// ===== 3. Prouve-le avec un adjectif (l'accord décide) =====
function preuveAdjectif() {
  const n = pick(NOMS);
  const a = pick(ADJECTIFS);
  const correct = formeAdj(a, n.g, n.n);
  const options = [...new Set([a.m, a.f, a.mp, a.fp])].filter(Boolean);
  return {
    category: CATEGORY,
    type: 'preuve_adjectif',
    text: `« ${PHRASES[n.mot]} »\n\nLe nom commun est « ${n.mot} ».\nQuel adjectif peux-tu lui ajouter?`,
    correct,
    options: shuffle(options).slice(0, 4),
    explanation: `${n.mot} est ${n.g === 'f' ? 'féminin' : 'masculin'} ${n.n === 'p' ? 'pluriel' : 'singulier'},`
      + ` donc l'adjectif s'écrit « ${correct} ».\nL'adjectif prend le genre ET le nombre du nom.`,
    hint: `Regarde « ${n.mot} »: un seul ou plusieurs? masculin ou féminin? L'adjectif fait pareil.`,
  };
}

// ===== 4. Prouve-le en remplaçant le nom =====
//
// UN SEUL remplacement doit convenir, et c'est l'accord qui décide: les deux
// autres ont un genre ou un nombre différent, donc la phrase se casse
// (« Mon souris garde la porte »). Sans cette règle, « caméléon » acceptait
// « lézard » ET « serpent » — deux bonnes réponses, une seule acceptée: la
// pire question qu'on puisse poser à un enfant qui pleure quand il se trompe.
function preuveRemplacement() {
  const n = pick(NOMS.filter((x) => (x.remplace || []).length >= 3));
  const vont = n.remplace.filter(([, g, nb]) => g === n.g && nb === n.n);
  if (vont.length !== 1) return preuveDeterminant(); // donnée douteuse: on ne la pose pas
  const correct = vont[0][0];
  const phrase = PHRASES[n.mot];
  return {
    category: CATEGORY,
    type: 'preuve_remplacement',
    text: `« ${phrase} »\n\nLe nom commun est « ${n.mot} ».\nQuel nom pourrait le remplacer?`,
    correct,
    options: shuffle(n.remplace.map(([m]) => m)),
    explanation: `« ${phrase.replace(n.mot, correct)} » — la phrase tient debout.\n`
      + n.remplace.filter(([m]) => m !== correct)
        .map(([m, g, nb]) => `« ${m} » ne va pas: ${g !== n.g ? (g === 'f' ? 'féminin' : 'masculin') : (nb === 'p' ? 'pluriel' : 'singulier')}.`)
        .join(' ')
      + `\nUn nom se remplace par un autre nom du même genre et du même nombre.`,
    hint: 'Essaie chaque mot dans la phrase. Un seul garde la phrase juste.',
  };
}

export function generateProuveLeNom() {
  return pickAdaptive(CATEGORY, [
    { type: 'trouve_nom', w: 24, build: trouveLeNom },
    { type: 'preuve_determinant', w: 26, build: preuveDeterminant },
    { type: 'preuve_adjectif', w: 28, build: preuveAdjectif },
    { type: 'preuve_remplacement', w: 22, build: preuveRemplacement },
  ]);
}
