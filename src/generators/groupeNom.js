// Le groupe du nom (GN) — Aide-mémoire Jazz p. 6-7, cahier thème 2 module 1
// (« Les aventures d'un biscuit »). Leçon de la semaine du 12 au 16 oct. 2026.
//
// Ce que la version précédente faisait, et pourquoi ça ne suffisait pas:
// 20 groupes à classer, 8 noyaux, 4 accords — écrits à la main, tirés au sort
// sans mémoire. En 15 questions il revoyait les mêmes, et l'app mesurait sa
// mémoire d'une liste plutôt que sa compréhension.
//
// Surtout, il manquait la seule chose qui décide: **la manipulation**. Comme
// pour « Nom, adjectif ou verbe? » (generators/quatreClasses), la règle du
// module est qu'on n'annonce jamais un GN sans redonner son test:
//   • un GN se remplace par IL / ELLE / ILS / ELLES;
//   • le NOYAU est le mot qu'on ne peut pas enlever;
//   • l'expansion (l'adjectif), elle, s'enlève sans casser la phrase.
// C'est ça, « prouver » — la même leçon que la feuille i+ de septembre
// (generators/prouveLeNom): trouver le mot ne suffit pas.
import { pickAdaptive } from '../utils/skillStats';

const CATEGORY = 'groupe_nom';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
const uniques = (arr) => arr.filter((v, i, a) => a.indexOf(v) === i);
function quatre(bonne, leurres) {
  return shuffle(uniques([bonne, ...leurres]).slice(0, 4));
}

// Un petit lexique accordé, pour FABRIQUER les groupes au lieu de les écrire
// un par un: la variété vient des combinaisons, pas d'une liste à rallonge.
// g = genre, n = nombre. Les noms sont ceux de ses cahiers (Jazz, Matcha).
const NOMS = [
  { mot: 'mésange', g: 'f', n: 's', vivant: 1 }, { mot: 'abeille', g: 'f', n: 's', vivant: 1 },
  { mot: 'fourmi', g: 'f', n: 's', vivant: 1 }, { mot: 'princesse', g: 'f', n: 's', vivant: 1 },
  { mot: 'bicyclette', g: 'f', n: 's' }, { mot: 'épée', g: 'f', n: 's' },
  { mot: 'maison', g: 'f', n: 's' }, { mot: 'tomate', g: 'f', n: 's' },
  { mot: 'lucioles', g: 'f', n: 'pl', vivant: 1 }, { mot: 'étoiles', g: 'f', n: 'pl' },
  { mot: 'fourmis', g: 'f', n: 'pl', vivant: 1 }, { mot: 'grenouilles', g: 'f', n: 'pl', vivant: 1 },
  { mot: 'château', g: 'm', n: 's' }, { mot: 'chapeau', g: 'm', n: 's' },
  { mot: 'renard', g: 'm', n: 's', vivant: 1 }, { mot: 'biscuit', g: 'm', n: 's' },
  { mot: 'livre', g: 'm', n: 's' }, { mot: 'chevalier', g: 'm', n: 's', vivant: 1 },
  { mot: 'oiseaux', g: 'm', n: 'pl', vivant: 1 }, { mot: 'nids', g: 'm', n: 'pl' },
  { mot: 'amis', g: 'm', n: 'pl', vivant: 1 }, { mot: 'poissons', g: 'm', n: 'pl', vivant: 1 },
];

const DETS = {
  'f-s': ['la', 'une', 'ma', 'cette'], 'm-s': ['le', 'un', 'mon', 'ce'],
  'f-pl': ['les', 'des', 'mes', 'deux'], 'm-pl': ['les', 'des', 'mes', 'trois'],
};

// Devant une voyelle, le determinant change: « ma abeille » n'existe pas.
// Trouve en jouant une session (abeille, epee): un generateur qui enseigne le
// faux est pire que pas de generateur du tout.
const DETS_VOYELLE = {
  'f-s': ["l'", 'une', 'mon', 'cette'], 'm-s': ["l'", 'un', 'mon', 'cet'],
  'f-pl': ['les', 'des', 'mes', 'deux'], 'm-pl': ['les', 'des', 'mes', 'trois'],
};
const commenceParVoyelle = (mot) => /^[aeiouyAEIOUYàâéèêîôû]/.test(mot) || /^h/.test(mot);
// « l' » se colle au nom, « la » prend une espace.
const colle = (det, mot) => (det.endsWith("'") ? det + mot : det + ' ' + mot);

// Adjectifs qui se placent APRÈS le nom (le cas le plus fréquent), avec leurs
// quatre formes. « avant: true » = ceux qui se placent devant (grand, petit…).
const ADJS = [
  { m: 'géant', f: 'géante', mpl: 'géants', fpl: 'géantes' },
  { m: 'brillant', f: 'brillante', mpl: 'brillants', fpl: 'brillantes' },
  { m: 'doré', f: 'dorée', mpl: 'dorés', fpl: 'dorées' },
  { m: 'rapide', f: 'rapide', mpl: 'rapides', fpl: 'rapides' },
  { m: 'grand', f: 'grande', mpl: 'grands', fpl: 'grandes', avant: true },
  { m: 'petit', f: 'petite', mpl: 'petits', fpl: 'petites', avant: true },
  { m: 'vieux', f: 'vieille', mpl: 'vieux', fpl: 'vieilles', avant: true },
  { m: 'beau', f: 'belle', mpl: 'beaux', fpl: 'belles', avant: true },
  { m: 'joli', f: 'jolie', mpl: 'jolis', fpl: 'jolies', avant: true },
  // « des grenouilles neuves », « un livre curieux »: grammaticalement
  // irreprochable et completement idiot. Un exemple bizarre fait rire la
  // classe et perdre la regle — l'adjectif se choisit donc selon le nom.
  { m: 'neuf', f: 'neuve', mpl: 'neufs', fpl: 'neuves', objet: true },
  { m: 'curieux', f: 'curieuse', mpl: 'curieux', fpl: 'curieuses', vivant: true },
  { m: 'gourmand', f: 'gourmande', mpl: 'gourmands', fpl: 'gourmandes', vivant: true },
];

// Les adjectifs qui vont avec CE nom-la.
const adjsPour = (nom) => ADJS.filter((a) => (a.vivant ? !!nom.vivant : true) && (a.objet ? !nom.vivant : true));

const NOMS_PROPRES = ['Pomélo', 'Léonard', 'Nougat', 'Montréal', 'Mirna', 'Ryan', 'Laval'];

// Devant un nom masculin singulier qui commence par une voyelle, trois
// adjectifs changent de forme: un BEL oiseau, un VIEIL ami, un NOUVEL arbre.
// Aucun nom de la liste ne déclenche le cas aujourd'hui — c'est justement
// pour ça que la règle est ici: le jour où quelqu'un ajoute « oiseau » au
// singulier, l'app ne lui apprendra pas « un beau oiseau ».
const DEVANT_VOYELLE = { beau: 'bel', vieux: 'vieil', nouveau: 'nouvel' };
function accorde(adj, nom) {
  const forme = adj[nom.n === 'pl' ? (nom.g === 'f' ? 'fpl' : 'mpl') : (nom.g === 'f' ? 'f' : 'm')];
  if (adj.avant && nom.g === 'm' && nom.n === 's' && commenceParVoyelle(nom.mot) && DEVANT_VOYELLE[forme]) {
    return DEVANT_VOYELLE[forme];
  }
  return forme;
}
const determinant = (nom) => pick((commenceParVoyelle(nom.mot) ? DETS_VOYELLE : DETS)[`${nom.g}-${nom.n}`]);
const pronom = (nom) => (nom.n === 'pl' ? (nom.g === 'f' ? 'elles' : 'ils') : (nom.g === 'f' ? 'elle' : 'il'));
const accordMot = (nom) => `${nom.g === 'f' ? 'féminin' : 'masculin'} ${nom.n === 'pl' ? 'pluriel' : 'singulier'}`;

// Fabrique un GN et dit tout ce qu'on sait de lui.
function groupe({ avecAdj = null } = {}) {
  const nom = pick(NOMS);
  const det = determinant(nom);
  if (avecAdj === false) {
    return { texte: colle(det, nom.mot), nom, det, adj: null, structure: 'det_nom' };
  }
  // Devant un adjectif place AVANT le nom, c'est LUI qui suit le determinant:
  // « l'abeille rapide » mais « la petite abeille ».
  const adj = pick(adjsPour(nom));
  const forme = accorde(adj, nom);
  const detReel = adj.avant
    ? pick((commenceParVoyelle(forme) ? DETS_VOYELLE : DETS)[`${nom.g}-${nom.n}`])
    : det;
  const texte = adj.avant ? colle(detReel, `${forme} ${nom.mot}`) : `${colle(detReel, nom.mot)} ${forme}`;
  return { texte, nom, det: detReel, adj: forme, avant: !!adj.avant, structure: 'det_nom_adj' };
}

// ===== 1. La construction du groupe =====
const LABELS = { nom_seul: 'Nom seul', det_nom: 'Dét. + nom', det_nom_adj: 'Dét. + nom + adj.' };
function construction() {
  const quoi = pick(['nom_seul', 'det_nom', 'det_nom_adj', 'det_nom', 'det_nom_adj']);
  if (quoi === 'nom_seul') {
    const np = pick(NOMS_PROPRES);
    return {
      category: CATEGORY, type: 'classify_gn',
      text: `Quelle est la construction du groupe du nom « ${np} »?`,
      correct: LABELS.nom_seul,
      options: shuffle(Object.values(LABELS)),
      explanation: `${np} est un nom propre: il forme un GN à lui tout seul, sans déterminant.\n\n`
        + `Le test: on peut le remplacer par « il » ou « elle ».`,
      hint: 'Un nom propre n\'a pas besoin de déterminant.',
    };
  }
  const g = groupe({ avecAdj: quoi === 'det_nom_adj' });
  return {
    category: CATEGORY, type: 'classify_gn',
    text: `Quelle est la construction du groupe du nom « ${g.texte} »?`,
    correct: LABELS[g.structure],
    options: shuffle(Object.values(LABELS)),
    explanation: g.adj
      ? `${g.det.trim()} (déterminant) + ${g.nom.mot} (nom) + ${g.adj} (adjectif).\n\n`
        + `L'adjectif ${g.avant ? 'est placé AVANT le nom ici, mais' : ''} s'appelle une EXPANSION: `
        + `on peut l'enlever et « ${colle(g.det, g.nom.mot)} » reste un GN.`
      : `${g.det.trim()} (déterminant) + ${g.nom.mot} (nom).\n\nIl n'y a pas d'adjectif: rien à enlever.`,
    hint: 'Compte les mots: y a-t-il un adjectif en plus du déterminant et du nom?',
  };
}

// ===== 2. Le noyau: le mot qu'on ne peut pas enlever =====
function noyau() {
  const g = groupe({ avecAdj: true });
  const autres = NOMS.filter((n) => n.mot !== g.nom.mot).map((n) => n.mot);
  return {
    category: CATEGORY, type: 'find_noyau',
    text: `Quel est le NOYAU du groupe du nom « ${g.texte} »?`,
    correct: g.nom.mot,
    options: quatre(g.nom.mot, [g.det.trim(), g.adj, pick(autres)]),
    explanation: `${g.nom.mot}.\n\n`
      + `Le noyau, c'est le NOM — le seul mot qu'on ne peut pas enlever.\n`
      + `• « ${g.det} ${g.nom.mot} » → ça se dit (on a enlevé l'adjectif)\n`
      + `• « ${g.adj} » tout seul → ça ne se dit pas.`,
    hint: 'Enlève un mot à la fois. Celui qui fait tout casser, c\'est le noyau.',
  };
}

// ===== 3. Le test qui décide: remplacer par un pronom =====
// C'est LE geste de l'Aide-mémoire p. 6. Sans lui, « c'est un GN » est une
// devinette qui se reperd au test suivant.
function remplacePronom() {
  const g = groupe({ avecAdj: pick([true, false]) });
  const bon = pronom(g.nom);
  return {
    category: CATEGORY, type: 'gn_pronom',
    text: `Par quel pronom peut-on remplacer « ${g.texte} »?`,
    correct: bon,
    options: shuffle(['il', 'elle', 'ils', 'elles']),
    explanation: `${bon}.\n\n`
      + `« ${g.texte} » est ${accordMot(g.nom)} → ${bon}.\n`
      + `C'est le TEST du groupe du nom: si on peut le remplacer par il, elle, ils ou elles, c'est bien un GN.`,
    hint: 'Un ou plusieurs? Masculin ou féminin? Le pronom suit le nom.',
  };
}

// ===== 4. L'expansion: ce qu'on peut enlever =====
function expansion() {
  const g = groupe({ avecAdj: true });
  const sansAdj = colle(g.det, g.nom.mot);
  return {
    category: CATEGORY, type: 'gn_expansion',
    text: `Dans « ${g.texte} », quel mot est l'EXPANSION (celui qu'on peut enlever)?`,
    correct: g.adj,
    options: quatre(g.adj, [g.nom.mot, g.det.trim(), pick(adjsPour(g.nom)).m]),
    explanation: `${g.adj}.\n\n`
      + `C'est l'adjectif. On l'enlève et il reste « ${sansAdj} », qui est toujours un groupe du nom.\n`
      + `Le déterminant et le nom, eux, ne s'enlèvent pas.`,
    hint: 'L\'expansion donne un détail. Enlève-la: la phrase tient encore.',
  };
}

// ===== 5. Trouver le GN dans une phrase =====
const VERBES_PHRASE = [
  { v: 'observe', suite: 'dans le jardin' },
  { v: 'regarde', suite: 'par la fenêtre' },
  { v: 'dessine', suite: 'sur sa feuille' },
  { v: 'cherche', suite: 'depuis ce matin' },
  { v: 'attend', suite: 'devant l\'école' },
];
function trouveGn() {
  const g = groupe({ avecAdj: pick([true, false]) });
  const sujet = pick(NOMS_PROPRES);
  const { v, suite } = pick(VERBES_PHRASE);
  const phrase = `${sujet} ${v} ${g.texte} ${suite}.`;
  return {
    category: CATEGORY, type: 'trouve_gn',
    text: `Dans « ${phrase} », quel groupe de mots est un groupe du nom?`,
    correct: g.texte,
    options: quatre(g.texte, [
      `${v} ${g.texte}`,
      suite,
      `${sujet} ${v}`,
    ]),
    explanation: `« ${g.texte} ».\n\n`
      + `Le test: on le remplace par « ${pronom(g.nom)} » et la phrase tient encore — `
      + `${sujet} ${v} ${pronom(g.nom) === 'il' || pronom(g.nom) === 'ils' ? 'le' : 'la'}…\n`
      + `« ${v} » est un verbe, pas un nom: un groupe qui commence par un verbe n'est pas un GN.`,
    hint: 'Cherche un déterminant: le, la, les, un, une, des, mon, ma… Le GN commence là.',
  };
}

// ===== 6. L'accord dans le GN =====
// Son vieux trou: 1/4 au test de l'adjectif féminin, alors que l'app affichait
// 54/54 en « adjectif ». Ici l'accord se joue DANS le groupe, où il le rate.
function accord() {
  const nom = pick(NOMS);
  const adj = pick(adjsPour(nom));
  const bonAdj = accorde(adj, nom);
  // Le determinant s'accorde au mot qui le SUIT (l'adjectif s'il est devant).
  const apresDet = adj.avant ? bonAdj : nom.mot;
  const det = pick((commenceParVoyelle(apresDet) ? DETS_VOYELLE : DETS)[`${nom.g}-${nom.n}`]);
  const mauvaisAdj = uniques([adj.m, adj.f, adj.mpl, adj.fpl]).filter((f) => f !== bonAdj);
  const mauvaisDet = uniques(Object.values(DETS).flat()).filter((d) => !DETS[`${nom.g}-${nom.n}`].includes(d));
  const bonne = adj.avant ? colle(det, `${bonAdj} ${nom.mot}`) : `${colle(det, nom.mot)} ${bonAdj}`;
  const faux = (d, a) => (adj.avant ? colle(d, `${a} ${nom.mot}`) : `${colle(d, nom.mot)} ${a}`);
  return {
    category: CATEGORY, type: 'gn_agreement',
    text: `Complète correctement: ___ ${adj.avant ? '___ ' : ''}${nom.mot}${adj.avant ? '' : ' ___'}`,
    hintNom: nom.mot,
    correct: bonne,
    options: quatre(bonne, [
      faux(det, pick(mauvaisAdj) || bonAdj),
      faux(pick(mauvaisDet) || det, bonAdj),
      faux(pick(mauvaisDet) || det, pick(mauvaisAdj) || bonAdj),
    ]),
    explanation: `${bonne}.\n\n`
      + `« ${nom.mot} » est ${accordMot(nom)}. Dans un groupe du nom, le déterminant ET l'adjectif `
      + `prennent le genre et le nombre du NOM.\n`
      + `C'est le nom qui commande, jamais l'inverse.`,
    hint: `« ${nom.mot} »: un ou plusieurs? masculin ou féminin? Tout le groupe suit.`,
  };
}

function buildOne() {
  return pickAdaptive(CATEGORY, [
    { type: 'gn_pronom', w: 18, build: remplacePronom },
    { type: 'trouve_gn', w: 18, build: trouveGn },
    { type: 'find_noyau', w: 16, build: noyau },
    { type: 'gn_expansion', w: 16, build: expansion },
    { type: 'classify_gn', w: 14, build: construction },
    { type: 'gn_agreement', w: 18, build: accord },
  ], (q) => `${q.type}|${q.text}`);
}

export function generateGroupeNom() {
  return buildOne();
}

export default generateGroupeNom;
