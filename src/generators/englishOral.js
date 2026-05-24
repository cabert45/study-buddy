// English oral — Ryan 2e année
// Test: Mercredi 13 mai (this week) — réciter days, months, seasons
// Also covers part of: Mercredi 10 juin — Anglais (exam final)
import { withFresh } from '../utils/antiRepeat';
import { getStudyRounds } from '../utils/studyRounds';

const ruleFor = (mode, rule) => (getStudyRounds(mode) < 1 ? rule : undefined);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const days = [
  { fr: 'lundi', en: 'Monday' },
  { fr: 'mardi', en: 'Tuesday' },
  { fr: 'mercredi', en: 'Wednesday' },
  { fr: 'jeudi', en: 'Thursday' },
  { fr: 'vendredi', en: 'Friday' },
  { fr: 'samedi', en: 'Saturday' },
  { fr: 'dimanche', en: 'Sunday' },
];

const months = [
  { fr: 'janvier', en: 'January' },
  { fr: 'février', en: 'February' },
  { fr: 'mars', en: 'March' },
  { fr: 'avril', en: 'April' },
  { fr: 'mai', en: 'May' },
  { fr: 'juin', en: 'June' },
  { fr: 'juillet', en: 'July' },
  { fr: 'août', en: 'August' },
  { fr: 'septembre', en: 'September' },
  { fr: 'octobre', en: 'October' },
  { fr: 'novembre', en: 'November' },
  { fr: 'décembre', en: 'December' },
];

const seasons = [
  { fr: 'printemps', en: 'Spring' },
  { fr: 'été', en: 'Summer' },
  { fr: 'automne', en: 'Fall', alt: 'Autumn' },
  { fr: 'hiver', en: 'Winter' },
];

// Persistent rule banner with full list for reference
const ENGLISH_RULE = `Days: Monday · Tuesday · Wednesday · Thursday · Friday · Saturday · Sunday

Months: January · February · March · April · May · June ·
July · August · September · October · November · December

Seasons: Spring · Summer · Fall · Winter`;

// ===== Type 1: French → English =====
function generateFrToEn(pool) {
  const item = pick(pool);
  const distractors = pool.filter((x) => x.en !== item.en);
  const options = shuffle([item.en, ...shuffle(distractors).slice(0, 3).map((d) => d.en)]);
  return {
    category: 'english_oral',
    type: 'fr_to_en',
    rule: ruleFor('english_oral', ENGLISH_RULE),
    text: `Comment dit-on « ${item.fr} » en anglais?`,
    correct: item.en,
    spokenWord: item.en,
    spokenLang: 'en',
    options,
    explanation: `${item.fr} = ${item.en}.`,
    hint: 'Appuie sur 🔊 pour entendre la prononciation.',
  };
}

// ===== Type 2: English → French =====
function generateEnToFr(pool) {
  const item = pick(pool);
  const distractors = pool.filter((x) => x.fr !== item.fr);
  const options = shuffle([item.fr, ...shuffle(distractors).slice(0, 3).map((d) => d.fr)]);
  return {
    category: 'english_oral',
    type: 'en_to_fr',
    rule: ruleFor('english_oral', ENGLISH_RULE),
    text: `Que veut dire « ${item.en} » en français?`,
    correct: item.fr,
    options,
    explanation: `${item.en} = ${item.fr}.`,
    hint: '',
  };
}

// ===== Type 3: What comes NEXT? =====
function generateNext(pool, label) {
  const idx = Math.floor(Math.random() * pool.length);
  const item = pool[idx];
  const nextItem = pool[(idx + 1) % pool.length];
  const correct = nextItem.en;
  const distractors = pool.filter((x) => x.en !== correct);
  const options = shuffle([correct, ...shuffle(distractors).slice(0, 3).map((d) => d.en)]);
  return {
    category: 'english_oral',
    type: 'next',
    rule: ruleFor('english_oral', ENGLISH_RULE),
    text: `What comes AFTER ${item.en}? (${label})`,
    correct,
    spokenWord: correct,
    spokenLang: 'en',
    options,
    explanation: `After ${item.en} comes ${correct}.`,
    hint: `Récite dans ta tête la suite des ${label}.`,
  };
}

// ===== Type 4: What comes BEFORE? =====
function generatePrev(pool, label) {
  const idx = Math.floor(Math.random() * pool.length);
  const item = pool[idx];
  const prevItem = pool[(idx - 1 + pool.length) % pool.length];
  const correct = prevItem.en;
  const distractors = pool.filter((x) => x.en !== correct);
  const options = shuffle([correct, ...shuffle(distractors).slice(0, 3).map((d) => d.en)]);
  return {
    category: 'english_oral',
    type: 'prev',
    rule: ruleFor('english_oral', ENGLISH_RULE),
    text: `What comes BEFORE ${item.en}? (${label})`,
    correct,
    spokenWord: correct,
    spokenLang: 'en',
    options,
    explanation: `Before ${item.en} comes ${correct}.`,
    hint: `Récite dans ta tête.`,
  };
}

// ===== Type 5: Position quiz =====
function generatePosition(pool, label, singular) {
  const positions = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
  const idx = Math.floor(Math.random() * pool.length);
  const correct = pool[idx].en;
  const positionLabel = positions[idx];
  const distractors = pool.filter((x) => x.en !== correct);
  const options = shuffle([correct, ...shuffle(distractors).slice(0, 3).map((d) => d.en)]);
  return {
    category: 'english_oral',
    type: 'position',
    rule: ruleFor('english_oral', ENGLISH_RULE),
    text: `What is the ${positionLabel} ${singular}?`,
    correct,
    spokenWord: correct,
    spokenLang: 'en',
    options,
    explanation: `The ${positionLabel} ${singular} is ${correct}.`,
    hint: `Compte depuis le début!`,
  };
}

function buildOne() {
  // Mix all 3 pools (days, months, seasons)
  // Bias toward harder items: months are 12 items, easier to mix up
  const poolChoice = Math.random();
  let pool, label, singular;
  if (poolChoice < 0.35) { pool = days; label = 'days of the week'; singular = 'day'; }
  else if (poolChoice < 0.80) { pool = months; label = 'months'; singular = 'month'; }
  else { pool = seasons; label = 'seasons'; singular = 'season'; }

  const r = Math.random();
  if (r < 0.30) return generateFrToEn(pool);
  if (r < 0.55) return generateEnToFr(pool);
  if (r < 0.75) return generateNext(pool, label);
  if (r < 0.90) return generatePrev(pool, label);
  return generatePosition(pool, label, singular);
}

export function generateEnglishOral() {
  return withFresh('english_oral', buildOne, 80, 25, (q) => `${q.type}|${q.text}`);
}
