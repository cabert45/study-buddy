// Nyla — Comparer les quantités (plus / moins / pareil)
// Maternelle 5 ans: core "éveil mathématique" skill before symbolic comparison.
// Show two groups of objects, ask which group has more/less, or if they're equal.
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

const icons = ['🍎', '⭐', '🐠', '🌸', '🦋', '🍓', '🎈', '🐝', '🌻'];

function buildOne() {
  const icon = pick(icons);
  const r = Math.random();

  // Type 1 — Which group has MORE?
  if (r < 0.4) {
    const a = 2 + Math.floor(Math.random() * 6);
    let b = 1 + Math.floor(Math.random() * 7);
    while (b === a) b = 1 + Math.floor(Math.random() * 7);
    const bigger = a > b ? 'Groupe A' : 'Groupe B';
    return {
      category: 'nyla_compare',
      type: 'more',
      text: `Quel groupe a le PLUS de ${icon}?\n\nGroupe A: ${icon.repeat(a)}\nGroupe B: ${icon.repeat(b)}`,
      correct: bigger,
      options: shuffle(['Groupe A', 'Groupe B', 'Les deux pareils']),
      explanation: `${bigger} a ${Math.max(a, b)} ${icon}, l'autre a ${Math.min(a, b)}.`,
      hint: 'Compte chaque groupe et compare les nombres.',
    };
  }

  // Type 2 — Which group has LESS?
  if (r < 0.7) {
    const a = 2 + Math.floor(Math.random() * 6);
    let b = 1 + Math.floor(Math.random() * 7);
    while (b === a) b = 1 + Math.floor(Math.random() * 7);
    const smaller = a < b ? 'Groupe A' : 'Groupe B';
    return {
      category: 'nyla_compare',
      type: 'less',
      text: `Quel groupe a le MOINS de ${icon}?\n\nGroupe A: ${icon.repeat(a)}\nGroupe B: ${icon.repeat(b)}`,
      correct: smaller,
      options: shuffle(['Groupe A', 'Groupe B', 'Les deux pareils']),
      explanation: `${smaller} a seulement ${Math.min(a, b)} ${icon}, l'autre en a ${Math.max(a, b)}.`,
      hint: 'Le plus petit groupe = le moins.',
    };
  }

  // Type 3 — Equal? Sometimes yes, sometimes no
  const equal = Math.random() < 0.5;
  const a = 2 + Math.floor(Math.random() * 6);
  const b = equal ? a : (a + (Math.random() < 0.5 ? 1 : -1));
  if (b < 1) return buildOne();
  return {
    category: 'nyla_compare',
    type: 'equal',
    text: `Est-ce que les deux groupes ont la même quantité?\n\nGroupe A: ${icon.repeat(a)}\nGroupe B: ${icon.repeat(b)}`,
    correct: a === b ? 'Oui, pareils' : 'Non, différents',
    options: ['Oui, pareils', 'Non, différents'],
    explanation: a === b ? `Oui! Les deux groupes ont ${a} ${icon}.` : `Non: un groupe a ${a}, l'autre a ${b}.`,
    hint: 'Compte chaque groupe pour vérifier.',
  };
}

export function generateNylaCompare() {
  return withFresh('nyla_compare', buildOne, 60, 25, (q) => q.text);
}
