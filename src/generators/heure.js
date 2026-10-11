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
    // Le cadran est VIDE (la petite aiguille seule est deja placee): c'est
    // l'exercice 6 du cahier, « dessine les aiguilles ». Sans dessin, la
    // question demandait d'imaginer une horloge — Ryan l'a eue comme ca a
    // l'ecran le 11 oct., et son pere a dit « Ryan needs a visual for this ».
    horloge: { h, min: m, sansAiguilles: true, montrerHeure: true },
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
  { q: '1 heure = ___ minutes', r: 60, pourquoi: 'Le tour complet de la grande aiguille: 12 chiffres \u00d7 5 minutes = 60.' },
  { q: '1 minute = ___ secondes', r: 60, pourquoi: "Comme pour l'heure: 60." },
  { q: '2 heures = ___ minutes', r: 120, pourquoi: '60 + 60 = 120.' },
  { q: '1 demi-heure = ___ minutes', r: 30, pourquoi: 'La moiti\u00e9 de 60.' },
  { q: "1 quart d'heure = ___ minutes", r: 15, pourquoi: 'Le quart de 60: 60 \u00f7 4 = 15.' },
  { q: '1 jour = ___ heures', r: 24, pourquoi: '12 heures de jour + 12 heures de nuit.' },
  { q: '1 semaine = ___ jours', r: 7, pourquoi: 'Du lundi au dimanche.' },
  { q: '1 ann\u00e9e = ___ mois', r: 12, pourquoi: 'De janvier \u00e0 d\u00e9cembre.' },
  { q: '1 ann\u00e9e = ___ semaines', r: 52, pourquoi: '52 semaines dans une ann\u00e9e.' },
  { q: '120 minutes = ___ heures', r: 2, pourquoi: '120 \u00f7 60 = 2.' },
  { q: '90 minutes = 1 heure et ___ minutes', r: 30, pourquoi: '90 = 60 + 30. Il reste 30 minutes.' },
  { q: '75 minutes = 1 heure et ___ minutes', r: 15, pourquoi: '75 = 60 + 15. Il reste 15 minutes.' },
  // Les quatre \u00e9galit\u00e9s de la feuille AS.1.14, question 3, mot pour mot.
  { q: '2 ans = ___ mois', r: 24, pourquoi: '1 an = 12 mois, donc 12 + 12 = 24.' },
  { q: '4 semaines = ___ jours', r: 28, pourquoi: '1 semaine = 7 jours, donc 7 \u00d7 4 = 28.' },
  { q: '3 minutes = ___ secondes', r: 180, pourquoi: '1 minute = 60 secondes, donc 60 \u00d7 3 = 180.' },
  { q: '14 jours = ___ semaines', r: 2, pourquoi: '7 jours font 1 semaine: 14 = 7 + 7, donc 2 semaines.' },
  { q: '21 jours = ___ semaines', r: 3, pourquoi: '7 + 7 + 7 = 21, donc 3 semaines.' },
  { q: '3 ans = ___ mois', r: 36, pourquoi: '12 \u00d7 3 = 36.' },
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

// ===== 9. Compare deux dur\u00e9es (< > =) =====
// Feuille AS.1.14, question 1: \u00ab 24 heures \u25cb 60 minutes \u00bb.
// Reste \u00e0 CHOISIR, comme dans le cahier: classer n'est pas produire.
const EN_SECONDES = {
  seconde: 1, minute: 60, heure: 3600, jour: 86400,
  semaine: 604800, mois: 2592000, an: 31536000,
};
const PLURIEL = {
  seconde: 'secondes', minute: 'minutes', heure: 'heures', jour: 'jours',
  semaine: 'semaines', mois: 'mois', an: 'ans',
};
const ecrisDuree = (n, u) => `${n} ${n > 1 ? PLURIEL[u] : u}`;

function compareDuree() {
  const paires = [
    ['heure', 24, 'minute', 60], ['semaine', 1, 'jour', 7],
    ['seconde', 60, 'semaine', 1], ['minute', 1, 'seconde', 60],
    ['jour', 1, 'heure', 24], ['an', 1, 'mois', 12],
    ['heure', 2, 'minute', 90], ['jour', 2, 'heure', 50],
    ['minute', 3, 'seconde', 180], ['semaine', 2, 'jour', 14],
    ['mois', 1, 'semaine', 5], ['heure', 1, 'minute', 45],
  ];
  const [uA, nA, uB, nB] = pick(paires);
  const a = nA * EN_SECONDES[uA];
  const b = nB * EN_SECONDES[uB];
  const bonne = a > b ? '>' : a < b ? '<' : '=';
  const gaucheEnB = Math.round(a / EN_SECONDES[uB]);
  return {
    category: CATEGORY,
    type: 'compare_duree',
    text: `${ecrisDuree(nA, uA)}  ___  ${ecrisDuree(nB, uB)}`,
    correct: bonne,
    options: ['<', '>', '='],
    explanation: `${ecrisDuree(nA, uA)} ${bonne} ${ecrisDuree(nB, uB)}.\n\n`
      + `Pour comparer, il faut la M\u00caME unit\u00e9 des deux c\u00f4t\u00e9s.\n`
      + `${ecrisDuree(nA, uA)} = ${ecrisDuree(gaucheEnB, uB)}.\n`
      + `${gaucheEnB} ${bonne} ${nB} \u2192 ${bonne}`,
    hint: 'Transforme les deux dur\u00e9es dans la m\u00eame unit\u00e9 avant de comparer.',
  };
}

// ===== 10. Quotidien, hebdomadaire ou annuel =====
// Feuille AS.1.14, question 2 (le coloriage vert / jaune / bleu).
const ACTIVITES = [
  { quoi: "s'habiller", f: 'quotidienne' },
  { quoi: 'faire son lit', f: 'quotidienne' },
  { quoi: 'se brosser les dents', f: 'quotidienne' },
  { quoi: 'faire une dict\u00e9e par semaine', f: 'hebdomadaire' },
  { quoi: 'sortir le recyclage', f: 'hebdomadaire' },
  { quoi: "aller \u00e0 la biblioth\u00e8que le mardi", f: 'hebdomadaire' },
  { quoi: 'acheter des fournitures scolaires', f: 'annuelle' },
  { quoi: 'bricoler un cadeau de No\u00ebl pour ses parents', f: 'annuelle' },
  { quoi: 'f\u00eater son anniversaire', f: 'annuelle' },
];
function frequence() {
  const a = pick(ACTIVITES);
  return {
    category: CATEGORY,
    type: 'frequence',
    text: `\u00ab ${a.quoi} \u00bb \u2014 c'est une activit\u00e9\u2026`,
    correct: a.f,
    options: ['quotidienne', 'hebdomadaire', 'annuelle'],
    explanation: `${a.f}.\n\n`
      + 'quotidienne = chaque JOUR \u00b7 hebdomadaire = chaque SEMAINE \u00b7 annuelle = chaque ANN\u00c9E.\n'
      + `\u00ab ${a.quoi} \u00bb, \u00e7a revient ${a.f === 'quotidienne' ? 'tous les jours' : a.f === 'hebdomadaire' ? 'une fois par semaine' : 'une fois par ann\u00e9e'}.`,
    hint: 'Combien de fois \u00e7a arrive: chaque jour, chaque semaine, ou une fois par ann\u00e9e?',
  };
}

// ===== 11. La notation 24 heures =====
// Les horloges du cahier portent un anneau int\u00e9rieur 13..24, et l'exercice 5
// demande les DEUX \u00e9critures (\u00ab 1 h 45 ou 13 h 45 \u00bb).
function heure24() {
  const h = rand(1, 11);
  const m = rand(0, 11) * 5;
  const sens = pick(['vers24', 'vers12']);
  if (sens === 'vers24') {
    return {
      category: CATEGORY,
      type: 'heure_24',
      horloge: { h, min: m, ring24: true },
      text: `Il est ${ecrisHeure(h, m)} de l'APR\u00c8S-MIDI ou du SOIR. Comment l'\u00e9crit-on en notation 24 heures?`,
      correct: cle(h + 12, m),
      optionLabels: { [cle(h + 12, m)]: `${h + 12} h ${String(m).padStart(2, '0')}` },
      tape: 'heure24',
      maxHeure: 24,
      explanation: `${h + 12} h ${String(m).padStart(2, '0')}.\n\n`
        + `L'apr\u00e8s-midi, on continue de compter au lieu de repartir \u00e0 1: ${h} + 12 = ${h + 12}.\n`
        + `C'est l'anneau gris \u00e0 l'int\u00e9rieur du cadran: en face du ${h}, il y a ${h + 12}.`,
      hint: `Ajoute 12 \u00e0 l'heure: ${h} + 12 = ?`,
    };
  }
  const h24 = h + 12;
  return {
    category: CATEGORY,
    type: 'heure_24',
    text: `Il est ${h24} h ${String(m).padStart(2, '0')}. Quelle heure montre la PETITE aiguille sur le cadran?`,
    correct: cle(h, m),
    optionLabels: { [cle(h, m)]: ecrisHeure(h, m) },
    tape: 'heure24',
    explanation: `${ecrisHeure(h, m)}.\n\n`
      + `Une horloge \u00e0 aiguilles ne va que jusqu'\u00e0 12: on enl\u00e8ve 12.\n`
      + `${h24} \u2212 12 = ${h}. Les minutes, elles, ne changent pas.`,
    hint: `Enl\u00e8ve 12: ${h24} \u2212 12 = ?`,
  };
}

// ===== 12. Une dur\u00e9e \u00e9crite \u00ab __ heures et __ minutes \u00bb =====
// Feuille AS.1.14, question 7: la dur\u00e9e de l'observation de l'ours noir.
function dureeHeuresMinutes() {
  const h = rand(1, 9);
  const m1 = rand(0, 11) * 5;
  const ajoutH = rand(1, 3);
  const ajoutM = pick([0, 10, 15, 20, 25, 30, 40, 45]);
  const total = ajoutH * 60 + ajoutM;
  const fin = h * 60 + m1 + total;
  const fh = Math.floor(fin / 60), fm = fin % 60;
  const th = Math.floor(total / 60), tm = total % 60;
  return {
    category: CATEGORY,
    type: 'duree_h_min',
    text: `L'activit\u00e9 commence \u00e0 ${ecrisHeure(h, m1)} et finit \u00e0 ${ecrisHeure(h12(fh), fm)}. `
      + `Combien de temps dure-t-elle? \u00c9cris les HEURES, puis les MINUTES.`,
    correct: cle(th, tm),
    optionLabels: { [cle(th, tm)]: `${th} heures et ${tm} minutes` },
    tape: 'heure',
    tapeLabel: '\u00c9cris la dur\u00e9e',
    explanation: `${th} heures et ${tm} minutes.\n\n`
      + `De ${ecrisHeure(h, m1)} \u00e0 ${ecrisHeure(h12(h + th), m1)}: ${th} heures enti\u00e8res.\n`
      + `Puis jusqu'\u00e0 ${ecrisHeure(h12(fh), fm)}: ${tm} minutes.\n`
      + `On compte d'abord les heures enti\u00e8res, ensuite les minutes qui restent.`,
    hint: "Compte les heures enti\u00e8res d'abord, puis les minutes en trop.",
  };
}

function buildOne() {
  return pickAdaptive(CATEGORY, [
    { type: 'lire_heure', w: 22, build: lireHeure },
    { type: 'placer_aiguilles', w: 12, build: placerAiguilles },
    { type: 'demie_quart', w: 8, build: demieQuart },
    { type: 'duree', w: 10, build: duree },
    { type: 'duree_h_min', w: 10, build: dureeHeuresMinutes },
    { type: 'plus_tard', w: 10, build: plusTard },
    { type: 'heure_24', w: 10, build: heure24 },
    { type: 'compare_duree', w: 12, build: compareDuree },
    { type: 'conversion', w: 12, build: conversion },
    { type: 'frequence', w: 8, build: frequence },
    { type: 'unite_temps', w: 5, build: uniteTemps },
    { type: 'calendrier', w: 5, build: calendrier },
  ], (q) => `${q.type}|${q.text}|${q.horloge ? q.horloge.h + ':' + q.horloge.min : ''}`);
}

export function generateHeure() {
  return buildOne();
}

export default generateHeure;
