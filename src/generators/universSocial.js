import { fillOptions } from './options.js';
import { MOTS, IMAGES, motById } from '../data/universSocialD1.js';
import { getUsStats, usPriority, getVariants } from '../data/universSocialStats.js';
// Univers social — Dossier 1 (Cayla, secondaire 1) — choix multiple
// Reproduit les 3 formats « objectifs » de l'examen:
//   1. associer le mot à une définition (dans les 2 sens)
//   2. trouver le mot qui résume un texte
//   3. placer un mot dans un texte (phrase à trou)
// + bonus: reconnaître l'image (page 5 du dossier)
// Le format 4 (définir dans ses mots) se travaille dans l'écran « Cartes ».

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Adaptatif: un mot qu'elle vient de rater ressort 6× plus souvent qu'un mot
// maîtrisé; sans historique, on se fie à sa pastille (rouge ×3, jaune ×2).
function pickWord() {
  const stats = getUsStats();
  const weights = MOTS.map((m) => usPriority(m, stats));
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < MOTS.length; i++) { r -= weights[i]; if (r <= 0) return MOTS[i]; }
  return MOTS[MOTS.length - 1];
}

// Mots avec lesquels elle a déjà confondu ce mot-là (les plus fréquents d'abord)
function confusedWith(target) {
  const s = getUsStats()[target.id];
  if (!s) return [];
  return Object.entries(s.confusions).sort((a, b) => b[1] - a[1]).map(([id]) => motById[id]).filter(Boolean);
}

// Distracteurs: ses confusions passées d'abord, puis le même aspect (piégeux), puis le reste
function wordOptions(target) {
  const options = new Set([target.mot]);
  fillOptions(options, confusedWith(target).slice(0, 2).map((m) => m.mot), 3);
  const same = MOTS.filter((m) => m.id !== target.id && m.aspect === target.aspect).map((m) => m.mot);
  const others = MOTS.filter((m) => m.id !== target.id && m.aspect !== target.aspect).map((m) => m.mot);
  fillOptions(options, same, 3);
  fillOptions(options, others, 4);
  return shuffle([...options]);
}

function defOptions(target) {
  const options = new Set([target.cle]);
  fillOptions(options, confusedWith(target).slice(0, 2).map((m) => m.cle), 3);
  const same = MOTS.filter((m) => m.id !== target.id && m.aspect === target.aspect).map((m) => m.cle);
  const others = MOTS.filter((m) => m.id !== target.id && m.aspect !== target.aspect).map((m) => m.cle);
  fillOptions(options, same, 3);
  fillOptions(options, others, 4);
  return shuffle([...options]);
}

// Texte / phrase: une variante écrite par l'IA pour ce mot si on en a (50 %), sinon celle du fichier
function texteFor(m) {
  const v = getVariants()[m.id];
  return v && v.textes.length && Math.random() < 0.5 ? pick(v.textes) : m.texte;
}
function trouFor(m) {
  const v = getVariants()[m.id];
  return v && v.trous.length && Math.random() < 0.5 ? pick(v.trous) : m.trou;
}

const base = (m, extra) => ({
  category: 'univers_social',
  ...extra,
  explanation: `${m.mot}: ${m.cle}${m.note ? ` (ta note: « ${m.note} »)` : ''}`,
});

export function generateUniversSocial() {
  const m = pickWord();
  const r = Math.random();

  // 1a. définition → mot
  if (r < 0.3) {
    return base(m, {
      type: 'us_def_mot',
      text: `Quel mot correspond à cette définition?\n« ${m.def} »`,
      correct: m.mot,
      options: wordOptions(m),
    });
  }
  // 1b. mot → définition
  if (r < 0.5) {
    return base(m, {
      type: 'us_mot_def',
      text: `Que veut dire « ${m.mot} »?`,
      correct: m.cle,
      options: defOptions(m),
    });
  }
  // 2. texte → mot qui le résume
  if (r < 0.72) {
    return base(m, {
      type: 'us_texte',
      text: `Quel mot résume ce texte?\n« ${texteFor(m)} »`,
      correct: m.mot,
      options: wordOptions(m),
    });
  }
  // 3. phrase à trou
  if (r < 0.92 || !m.image || !IMAGES[m.image].mot) {
    return base(m, {
      type: 'us_trou',
      text: `Complète la phrase avec le bon mot:\n« ${trouFor(m)} »`,
      correct: m.mot,
      options: wordOptions(m),
    });
  }
  // 4. image (page 5) → mot
  const img = IMAGES[m.image];
  const target = motById[img.mot];
  return base(target, {
    type: 'us_image',
    text: `Image ${m.image} du dossier: ${img.desc}.\nÀ quel mot cette image correspond-elle?`,
    correct: target.mot,
    options: wordOptions(target),
  });
}
