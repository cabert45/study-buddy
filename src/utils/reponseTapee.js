// Réponses tapées — pourquoi ce fichier existe
//
// L'app affichait 88 % à Ryan sur « matcha_nombres ». Sur la feuille papier du
// même sujet (Matcha AS.1.02), il a fait environ 4/13. L'écart n'est pas lui:
// l'app lui donnait QUATRE RÉPONSES À CHOISIR, la feuille demande d'écrire
// dans une case vide. Reconnaître 8 504 parmi quatre, ce n'est pas la même
// compétence que le produire.
//
// Ici on décide quelles questions ne donnent plus de choix, et comment juger
// une réponse écrite à la main sans la punir pour une majuscule ou un espace.
//
// Ce qu'on ne touche PAS: les questions de classement (« quelle est la POSITION
// du chiffre 4 », « < > = », « vrai ou faux », « quelle lettre est muette »).
// Là, choisir parmi les réponses possibles EST la tâche, exactement comme dans
// le cahier. Taper n'y ajouterait que de la frustration.

// '*' = tous les types de la catégorie.
// Un nombre à écrire.
const NOMBRE = {
  // Les types de production du cahier Matcha. Absents volontairement:
  // chiffres_lettres (ce serait un test d'orthographe), position_nom,
  // comparer, ordre (on ne tape pas un ordre).
  matcha_nombres: ['blocs', 'tableau_zero', 'jetons', 'abaque', 'lettres_chiffres',
    'position_valeur', 'ajouter', 'ajouter_deux', 'groupements', 'sacs', 'plus_grand_petit'],
  terme: '*',       // sa catégorie la plus faible: 27/54
  relational: '*',
  mental: '*',
};

// Un mot (ou deux) à écrire: la conjugaison, c'est-à-dire ce que l'école lui
// demande d'ÉCRIRE au test. « passe_compose » est sa 2e plus faible: 84/128.
const MOT = {
  passe_compose: ['conjugate_er', 'conjugate_etre'],
  present_indicatif: ['conjugate'],
  futur_simple: ['conjugate'],
  futur_etre_avoir: ['conjugate'],
  conjugaison: '*',
};

function listeContient(table, categorie, type) {
  const types = table[categorie];
  if (!types) return false;
  return types === '*' || types.includes(type);
}

// Renvoie 'nombre', 'mot' ou null (= garder les choix).
export function modeTape(question) {
  if (!question) return null;
  if (question.tape === 'nombre' || question.tape === 'mot') return question.tape;
  if (question.tape === false) return null;
  if (question.useDigitPad) return 'nombre';
  const cat = question.category;
  const type = question.type;
  if (typeof question.correct === 'number' && listeContient(NOMBRE, cat, type)) return 'nombre';
  // Garde-fou: on ne fait pas taper une phrase entière à un enfant de 8 ans.
  if (typeof question.correct === 'string' && question.correct.length <= 26
      && listeContient(MOT, cat, type)) return 'mot';
  return null;
}

// « 2 407 », « 2 407 » (espace insécable), « 2407 » → 2407
export function versNombre(saisie) {
  const s = String(saisie ?? '').replace(/[\s  ]/g, '');
  if (!/^-?\d+$/.test(s)) return NaN;
  return parseInt(s, 10);
}

// Ce qu'on laisse passer: majuscules, espaces en trop, l'apostrophe courbe du
// clavier du téléphone. Ce qu'on ne laisse PAS passer: les accents — en 3e
// année, l'accent fait partie du mot (« mangé » n'est pas « mange »).
export function normaliserMot(s) {
  return String(s ?? '')
    .trim()
    .toLowerCase()
    .replace(/[’ʼ`]/g, "'")
    .replace(/[\s ]+/g, ' ')
    .replace(/\s*'\s*/g, "'")
    .replace(/[.!?]+$/, '');
}

// Les lettres seules, accents gardés: « j ai mangé » et « j'ai mangé » sont la
// même réponse. Sur un clavier de téléphone, l'apostrophe se manque; l'accent,
// lui, reste une faute (il l'a eu 8,8/9 en apostrophes, pas en accents).
const squelette = (s) => normaliserMot(s).replace(/[^0-9a-zà-öø-ÿ]/g, '');
const sansAccents = (s) => squelette(s).normalize('NFD').replace(/[̀-ͯ]/g, '');

const PRONOMS = ['je', "j'", 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles'];

// Le pronom est déjà écrit dans la question (« Conjugue « manger » avec « je » »),
// alors « ai mangé » vaut « j'ai mangé ». On enlève le pronom des deux côtés.
function sansPronom(s) {
  const n = normaliserMot(s);
  for (const p of PRONOMS) {
    if (p.endsWith("'") && n.startsWith(p)) return n.slice(p.length).trim();
    if (n.startsWith(p + ' ')) return n.slice(p.length).trim();
  }
  return n;
}

export function memeReponse(saisie, correct, mode) {
  if (mode === 'nombre') return versNombre(saisie) === Number(correct);
  if (mode === 'mot') {
    if (!String(saisie || '').trim()) return false;
    if (squelette(saisie) === squelette(correct)) return true;
    const a = squelette(sansPronom(saisie));
    return a !== '' && a === squelette(sansPronom(correct));
  }
  return saisie === correct;
}

// 40 → « 4 dizaines », 2 000 → « 2 unités de mille »
function enPositions(n) {
  const s = String(n);
  const zeros = s.length - 1;
  const chiffre = Number(s[0]);
  if (zeros > 3) return null;
  const nom = ['unité', 'dizaine', 'centaine', 'unité de mille'][zeros];
  if (chiffre === 1) return '1 ' + nom;
  return chiffre + ' ' + (zeros === 3 ? 'unités de mille' : nom + 's');
}

const memesChiffres = (a, b) =>
  String(a).split('').sort().join('') === String(b).split('').sort().join('');

// Une réponse presque bonne, expliquée en une ligne. Ses trois malentendus
// connus, vus sur ses vraies feuilles (voir docs/passation-ryan.md):
//   1. un zéro en trop (« six cent vingt » écrit 6200)
//   2. la colonne vide sans son 0 (247 au lieu de 2 407)
//   3. la moitié d'une consigne à deux temps (2 358 au lieu de 2 398)
// Quand on reconnaît l'un des trois, l'écran dit « presque », pas rouge: il
// pleure quand il se trompe, et un mur de rouge le fait fermer l'app.
export function diagnosticTape(saisie, correct, mode) {
  if (mode === 'nombre') {
    const v = versNombre(saisie);
    const c = Number(correct);
    if (!Number.isFinite(v) || v === c) return null;
    if (v === c * 10 || String(v) === String(c) + '0') {
      return 'Un zéro en trop. ' + String(c).length + ' chiffres suffisent — compte-les.';
    }
    if (String(c).includes('0') && String(v) === String(c).replace(/0/g, '')) {
      return "Il manque le 0 de la colonne vide. Une colonne sans rien, ça s'écrit 0.";
    }
    if (String(v).length === String(c).length && memesChiffres(v, c)) {
      return 'Tu as les bons chiffres, mais pas à la bonne place.';
    }
    const ecart = c - v;
    if (Math.abs(ecart) === 1) return 'À un près. Recompte une dernière fois, lentement.';
    // Un écart rond (40, 200, 2 000): c'est le réflexe « j'ai fait la première
    // moitié de la consigne ». Un écart de 3 ou de 7 ne dit rien de tel.
    if (ecart >= 10 && /^[1-9]0*$/.test(String(ecart))) {
      const quoi = enPositions(ecart);
      return quoi
        ? 'Il te manque exactement ' + quoi + ' — la deuxième moitié de la consigne.'
        : 'Il te manque exactement ' + ecart + '.';
    }
    return null;
  }
  if (mode === 'mot') {
    if (!String(saisie || '').trim()) return null;
    if (sansAccents(saisie) === sansAccents(correct)) {
      return "C'est le bon mot — il manque juste l'accent. En français, l'accent fait partie du mot.";
    }
    if (distance(normaliserMot(saisie), normaliserMot(correct)) <= 2) {
      return 'Tu y es presque: une lettre ou deux à changer.';
    }
    return null;
  }
  return null;
}

// Levenshtein, pour distinguer « une lettre à changer » d'une autre réponse.
function distance(a, b) {
  const m = a.length, n = b.length;
  if (!m || !n) return Math.max(m, n);
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}
