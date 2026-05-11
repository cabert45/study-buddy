// Futur simple — verbes 1er groupe (-ER) — NIVEAU AVANCÉ
// Ryan a maîtrisé les bases (15/15). On enlève la règle persistante et on ajoute:
// - phrases contextuelles à compléter (Demain, je ___ au parc.)
// - repérer l'erreur dans une mauvaise conjugaison
// - transformer présent → futur
// - distinguer futur vs présent vs passé composé vs infinitif
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

const erVerbs = [
  'chanter', 'manger', 'parler', 'danser', 'jouer', 'aimer',
  'travailler', 'arriver', 'rester', 'tomber', 'écouter',
  'regarder', 'trouver', 'donner', 'porter', 'amuser',
  'passer', 'penser', 'gagner', 'sauter', 'marcher',
  'demander', 'préparer', 'voyager', 'visiter', 'inviter',
];

const endings = {
  je: 'ai', tu: 'as', il: 'a', elle: 'a',
  nous: 'ons', vous: 'ez', ils: 'ont', elles: 'ont',
};
const pronouns = ['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles'];

function conjugate(verb, pronoun) { return verb + endings[pronoun]; }

function present(verb, pronoun) {
  const r = verb.slice(0, -2);
  const pres = { je: 'e', tu: 'es', il: 'e', elle: 'e', nous: 'ons', vous: 'ez', ils: 'ent', elles: 'ent' };
  return r + pres[pronoun];
}

function passeCompose(verb, pronoun) {
  const pp = verb.slice(0, -2) + 'é';
  const aux = { je: "j'ai", tu: 'tu as', il: 'il a', elle: 'elle a', nous: 'nous avons', vous: 'vous avez', ils: 'ils ont', elles: 'elles ont' };
  return `${aux[pronoun]} ${pp}`;
}

function withPronoun(verb, pronoun, tense = 'futur') {
  const conj = tense === 'futur' ? conjugate(verb, pronoun) : present(verb, pronoun);
  // For futur, even "je" stays as "je" (verb starts with consonant after radical e.g. chanter→chanterai). Safe.
  return pronoun === 'je' ? `je ${conj}` : `${pronoun} ${conj}`;
}

// === HARD TYPE 1: Fill in a context sentence ===
// "Demain, nous _____ au parc." (jouer) → "jouerons"
const futureContexts = [
  { template: 'Demain, ___PRO___ ___V___ au parc.', verbs: ['jouer', 'aller'].filter((v) => erVerbs.includes(v)) },
  { template: "L'an prochain, ___PRO___ ___V___ en France.", verbs: ['voyager', 'aller'] },
  { template: 'Plus tard, ___PRO___ ___V___ très fort.', verbs: ['travailler', 'chanter'] },
  { template: "La semaine prochaine, ___PRO___ ___V___ ses cousins.", verbs: ['visiter', 'inviter'] },
  { template: 'Dans une heure, ___PRO___ ___V___ le souper.', verbs: ['préparer', 'manger'] },
  { template: 'Quand papa rentrera, ___PRO___ ___V___ avec lui.', verbs: ['parler', 'jouer'] },
  { template: "Bientôt, ___PRO___ ___V___ à l'école.", verbs: ['arriver', 'marcher'] },
  { template: 'À Noël, ___PRO___ ___V___ des cadeaux.', verbs: ['donner', 'préparer'] },
];

function generateContextFill() {
  const ctx = pick(futureContexts);
  const verb = pick(ctx.verbs.filter((v) => erVerbs.includes(v)));
  const pronoun = pick(pronouns);
  const correctForm = conjugate(verb, pronoun);
  const sentence = ctx.template.replace('___PRO___', pronoun).replace('___V___', '___');
  // Distractors using same verb but wrong form
  const wrongPron = pronouns.find((p) => p !== pronoun && endings[p] !== endings[pronoun]);
  const distractors = [
    present(verb, pronoun),          // présent (Demain, je joue → wrong tense)
    verb,                             // infinitif (Demain, je jouer → wrong)
    conjugate(verb, wrongPron),       // wrong ending
  ];
  const options = shuffle([correctForm, ...distractors]);
  return {
    category: 'futur_simple',
    type: 'context_fill',
    text: `Complète la phrase au FUTUR:\n\n« ${sentence} »\n\n(verbe: ${verb})`,
    correct: correctForm,
    options,
    explanation: `${pronoun} + ${verb} au futur = ${withPronoun(verb, pronoun)}.\nLe mot-indicateur "${ctx.template.split(',')[0]}" annonce le futur.`,
    hint: 'Cherche le mot-temps (Demain, Plus tard, Bientôt...). Garde le verbe entier + termine avec ai/as/a/ons/ez/ont.',
  };
}

// === HARD TYPE 2: Find the error ===
function generateFindError() {
  const verb = pick(erVerbs);
  const pronoun = pick(pronouns);
  const correctForm = withPronoun(verb, pronoun);
  // Create a wrong version: swap ending
  const wrongPron = pronouns.find((p) => p !== pronoun && endings[p] !== endings[pronoun]);
  const wrongConj = conjugate(verb, wrongPron);
  const wrongSentence = `${pronoun === 'je' ? 'je' : pronoun} ${wrongConj}`;
  const options = shuffle([
    `Bonne réponse: ${correctForm}`,
    `Bonne réponse: ${pronoun === 'je' ? 'je' : pronoun} ${verb}`,
    `Bonne réponse: ${pronoun === 'je' ? "j'ai" : pronoun + ' a'} ${verb.slice(0, -2)}é`,
    'La phrase est correcte',
  ]);
  return {
    category: 'futur_simple',
    type: 'find_error',
    text: `Cette phrase au futur est FAUSSE: « ${wrongSentence} ».\nQuelle est la bonne réponse?`,
    correct: `Bonne réponse: ${correctForm}`,
    options,
    explanation: `${pronoun} prend la terminaison "${endings[pronoun]}", pas "${endings[wrongPron]}". La bonne phrase: ${correctForm}.`,
    hint: 'Regarde le pronom et trouve sa bonne terminaison.',
  };
}

// === HARD TYPE 3: Present → Future transformation ===
function generateTransform() {
  const verb = pick(erVerbs);
  const pronoun = pick(pronouns);
  const presentSentence = withPronoun(verb, pronoun, 'present');
  const correct = withPronoun(verb, pronoun, 'futur');
  // Distractors
  const wrongPron = pronouns.find((p) => p !== pronoun && endings[p] !== endings[pronoun]);
  const distractors = [
    `${pronoun === 'je' ? 'je' : pronoun} ${verb}`,                    // infinitif
    `${pronoun === 'je' ? 'je' : pronoun} ${conjugate(verb, wrongPron)}`, // wrong ending
    passeCompose(verb, pronoun),                                        // passé composé
  ];
  const options = shuffle([correct, ...distractors]);
  return {
    category: 'futur_simple',
    type: 'transform',
    text: `Transforme cette phrase au FUTUR:\n\n« ${presentSentence} » (présent) → ?`,
    correct,
    options,
    explanation: `Présent: ${presentSentence}. Futur: ${correct}.\n(Garde le verbe ENTIER + ajoute la terminaison du futur.)`,
    hint: 'Au futur, on garde le verbe COMPLET (infinitif) + une terminaison spéciale.',
  };
}

// === HARD TYPE 4: Spot the FUTUR among mixed tenses ===
function generateSpotFutur() {
  const verb = pick(erVerbs);
  const pronoun = pick(pronouns);
  const correct = withPronoun(verb, pronoun, 'futur');
  const presentForm = withPronoun(verb, pronoun, 'present');
  const passeForm = passeCompose(verb, pronoun);
  const infForm = `${pronoun === 'je' ? 'je' : pronoun} ${verb}`;
  const options = shuffle([correct, presentForm, passeForm, infForm]);
  return {
    category: 'futur_simple',
    type: 'spot_futur',
    text: `Quelle phrase est au FUTUR? (verbe: ${verb}, pronom: ${pronoun})`,
    correct,
    options,
    explanation: `${correct} = futur (verbe entier + terminaison ai/as/a/ons/ez/ont).\nLes autres: ${presentForm} = présent · ${infForm} = infinitif · ${passeForm} = passé composé.`,
    hint: 'Le futur garde le verbe ENTIER. Le présent enlève -er. L\'infinitif n\'a pas de terminaison.',
  };
}

// === Easy fallback (still useful, but rare) ===
function generateBasicConjugate() {
  const verb = pick(erVerbs);
  const pronoun = pick(pronouns);
  const correct = withPronoun(verb, pronoun);
  const wrongPron = pronouns.find((p) => p !== pronoun && endings[p] !== endings[pronoun]);
  const options = shuffle([
    correct,
    `${pronoun === 'je' ? 'je' : pronoun} ${verb}`,                    // infinitif
    `${pronoun === 'je' ? 'je' : pronoun} ${conjugate(verb, wrongPron)}`, // wrong ending
    `${pronoun === 'je' ? 'je' : pronoun} ${verb.slice(0, -2) + 'e'}`,  // présent
  ]);
  return {
    category: 'futur_simple',
    type: 'conjugate',
    text: `Conjugue "${verb}" au FUTUR avec "${pronoun}":`,
    correct,
    options,
    explanation: `${verb} + ${endings[pronoun]} → ${correct}.`,
    hint: `Verbe entier + terminaison.`,
  };
}

function buildOne() {
  const r = Math.random();
  // Distribution shifted to HARDER types now that Ryan masters the basics
  if (r < 0.30) return generateContextFill();     // 30% — context sentences (hardest)
  if (r < 0.55) return generateTransform();        // 25% — present → futur
  if (r < 0.75) return generateSpotFutur();        // 20% — mixed-tense identification
  if (r < 0.90) return generateFindError();        // 15% — error correction
  return generateBasicConjugate();                 // 10% — fallback easy
}

export function generateFuturSimple() {
  return withFresh('futur_simple', buildOne, 100, 25, (q) => `${q.type}|${q.text}`);
}
