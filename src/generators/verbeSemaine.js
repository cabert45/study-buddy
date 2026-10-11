// Le verbe de la semaine — la ligne « Verbe : ___ » de la feuille de Mme Haidar.
//
// POURQUOI CE FICHIER EXISTE (11 oct. 2026). Chaque liste d'orthographe porte
// depuis le début un champ `verbe` (« aimer au présent ») et un champ
// `verbeMode`. Le parent a demandé: « le verbe aimer au pluriel, where are the
// verbs? » — et il avait raison: **`verbeMode` n'était lu nulle part**. Le
// verbe de la semaine ne s'affichait qu'en TEXTE dans « La liste ». Le seul
// moment où Ryan conjuguait quoi que ce soit, c'était le vendredi, parce que
// la rotation du Coach tombait par hasard sur `present_indicatif` — un
// générateur qui tire « aimer » une fois sur 24.
//
// Deux semaines auraient même enseigné le faux: la liste 6 (« finir au
// présent ») et la liste 7 (« aller au présent ») pointaient vers le
// générateur des verbes en -ER. *finir* est du 2e groupe (nous finiSSons) et
// *aller* est irrégulier (je vais). Ici, chaque verbe a sa vraie table.
//
// Ce qui est travaillé en priorité: le PLURIEL. C'est là que tout se joue à
// l'écrit — « ils aiment » ne s'entend pas différemment de « il aime », et le
// -ent muet est la faute n° 1 de la 3e année.
import { pickAdaptive } from '../utils/skillStats';

const CATEGORY = 'verbe_semaine';

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
function quatre(bonne, leurres) { return shuffle(uniques([bonne, ...leurres]).slice(0, 4)); }

// Les six personnes, dans l'ordre du tableau de conjugaison.
const PERSONNES = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];
const AFFICHE = { je: 'je', tu: 'tu', il: 'il / elle', nous: 'nous', vous: 'vous', ils: 'ils / elles' };
const EST_PLURIEL = { je: false, tu: false, il: false, nous: true, vous: true, ils: true };

// Les verbes que la feuille nomme, semaine par semaine. Écrits en toutes
// lettres: une règle « enlève -er » ne marche ni pour finir, ni pour aller.
// `muette` = la terminaison qu'on n'entend pas mais qu'on doit écrire.
export const VERBES = {
  aimer_present: {
    verbe: 'aimer', temps: 'présent', groupe: '1er groupe (-ER)',
    formes: { je: "j'aime", tu: 'tu aimes', il: 'il aime', nous: 'nous aimons', vous: 'vous aimez', ils: 'ils aiment' },
    muette: { tu: 's', ils: 'nt' },
    regle: 'Radical AIM- + e · es · e · ons · ez · ent',
    note: "« aimer » commence par une voyelle: je devient j' → j'aime.",
  },
  finir_present: {
    verbe: 'finir', temps: 'présent', groupe: '2e groupe (-IR)',
    formes: { je: 'je finis', tu: 'tu finis', il: 'il finit', nous: 'nous finissons', vous: 'vous finissez', ils: 'ils finissent' },
    muette: { je: 's', tu: 's', il: 't', ils: 'ent' },
    regle: 'Radical FIN- + is · is · it · issons · issez · issent',
    note: 'Au pluriel, il arrive un -SS- qui n\'était pas là au singulier: nous finiSSons.',
  },
  aller_present: {
    verbe: 'aller', temps: 'présent', groupe: 'verbe irrégulier',
    formes: { je: 'je vais', tu: 'tu vas', il: 'il va', nous: 'nous allons', vous: 'vous allez', ils: 'ils vont' },
    muette: { tu: 's', ils: 't' },
    regle: 'vais · vas · va · allons · allez · vont — il n\'y a pas de règle, ça s\'apprend par cœur',
    note: 'Le verbe change complètement de mot: je VAIS, mais nous ALLONS.',
  },
  avoir_present: {
    verbe: 'avoir', temps: 'présent', groupe: 'auxiliaire',
    formes: { je: "j'ai", tu: 'tu as', il: 'il a', nous: 'nous avons', vous: 'vous avez', ils: 'ils ont' },
    muette: { tu: 's', ils: 'nt' },
    regle: 'ai · as · a · avons · avez · ont',
    note: '« ils ONT » (le verbe avoir) ne s\'écrit pas comme « ON » (quelqu\'un).',
  },
  etre_present: {
    verbe: 'être', temps: 'présent', groupe: 'auxiliaire',
    formes: { je: 'je suis', tu: 'tu es', il: 'il est', nous: 'nous sommes', vous: 'vous êtes', ils: 'ils sont' },
    muette: { tu: 's', il: 't', ils: 't' },
    regle: 'suis · es · est · sommes · êtes · sont',
    note: '« tu ES » et « il EST » se disent pareil, mais le il prend un T.',
  },
  avoir_imparfait: {
    verbe: 'avoir', temps: "imparfait", groupe: 'auxiliaire',
    formes: { je: "j'avais", tu: 'tu avais', il: 'il avait', nous: 'nous avions', vous: 'vous aviez', ils: 'ils avaient' },
    muette: { je: 's', tu: 's', il: 't', ils: 'ent' },
    regle: 'Radical AV- + ais · ais · ait · ions · iez · aient',
    note: "À l'imparfait, les trois personnes du singulier se disent pareil: j'avais, tu avais, il avait.",
  },
  etre_imparfait: {
    verbe: 'être', temps: "imparfait", groupe: 'auxiliaire',
    formes: { je: "j'étais", tu: 'tu étais', il: 'il était', nous: 'nous étions', vous: 'vous étiez', ils: 'ils étaient' },
    muette: { je: 's', tu: 's', il: 't', ils: 'ent' },
    regle: 'Radical ÉT- + ais · ais · ait · ions · iez · aient',
    note: "Même musique que l'imparfait d'avoir: -ais, -ais, -ait, -ions, -iez, -aient.",
  },
};

// Le verbe courant, posé par PracticeSession avant de rendre le générateur —
// même montage que la dictée de la semaine (setCurrentWeek).
let courant = 'aimer_present';
export function setVerbeSemaine(cle) { if (VERBES[cle]) courant = cle; }
export const verbeCourant = () => VERBES[courant];

// Le tableau complet, montré AVANT les questions (« la liste avant les
// exercices », règle du parent du 20 sept.).
export function tableauVerbe(v = VERBES[courant]) {
  return PERSONNES.map((p) => ({ personne: AFFICHE[p], forme: v.formes[p] }));
}

// La forme sans son pronom: « nous aimons » → « aimons ».
const sansPronom = (forme) => forme.replace(/^(j'|je |tu |il |elle |on |nous |vous |ils |elles )/, '');

// Un seul verbe par semaine, six formes: tire au sort, il redemandait quatre
// fois de suite « conjugue aimer avec ils/elles ». On garde donc en memoire
// les trois dernieres personnes posees et on en choisit une autre.
let dernieres = [];
function personneFraiche(parmi) {
  const libres = parmi.filter((p) => !dernieres.includes(p));
  const choisie = pick(libres.length ? libres : parmi);
  // La memoire ne peut pas etre aussi longue que le choix: avec 3 personnes
  // du pluriel et 3 en memoire, tout etait toujours « deja vu » et le filtre
  // ne servait plus a rien. On en garde une de moins que le pool.
  dernieres = [choisie, ...dernieres].slice(0, Math.max(1, Math.min(3, parmi.length - 1)));
  return choisie;
}

// ===== 1. Conjugue (tapé) — le cœur =====
function conjugue(forcerPluriel = false) {
  const v = VERBES[courant];
  // Le pluriel pèse plus lourd: c'est là qu'il perd ses points à l'écrit.
  const p = personneFraiche(forcerPluriel ? ['nous', 'vous', 'ils'] : PERSONNES);
  const correct = v.formes[p];
  return {
    category: CATEGORY,
    type: 'conjugate',
    text: `Conjugue « ${v.verbe} » au ${v.temps} avec « ${AFFICHE[p]} ».`,
    correct,
    tape: 'mot',
    explanation: `${correct}.\n\n${v.regle}\n${EST_PLURIEL[p] ? `C'est une personne du PLURIEL: ${correct}.` : v.note}`,
    hint: `${v.verbe} au ${v.temps}: ${v.formes.je} · ${v.formes.tu} · ${v.formes.il} · …`,
  };
}

// ===== 2. La lettre qu'on n'entend pas =====
// « ils aiment » se dit comme « il aime ». Le -ent ne s'entend jamais, et il
// s'écrit toujours — c'est sa faute n° 1 à l'écrit.
function muette() {
  const v = VERBES[courant];
  const choix = Object.keys(v.muette);
  const p = pick(choix);
  const correct = v.muette[p];
  return {
    category: CATEGORY,
    type: 'muette',
    text: `Dans « ${v.formes[p]} », quelle(s) lettre(s) écrit-on sans les entendre?`,
    correct,
    options: quatre(correct, uniques(['s', 't', 'nt', 'ent', 'e', 'x']).filter((x) => x !== correct)),
    explanation: `« ${correct} ».\n\n`
      + `On écrit « ${v.formes[p]} » mais on ne prononce pas le « ${correct} » de la fin.\n`
      + `${EST_PLURIEL[p] ? 'Au pluriel, la terminaison ne s\'entend presque jamais — c\'est pour ça qu\'il faut la SAVOIR.' : v.note}`,
    hint: 'Dis le mot à voix haute, puis regarde-le écrit. Qu\'est-ce qui reste en trop?',
  };
}

// ===== 3. Qui va avec cette forme? =====
function quelPronom() {
  const v = VERBES[courant];
  const p = pick(PERSONNES);
  const forme = sansPronom(v.formes[p]);
  // Les formes qui s'écrivent pareil pour deux personnes (tu finis / je finis)
  // ne font pas une bonne question: on n'en garde qu'une.
  const ambigu = PERSONNES.filter((q) => q !== p && sansPronom(v.formes[q]) === forme);
  if (ambigu.length) return conjugue(true);
  return {
    category: CATEGORY,
    type: 'quel_pronom',
    text: `« ${forme} » — avec quel pronom?`,
    correct: AFFICHE[p],
    options: quatre(AFFICHE[p], shuffle(PERSONNES.filter((q) => q !== p).map((q) => AFFICHE[q]))),
    explanation: `${v.formes[p]}.\n\n${v.regle}`,
    hint: 'Regarde la terminaison: -ons va toujours avec nous, -ez avec vous.',
  };
}

// ===== 4. Singulier ou pluriel? =====
// Le geste de l'accord: reconnaître le nombre AVANT d'écrire la terminaison.
function singulierPluriel() {
  const v = VERBES[courant];
  const p = pick(PERSONNES);
  const bonne = EST_PLURIEL[p] ? 'pluriel' : 'singulier';
  return {
    category: CATEGORY,
    type: 'nombre',
    text: `« ${v.formes[p]} » — est-ce au singulier ou au pluriel?`,
    correct: bonne,
    options: ['singulier', 'pluriel'],
    explanation: `${bonne}.\n\n`
      + (EST_PLURIEL[p]
        ? `« ${AFFICHE[p]} », c'est PLUSIEURS personnes. Les trois personnes du pluriel sont nous, vous, ils/elles.`
        : `« ${AFFICHE[p]} », c'est UNE seule personne. Les trois personnes du singulier sont je, tu, il/elle.`),
    hint: 'nous, vous, ils et elles = plusieurs. je, tu, il et elle = un seul.',
  };
}

// ===== 5. Corrige la phrase =====
function corrige() {
  const v = VERBES[courant];
  const p = pick(['nous', 'vous', 'ils', 'tu']);
  const correct = v.formes[p];
  const autre = pick(PERSONNES.filter((q) => q !== p && v.formes[q] !== correct));
  const fautif = `${AFFICHE[p].split(' / ')[0]} ${sansPronom(v.formes[autre])}`;
  return {
    category: CATEGORY,
    type: 'corrige',
    text: `Cette phrase a une faute: « ${fautif} ». Comment doit-on l'écrire?`,
    correct,
    options: quatre(correct, [
      fautif,
      `${AFFICHE[p].split(' / ')[0]} ${v.verbe}`,
      `${AFFICHE[p].split(' / ')[0]} ${sansPronom(v.formes[pick(PERSONNES.filter((q) => q !== p && q !== autre))])}`,
    ]),
    explanation: `${correct}.\n\n`
      + `La terminaison doit aller avec « ${AFFICHE[p]} », pas avec quelqu'un d'autre.\n${v.regle}`,
    hint: `Qui fait l'action? ${AFFICHE[p]}. La terminaison suit la personne.`,
  };
}

function buildOne() {
  return pickAdaptive(CATEGORY, [
    // Le pluriel d'abord: « le verbe aimer au pluriel » (le parent, 11 oct.)
    { type: 'conjugate', w: 24, build: () => conjugue(true) },
    { type: 'conjugate_tout', w: 14, build: () => conjugue(false) },
    { type: 'muette', w: 18, build: muette },
    { type: 'corrige', w: 16, build: corrige },
    { type: 'quel_pronom', w: 12, build: quelPronom },
    { type: 'nombre', w: 10, build: singulierPluriel },
  ], (q) => `${q.type}|${q.text}`);
}

export function generateVerbeSemaine() {
  const q = buildOne();
  // Le tableau de conjugaison derrière le bouton « 📋 Le tableau », comme la
  // liste de mots derrière « 📋 La liste ».
  if (q) q.memoireVerbe = verbeCourant();
  return q;
}

export default generateVerbeSemaine;
