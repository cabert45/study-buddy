// Le sens de la multiplication — Aide-mémoire Matcha p. 23
// (feuille « Plan de travail, semaine du 16 au 20 novembre 2026 »).
//
// Ce n'est PAS encore les tables par cœur (ça, c'est le « répertoire mémorisé
// × et ÷ », plus loin dans le thème 3). C'est ce que × VEUT DIRE:
//   • des groupes égaux — 3 sacs de 4 billes;
//   • une addition répétée — 4 + 4 + 4 = 3 × 4 (« 3 fois 4 »);
//   • une disposition rectangulaire — 3 rangées de 4;
//   • les mots: les FACTEURS (3 et 4) et le PRODUIT (12).
//
// Le piège qu'on surveille: ADDITIONNER les deux nombres (3 sacs de 4 → 7).
// C'est la même erreur que celle qui sort en situation-problème: il prend
// les nombres de l'énoncé et les additionne sans se demander ce qu'ils sont.
//
// Les rangées sont dessinées avec des points (●), pas des émojis: le dessin
// se compte, et le code les dessine juste (jamais une image générée — elle se
// trompe dans le compte, voir la mémoire du graphiste).
import { withFresh } from '../utils/antiRepeat';

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const OBJETS = [
  { groupe: 'sacs', de: 'billes' },
  { groupe: 'boîtes', de: 'crayons' },
  { groupe: 'assiettes', de: 'biscuits' },
  { groupe: 'équipes', de: 'joueurs' },
  { groupe: 'paquets', de: 'cartes de hockey' },
  { groupe: 'étagères', de: 'livres' },
  { groupe: 'vases', de: 'fleurs' },
];

const rangees = (r, c) => Array.from({ length: r }, () => Array(c).fill('●').join(' ')).join('\n');
const repetee = (n, fois) => Array(fois).fill(n).join(' + ');

function base(type, extra) {
  return { category: 'sens_multiplication', type, ...extra };
}

// L'erreur « j'additionne les deux nombres » reçoit son propre message.
// (2 et 2: 2 + 2 = 2 × 2 — là, additionner donne la bonne réponse.)
const presqueAddition = (g, n) => (g + n === g * n ? {} : {
  [g + n]: `Tu as ADDITIONNÉ ${g} et ${n}. Mais il y a ${g} groupes, et chacun en a ${n}: c'est ${g} fois ${n}.`,
});

// 1. Groupes égaux → combien en tout? (tapé)
function groupesEgaux() {
  const g = rand(2, 6), n = rand(2, 6), o = pick(OBJETS);
  return base('groupes', {
    text: `${g} ${o.groupe} de ${n} ${o.de}.\nCombien de ${o.de} en tout?`,
    correct: g * n,
    useDigitPad: true,
    presque: presqueAddition(g, n),
    hint: `${g} groupes égaux de ${n}: compte par bonds de ${n}.`,
    explanation: `${repetee(n, g)} = ${g * n}\nC'est ${g} fois ${n}: ${g} × ${n} = ${g * n}.`,
  });
}

// 2. Addition répétée → quelle multiplication? (choix: la tâche est de reconnaître)
function additionVersMult() {
  const g = rand(2, 6), n = rand(2, 7);
  if (g === n) return additionVersMult();
  const bonne = `${g} × ${n}`;
  // Pas « n × g » parmi les leurres: ce serait aussi juste (même produit).
  const options = shuffle([bonne, `${g} + ${n}`, `${n} × ${n}`, `${g} × ${g}`]);
  return base('addition_repetee', {
    text: `${repetee(n, g)}\nQuelle multiplication veut dire la même chose?`,
    correct: bonne,
    options,
    hint: `Combien de fois vois-tu le ${n}? C'est le nombre de groupes.`,
    explanation: `Le ${n} est écrit ${g} fois → ${g} fois ${n} → ${g} × ${n} = ${g * n}.`,
  });
}

// 3. Multiplication → addition répétée (choix)
function multVersAddition() {
  const g = rand(2, 5), n = rand(2, 9);
  if (g === n) return multVersAddition();
  const bonne = repetee(n, g);
  // Les leurres: additionner les deux nombres, une fois de trop, une fois de
  // moins. Jamais « le g, n fois »: ce serait AUSSI juste (même produit).
  const options = shuffle([bonne, `${g} + ${n}`, repetee(n, g + 1), g > 2 ? repetee(n, g - 1) : repetee(n, g + 2)]);
  return base('mult_addition', {
    text: `${g} × ${n}, c'est la même chose que…`,
    correct: bonne,
    options,
    hint: `${g} × ${n} se lit « ${g} fois ${n} »: le ${n}, ${g} fois.`,
    explanation: `${g} × ${n} = ${bonne} = ${g * n}.`,
  });
}

// 4. Disposition rectangulaire dessinée → combien de points? (tapé)
function rectangle() {
  const r = rand(2, 5), c = rand(3, 6);
  return base('rectangle', {
    text: `${rangees(r, c)}\n\nCombien de rangées? Combien dans chaque rangée?\nCombien de points en tout?`,
    correct: r * c,
    useDigitPad: true,
    presque: presqueAddition(r, c),
    hint: `${r} rangées de ${c}: ${repetee(c, r)}.`,
    explanation: `${r} rangées de ${c} points → ${r} × ${c} = ${r * c}.`,
  });
}

// 5. Disposition rectangulaire → quelle multiplication? (choix)
function rectangleVersMult() {
  const r = rand(2, 5), c = rand(3, 6);
  if (r === c) return rectangleVersMult();
  const bonne = `${r} × ${c}`;
  return base('rectangle_mult', {
    text: `${rangees(r, c)}\n\nQuelle multiplication décrit ce rectangle?`,
    correct: bonne,
    options: shuffle([bonne, `${r} + ${c}`, `${r} × ${c + 1}`, `${r + 1} × ${c}`]),
    hint: 'Compte les rangées (de haut en bas), puis les points dans UNE rangée.',
    explanation: `${r} rangées × ${c} points par rangée = ${r * c}. (${c} × ${r} donne le même produit: on a juste tourné le rectangle.)`,
  });
}

// 6. Les mots: facteur et produit (choix)
function vocabulaire() {
  const a = rand(2, 6), b = rand(3, 9);
  const p = a * b;
  if (Math.random() < 0.5) {
    return base('produit', {
      text: `${a} × ${b} = ${p}\nComment s'appelle le ${p}?`,
      correct: 'le produit',
      options: shuffle(['le produit', 'un facteur', 'la somme', 'la différence']),
      hint: 'Le résultat d\'une multiplication a un nom spécial.',
      explanation: `${a} et ${b} sont les FACTEURS. ${p}, le résultat, est le PRODUIT.\n(Le résultat d'une addition, c'est la somme.)`,
    });
  }
  return base('facteur', {
    text: `${a} × ${b} = ${p}\nComment s'appellent ${a} et ${b}?`,
    correct: 'les facteurs',
    options: shuffle(['les facteurs', 'les produits', 'les termes', 'les sommes']),
    hint: 'Ce sont les nombres qu\'on multiplie.',
    explanation: `On multiplie des FACTEURS (${a} et ${b}) pour obtenir un PRODUIT (${p}).`,
  });
}

// 7. Situation: multiplier ou additionner? (tapé) — le cœur du piège.
function situation() {
  const g = rand(3, 6), n = rand(3, 8), o = pick(OBJETS);
  return base('situation', {
    text: `Ryan a ${g} ${o.groupe}. Dans chaque ${o.groupe.replace(/s$/, '')}, il y a ${n} ${o.de}.\nCombien de ${o.de} a-t-il?`,
    correct: g * n,
    useDigitPad: true,
    presque: presqueAddition(g, n),
    hint: `« Dans CHAQUE » = des groupes égaux. Ce n'est pas ${g} + ${n}.`,
    explanation: `${g} groupes de ${n} → ${g} × ${n} = ${g * n}.\n(${repetee(n, g)} = ${g * n})`,
  });
}

// 8. Le même produit dans les deux sens (tapé)
function commutatif() {
  const a = rand(2, 6), b = rand(3, 9);
  if (a === b) return commutatif();
  return base('commutatif', {
    text: `${a} × ${b} = ${a * b}\nAlors ${b} × ${a} = ?`,
    correct: a * b,
    useDigitPad: true,
    hint: 'Tourne le rectangle d\'un quart de tour: il a encore autant de points.',
    explanation: `${a} rangées de ${b} ou ${b} rangées de ${a}: c'est le même nombre de points. ${b} × ${a} = ${a * b}.`,
  });
}

function construire() {
  const r = Math.random();
  if (r < 0.16) return groupesEgaux();
  if (r < 0.30) return additionVersMult();
  if (r < 0.40) return multVersAddition();
  if (r < 0.56) return rectangle();
  if (r < 0.66) return rectangleVersMult();
  if (r < 0.76) return vocabulaire();
  if (r < 0.92) return situation();
  return commutatif();
}

export function generateSensMultiplication() {
  return withFresh('sens_multiplication', construire, 60, 20, (q) => `${q.type}|${q.text}`);
}
