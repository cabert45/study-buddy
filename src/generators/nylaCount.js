// Nyla — Compter (maternelle 5 ans)
//
// ⚠️ Avant, cet exercice s'arrêtait à 10 et posait toujours la même question:
// « Combien de pommes? » avec une rangée d'emojis. Elle avait tout juste, donc
// elle ne progressait plus. La maternelle 5 ans va bien plus loin: dénombrer
// jusqu'à 30, reconnaître une quantité d'un coup d'œil (le dé, les doigts),
// compter des objets mélangés, et dire quel nombre vient juste après.
//
// Six paliers, du plus simple au plus exigeant. Un palier s'ouvre quand le
// précédent est solide (voir utils/nylaNiveau) — elle ne saute pas d'étape,
// mais elle n'en refait pas une qu'elle maîtrise.
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
  { nom: 'pommes', icon: '🍎' }, { nom: 'étoiles', icon: '⭐' }, { nom: 'cœurs', icon: '❤️' },
  { nom: 'fleurs', icon: '🌸' }, { nom: 'papillons', icon: '🦋' }, { nom: 'soleils', icon: '☀️' },
  { nom: 'lunes', icon: '🌙' }, { nom: 'poissons', icon: '🐟' }, { nom: 'oiseaux', icon: '🐦' },
  { nom: 'arbres', icon: '🌳' }, { nom: 'ballons', icon: '🎈' }, { nom: 'gâteaux', icon: '🍰' },
  { nom: 'fraises', icon: '🍓' }, { nom: 'abeilles', icon: '🐝' }, { nom: 'chats', icon: '🐱' },
  { nom: 'voitures', icon: '🚗' }, { nom: 'bonbons', icon: '🍬' }, { nom: 'coccinelles', icon: '🐞' },
];

// Les faces du dé et les doigts: reconnaître une quantité SANS compter.
const DES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
const MAINS = { 1: '☝️', 2: '✌️', 5: '🖐️' };

// Options numériques serrées autour de la réponse: si les mauvais choix sont
// loin, elle trouve sans compter.
function optionsAutour(n, min, max) {
  const proches = [n - 2, n - 1, n + 1, n + 2, n - 3, n + 3]
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

// Une rangée d'objets. Au-delà de 10, on groupe par 5 pour qu'elle apprenne à
// compter par paquets au lieu de perdre le fil un par un.
function rangee(icon, n) {
  if (n <= 10) return icon.repeat(n);
  const lignes = [];
  for (let i = 0; i < n; i += 5) lignes.push(icon.repeat(Math.min(5, n - i)));
  return lignes.join('  ');
}

function compter(min, max, type) {
  const t = pick(themes);
  const n = rand(min, max);
  return {
    category: 'nyla_count',
    type,
    text: `Combien de ${t.nom}?\n\n${rangee(t.icon, n)}`,
    correct: String(n),
    options: optionsAutour(n, 1, max + 3),
    explanation: n > 10
      ? `Il y en a ${n}. Compte par paquets de 5: ${Array.from({ length: Math.ceil(n / 5) }, (_, i) => Math.min((i + 1) * 5, n)).join(', ')}.`
      : `Il y en a ${n}. Compte un par un: ${Array.from({ length: n }, (_, i) => i + 1).join(', ')}.`,
    hint: n > 10
      ? 'Compte un paquet de 5, puis continue: 5, 10, 15...'
      : 'Pointe chaque objet avec ton doigt et compte un par un.',
  };
}

// Reconnaître la quantité d'un coup d'œil (dé ou doigts) — sans compter.
function buildSubitize() {
  const surDe = Math.random() < 0.6;
  const n = surDe ? rand(1, 6) : pick([1, 2, 5]);
  const visuel = surDe ? DES[n - 1] : MAINS[n];
  return {
    category: 'nyla_count',
    type: 'subitize',
    text: `Combien ça fait? Essaie de le voir SANS compter.\n\n${visuel}`,
    correct: String(n),
    options: optionsAutour(n, 1, 8),
    explanation: surDe
      ? `${visuel} c'est ${n}. Les faces du dé, on finit par les reconnaître d'un coup d'œil.`
      : `${visuel} c'est ${n} doigts.`,
    hint: 'Regarde la forme des points. Tu la connais déjà!',
  };
}

// Deux paquets à compter ensemble — le pont vers l'addition.
function buildDeuxGroupes() {
  const t1 = pick(themes);
  const t2 = pick(themes.filter((t) => t.icon !== t1.icon));
  const a = rand(2, 6);
  const b = rand(2, 6);
  const n = a + b;
  return {
    category: 'nyla_count',
    type: 'deux_groupes',
    text: `Combien d'objets en tout?\n\n${t1.icon.repeat(a)}  ${t2.icon.repeat(b)}`,
    correct: String(n),
    options: optionsAutour(n, 1, 15),
    explanation: `${a} ${t1.nom} et ${b} ${t2.nom}, ça fait ${n} objets en tout.`,
    hint: 'Compte le premier paquet, puis CONTINUE de compter sur le deuxième.',
  };
}

// Quel nombre vient juste après / juste avant.
function buildApresAvant() {
  const apres = Math.random() < 0.5;
  const n = rand(1, 29);
  const correct = apres ? n + 1 : n - 1;
  if (correct < 0) return null;
  return {
    category: 'nyla_count',
    type: 'apres_avant',
    text: apres
      ? `Quel nombre vient JUSTE APRÈS ${n}?`
      : `Quel nombre vient JUSTE AVANT ${n}?`,
    correct: String(correct),
    options: optionsAutour(correct, 0, 32),
    explanation: apres
      ? `Après ${n}, on dit ${correct}. Un de plus.`
      : `Avant ${n}, on dit ${correct}. Un de moins.`,
    hint: apres ? 'Compte tout haut et écoute le nombre suivant.' : 'Compte tout haut et arrête-toi juste avant.',
  };
}

// Combien il en manque pour arriver à 5 ou à 10 — les compléments, la base
// de l'addition en 1re année.
function buildCombienManque() {
  const cible = Math.random() < 0.5 ? 5 : 10;
  const a = rand(1, cible - 1);
  const manque = cible - a;
  const t = pick(themes);
  return {
    category: 'nyla_count',
    type: 'combien_manque',
    text: `Il en faut ${cible} en tout. Combien il en MANQUE?\n\n${t.icon.repeat(a)}`,
    correct: String(manque),
    options: optionsAutour(manque, 0, cible + 2),
    explanation: `Il y en a ${a}, et il en faut ${cible}. ${a} + ${manque} = ${cible}.`,
    hint: `Compte sur tes doigts à partir de ${a} jusqu'à ${cible}.`,
  };
}

export function generateNylaCount() {
  // Les quatre `count_*` sont la ligne de difficulté: 1-5, puis 1-10, puis
  // jusqu'à 20, puis jusqu'à 30, chacun ouvert par le précédent.
  // Les autres sont des FORMATS, pas des niveaux: ils restent disponibles tout
  // le temps, pour que six questions d'affilée ne se ressemblent jamais.
  const entries = entreesOuvertes('nyla_count', [
    { type: 'count_5', w: 1.5, build: () => compter(1, 5, 'count_5') },
    { type: 'count_10', w: 3, build: () => compter(4, 10, 'count_10') },
    { type: 'count_20', w: 3, build: () => compter(11, 20, 'count_20') },
    { type: 'count_30', w: 2.5, build: () => compter(21, 30, 'count_30') },
    { type: 'subitize', w: 2, horsPalier: true, build: buildSubitize },
    { type: 'apres_avant', w: 2.5, horsPalier: true, build: buildApresAvant },
    { type: 'deux_groupes', w: 2, horsPalier: true, build: buildDeuxGroupes },
    { type: 'combien_manque', w: 2, horsPalier: true, build: buildCombienManque },
  ]);
  return pickAdaptive('nyla_count', entries, (q) => `${q.type}|${q.text}`);
}
