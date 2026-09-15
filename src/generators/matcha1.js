// Matcha 3e année, cahier A — Thème 1 « Adorables animaux »: les nombres jusqu'à 9 999
// Photos des pages: Documents/Ryan - Tandem/Matcha -3e (13 sept 2026: p. 2-8 faites, p. 9+ vierges)
//
// Les mauvais choix reprennent les VRAIES erreurs de Ryan dans son cahier:
//   p. 8  — 22 bâtonnets comptés comme 2 dizaines → 1 426 au lieu de 1 626 (pas d'échange)
//   p. 5  — colonne des dizaines vide → 247 au lieu de 2 407 (le zéro oublié)
//   p. 4  — « six cent vingt » écrit 6200, « trois cent douze » écrit 3120 (zéros en trop)
//   p. 4  — 5 014 choisi pour « cinq mille cent quarante » (chiffres dans le désordre)
//   p. 6  — « ajoute 1 centaine » raté
//   p. 9  — 4 feuilles de 100 + 3 bandes de 10 + 19 à l'unité = 449 (le piège: 439)
import { getStudyRounds } from '../utils/studyRounds';
import { pickAdaptive } from '../utils/skillStats';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const CATEGORY = 'matcha_nombres';
const RULE = `um = unités de mille (1 000) · c = centaines (100) · d = dizaines (10) · u = unités (1)
10 unités = 1 dizaine · 10 dizaines = 1 centaine · 10 centaines = 1 unité de mille
Une colonne vide? On écrit 0! → 2 um, 4 c, 0 d, 7 u = 2 407`;
const ruleFor = () => (getStudyRounds(CATEGORY) < 3 ? RULE : undefined);

// 1 604 → « 1 604 » (espace des milliers, comme dans le cahier)
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

// ===== Nombres en lettres (orthographe traditionnelle, comme le cahier) =====
const UNITES = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix',
  'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
const DIZAINES = { 2: 'vingt', 3: 'trente', 4: 'quarante', 5: 'cinquante', 6: 'soixante' };

function moinsDeCent(n) {
  if (n < 20) return UNITES[n];
  const d = Math.floor(n / 10);
  const u = n % 10;
  if (d === 7) return u === 1 ? 'soixante et onze' : `soixante-${UNITES[10 + u]}`;
  if (d === 9) return `quatre-vingt-${UNITES[10 + u]}`;
  if (d === 8) return u === 0 ? 'quatre-vingts' : `quatre-vingt-${UNITES[u]}`;
  if (u === 0) return DIZAINES[d];
  if (u === 1) return `${DIZAINES[d]} et un`;
  return `${DIZAINES[d]}-${UNITES[u]}`;
}

function moinsDeMille(n) {
  const c = Math.floor(n / 100);
  const r = n % 100;
  let s = '';
  if (c === 1) s = 'cent';
  else if (c > 1) s = `${UNITES[c]} cent${r === 0 ? 's' : ''}`;
  if (r) s = s ? `${s} ${moinsDeCent(r)}` : moinsDeCent(r);
  return s;
}

export function enLettres(n) {
  if (n === 0) return 'zéro';
  const m = Math.floor(n / 1000);
  const r = n % 1000;
  let s = '';
  if (m === 1) s = 'mille';
  else if (m > 1) s = `${moinsDeMille(m)} mille`;
  if (r) s = s ? `${s} ${moinsDeMille(r)}` : moinsDeMille(r);
  return s;
}

const chiffres = (n) => {
  const s = String(n).padStart(4, '0');
  return { um: +s[0], c: +s[1], d: +s[2], u: +s[3] };
};

// Complète jusqu'à 4 choix uniques, positifs, sans la bonne réponse en double
function options(correct, candidats, fallback) {
  const set = new Set([correct]);
  for (const x of candidats) {
    if (set.size >= 4) break;
    if (Number.isInteger(x) && x > 0 && x <= 99999) set.add(x);
  }
  let k = 1;
  while (set.size < 4) { set.add(fallback(k)); k++; }
  return shuffle([...set]);
}

// ===== p. 8 — Blocs base 10 avec ÉCHANGES =====
function blocsEchange() {
  const echange = Math.random() < 0.75;
  const um = rand(0, 2);
  const c = rand(0, 9);
  const d = echange ? rand(10, 25) : rand(0, 9);
  const u = echange && Math.random() < 0.5 ? rand(10, 19) : rand(0, 9);
  const total = um * 1000 + c * 100 + d * 10 + u;
  if (total < 100) return blocsEchange();
  // L'erreur de Ryan: garder seulement le dernier chiffre des dizaines / unités
  const sansEchange = um * 1000 + c * 100 + (d % 10) * 10 + (u % 10);
  const etapes = [];
  if (um) etapes.push(`${um} × 1 000 = ${fmt(um * 1000)}`);
  if (c) etapes.push(`${c} × 100 = ${fmt(c * 100)}`);
  if (d) etapes.push(`${d} × 10 = ${fmt(d * 10)}${d >= 10 ? ` (10 bâtonnets = 1 plaque!)` : ''}`);
  if (u) etapes.push(`${u} × 1 = ${u}${u >= 10 ? ' (10 petits cubes = 1 bâtonnet!)' : ''}`);
  return {
    category: CATEGORY,
    rule: ruleFor(),
    type: 'blocs',
    // Le dessin (components/Numeration) montre les blocs: Ryan doit les COMPTER, comme au cahier
    text: 'Compte les blocs. Quel nombre est représenté?',
    blocs: { um, c, d, u },
    correct: total,
    options: options(total, [sansEchange, total + 100, total - 100, total + 10, total - 10], (k) => total + 1000 * k),
    explanation: `${etapes.join('\n')}\nEn tout: ${fmt(total)}.`
      + (sansEchange !== total ? `\n⚠ Piège: ${fmt(sansEchange)} — c'est ce qu'on trouve si on oublie de faire les échanges.` : ''),
    hint: 'Compte la valeur de CHAQUE sorte de bloc. 10 bâtonnets ou plus? Échange-les contre des plaques.',
  };
}

// ===== p. 5 — Tableau de numération avec une colonne à 0 =====
function tableauZero() {
  const um = rand(1, 9);
  const vide = pick(['c', 'd', 'u', 'cd']);
  const c = vide.includes('c') ? 0 : rand(1, 9);
  const d = vide.includes('d') ? 0 : rand(1, 9);
  const u = vide === 'u' ? 0 : rand(1, 9);
  const total = um * 1000 + c * 100 + d * 10 + u;
  const sansZero = Number(`${um}${c || ''}${d || ''}${u || ''}`);
  return {
    category: CATEGORY,
    rule: ruleFor(),
    type: 'tableau_zero',
    text: 'Quel nombre est écrit dans le tableau de numération?',
    tableau: { um, c, d, u },
    correct: total,
    options: options(total, [sansZero, Number(`${um}${c}${u}${d}`), total + 10, Number(`${um}${d}${c}${u}`)], (k) => total + 100 * k),
    explanation: `${um} unités de mille, ${c} centaine${c > 1 ? 's' : ''}, ${d} dizaine${d > 1 ? 's' : ''}, ${u} unité${u > 1 ? 's' : ''} → ${fmt(total)}.\nLe 0 garde la place de la colonne vide. Sans lui, on lirait ${fmt(sansZero)}!`,
    hint: 'Écris un chiffre pour CHAQUE colonne, même celle qui est vide (0).',
  };
}

// ===== p. 2 et 5 — Jetons dans un tableau de numération / p. 6 — l'abaque =====
// Souvent une colonne vide: c'est là que Ryan oublie le zéro.
function chiffresAvecTrou() {
  const um = rand(1, 9);
  const trou = pick(['c', 'd', 'u', null]);
  const ch = { um, c: rand(1, 9), d: rand(1, 9), u: rand(1, 9) };
  if (trou) ch[trou] = 0;
  return ch;
}

function representation(kind) {
  const ch = chiffresAvecTrou();
  const total = ch.um * 1000 + ch.c * 100 + ch.d * 10 + ch.u;
  const s = String(total);
  const sansZero = Number(s.replace(/0/g, '')) || total + 1;
  const inverse = Number(s.slice(0, -2) + s.slice(-1) + s.slice(-2, -1));
  const jetons = kind === 'jetons';
  return {
    category: CATEGORY,
    rule: ruleFor(),
    type: kind,
    text: jetons
      ? 'Compte les jetons dans chaque colonne. Quel nombre est représenté?'
      : "Compte les anneaux sur chaque tige de l'abaque. Quel nombre est représenté?",
    ...(jetons ? { tableau: { ...ch, jetons: true } } : { abaque: ch }),
    correct: total,
    options: options(total, [sansZero, inverse, total + 1, total + 10, total - 1], (k) => total + 100 * k),
    explanation: `um: ${ch.um} · c: ${ch.c} · d: ${ch.d} · u: ${ch.u} → ${fmt(total)}.`
      + (s.includes('0') ? `\n${jetons ? 'Une colonne sans jeton' : 'Une tige sans anneau'} = un 0 dans le nombre. Sans lui, on lirait ${fmt(sansZero)}!` : '')
      + `\nCompte lentement, une ${jetons ? 'colonne' : 'tige'} à la fois, de gauche à droite.`,
    hint: jetons ? 'Chaque colonne donne UN chiffre: le nombre de jetons. Aucun jeton? Écris 0.' : 'Chaque tige donne UN chiffre: le nombre d\'anneaux. Aucun anneau? Écris 0.',
  };
}

// ===== p. 4 — Nombre en lettres → en chiffres =====
function nombreAuHasard() {
  const r = Math.random();
  if (r < 0.3) return rand(101, 999);
  const n = rand(1001, 9999);
  // Beaucoup de zéros dedans: c'est là que Ryan se trompe (mille douze, deux mille quarante-deux…)
  if (Math.random() < 0.5) {
    const s = String(n).split('');
    s[pick([1, 2])] = '0';
    return Number(s.join(''));
  }
  return n;
}

function lettresEnChiffres() {
  const n = nombreAuHasard();
  const s = String(n);
  const sansZeros = Number(s.replace(/0/g, '')) || n + 1;
  const inverse = Number(s.slice(0, -2) + s.slice(-1) + s.slice(-2, -1));
  return {
    category: CATEGORY,
    rule: ruleFor(),
    type: 'lettres_chiffres',
    text: `Écris en chiffres:\n\n« ${enLettres(n)} »`,
    correct: n,
    options: options(n, [n * 10, sansZeros, inverse, n + 100], (k) => n + 10 * k),
    explanation: `« ${enLettres(n)} » = ${fmt(n)}.`
      + `\n⚠ Piège: ${fmt(n * 10)} — un zéro en trop. Compte les chiffres: ${n >= 1000 ? 'mille… = 4 chiffres' : 'cent… = 3 chiffres'}.`,
    hint: n >= 1000 ? 'Un nombre avec « mille » a 4 chiffres, pas plus.' : 'Un nombre avec « cent » (sans mille) a 3 chiffres.',
    aide: {
      titre: 'Place chaque partie dans sa colonne',
      tableauVide: true,
      note: '« mille » → colonne um · « cent(s) » → colonne c · puis les dizaines et les unités. Une colonne vide? Écris 0!',
    },
  };
}

// ===== p. 3-4 — Chiffres → comment ça se lit =====
function chiffresEnLettres() {
  const n = nombreAuHasard();
  const s = String(n);
  const voisins = new Set();
  // mêmes chiffres dans un autre ordre (5 140 / 5 014) + un chiffre changé
  if (s.length === 4) voisins.add(Number(s[0] + s[2] + s[1] + s[3]));
  voisins.add(Number(s.slice(0, -2) + s.slice(-1) + s.slice(-2, -1)));
  voisins.add(n + 10 <= 9999 ? n + 10 : n - 10);
  voisins.add(n + 100 <= 9999 ? n + 100 : n - 100);
  const choix = [n];
  for (const v of voisins) {
    if (choix.length >= 4) break;
    if (v !== n && v >= 100 && !choix.includes(v)) choix.push(v);
  }
  while (choix.length < 4) choix.push(n + choix.length);
  const lettres = choix.map(enLettres);
  return {
    category: CATEGORY,
    rule: ruleFor(),
    type: 'chiffres_lettres',
    text: `Comment se lit le nombre ${fmt(n)}?`,
    correct: lettres[0],
    options: shuffle(lettres),
    explanation: `${fmt(n)} se lit « ${lettres[0]} ».`,
    hint: 'Lis de gauche à droite: les unités de mille, puis les centaines, puis le reste.',
  };
}

// ===== p. 11 — Valeur de position =====
const POSITIONS = [
  { cle: 'um', nom: 'unités de mille', valeur: 1000 },
  { cle: 'c', nom: 'centaines', valeur: 100 },
  { cle: 'd', nom: 'dizaines', valeur: 10 },
  { cle: 'u', nom: 'unités', valeur: 1 },
];

function valeurPosition(kind) {
  // un nombre dont les chiffres sont tous différents, pour qu'on sache de quel chiffre on parle
  let n;
  do { n = rand(1023, 9876); } while (new Set(String(n)).size < 4);
  const ch = chiffres(n);
  const pos = pick(POSITIONS.filter((p) => ch[p.cle] !== 0));
  const chiffre = ch[pos.cle];
  if (kind === 'nom') {
    return {
      category: CATEGORY,
      rule: ruleFor(),
      type: 'position_nom',
      text: `Dans le nombre ${fmt(n)}, quelle est la POSITION du chiffre ${chiffre}?`,
      correct: pos.nom,
      options: POSITIONS.map((p) => p.nom),
      explanation: `${fmt(n)}: um ${ch.um} · c ${ch.c} · d ${ch.d} · u ${ch.u}\nLe ${chiffre} est à la position des ${pos.nom}.`,
      hint: 'De droite à gauche: unités, dizaines, centaines, unités de mille.',
    };
  }
  const valeur = chiffre * pos.valeur;
  return {
    category: CATEGORY,
    rule: ruleFor(),
    type: 'position_valeur',
    text: `Dans le nombre ${fmt(n)}, quelle est la VALEUR du chiffre ${chiffre}?`,
    correct: valeur,
    options: shuffle([chiffre, chiffre * 10, chiffre * 100, chiffre * 1000]),
    explanation: `Le ${chiffre} est à la position des ${pos.nom}: ${chiffre} × ${fmt(pos.valeur)} = ${fmt(valeur)}.\nPlus un chiffre est à gauche, plus sa valeur est grande.`,
    hint: 'Trouve d\'abord sa position, puis multiplie: × 1, × 10, × 100 ou × 1 000.',
  };
}

// ===== p. 6 — Ajouter 1 centaine / 1 dizaine / 1 unité de mille =====
function ajouter() {
  const n = rand(1100, 8899);
  const quoi = pick([
    { mot: '1 centaine', v: 100 }, { mot: '1 dizaine', v: 10 }, { mot: '1 unité de mille', v: 1000 },
    { mot: '2 centaines', v: 200 }, { mot: '3 dizaines', v: 30 },
  ]);
  const correct = n + quoi.v;
  return {
    category: CATEGORY,
    rule: ruleFor(),
    type: 'ajouter',
    text: `Ajoute ${quoi.mot} au nombre ${fmt(n)}.`,
    correct,
    options: options(correct, [n + 1, n + 10, n + 100, n + 300, n + 1000, n + quoi.v * 3], (k) => correct + k),
    explanation: `${quoi.mot} = ${fmt(quoi.v)}. ${fmt(n)} + ${fmt(quoi.v)} = ${fmt(correct)}.\nSeul le chiffre des ${quoi.v >= 1000 ? 'unités de mille' : quoi.v >= 100 ? 'centaines' : 'dizaines'} change (sauf s'il faut échanger).`,
    hint: `Trouve la bonne colonne, puis ajoute seulement dans cette colonne.`,
    aide: {
      titre: `${fmt(n)} dans le tableau`,
      tableau: chiffres(n),
      note: `Trouve la colonne de « ${quoi.mot} » et ajoute seulement là. Si ça fait 10, échange!`,
    },
  };
}

// ===== p. 9 — Problèmes de groupements =====
// [singulier, pluriel] — « 1 caisse de 100 » mais « 4 caisses de 100 »
const CONTEXTES = [
  { quoi: 'autocollants', cent: ['feuille', 'feuilles'], dix: ['bande', 'bandes'], un: 'autocollants à l\'unité', qui: 'Émilie a vendu' },
  { quoi: 'biscuits', cent: ['caisse', 'caisses'], dix: ['sachet', 'sachets'], un: 'biscuits seuls', qui: 'La boulangère a préparé' },
  { quoi: 'crayons', cent: ['boîte', 'boîtes'], dix: ['paquet', 'paquets'], un: 'crayons seuls', qui: "L'école a reçu" },
  { quoi: 'graines', cent: ['sac', 'sacs'], dix: ['sachet', 'sachets'], un: 'graines seules', qui: 'Le fermier a semé' },
];
const accorde = (n, [sing, plur]) => `${n} ${n > 1 ? plur : sing}`;

function groupements() {
  const ctx = pick(CONTEXTES);
  const c = rand(1, 9);
  const d = rand(1, 18);
  const u = rand(10, 19);
  const total = c * 100 + d * 10 + u;
  const piege = c * 100 + d * 10 + (u % 10);
  return {
    category: CATEGORY,
    rule: ruleFor(),
    type: 'groupements',
    text: `${ctx.qui} ${accorde(c, ctx.cent)} de 100, ${accorde(d, ctx.dix)} de 10 et ${u} ${ctx.un}.\nCombien de ${ctx.quoi} en tout?`,
    correct: total,
    aide: {
      titre: 'Le problème en blocs',
      blocs: { um: 0, c, d, u },
      note: '10 petits cubes = 1 bâtonnet · 10 bâtonnets = 1 plaque. Fais les échanges, puis lis le nombre.',
    },
    options: options(total, [piege, Number(`${c}${d}${u}`), total + 10, total - 10], (k) => total + 100 * k),
    explanation: `${c} × 100 = ${fmt(c * 100)}\n${d} × 10 = ${fmt(d * 10)}\n${u} × 1 = ${u}\n${fmt(c * 100)} + ${fmt(d * 10)} + ${u} = ${fmt(total)}.\n⚠ ${u} unités, c'est plus que 10: ça fait 1 dizaine de plus!`,
    hint: 'Calcule la valeur de chaque groupe, puis additionne. Attention aux unités: 10 ou plus = une dizaine de plus.',
  };
}

// ===== p. 10 — Faire des sacs de 10 ou de 100 =====
function faireDesSacs() {
  const deCent = Math.random() < 0.4;
  const n = deCent ? rand(1100, 9899) : rand(120, 989);
  const taille = deCent ? 100 : 10;
  const correct = Math.floor(n / taille);
  const quoi = pick(['carottes', 'grains de maïs', 'noisettes', 'pommes']);
  return {
    category: CATEGORY,
    rule: ruleFor(),
    type: 'sacs',
    text: `Il y a ${fmt(n)} ${quoi}. On remplit des sacs de ${taille}.\nCombien de sacs PLEINS peut-on faire?`,
    correct,
    options: options(correct, [correct + 1, deCent ? chiffres(n).c : chiffres(n).d, correct * 10, correct - 1], (k) => correct + 2 * k),
    explanation: deCent
      ? `${fmt(n)} = ${correct} centaines et ${n % 100} de plus. Chaque centaine remplit 1 sac de 100 → ${correct} sacs pleins (le chiffre des unités de mille ET celui des centaines: ${correct}).`
      : `${fmt(n)} = ${correct} dizaines et ${n % 10} de plus. Chaque dizaine remplit 1 sac de 10 → ${correct} sacs pleins.`,
    hint: deCent ? 'Combien de CENTAINES en tout dans le nombre? (pas seulement le chiffre des centaines!)' : 'Combien de DIZAINES en tout dans le nombre?',
    // « Mes boîtes de travail » → les blocs du nombre (les cadres de 10 ne vont que jusqu'à 40)
    aide: {
      titre: `${fmt(n)} ${quoi} en blocs`,
      blocs: chiffres(n),
      note: deCent
        ? 'Chaque plaque (100) remplit 1 sac de 100. Un gros cube = 10 plaques = 10 sacs. Compte les sacs!'
        : 'Chaque bâtonnet (10) remplit 1 sac de 10. Une plaque = 10 bâtonnets = 10 sacs. Compte les sacs!',
    },
  };
}

// Poids de base = ses erreurs du cahier + ce qui s'en vient; pickAdaptive ajuste selon ses réponses.
function buildOne() {
  return pickAdaptive(CATEGORY, [
    { type: 'blocs', w: 22, build: blocsEchange },
    { type: 'tableau_zero', w: 8, build: tableauZero },
    { type: 'jetons', w: 8, build: () => representation('jetons') },
    { type: 'abaque', w: 7, build: () => representation('abaque') },
    { type: 'lettres_chiffres', w: 14, build: lettresEnChiffres },
    { type: 'chiffres_lettres', w: 8, build: chiffresEnLettres },
    // valeurPosition rend « position_nom » ou « position_valeur »
    { type: 'position_nom', w: 8, build: () => valeurPosition('nom') },
    { type: 'position_valeur', w: 8, build: () => valeurPosition('valeur') },
    { type: 'ajouter', w: 8, build: ajouter },
    { type: 'groupements', w: 12, build: groupements },
    { type: 'sacs', w: 8, build: faireDesSacs },
  ]);
}

export function generateMatchaNombres() {
  const q = buildOne(); // pickAdaptive gère l'anti-répétition dans le type choisi
  // Les boutons affichent « 1 626 » comme dans le cahier; la réponse reste un nombre.
  if (q.options.every((o) => typeof o === 'number')) {
    q.optionLabels = Object.fromEntries(q.options.map((o) => [o, fmt(o)]));
  }
  return q;
}
