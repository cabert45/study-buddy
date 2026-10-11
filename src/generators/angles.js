// Droites et angles — Matcha 3e, thème 1 (les droites p. 25, les angles p. 28)
// Feuille de consolidation AS.1.11, section 4.
//
// Apporté par le parent le 11 oct. 2026 avec la feuille en main: « Ryan needs
// a visual for this. That's his actual homework. Also the angles. »
//
// Ce que la feuille demande, et qui n'existait nulle part dans l'app:
//   1. tracer une droite PARALLÈLE / PERPENDICULAIRE à une droite donnée;
//   2. reconnaître quelles droites d'une figure sont // ou ⊥;
//   3. comparer: l'angle obtus est plus GRAND que l'angle droit, etc.;
//   4. nommer un angle: aigu, droit, obtus;
//   5. trier des triangles par leurs angles.
//
// Tout se dessine en code (components/Angles). Un angle « droit » tracé à 85°
// rendrait la bonne réponse fausse, et aucune image générée ne garantit un
// angle au degré près — même raison que les blocs base 10 et l'horloge.
import { pickAdaptive } from '../utils/skillStats';

const CATEGORY = 'angles';

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const uniques = (arr) => arr.filter((v, i, a) => a.indexOf(v) === i);
function quatre(bonne, leurres) { return shuffle(uniques([bonne, ...leurres]).slice(0, 4)); }

// Le vocabulaire, une fois pour toutes. C'est la définition du cahier.
const SORTE = {
  aigu: "plus PETIT que l'angle droit (moins que le coin d'une feuille)",
  droit: "exactement le coin d'une feuille de papier — 90 degrés",
  obtus: "plus GRAND que l'angle droit (plus ouvert que le coin d'une feuille)",
};
const nommeAngle = (d) => (Math.abs(d - 90) < 0.5 ? 'droit' : d < 90 ? 'aigu' : 'obtus');

// Des mesures franches: 70° et 90° se confondraient à l'œil, et on ne teste
// pas sa vue, on teste s'il connaît la règle.
const mesureAigue = () => pick([25, 35, 40, 50, 55, 60]);
const mesureObtuse = () => pick([115, 125, 135, 140, 150, 160]);

// ===== 1. Nomme cet angle =====
// Question 5 de la feuille: « Écris le type de chaque angle. »
function nommeCetAngle() {
  const sorte = pick(['aigu', 'droit', 'obtus']);
  const mesure = sorte === 'droit' ? 90 : sorte === 'aigu' ? mesureAigue() : mesureObtuse();
  // L'angle est pivoté au hasard: dans le cahier, il n'est jamais posé à plat.
  // S'il n'était pivoté que vers le haut, « droit » deviendrait « celui qui
  // ressemble à un L » au lieu d'une mesure.
  const base = pick([0, 10, 20, 35, 50, 70, 90]);
  return {
    category: CATEGORY,
    type: 'nomme_angle',
    text: 'Quelle sorte d’angle est-ce?',
    figure: { kind: 'angle', mesure, base },
    correct: sorte,
    options: ['aigu', 'droit', 'obtus'],
    explanation: `C’est un angle ${sorte.toUpperCase()}.\n\n`
      + `Un angle ${sorte}, c’est ${SORTE[sorte]}.\n\n`
      + 'LE TEST: prends le coin d’une feuille de papier et pose-le dans l’angle.\n'
      + `• l’angle est plus serré que le coin → aigu\n`
      + `• il remplit exactement le coin → droit\n`
      + `• il est plus ouvert que le coin → obtus`,
    hint: 'Compare avec le coin d’une feuille de papier: plus serré, pareil, ou plus ouvert?',
  };
}

// ===== 2. Plus grand ou plus petit =====
// Question 4 de la feuille: « L'angle obtus est plus ___ que l'angle droit. »
function comparerSortes() {
  const paires = [
    { a: 'obtus', b: 'droit', r: 'grand' },
    { a: 'droit', b: 'aigu', r: 'grand' },
    { a: 'aigu', b: 'obtus', r: 'petit' },
    { a: 'droit', b: 'obtus', r: 'petit' },
    { a: 'aigu', b: 'droit', r: 'petit' },
    { a: 'obtus', b: 'aigu', r: 'grand' },
  ];
  const p = pick(paires);
  return {
    category: CATEGORY,
    type: 'comparer_sortes',
    text: `Complète: « L’angle ${p.a} est plus ______ que l’angle ${p.b}. »`,
    correct: p.r,
    options: ['grand', 'petit'],
    explanation: `L’angle ${p.a} est plus ${p.r} que l’angle ${p.b}.\n\n`
      + 'Du plus serré au plus ouvert: AIGU → DROIT → OBTUS.\n'
      + 'L’angle droit est au milieu: c’est lui qui sert de règle pour les deux autres.',
    hint: 'Range-les dans ta tête: aigu, droit, obtus — du plus serré au plus ouvert.',
  };
}

// ===== 3. Parallèles ou perpendiculaires =====
// Questions 1, 2 et 3 de la feuille.
function droites() {
  const relation = pick(['paralleles', 'perpendiculaires', 'secantes']);
  const nom = { paralleles: 'parallèles', perpendiculaires: 'perpendiculaires', secantes: 'ni l’un ni l’autre' };
  return {
    category: CATEGORY,
    type: 'droites',
    text: 'Ces deux droites sont…',
    figure: { kind: 'droites', relation },
    correct: nom[relation],
    options: ['parallèles', 'perpendiculaires', 'ni l’un ni l’autre'],
    explanation: `Elles sont ${nom[relation]}.\n\n`
      + 'PARALLÈLES (//): elles vont dans la même direction et ne se touchent JAMAIS, '
      + 'comme les deux rails d’un chemin de fer.\n'
      + 'PERPENDICULAIRES (⊥): elles se croisent en formant un ANGLE DROIT, '
      + 'comme les deux côtés du coin d’une feuille.\n'
      + 'Si elles se croisent sans faire d’angle droit, elles ne sont ni l’un ni l’autre.',
    hint: 'Se touchent-elles? Et si oui, est-ce que ça fait le coin d’une feuille?',
  };
}

// ===== 4. Le mot pour le symbole =====
function symbole() {
  const cas = pick([
    { s: '//', r: 'parallèles', why: 'Les deux traits du symbole // sont eux-mêmes parallèles.' },
    { s: '⊥', r: 'perpendiculaires', why: 'Le symbole ⊥ montre un angle droit.' },
  ]);
  return {
    category: CATEGORY,
    type: 'symbole',
    text: `Dans « droite 1 ${cas.s} droite 2 », que veut dire le symbole « ${cas.s} »?`,
    correct: cas.r,
    options: ['parallèles', 'perpendiculaires'],
    explanation: `${cas.s} veut dire ${cas.r}.\n\n${cas.why}`,
    hint: 'Regarde la forme du symbole: elle dessine la réponse.',
  };
}

// ===== 5. Combien d'angles de telle sorte dans ce triangle =====
// Question 6 de la feuille: colorier le triangle à 3 angles aigus, celui qui a
// un angle obtus, celui qui a un angle droit.
function triangle() {
  const genre = pick(['aigus', 'rectangle', 'obtusangle']);
  const angles = genre === 'rectangle'
    ? (() => { const a = rand(30, 60); return [90, a, 90 - a]; })()
    : genre === 'obtusangle'
      ? (() => { const a = pick([100, 110, 120, 130]); const b = rand(25, (180 - a) - 20); return [a, b, 180 - a - b]; })()
      : (() => { const a = rand(50, 75); const b = rand(50, 75); return [a, b, 180 - a - b]; })();
  const sortes = angles.map(nommeAngle);
  const nbAigus = sortes.filter((s) => s === 'aigu').length;
  const description = genre === 'rectangle' ? '1 angle droit et 2 angles aigus'
    : genre === 'obtusangle' ? '1 angle obtus et 2 angles aigus'
      : '3 angles aigus';
  return {
    category: CATEGORY,
    type: 'triangle',
    text: 'Quels angles ce triangle possède-t-il?',
    figure: { kind: 'triangle', angles },
    correct: description,
    options: shuffle(['3 angles aigus', '1 angle droit et 2 angles aigus', '1 angle obtus et 2 angles aigus']),
    explanation: `${description}.\n\n`
      + `Ses trois angles mesurent ${angles.map((a) => Math.round(a) + '°').join(', ')} — `
      + `donc ${sortes.join(', ')}.\n`
      + `Un triangle a TOUJOURS au moins 2 angles aigus (ici ${nbAigus}): `
      + 'les trois angles ensemble font 180°, alors il ne peut pas y en avoir deux grands.',
    hint: 'Regarde chaque coin: lequel est le plus ouvert? Compare-le au coin d’une feuille.',
  };
}

// ===== 6. Autour de toi =====
// Ancrer le vocabulaire dans ce qu'il voit, pas seulement dans des figures.
const OBJETS = [
  { quoi: 'le coin d’une feuille de papier', r: 'droit' },
  { quoi: 'le coin d’une porte', r: 'droit' },
  { quoi: 'les deux aiguilles à 3 h pile', r: 'droit' },
  { quoi: 'la pointe d’une part de pizza', r: 'aigu' },
  { quoi: 'la pointe d’un crayon taillé', r: 'aigu' },
  { quoi: 'les deux aiguilles à 1 h pile', r: 'aigu' },
  // Pas « un livre ouvert à plat »: à plat, c'est 180 degrés, un angle PLAT,
  // et la 3e année n'a que aigu / droit / obtus. On ne pose pas une question
  // dont la bonne réponse n'est pas dans les choix.
  { quoi: "le coin d'un panneau d'arrêt (le gros octogone rouge)", r: 'obtus' },
  { quoi: 'le dossier d’une chaise longue inclinée', r: 'obtus' },
  { quoi: 'les deux aiguilles à 5 h pile', r: 'obtus' },
];
function autourDeToi() {
  const o = pick(OBJETS);
  return {
    category: CATEGORY,
    type: 'autour',
    text: `Quelle sorte d’angle forme ${o.quoi}?`,
    correct: o.r,
    options: ['aigu', 'droit', 'obtus'],
    explanation: `Un angle ${o.r.toUpperCase()}.\n\nUn angle ${o.r}, c’est ${SORTE[o.r]}.`,
    hint: 'Imagine le coin d’une feuille posé dessus.',
  };
}

function buildOne() {
  return pickAdaptive(CATEGORY, [
    { type: 'nomme_angle', w: 26, build: nommeCetAngle },
    { type: 'droites', w: 22, build: droites },
    { type: 'comparer_sortes', w: 16, build: comparerSortes },
    { type: 'triangle', w: 14, build: triangle },
    { type: 'autour', w: 12, build: autourDeToi },
    { type: 'symbole', w: 10, build: symbole },
  ], (q) => `${q.type}|${q.text}|${q.figure ? JSON.stringify(q.figure) : ''}`);
}

export function generateAngles() {
  return buildOne();
}

export default generateAngles;
