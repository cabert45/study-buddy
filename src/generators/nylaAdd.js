// Nyla — Ajouter et enlever (maternelle 5 ans)
//
// ⚠️ Avant: toujours « 1-5 plus 1-5 », donc jamais plus que 10, et une seule
// façon de poser la question. Trop facile, et six questions d'affilée se
// ressemblaient toutes.
//
// Maintenant: additionner ET enlever, avec des paliers qui s'ouvrent quand le
// précédent est solide, plus les formats que la maternelle 5 ans travaille
// vraiment — « il en arrive deux de plus », « il en reste combien », et les
// compléments (combien pour faire 10).
import { pickAdaptive } from '../utils/skillStats';
import { entreesOuvertes } from '../utils/nylaNiveau';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }

const themes = [
  { nom: 'pommes', icon: '🍎' }, { nom: 'étoiles', icon: '⭐' }, { nom: 'poissons', icon: '🐠' },
  { nom: 'fleurs', icon: '🌸' }, { nom: 'papillons', icon: '🦋' }, { nom: 'fraises', icon: '🍓' },
  { nom: 'ballons', icon: '🎈' }, { nom: 'petits gâteaux', icon: '🧁' }, { nom: 'abeilles', icon: '🐝' },
  { nom: 'coccinelles', icon: '🐞' }, { nom: 'bonbons', icon: '🍬' }, { nom: 'oiseaux', icon: '🐦' },
];

function optionsAutour(n, min, max) {
  const proches = [n - 1, n + 1, n - 2, n + 2, n - 3, n + 3]
    .filter((x) => x >= min && x <= max && x !== n);
  const opts = shuffle(proches).slice(0, 3);
  for (let d = 1; opts.length < 3 && d < 30; d++) {
    for (const cand of [n - d, n + d]) {
      if (cand >= min && cand <= max && cand !== n && !opts.includes(cand)) opts.push(cand);
      if (opts.length >= 3) break;
    }
  }
  return shuffle([n, ...opts]).map(String);
}

// Addition avec les deux paquets dessinés.
function additionner(max, type) {
  const t = pick(themes);
  const a = rand(1, Math.max(1, max - 1));
  const b = rand(1, Math.max(1, max - a));
  const n = a + b;
  return {
    category: 'nyla_add',
    type,
    text: `Combien y en a-t-il EN TOUT?\n\n${t.icon.repeat(a)}   +   ${t.icon.repeat(b)}`,
    correct: String(n),
    options: optionsAutour(n, 0, max + 3),
    explanation: `${a} + ${b} = ${n}. Compte le premier paquet, puis continue sur le deuxième.`,
    hint: `Pars de ${a} et continue à compter: ${Array.from({ length: Math.min(b, 5) }, (_, i) => a + i + 1).join(', ')}...`,
  };
}

// Soustraction: on en enlève, il en reste combien.
function enlever(max, type) {
  const t = pick(themes);
  const total = rand(3, max);
  const enleves = rand(1, total - 1);
  const reste = total - enleves;
  return {
    category: 'nyla_add',
    type,
    text: `Il y en avait ${total}. On en enlève ${enleves}.\nIl en RESTE combien?\n\n${t.icon.repeat(reste)}${'✖️'.repeat(enleves)}`,
    correct: String(reste),
    options: optionsAutour(reste, 0, max),
    explanation: `${total} − ${enleves} = ${reste}. Les ✖️ sont ceux qu'on a enlevés.`,
    hint: 'Compte seulement ceux qui restent — pas les ✖️.',
  };
}

// Une petite histoire: il en arrive / il en part.
function buildHistoire() {
  const t = pick(themes);
  const plus = Math.random() < 0.5;
  const a = rand(2, 8);
  const b = rand(1, plus ? 6 : a - 1);
  const n = plus ? a + b : a - b;
  return {
    category: 'nyla_add',
    type: 'histoire',
    text: plus
      ? `Il y a ${a} ${t.nom}. ${b} autres arrivent. Combien y en a-t-il maintenant?\n\n${t.icon.repeat(a)}`
      : `Il y a ${a} ${t.nom}. ${b} s'en vont. Combien en reste-t-il?\n\n${t.icon.repeat(a)}`,
    correct: String(n),
    options: optionsAutour(n, 0, 16),
    explanation: plus ? `${a} + ${b} = ${n}.` : `${a} − ${b} = ${n}.`,
    hint: plus
      ? `Pars de ${a} et avance de ${b} sur tes doigts.`
      : `Pars de ${a} et recule de ${b} sur tes doigts.`,
  };
}

// Les compléments: combien pour arriver à 10. La base du calcul de 1re année.
function buildComplement() {
  const cible = pick([5, 10, 10]);
  const a = rand(1, cible - 1);
  const manque = cible - a;
  const t = pick(themes);
  return {
    category: 'nyla_add',
    type: 'complement',
    text: `Combien il en faut de PLUS pour arriver à ${cible}?\n\n${t.icon.repeat(a)}`,
    correct: String(manque),
    options: optionsAutour(manque, 0, cible),
    explanation: `${a} + ${manque} = ${cible}.`,
    hint: `Montre ${a} doigts. Combien il t'en reste pour faire ${cible}?`,
  };
}

// Le double: 3 et 3, 4 et 4… un fait que les enfants retiennent vite et qui
// sert de point d'appui pour tout le reste.
function buildDouble() {
  const a = rand(1, 8);
  const n = a + a;
  const t = pick(themes);
  return {
    category: 'nyla_add',
    type: 'double',
    text: `Le DOUBLE: ${a} et encore ${a}, ça fait combien?\n\n${t.icon.repeat(a)}   +   ${t.icon.repeat(a)}`,
    correct: String(n),
    options: optionsAutour(n, 0, 20),
    explanation: `${a} + ${a} = ${n}. C'est le double de ${a}.`,
    hint: `Montre ${a} doigts sur chaque main et compte-les tous.`,
  };
}

export function generateNylaAdd() {
  const entries = entreesOuvertes('nyla_add', [
    { type: 'add_5', w: 1.5, build: () => additionner(5, 'add_5') },
    { type: 'add_10', w: 3, build: () => additionner(10, 'add_10') },
    { type: 'moins_10', w: 3, build: () => enlever(10, 'moins_10') },
    { type: 'add_15', w: 2.5, build: () => additionner(15, 'add_15') },
    { type: 'histoire', w: 2.5, horsPalier: true, build: buildHistoire },
    { type: 'complement', w: 2.5, horsPalier: true, build: buildComplement },
    { type: 'double', w: 2, horsPalier: true, build: buildDouble },
  ]);
  return pickAdaptive('nyla_add', entries, (q) => `${q.type}|${q.text}`);
}
