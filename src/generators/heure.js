// La mesure du temps et l'heure — Matcha, Aide-mémoire p. 12-13
// Leçon de la semaine du 12 au 16 octobre 2026 (feuille de Mme Haidar).
//
// Rien de tout ça n'existait dans l'app: `mesure.js` ne fait que les
// centimètres. C'est la première fois que Ryan voit une horloge ici.
//
// Les trois erreurs de 3e année, et ce que le générateur en fait:
//   1. LIRE LES AIGUILLES À L'ENVERS — 2 h 50 lu « 10 h 10 ». Les aiguilles
//      sont dessinées de longueur et de couleur différentes (components/Horloge),
//      et le diagnostic reconnaît l'inversion pour la nommer.
//   2. LE 4 VAUT 20 — compter les minutes de 5 en 5 sur les mêmes chiffres.
//      Type `placer_aiguilles`, et l'anneau d'aide sur le cadran.
//   3. NE PAS ÉCHANGER À 60 — 3 h 45 + 25 min écrit « 3 h 70 ». C'est son
//      vieux réflexe des blocs (dix plaques ≠ mille) transposé au temps: il ne
//      regroupe pas. Types `plus_tard` et `duree`, diagnostic dédié.
import { pickAdaptive } from '../utils/skillStats';
import { getLevel } from '../utils/mastery';

const CATEGORY = 'heure';

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const uniques = (arr) => arr.filter((v, i, a) => a.indexOf(v) === i);

// Quatre choix dont la bonne réponse, sans doublon.
function quatre(bonne, leurres) {
  const opts = uniques([bonne, ...leurres]).slice(0, 4);
  return shuffle(opts);
}

// « 3 h 45 », « 3 h » pile. C'est l'écriture du cahier.
export const ecrisHeure = (h, m) => (m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, '0')}`);
// La forme canonique de la réponse tapée: deux cases, heures et minutes.
const cle = (h, m) => `${h}:${String(m).padStart(2, '0')}`;

// Un cadran rend 12 h, jamais 0 h.
const h12 = (h) => ((h - 1 + 12) % 12) + 1;

// ===== 1. Lire l'horloge =====
// Il TAPE l'heure. La reconnaître parmi quatre cadrans n'est pas la même
// compétence que la lire — c'est tout ce qu'on a appris de matcha_nombres.
function lireHeure() {
  const h = rand(1, 12);
  // Des PALIERS, pas « un peu plus dur »: on enlève une béquille à la fois
  // (utils/mastery, même règle que les problèmes à étapes). Il pleure quand il
  // se trompe — lui donner 9 h 57 à lire le premier jour, c'est le perdre.
  //   1: l'heure pile, et demie, et quart — celles qu'on dit à voix haute
  //   2: de 5 en 5, ce que demande la 3e année
  //   3: de 5 en 5, sans l'anneau des minutes
  //   4: à la minute près
  const niveau = getLevel(CATEGORY);
  const r = Math.random();
  const m = niveau <= 1 ? pick([0, 15, 30, 45])
    : niveau <= 3 ? (r < 0.3 ? pick([0, 15, 30, 45]) : rand(0, 11) * 5)
      : (r < 0.55 ? rand(0, 11) * 5 : rand(0, 59));
  // L'anneau des minutes (5, 10, 15…) ne sert qu'aux cadrans qui ne tombent
  // pas sur une heure ronde, et il disparaît au palier 3: une béquille
  // permanente empêcherait d'apprendre à compter de 5 en 5 tout seul.
  const aide = niveau <= 2 && m !== 0 && m % 15 !== 0;
  const cinq = Math.floor(m / 5);
  const ouMinute = m % 5 === 0
    ? `sur le ${cinq === 0 ? 12 : cinq}`
    : `entre le ${cinq === 0 ? 12 : cinq} et le ${cinq + 1}`;
  return {
    category: CATEGORY,
    type: 'lire_heure',
    text: "Quelle heure est-il? Écris l'heure, puis les minutes.",
    horloge: { h, min: m, aide },
    correct: cle(h, m),
    optionLabels: { [cle(h, m)]: ecrisHeure(h, m) },
    tape: 'heure',
    explanation: `${ecrisHeure(h, m)}.\n\n`
      + `La PETITE aiguille: ${m >= 30
        ? `elle est entre le ${h} et le ${h12(h + 1)}. On garde le plus petit → ${h} heures.`
        : `elle est sur le ${h} (ou juste après) → ${h} heures.`}\n`
      + `La GRANDE aiguille: elle est ${ouMinute} → ${m} minutes (on compte de 5 en 5).`,
    hint: 'La petite aiguille donne les heures. La grande donne les minutes: compte de 5 en 5 sur les chiffres.',
  };
}

// ===== 2. Où se place la grande aiguille =====
// « Le 4, c'est 20 »: le seul vrai obstacle pour lire les minutes.
function placerAiguilles() {
  const h = rand(1, 12);
  const m = pick([5, 10, 20, 25, 35, 40, 50, 55]);
  const chiffre = m / 5;
  const bonne = `sur le ${chiffre}`;
  return {
    category: CATEGORY,
    type: 'placer_aiguilles',
    text: `Il est ${ecrisHeure(h, m)}. Où pointe la GRANDE aiguille (celle des minutes)?`,
    correct: bonne,
    options: quatre(bonne, [
      `sur le ${h}`,
      `entre le ${chiffre} et le ${chiffre + 1}`,
      `sur le ${h12(chiffre + 2)}`,
      `sur le ${h12(chiffre + 5)}`,
    ]),
    explanation: `Sur le ${chiffre}.\n\n`
      + 'Pour la grande aiguille, chaque chiffre de l\'horloge vaut 5 minutes: '
      + '1 → 5, 2 → 10, 3 → 15, 4 → 20…\n'
      + `${chiffre} × 5 = ${m} minutes.`,
    hint: `Divise les minutes par 5: ${m} ÷ 5 = ?`,
  };
}

// ===== 3. Et demie, et quart, moins quart =====
function demieQuart() {
  const h = rand(1, 12);
  const suivant = h12(h + 1);
  const cas = pick([
    { m: 30, dit: `${h} heures et demie` },
    { m: 15, dit: `${h} heures et quart` },
    { m: 45, dit: `${suivant} heures moins quart` },
    { m: 0, dit: `${h} heures pile` },
  ]);
  return {
    category: CATEGORY,
    type: 'demie_quart',
    text: `Comment dit-on ${ecrisHeure(h, cas.m)}?`,
    correct: cas.dit,
    options: quatre(cas.dit, [
      `${h} heures et demie`,
      `${h} heures et quart`,
      `${suivant} heures moins quart`,
      `${h} heures pile`,
    ]),
    explanation: `${cas.dit}.\n\n`
      + 'Une heure = 60 minutes.\n'
      + '• la moitié de 60 = 30 → « et demie »\n'
      + '• le quart de 60 = 15 → « et quart »\n'
      + `• 45, c'est 15 minutes avant l'heure suivante → « ${suivant} heures moins quart »`,
    hint: '30 minutes = la moitié d\'une heure. 15 minutes = le quart.',
  };
}

// ===== 4. Combien de temps? (une durée) =====
// Le piège de l'échange à 60: de 14 h 50 à 15 h 20, il n'y a pas 70 minutes.
function duree() {
  const h = rand(1, 10);
  // Au palier 1, on part d'une heure ronde et on reste sous l'heure: le saut
  // par-dessus 60 est la vraie difficulté, elle arrive au palier suivant.
  const niveau = getLevel(CATEGORY);
  const m1 = niveau <= 1 ? pick([0, 15, 30]) : rand(0, 11) * 5;
  const total = niveau <= 1 ? pick([10, 15, 20, 30])
    : pick([10, 15, 20, 25, 30, 40, 45, 50, 60, 75, 90]);
  const debut = h * 60 + m1;
  const fin = debut + total;
  const fh = Math.floor(fin / 60), fm = fin % 60;
  const quoi = pick([
    { a: 'Le film commence', b: 'il finit' },
    { a: 'La récréation commence', b: 'elle finit' },
    { a: 'Le cours de natation commence', b: 'il finit' },
    { a: 'La partie de soccer commence', b: 'elle finit' },
    { a: 'Le dîner commence', b: 'il finit' },
  ]);
  const passeLHeure = m1 + total >= 60;
  return {
    category: CATEGORY,
    type: 'duree',
    text: `${quoi.a} à ${ecrisHeure(h, m1)} et ${quoi.b} à ${ecrisHeure(h12(fh), fm)}. Combien de MINUTES ça dure?`,
    correct: total,
    tape: 'nombre',
    explanation: `${total} minutes.\n\n`
      + (passeLHeure && m1 !== 0
        ? `On avance par bonds. De ${ecrisHeure(h, m1)} à ${ecrisHeure(h12(h + 1), 0)}: ${60 - m1} minutes.\n`
          + `Puis de ${ecrisHeure(h12(h + 1), 0)} à ${ecrisHeure(h12(fh), fm)}: ${total - (60 - m1)} minutes.\n`
          + `${60 - m1} + ${total - (60 - m1)} = ${total} minutes.`
        : `De ${ecrisHeure(h, m1)} à ${ecrisHeure(h12(fh), fm)}, la grande aiguille avance de ${total} minutes.`)
      + '\nUne heure entière vaut 60 minutes, pas 100.',
    hint: "Avance jusqu'à l'heure pile d'abord, puis compte le reste.",
  };
}

// ===== 5. Quelle heure sera-t-il? =====
function plusTard() {
  const h = rand(1, 11);
  const m = rand(0, 11) * 5;
  const ajout = pick([10, 15, 20, 25, 30, 35, 40, 45]);
  const fin = h * 60 + m + ajout;
  const fh = h12(Math.floor(fin / 60)), fm = fin % 60;
  const deborde = m + ajout >= 60;
  return {
    category: CATEGORY,
    type: 'plus_tard',
    text: `Il est ${ecrisHeure(h, m)}. Dans ${ajout} minutes, quelle heure sera-t-il?`,
    correct: cle(fh, fm),
    optionLabels: { [cle(fh, fm)]: ecrisHeure(fh, fm) },
    tape: 'heure',
    explanation: `${ecrisHeure(fh, fm)}.\n\n`
      + (deborde
        ? `${m} + ${ajout} = ${m + ajout} minutes. Mais une horloge ne va que jusqu'à 60: `
          + `on ÉCHANGE 60 minutes contre 1 heure.\n`
          + `${m + ajout} − 60 = ${fm} minutes, et l'heure monte de 1 → ${fh} h.`
        : `${m} + ${ajout} = ${fm} minutes. On reste dans la même heure → ${ecrisHeure(fh, fm)}.`),
    hint: deborde
      ? 'Tu dépasses 60 minutes? Alors échange 60 minutes contre 1 heure.'
      : 'Ajoute les minutes, l\'heure ne bouge pas.',
  };
}

// ===== 6. La bonne unité de temps =====
const UNITES = ['secondes', 'minutes', 'heures', 'jours', 'mois', 'années'];
const unites = [
  { quoi: 'un battement de cœur', u: 'secondes' },
  { quoi: 'le brossage de tes dents', u: 'minutes' },
  { quoi: 'une nuit de sommeil', u: 'heures' },
  { quoi: 'une récréation', u: 'minutes' },
  { quoi: "les vacances d'été", u: 'mois' },
  { quoi: 'une année scolaire', u: 'mois' },
  { quoi: 'un film', u: 'heures' },
  { quoi: 'le temps de dire ton nom', u: 'secondes' },
  { quoi: 'un voyage en avion vers la France', u: 'heures' },
  { quoi: 'ton âge', u: 'années' },
  { quoi: 'une journée de classe', u: 'heures' },
  { quoi: "le temps de compter jusqu'à 10", u: 'secondes' },
  { quoi: 'un camp de vacances', u: 'jours' },
];
function uniteTemps() {
  const it = pick(unites);
  return {
    category: CATEGORY,
    type: 'unite_temps',
    text: `Pour mesurer ${it.quoi}, quelle unité est la MEILLEURE?`,
    correct: it.u,
    options: quatre(it.u, shuffle(UNITES.filter((u) => u !== it.u))),
    explanation: `${it.u}.\n\n`
      + 'Du plus court au plus long: seconde → minute → heure → jour → semaine → mois → année.',
    hint: "Est-ce plus court ou plus long qu'une journée?",
  };
}

// ===== 7. Les équivalences =====
const equivalences = [
  { q: '1 heure = ___ minutes', r: 60, pourquoi: 'Le tour complet de la grande aiguille: 12 chiffres × 5 minutes = 60.' },
  { q: '1 minute = ___ secondes', r: 60, pourquoi: "Comme pour l'heure: 60." },
  { q: '2 heures = ___ minutes', r: 120, pourquoi: '60 + 60 = 120.' },
  { q: '1 demi-heure = ___ minutes', r: 30, pourquoi: 'La moitié de 60.' },
  { q: "1 quart d'heure = ___ minutes", r: 15, pourquoi: 'Le quart de 60: 60 ÷ 4 = 15.' },
  { q: '1 jour = ___ heures', r: 24, pourquoi: '12 heures de jour + 12 heures de nuit.' },
  { q: '1 semaine = ___ jours', r: 7, pourquoi: 'Du lundi au dimanche.' },
  { q: '1 année = ___ mois', r: 12, pourquoi: 'De janvier à décembre.' },
  { q: '1 année = ___ semaines', r: 52, pourquoi: '52 semaines dans une année.' },
  { q: '120 minutes = ___ heures', r: 2, pourquoi: '120 ÷ 60 = 2.' },
  { q: '90 minutes = 1 heure et ___ minutes', r: 30, pourquoi: '90 = 60 + 30. Il reste 30 minutes.' },
  { q: '75 minutes = 1 heure et ___ minutes', r: 15, pourquoi: '75 = 60 + 15. Il reste 15 minutes.' },
];
function conversion() {
  const it = pick(equivalences);
  return {
    category: CATEGORY,
    type: 'conversion',
    text: it.q,
    correct: it.r,
    tape: 'nombre',
    explanation: `${it.r}.\n\n${it.pourquoi}`,
    hint: 'Une heure et une minute ont le même nombre magique: 60.',
  };
}

// ===== 8. Le calendrier =====
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
function calendrier() {
  const genre = pick(['mois_apres', 'mois_avant', 'jour_apres', 'rang_mois']);
  if (genre === 'rang_mois') {
    const i = rand(0, 11);
    return {
      category: CATEGORY,
      type: 'calendrier',
      text: `Quel est le ${i + 1}e mois de l'année?`,
      correct: MOIS[i],
      options: quatre(MOIS[i], [MOIS[(i + 1) % 12], MOIS[(i + 5) % 12], MOIS[(i + 8) % 12]]),
      explanation: `${MOIS[i]}.\n\nL'ordre des mois: ${MOIS.join(', ')}.`,
      hint: 'Compte les mois depuis janvier.',
    };
  }
  if (genre === 'jour_apres') {
    const i = rand(0, 6);
    return {
      category: CATEGORY,
      type: 'calendrier',
      text: `Quel jour vient APRÈS ${JOURS[i]}?`,
      correct: JOURS[(i + 1) % 7],
      options: quatre(JOURS[(i + 1) % 7], [JOURS[(i + 6) % 7], JOURS[(i + 2) % 7], JOURS[(i + 4) % 7]]),
      explanation: `${JOURS[(i + 1) % 7]}.\n\nLa semaine: ${JOURS.join(', ')}.`,
      hint: 'La semaine commence le lundi.',
    };
  }
  const i = rand(0, 11);
  const apres = genre === 'mois_apres';
  const bon = MOIS[apres ? (i + 1) % 12 : (i + 11) % 12];
  return {
    category: CATEGORY,
    type: 'calendrier',
    text: `Quel mois vient ${apres ? 'APRÈS' : 'AVANT'} ${MOIS[i]}?`,
    correct: bon,
    options: quatre(bon, [MOIS[(i + 2) % 12], MOIS[(i + 10) % 12], MOIS[(i + 6) % 12], MOIS[(i + 4) % 12]]),
    explanation: `${bon}.\n\nL'ordre des mois: ${MOIS.join(', ')}.`,
    hint: apres ? "Avance d'un mois." : "Recule d'un mois.",
  };
}

function buildOne() {
  return pickAdaptive(CATEGORY, [
    { type: 'lire_heure', w: 26, build: lireHeure },
    { type: 'placer_aiguilles', w: 10, build: placerAiguilles },
    { type: 'demie_quart', w: 12, build: demieQuart },
    { type: 'duree', w: 14, build: duree },
    { type: 'plus_tard', w: 14, build: plusTard },
    { type: 'unite_temps', w: 8, build: uniteTemps },
    { type: 'conversion', w: 10, build: conversion },
    { type: 'calendrier', w: 6, build: calendrier },
  ], (q) => `${q.type}|${q.text}|${q.horloge ? q.horloge.h + ':' + q.horloge.min : ''}`);
}

export function generateHeure() {
  return buildOne();
}

export default generateHeure;
