// Nyla — Suites logiques (maternelle 5 ans)
//
// ⚠️ Pourquoi cette réécriture: dans l'ancienne version, le trou était
// TOUJOURS à la fin et la bonne réponse était TOUJOURS le premier objet du
// motif. Elle pouvait avoir 10/10 sans jamais lire la suite — il suffisait de
// prendre le dessin de gauche. C'est exactement « trop facile ».
//
// Maintenant: le trou peut tomber n'importe où (même au milieu ou au début),
// les motifs vont de AB à ABBC, et il y a des suites de nombres qui montent —
// donc la bonne réponse n'est plus devinable par position.
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

// Paires d'objets bien contrastés — le motif doit se voir d'un coup d'œil.
const itemGroups = [
  ['🍎', '🍌'], ['⭐', '🌙'], ['❤️', '💙'], ['🐶', '🐱'],
  ['🔴', '🔵'], ['🌸', '🌻'], ['☀️', '🌧️'], ['🐢', '🐇'],
  ['🚗', '🚲'], ['🍓', '🍇'], ['🦋', '🐝'], ['🟥', '🟨'],
  ['⚽', '🏀'], ['🐟', '🐙'], ['🎈', '🎁'], ['🌲', '🌵'],
];

// Les motifs qu'on voit en maternelle, du plus simple au plus exigeant.
const MOTIFS = [
  { nom: 'AB', suite: [0, 1], desc: 'un, puis l\'autre' },
  { nom: 'AAB', suite: [0, 0, 1], desc: 'deux fois le premier, une fois le deuxième' },
  { nom: 'ABB', suite: [0, 1, 1], desc: 'une fois le premier, deux fois le deuxième' },
  { nom: 'ABC', suite: [0, 1, 2], desc: 'trois objets qui se suivent' },
  { nom: 'AABB', suite: [0, 0, 1, 1], desc: 'deux et deux' },
  { nom: 'ABBC', suite: [0, 1, 1, 2], desc: 'un, deux pareils, puis un nouveau' },
];

// Une suite d'objets avec UN trou, placé au hasard.
function buildMotif() {
  const motif = pick(MOTIFS);
  const besoin3 = motif.suite.includes(2);

  const g1 = pick(itemGroups);
  const g2 = pick(itemGroups.filter((g) => g !== g1));
  const palette = [g1[0], g1[1], g2[0]];
  if (new Set(palette).size < (besoin3 ? 3 : 2)) return null;

  // On déroule le motif sur 7 à 9 cases, assez pour que la régularité se voie.
  const longueur = 7 + Math.floor(Math.random() * 3);
  const suite = [];
  for (let i = 0; i < longueur; i++) suite.push(palette[motif.suite[i % motif.suite.length]]);

  // Le trou: n'importe où sauf dans les deux premières cases — il faut avoir
  // vu le motif au moins une fois avant de pouvoir le compléter.
  const trou = 2 + Math.floor(Math.random() * (longueur - 2));
  const correct = suite[trou];

  const affichee = suite.map((s, i) => (i === trou ? '❓' : s)).join(' ');
  const distracteurs = shuffle([...new Set(palette)].filter((p) => p !== correct));
  const remplissage = shuffle(itemGroups.flat()).filter((x) => !palette.includes(x));
  while (distracteurs.length < 3 && remplissage.length) distracteurs.push(remplissage.pop());
  if (distracteurs.length < 3) return null;

  const position = trou === longueur - 1 ? 'à la fin'
    : trou === 0 ? 'au début' : 'au milieu';

  return {
    category: 'nyla_patterns',
    type: `motif_${motif.nom}`,
    text: `Qu'est-ce qui va dans le ❓?\n\n${affichee}`,
    correct,
    options: shuffle([correct, ...distracteurs.slice(0, 3)]),
    explanation: `Le motif est « ${motif.desc} »: ${palette.slice(0, besoin3 ? 3 : 2).join(' ')} qui se répète. Dans le trou ${position}, il faut ${correct}.`,
    hint: 'Lis la suite à voix haute depuis le début, et arrête-toi au ❓.',
  };
}

// Suites de nombres qui montent — de 1 en 1, de 2 en 2, de 5 en 5, de 10 en 10.
// C'est la préparation directe au comptage par bonds de la 1re année.
function buildSuiteNombres() {
  const pas = pick([1, 1, 2, 2, 5, 10]);
  const depart = pas === 10 ? pick([0, 10, 20, 30])
    : pas === 5 ? pick([0, 5, 10, 15, 20])
    : pick([1, 2, 3, 4, 5, 6, 7, 8, 10, 12]);
  const longueur = 5;
  const suite = Array.from({ length: longueur }, (_, i) => depart + i * pas);
  if (suite[longueur - 1] > 60) return null;

  const trou = 2 + Math.floor(Math.random() * (longueur - 2));
  const correct = suite[trou];
  const affichee = suite.map((n, i) => (i === trou ? '❓' : n)).join('  ');

  const faux = new Set([correct + pas, correct - pas, correct + 1, correct - 1]);
  faux.delete(correct);
  const distracteurs = shuffle([...faux].filter((n) => n >= 0)).slice(0, 3);
  if (distracteurs.length < 3) return null;

  return {
    category: 'nyla_patterns',
    type: `suite_${pas}`,
    text: `Quel nombre manque?\n\n${affichee}`,
    correct: String(correct),
    options: shuffle([correct, ...distracteurs]).map(String),
    explanation: `On compte de ${pas} en ${pas}: ${suite.join(', ')}. Il manquait ${correct}.`,
    hint: pas === 1 ? 'Compte tout haut en suivant la suite.'
      : `Regarde de combien on saute entre deux nombres: de ${pas} en ${pas}.`,
  };
}

// Suites de grandeurs: petit, moyen, grand… qui recommence.
function buildSuiteTailles() {
  const trio = pick([
    ['🔸', '🔶', '🟠'], ['▪️', '◾', '⬛'], ['🤏', '✋', '🙌'],
  ]);
  const longueur = 7 + Math.floor(Math.random() * 2);
  const suite = Array.from({ length: longueur }, (_, i) => trio[i % 3]);
  const trou = 3 + Math.floor(Math.random() * (longueur - 3));
  const correct = suite[trou];
  const affichee = suite.map((s, i) => (i === trou ? '❓' : s)).join(' ');
  const distracteurs = trio.filter((t) => t !== correct);
  const extra = shuffle(itemGroups.flat()).slice(0, 1);
  return {
    category: 'nyla_patterns',
    type: 'suite_tailles',
    text: `Qu'est-ce qui va dans le ❓?\n\n${affichee}`,
    correct,
    options: shuffle([correct, ...distracteurs, ...extra]),
    explanation: `La suite va du plus petit au plus grand, puis recommence: ${trio.join(' ')}.`,
    hint: 'Regarde les tailles: ça monte, puis ça recommence au plus petit.',
  };
}

function buildOne() {
  const r = Math.random();
  if (r < 0.6) return buildMotif();
  if (r < 0.9) return buildSuiteNombres() || buildMotif();
  return buildSuiteTailles();
}

export function generateNylaPatterns() {
  return withFresh('nyla_patterns', buildOne, 80, 25, (q) => `${q.type}|${q.text}`);
}
