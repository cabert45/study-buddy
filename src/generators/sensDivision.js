// Le sens de la division — Aide-mémoire Matcha p. 24
// (feuille « Plan de travail, semaine du 23 au 27 novembre 2026 »).
//
// Pas encore les tables de division par cœur: ce que ÷ VEUT DIRE.
//   • PARTAGER également — 12 billes dans 3 sacs: combien dans CHAQUE sac?
//   • FAIRE DES GROUPES — 12 billes, 4 par sac: combien de SACS?
//   • la division défait la multiplication: 12 ÷ 3 = 4 parce que 3 × 4 = 12.
//
// Les pièges qu'on surveille (mêmes réflexes qu'en situation-problème: il
// prend les nombres de l'énoncé sans se demander ce qu'ils sont):
//   • il MULTIPLIE (12 et 3 → 36), il SOUSTRAIT (→ 9), il ADDITIONNE (→ 15).
// Chacun reçoit son propre message.
//
// Les points (●) sont dessinés par le code — jamais une image générée.
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
  { groupe: 'sacs', de: 'billes', un: 'sac' },
  { groupe: 'boîtes', de: 'crayons', un: 'boîte' },
  { groupe: 'assiettes', de: 'biscuits', un: 'assiette' },
  { groupe: 'équipes', de: 'joueurs', un: 'équipe' },
  { groupe: 'paquets', de: 'cartes de hockey', un: 'paquet' },
  { groupe: 'vases', de: 'fleurs', un: 'vase' },
];
const AMIS = ['Ryan', 'Nyla', 'Cayla', 'Léo', 'Maya', 'Zoé'];

const rangees = (r, c) => Array.from({ length: r }, () => Array(c).fill('●').join(' ')).join('\n');

function base(type, extra) {
  return { category: 'sens_division', type, ...extra };
}

// total ÷ d = q. Les mauvaises opérations, chacune avec son message.
function presqueOps(total, d, q) {
  const p = {};
  const add = (v, msg) => { if (v !== q && v > 0 && !p[v]) p[v] = msg; };
  add(total * d, `Tu as MULTIPLIÉ ${total} par ${d}. Mais on PARTAGE ${total}: la réponse est plus PETITE que ${total}.`);
  add(total - d, `Tu as enlevé ${d} une seule fois. Diviser, c'est enlever ${d} encore et encore: ${total} ÷ ${d}.`);
  add(total + d, `Tu as ADDITIONNÉ. Quand on partage, on n'en ajoute pas: ${total} ÷ ${d}.`);
  return p;
}

const pourquoi = (total, d, q) => `${total} ÷ ${d} = ${q}, parce que ${d} × ${q} = ${total}.`;

// 1. Partage: combien dans chaque groupe? (tapé)
function partage() {
  const d = rand(2, 6), q = rand(2, 6), total = d * q, o = pick(OBJETS);
  return base('partage', {
    text: `On partage ${total} ${o.de} également dans ${d} ${o.groupe}.\nCombien de ${o.de} dans chaque ${o.un}?`,
    correct: q,
    useDigitPad: true,
    presque: presqueOps(total, d, q),
    hint: `Distribue un à la fois dans les ${d} ${o.groupe}, comme des cartes, jusqu'à ce qu'il n'en reste plus.`,
    explanation: `${total} partagés en ${d} groupes égaux → ${q} dans chaque ${o.un}.\n${pourquoi(total, d, q)}`,
  });
}

// 2. Groupement: combien de groupes? (tapé)
function groupement() {
  const n = rand(2, 6), g = rand(2, 6), total = n * g, o = pick(OBJETS);
  return base('groupement', {
    text: `Il y a ${total} ${o.de}. On en met ${n} dans chaque ${o.un}.\nCombien de ${o.groupe} faut-il?`,
    correct: g,
    useDigitPad: true,
    presque: presqueOps(total, n, g),
    hint: `Fais des paquets de ${n}: ${n}, ${2 * n}, ${3 * n}… jusqu'à ${total}. Compte les paquets.`,
    explanation: `${total} en paquets de ${n} → ${g} ${o.groupe}.\n${pourquoi(total, n, g)}`,
  });
}

// 3. Rangées dessinées: partager en rangées égales (tapé)
function rectangle() {
  const r = rand(2, 4), c = rand(3, 6), total = r * c;
  return base('rectangle', {
    text: `${rangees(r, c)}\n\nCes ${total} points sont placés en ${r} rangées égales.\nCombien de points dans chaque rangée?`,
    correct: c,
    useDigitPad: true,
    presque: presqueOps(total, r, c),
    hint: 'Compte les points dans UNE seule rangée.',
    explanation: `${total} points en ${r} rangées → ${c} par rangée. ${total} ÷ ${r} = ${c}, parce que ${r} × ${c} = ${total}.`,
  });
}

// 4. La multiplication qui va avec (choix)
function famille() {
  const d = rand(2, 6), q = rand(2, 7);
  if (d === q) return famille();
  const total = d * q;
  const bonne = `${d} × ${q} = ${total}`;
  return base('famille', {
    text: `${total} ÷ ${d} = ${q}\nQuelle multiplication le prouve?`,
    correct: bonne,
    options: shuffle([bonne, `${total} × ${d} = ${total * d}`, `${d} + ${q} = ${d + q}`, `${total} − ${d} = ${total - d}`]),
    hint: 'La division DÉFAIT la multiplication. Multiplie la réponse par le nombre de groupes.',
    explanation: `${d} groupes de ${q}, ça fait ${total}. Donc ${total} partagé en ${d}, ça donne ${q}.`,
  });
}

// 5. Division manquante à partir d'une multiplication (tapé)
function trouverAvecMult() {
  const d = rand(2, 6), q = rand(2, 9), total = d * q;
  return base('avec_mult', {
    text: `${d} × ? = ${total}\nAlors ${total} ÷ ${d} = ?`,
    correct: q,
    useDigitPad: true,
    presque: presqueOps(total, d, q),
    hint: `Compte par bonds de ${d} jusqu'à ${total}: combien de bonds?`,
    explanation: `${d} × ${q} = ${total}, donc ${total} ÷ ${d} = ${q}.`,
  });
}

// 6. Partager ou multiplier? La situation décide. (tapé)
function situation() {
  const a = rand(2, 5), b = rand(2, 6), o = pick(OBJETS), ami = pick(AMIS);
  const total = a * b;
  const r = Math.random();
  if (r < 0.4) {
    return base('situation', {
      text: `${ami} partage ${total} ${o.de} également entre ${a} amis.\nCombien chaque ami en reçoit-il?`,
      correct: b,
      useDigitPad: true,
      presque: presqueOps(total, a, b),
      hint: '« Partage également » → c\'est une division.',
      explanation: `Partager ${total} entre ${a}: ${total} ÷ ${a} = ${b}. Vérifie: ${a} × ${b} = ${total}.`,
    });
  }
  if (r < 0.7) {
    return base('situation', {
      text: `${ami} range ${total} ${o.de}, ${b} par ${o.un}.\nCombien de ${o.groupe} faut-il?`,
      correct: a,
      useDigitPad: true,
      presque: presqueOps(total, b, a),
      hint: `Des paquets de ${b}: combien de paquets dans ${total}?`,
      explanation: `${total} ÷ ${b} = ${a}. Vérifie: ${a} × ${b} = ${total}.`,
    });
  }
  // La contre-épreuve: ici, c'est une multiplication.
  return base('situation', {
    text: `On a ${a} ${o.groupe}. Dans chaque ${o.un}, il y a ${b} ${o.de}.\nCombien de ${o.de} en tout?`,
    correct: total,
    useDigitPad: true,
    presque: a + b === total ? {} : { [a + b]: `Tu as additionné. ${a} groupes de ${b}, c'est ${a} × ${b}.` },
    hint: '« Dans chaque » et on cherche le TOUT → c\'est une multiplication cette fois.',
    explanation: `On cherche le tout: ${a} × ${b} = ${total}. (Attention: pas toujours une division!)`,
  });
}

// 7. Le symbole et la lecture (choix)
function lecture() {
  const d = rand(2, 5), q = rand(2, 6), total = d * q;
  return base('lecture', {
    text: `« ${total} ÷ ${d} » veut dire…`,
    correct: `${total} partagé en ${d} parts égales`,
    options: shuffle([
      `${total} partagé en ${d} parts égales`,
      `${total} groupes de ${d}`,
      `${total} et ${d} de plus`,
      `${d} partagé en ${total} parts`,
    ]),
    hint: '÷ se lit « divisé par ». On part du GRAND nombre, et on le partage.',
    explanation: `${total} ÷ ${d}: on partage ${total} en ${d} parts égales → ${q} dans chaque part.`,
  });
}

function construire() {
  const r = Math.random();
  if (r < 0.2) return partage();
  if (r < 0.38) return groupement();
  if (r < 0.5) return rectangle();
  if (r < 0.62) return famille();
  if (r < 0.74) return trouverAvecMult();
  if (r < 0.92) return situation();
  return lecture();
}

export function generateSensDivision() {
  return withFresh('sens_division', construire, 50, 20, (q) => q.text);
}
