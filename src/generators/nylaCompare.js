// Nyla — Comparer (maternelle 5 ans)
//
// ⚠️ Avant: des paquets de 1 à 7, et seulement trois choix (« Groupe A »,
// « Groupe B », « Les deux pareils »). Une chance sur trois de tomber juste
// sans rien compter, et toujours la même question.
//
// Maintenant: des quantités plus grandes qui s'ouvrent par paliers, trois
// paquets à classer, la comparaison de deux NOMBRES écrits (sans dessin), et
// « combien de plus » — qui est le vrai début de la soustraction.
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

const icons = ['🍎', '⭐', '🐠', '🌸', '🦋', '🍓', '🎈', '🐝', '🌻', '🍬', '🐞', '🧁'];

// Au-delà de 10, on groupe par 5: sinon la rangée devient illisible et
// l'exercice ne mesure plus que sa patience.
function rangee(icon, n) {
  if (n <= 10) return icon.repeat(n);
  const parts = [];
  for (let i = 0; i < n; i += 5) parts.push(icon.repeat(Math.min(5, n - i)));
  return parts.join(' ');
}

// Deux paquets: lequel a le plus / le moins.
function deuxPaquets(max, type) {
  const icon = pick(icons);
  const plus = Math.random() < 0.5;
  const a = rand(1, max);
  let b = rand(1, max);
  // Un écart de 1 ou 2 force un vrai dénombrement; un gros écart se voit.
  if (Math.abs(a - b) > 3) b = a + (Math.random() < 0.5 ? 1 : -1) * rand(1, 3);
  if (b === a || b < 1 || b > max) b = a === max ? a - 1 : a + 1;

  const gagnant = plus ? (a > b ? 'A' : 'B') : (a < b ? 'A' : 'B');
  return {
    category: 'nyla_compare',
    type,
    text: `Quel groupe a le ${plus ? 'PLUS' : 'MOINS'} de ${icon}?\n\nA:  ${rangee(icon, a)}\nB:  ${rangee(icon, b)}`,
    correct: `Groupe ${gagnant}`,
    options: shuffle(['Groupe A', 'Groupe B', 'Les deux pareils']),
    explanation: `A en a ${a}, B en a ${b}. Le ${plus ? 'plus' : 'moins'}, c'est le groupe ${gagnant}.`,
    hint: 'Compte chaque rangée, puis compare les deux nombres.',
  };
}

// Autant l'un que l'autre — il faut vraiment compter pour le voir.
function buildAutant() {
  const icon = pick(icons);
  const pareils = Math.random() < 0.5;
  const a = rand(4, 12);
  const b = pareils ? a : a + (Math.random() < 0.5 ? 1 : -1);
  if (b < 1) return null;
  return {
    category: 'nyla_compare',
    type: 'autant',
    text: `Est-ce qu'il y en a AUTANT dans les deux groupes?\n\nA:  ${rangee(icon, a)}\nB:  ${rangee(icon, b)}`,
    correct: pareils ? 'Oui, autant' : 'Non, pas pareil',
    options: shuffle(['Oui, autant', 'Non, pas pareil']),
    explanation: pareils
      ? `Oui: ${a} d'un côté et ${b} de l'autre. C'est pareil.`
      : `Non: ${a} d'un côté et ${b} de l'autre.`,
    hint: 'Compte les deux rangées. Un seul de différence, ça compte!',
  };
}

// Comparer deux nombres ÉCRITS, sans dessin: elle doit connaître l'ordre.
function buildNombres(max, type) {
  const plus = Math.random() < 0.5;
  const a = rand(1, max);
  let b = rand(1, max);
  while (b === a) b = rand(1, max);
  const correct = plus ? Math.max(a, b) : Math.min(a, b);
  return {
    category: 'nyla_compare',
    type,
    text: `Quel nombre est le PLUS ${plus ? 'GRAND' : 'PETIT'}?\n\n${a}     ${b}`,
    correct: String(correct),
    options: shuffle([String(a), String(b)]),
    explanation: `${correct} est le plus ${plus ? 'grand' : 'petit'}. Quand on compte, on dit ${Math.min(a, b)} avant ${Math.max(a, b)}.`,
    hint: 'Pense à la file des nombres: celui qu\'on dit en dernier est le plus grand.',
  };
}

// Trois paquets à classer — le plus grand des trois.
function buildTrois() {
  const icon = pick(icons);
  const plus = Math.random() < 0.5;
  const vals = [];
  while (vals.length < 3) {
    const v = rand(2, 14);
    if (!vals.includes(v)) vals.push(v);
  }
  const [a, b, c] = vals;
  const cible = plus ? Math.max(a, b, c) : Math.min(a, b, c);
  const lettre = ['A', 'B', 'C'][vals.indexOf(cible)];
  return {
    category: 'nyla_compare',
    type: 'trois_groupes',
    text: `Quel groupe a le ${plus ? 'PLUS' : 'MOINS'} de ${icon}?\n\nA:  ${rangee(icon, a)}\nB:  ${rangee(icon, b)}\nC:  ${rangee(icon, c)}`,
    correct: `Groupe ${lettre}`,
    options: shuffle(['Groupe A', 'Groupe B', 'Groupe C']),
    explanation: `A: ${a}, B: ${b}, C: ${c}. Le ${plus ? 'plus' : 'moins'}, c'est ${lettre} avec ${cible}.`,
    hint: 'Compte les trois rangées et écris les nombres dans ta tête.',
  };
}

// Combien de plus — la différence, début de la soustraction.
function buildCombienDePlus() {
  const icon = pick(icons);
  const a = rand(4, 12);
  const b = rand(1, a - 1);
  const ecart = a - b;
  return {
    category: 'nyla_compare',
    type: 'combien_de_plus',
    text: `Combien le groupe A en a-t-il de PLUS que le groupe B?\n\nA:  ${rangee(icon, a)}\nB:  ${rangee(icon, b)}`,
    correct: String(ecart),
    options: shuffle([...new Set([ecart, ecart + 1, Math.max(0, ecart - 1), ecart + 2])].slice(0, 4)).map(String),
    explanation: `A en a ${a}, B en a ${b}. ${a} − ${b} = ${ecart} de plus.`,
    hint: 'Place les deux rangées l\'une sous l\'autre et compte ce qui dépasse.',
  };
}

export function generateNylaCompare() {
  const entries = entreesOuvertes('nyla_compare', [
    { type: 'deux_8', w: 2, build: () => deuxPaquets(8, 'deux_8') },
    { type: 'deux_15', w: 3, build: () => deuxPaquets(15, 'deux_15') },
    { type: 'nombres_10', w: 2.5, build: () => buildNombres(10, 'nombres_10') },
    { type: 'nombres_30', w: 2.5, build: () => buildNombres(30, 'nombres_30') },
    { type: 'autant', w: 2, horsPalier: true, build: buildAutant },
    { type: 'trois_groupes', w: 2.5, horsPalier: true, build: buildTrois },
    { type: 'combien_de_plus', w: 2, horsPalier: true, build: buildCombienDePlus },
  ]);
  return pickAdaptive('nyla_compare', entries, (q) => `${q.type}|${q.text}`);
}
