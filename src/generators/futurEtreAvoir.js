// Futur simple — auxiliaires ÊTRE et AVOIR
// TEST mercredi 20 mai 2026 — mémorisation pure (D-T Rouge)
// Ryan doit savoir par cœur les 6 personnes pour les 2 verbes.
//
// Être au futur:  je serai · tu seras · il/elle sera · nous serons · vous serez · ils/elles seront
// Avoir au futur: j'aurai · tu auras · il/elle aura · nous aurons · vous aurez · ils/elles auront
import { withFresh } from '../utils/antiRepeat';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const etre = {
  je:    { form: 'serai',   display: 'je serai' },
  tu:    { form: 'seras',   display: 'tu seras' },
  il:    { form: 'sera',    display: 'il sera' },
  elle:  { form: 'sera',    display: 'elle sera' },
  nous:  { form: 'serons',  display: 'nous serons' },
  vous:  { form: 'serez',   display: 'vous serez' },
  ils:   { form: 'seront',  display: 'ils seront' },
  elles: { form: 'seront',  display: 'elles seront' },
};

const avoir = {
  je:    { form: 'aurai',   display: "j'aurai" },
  tu:    { form: 'auras',   display: 'tu auras' },
  il:    { form: 'aura',    display: 'il aura' },
  elle:  { form: 'aura',    display: 'elle aura' },
  nous:  { form: 'aurons',  display: 'nous aurons' },
  vous:  { form: 'aurez',   display: 'vous aurez' },
  ils:   { form: 'auront',  display: 'ils auront' },
  elles: { form: 'auront',  display: 'elles auront' },
};

const pronouns = ['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles'];
const allEtreForms = Array.from(new Set(Object.values(etre).map(e => e.form)));
const allAvoirForms = Array.from(new Set(Object.values(avoir).map(e => e.form)));

function pickPronoun() { return pick(pronouns); }

// === TYPE 1: Direct conjugation drill (MAIN — this IS the test) ===
function generateConjugate() {
  const isEtre = Math.random() < 0.5;
  const verb = isEtre ? 'être' : 'avoir';
  const table = isEtre ? etre : avoir;
  const pronoun = pickPronoun();
  const correct = table[pronoun].display;

  // Distractors: same verb, OTHER persons (classic confusion)
  const otherForms = pronouns
    .filter(p => p !== pronoun && table[p].display !== correct)
    .map(p => table[p].display);
  // Plus one "wrong verb" form to trap mix-ups (être vs avoir)
  const otherTable = isEtre ? avoir : etre;
  const trap = otherTable[pronoun].display;

  const distractors = shuffle([...new Set([...shuffle(otherForms).slice(0, 2), trap])]).slice(0, 3);
  const options = shuffle([correct, ...distractors]);

  return {
    category: 'futur_etre_avoir',
    type: 'conjugate',
    text: `Conjugue le verbe « ${verb.toUpperCase()} » au FUTUR avec « ${pronoun} » :`,
    correct,
    options,
    explanation: `${verb.toUpperCase()} au futur :\n` +
      `${isEtre ? 'je serai · tu seras · il/elle sera · nous serons · vous serez · ils/elles seront' :
                  "j'aurai · tu auras · il/elle aura · nous aurons · vous aurez · ils/elles auront"}\n\n` +
      `Avec « ${pronoun} » → ${correct}.`,
    hint: isEtre
      ? `ÊTRE au futur commence par "ser-" (pas "êtr-"!). Pense au pronom pour la fin.`
      : `AVOIR au futur commence par "aur-" (pas "avoir-"!). Pense au pronom pour la fin.`,
  };
}

// === TYPE 2: Context fill ===
const contextsEtre = [
  { text: 'Demain, ___PRO___ ___ à l\'école.',           reasonable: ['je','tu','il','elle','nous','vous','ils','elles'] },
  { text: 'L\'été prochain, ___PRO___ ___ en vacances.', reasonable: ['je','tu','il','elle','nous','vous','ils','elles'] },
  { text: 'Bientôt, ___PRO___ ___ grand(e).',            reasonable: ['je','tu','il','elle'] },
  { text: 'Dans 10 ans, ___PRO___ ___ adultes.',         reasonable: ['nous','vous','ils','elles'] },
  { text: 'Plus tard, ___PRO___ ___ content(e).',        reasonable: ['je','tu','il','elle'] },
  { text: 'À midi, ___PRO___ ___ prêt(s).',              reasonable: ['je','tu','il','elle','nous','vous','ils','elles'] },
];

const contextsAvoir = [
  { text: 'À Noël, ___PRO___ ___ des cadeaux.',          reasonable: ['je','tu','il','elle','nous','vous','ils','elles'] },
  { text: 'Demain, ___PRO___ ___ une surprise.',         reasonable: ['je','tu','il','elle','nous','vous','ils','elles'] },
  { text: 'Quand je grandirai, ___PRO___ ___ un chien.', reasonable: ['je'] },
  { text: 'L\'an prochain, ___PRO___ ___ 8 ans.',        reasonable: ['je','tu','il','elle'] },
  { text: 'Plus tard, ___PRO___ ___ une voiture.',       reasonable: ['je','tu','il','elle','nous','vous','ils','elles'] },
  { text: 'Bientôt, ___PRO___ ___ de la chance.',        reasonable: ['je','tu','il','elle','nous','vous','ils','elles'] },
];

function generateContextFill() {
  const isEtre = Math.random() < 0.5;
  const ctx = pick(isEtre ? contextsEtre : contextsAvoir);
  const table = isEtre ? etre : avoir;
  const pronoun = pick(ctx.reasonable);
  const correct = table[pronoun].form;

  // Distractors: wrong forms of same verb
  const wrongForms = Object.values(table).map(e => e.form).filter(f => f !== correct);
  // Plus the wrong-verb trap
  const otherTable = isEtre ? avoir : etre;
  const trap = otherTable[pronoun].form;

  const distractors = shuffle([...new Set([...shuffle(wrongForms).slice(0, 2), trap])]).slice(0, 3);
  const options = shuffle([correct, ...distractors]);

  // Render full sentence shown to user
  const proDisplay = pronoun === 'je' && !isEtre ? "j'" : `${pronoun} `;
  const sentence = ctx.text.replace('___PRO___', pronoun);

  return {
    category: 'futur_etre_avoir',
    type: 'context_fill',
    text: `Complète au FUTUR (verbe : ${isEtre ? 'ÊTRE' : 'AVOIR'}) :\n\n« ${sentence} »`,
    correct,
    options,
    explanation: `${isEtre ? 'ÊTRE' : 'AVOIR'} au futur avec « ${pronoun} » → ${table[pronoun].display}.\n` +
      `Phrase complète : « ${sentence.replace('___', correct)} »`,
    hint: `Le mot-temps annonce le FUTUR. ${isEtre ? 'ÊTRE commence par "ser-"' : 'AVOIR commence par "aur-"'}.`,
  };
}

// === TYPE 3: Spot the error ===
function generateFindError() {
  const isEtre = Math.random() < 0.5;
  const table = isEtre ? etre : avoir;
  const pronoun = pickPronoun();
  const correctForm = table[pronoun].form;
  // Wrong ending: take ending from a different pronoun
  const wrongEndingPron = pronouns.find(p => table[p].form !== correctForm);
  const wrongForm = table[wrongEndingPron].form;
  const wrongSentence = pronoun === 'je' && !isEtre
    ? `j'${wrongForm}`
    : `${pronoun} ${wrongForm}`;
  const correctSentence = table[pronoun].display;

  const options = shuffle([
    correctSentence,
    `${pronoun === 'je' ? 'je' : pronoun} ${isEtre ? 'être' : 'avoir'}`,  // infinitif trap
    `${pronoun === 'je' ? 'je' : pronoun} ${isEtre ? 'suis' : 'ai'}`,      // présent trap (rough)
    `${pronoun === 'je' ? 'je' : pronoun} ${pick(isEtre ? allAvoirForms : allEtreForms)}`, // wrong-verb trap
  ]);
  // Make sure correct is in
  if (!options.includes(correctSentence)) options[0] = correctSentence;

  return {
    category: 'futur_etre_avoir',
    type: 'find_error',
    text: `Cette phrase est FAUSSE : « ${wrongSentence} » (verbe ${isEtre ? 'ÊTRE' : 'AVOIR'} au futur).\nQuelle est la BONNE forme ?`,
    correct: correctSentence,
    options,
    explanation: `Avec « ${pronoun} », ${isEtre ? 'ÊTRE' : 'AVOIR'} au futur = ${correctSentence}.\n` +
      `« ${wrongForm} » est la terminaison pour « ${wrongEndingPron} », pas pour « ${pronoun} ».`,
    hint: `Regarde le pronom. Chaque pronom a SA terminaison: -ai, -as, -a, -ons, -ez, -ont.`,
  };
}

// === TYPE 4: Identify the verb (être vs avoir) ===
function generateIdentifyVerb() {
  const isEtre = Math.random() < 0.5;
  const table = isEtre ? etre : avoir;
  const pronoun = pickPronoun();
  const form = table[pronoun].form;
  const display = table[pronoun].display;

  const options = shuffle([
    `ÊTRE — ${pronoun}`,
    `AVOIR — ${pronoun}`,
    `ÊTRE — ${pronouns.find(p => p !== pronoun)}`,
    `AVOIR — ${pronouns.find(p => p !== pronoun)}`,
  ]);
  const correct = `${isEtre ? 'ÊTRE' : 'AVOIR'} — ${pronoun}`;

  return {
    category: 'futur_etre_avoir',
    type: 'identify',
    text: `« ${display} » — Quel verbe et quel pronom?`,
    correct,
    options,
    explanation: `${display} = ${isEtre ? 'ÊTRE' : 'AVOIR'} au futur avec « ${pronoun} ».\n` +
      `Astuce : ÊTRE commence par "ser-", AVOIR commence par "aur-".`,
    hint: 'Si ça commence par "ser-" c\'est ÊTRE. Si ça commence par "aur-" c\'est AVOIR.',
  };
}

function buildOne() {
  const r = Math.random();
  // Distribution heavy on conjugation drill (this IS the memorization test)
  if (r < 0.50) return generateConjugate();      // 50% — pure conjugation
  if (r < 0.75) return generateContextFill();    // 25% — sentence context
  if (r < 0.90) return generateFindError();      // 15% — error correction
  return generateIdentifyVerb();                  // 10% — identify the form
}

export function generateFuturEtreAvoir() {
  return withFresh('futur_etre_avoir', buildOne, 80, 20, (q) => `${q.type}|${q.text}`);
}
