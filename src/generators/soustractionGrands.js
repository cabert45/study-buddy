// La soustraction de grands nombres — Aide-mémoire Matcha p. 22
// (feuille « Plan de travail, semaine du 16 au 20 novembre 2026 »).
//
// Ce que ses feuilles montrent (docs/passation-ryan.md, mémoire Matcha AS.1.02):
// il n'ÉCHANGE pas les blocs. En soustraction, ça donne deux erreurs connues:
//   1. « le petit ôté du grand » — 523 − 187: aux unités il fait 7 − 3 = 4
//      au lieu d'échanger une dizaine. Le résultat a l'air raisonnable, et
//      c'est justement pour ça qu'il ne le voit pas.
//   2. il échange, mais n'enlève pas la dizaine prêtée à la colonne d'à côté
//      → la réponse a 10 (ou 100) de trop.
// Et le piège de la 3e année: le ZÉRO au milieu (503 − 278). Pour avoir des
// unités, il faut d'abord aller chercher une centaine, la défaire en
// 10 dizaines, puis en défaire une en 10 unités.
//
// Toutes les réponses s'ÉCRIVENT (useDigitPad): à l'école, la case est vide.
import { withFresh } from '../utils/antiRepeat';

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const chiffres = (n, k) => String(n).padStart(k, '0').split('').map(Number);
const espace = (n) => (n >= 1000 ? `${Math.floor(n / 1000)} ${String(n % 1000).padStart(3, '0')}` : String(n));
const NOMS = ['unités', 'dizaines', 'centaines', 'unités de mille'];
const NOM1 = ['unité', 'dizaine', 'centaine', 'unité de mille'];

// Erreur 1: dans chaque colonne, le plus grand moins le plus petit.
function petitDuGrand(a, b, k) {
  const A = chiffres(a, k), B = chiffres(b, k);
  return Number(A.map((x, i) => Math.abs(x - B[i])).join(''));
}

// Les colonnes (de droite à gauche) où il faut échanger.
function echanges(a, b, k) {
  const A = chiffres(a, k).reverse(), B = chiffres(b, k).reverse();
  const out = [];
  let prete = 0;
  for (let i = 0; i < k; i++) {
    const haut = A[i] - prete;
    if (haut < B[i]) { out.push(i); prete = 1; } else prete = 0;
  }
  return out;
}

// La démarche, colonne par colonne, dans les mots du cahier: on ÉCHANGE.
function demarche(a, b, k) {
  const A = chiffres(a, k).reverse(), B = chiffres(b, k).reverse();
  const lignes = [`${espace(a)} − ${espace(b)}, colonne par colonne, en commençant par les unités:`];
  const haut = [...A];
  for (let i = 0; i < k; i++) {
    if (haut[i] < B[i]) {
      // Aller chercher à gauche, en passant par les zéros s'il le faut.
      let j = i + 1;
      while (haut[j] === 0) j++;
      const chemin = [];
      haut[j] -= 1;
      chemin.push(`on prend 1 ${NOM1[j]}`);
      for (let m = j - 1; m > i; m--) {
        haut[m] = 9;
        chemin.push(`on la défait en 10 ${NOMS[m]} (il en reste 9: la 10e descend)`);
      }
      haut[i] += 10;
      lignes.push(`• ${NOMS[i]}: ${haut[i] - 10} − ${B[i]}, pas assez! ${chemin.join(', ')} → ${haut[i]} ${NOMS[i]}. ${haut[i]} − ${B[i]} = ${haut[i] - B[i]}.`);
    } else {
      lignes.push(`• ${NOMS[i]}: ${haut[i]} − ${B[i]} = ${haut[i] - B[i]}.`);
    }
  }
  lignes.push(`Réponse: ${espace(a - b)}.`);
  lignes.push(`Vérifie avec une addition: ${espace(a - b)} + ${espace(b)} = ${espace(a)}.`);
  return lignes.join('\n');
}

function presqueDe(a, b, k) {
  const c = a - b;
  const p = {};
  const pg = petitDuGrand(a, b, k);
  if (pg !== c) {
    p[pg] = "Tu as fait « le petit moins le grand » dans une colonne. Quand le chiffre du haut est trop petit, on ÉCHANGE: on va chercher 1 dans la colonne de gauche.";
  }
  const ech = echanges(a, b, k);
  for (const i of ech) {
    const v = c + 10 ** (i + 1);
    if (!p[v]) p[v] = `Tu as bien échangé, mais la colonne des ${NOMS[i + 1]} a prêté 1: il faut l'enlever là aussi.`;
  }
  if (!p[a + b]) p[a + b] = "C'est une addition, ça! Regarde le signe: −, on enlève.";
  return p;
}

// Un nombre de k chiffres avec des contraintes sur les colonnes.
function tirer(k, verif) {
  for (let essai = 0; essai < 400; essai++) {
    const min = 10 ** (k - 1);
    const a = rand(min + 100, 10 ** k - 1);
    const b = rand(min, a - 1);
    if (verif(a, b)) return [a, b];
  }
  return [523, 187];
}

function question(a, b, k, type, texte) {
  return {
    category: 'soustraction_grands',
    type,
    text: texte || `${espace(a)} − ${espace(b)} = ?`,
    correct: a - b,
    useDigitPad: true,
    presque: presqueDe(a, b, k),
    explanation: demarche(a, b, k),
    hint: 'Commence par les unités. Si le chiffre du haut est trop petit, échange 1 de la colonne de gauche.',
  };
}

// --- Les sortes de questions ---

const emprunteUnites = () => {
  const [a, b] = tirer(3, (a, b) => { const e = echanges(a, b, 3); return e.length === 1 && e[0] === 0; });
  return question(a, b, 3, 'emprunt_unites');
};

const emprunteDizaines = () => {
  const [a, b] = tirer(3, (a, b) => { const e = echanges(a, b, 3); return e.length === 1 && e[0] === 1; });
  return question(a, b, 3, 'emprunt_dizaines');
};

const emprunteDeux = () => {
  const [a, b] = tirer(3, (a, b) => echanges(a, b, 3).length === 2 && String(a)[1] !== '0');
  return question(a, b, 3, 'emprunt_deux');
};

// 503 − 278, 700 − 246: le zéro au milieu.
const zeroAuMilieu = () => {
  const c = rand(3, 9);
  const u = Math.random() < 0.35 ? 0 : rand(0, 5);
  const a = c * 100 + u;
  const b = rand(100, a - 1);
  if ((b % 10) <= u) return zeroAuMilieu();
  return question(a, b, 3, 'zero_milieu');
};

// Les grands nombres jusqu'à 9 999 (Matcha 3e).
const quatreChiffres = () => {
  const [a, b] = tirer(4, (a, b) => echanges(a, b, 4).length >= 1 && a - b >= 100);
  return question(a, b, 4, 'quatre_chiffres');
};

const SITUATIONS = [
  (a, b) => `La bibliothèque a ${espace(a)} livres. On en prête ${espace(b)}. Combien de livres reste-t-il sur les tablettes?`,
  (a, b) => `Un album peut contenir ${espace(a)} autocollants. Ryan en a déjà collé ${espace(b)}. Combien de places reste-t-il?`,
  (a, b) => `Une route mesure ${espace(a)} mètres. Papa en a déjà roulé ${espace(b)}. Combien de mètres reste-t-il?`,
  (a, b) => `Il y a ${espace(a)} places dans l'aréna. ${espace(b)} places sont déjà vendues. Combien de places sont encore libres?`,
];

// Une situation: il doit trouver l'opération ET la faire.
const situation = () => {
  const k = Math.random() < 0.7 ? 3 : 4;
  const [a, b] = tirer(k, (a, b) => echanges(a, b, k).length >= 1);
  const q = question(a, b, k, 'situation', pick(SITUATIONS)(a, b));
  q.hint = 'On ENLÈVE ce qui est parti: c\'est une soustraction. Puis échange s\'il le faut.';
  return q;
};

// Vérifier par l'addition: le nombre manquant.
const nombreManquant = () => {
  const [a, b] = tirer(3, (a, b) => echanges(a, b, 3).length >= 1);
  const q = question(a, b, 3, 'manquant', `${espace(b)} + ? = ${espace(a)}`);
  q.hint = `Ce qui manque, c'est ${espace(a)} − ${espace(b)}.`;
  return q;
};

function construire() {
  const r = Math.random();
  if (r < 0.14) return emprunteUnites();
  if (r < 0.28) return emprunteDizaines();
  if (r < 0.46) return emprunteDeux();
  if (r < 0.66) return zeroAuMilieu();
  if (r < 0.78) return quatreChiffres();
  if (r < 0.92) return situation();
  return nombreManquant();
}

export function generateSoustractionGrands() {
  return withFresh('soustraction_grands', construire, 60, 20, (q) => q.text);
}
