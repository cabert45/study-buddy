import { fillOptions } from './options.js';
import {
  VERBES, TENSES, tenseById, personsFor, formOf, pronounPrefix, promptPrefix, tenseLabel, loadSelection,
} from '../data/verbesAvoirEtre.js';
// Verbes AVOIR & ÊTRE — choix multiple (Cayla, secondaire 1)
// Utilise la sélection de temps enregistrée dans l'écran « Verbes avoir & être ».

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Pièges classiques (homophones) qu'on glisse parmi les choix quand ça s'applique
const TRAPS = {
  a: ['à', 'as'], as: ['a', 'à'], ont: ['on', 'ons'], est: ['et', 'ait', 'es'], es: ['est', 'ai'],
  sont: ['son', 'sons'], ait: ['est', 'et', 'aie'], aie: ['ait', 'aies', 'ai'], ai: ['aie', 'es'],
  eut: ['eût', 'eu'], 'eût': ['eut', 'eu'], fut: ['fût'], 'fût': ['fut'], sois: ['soit', 'suis'],
  soit: ['sois', 'soient'], soient: ['soit', 'sont'], aient: ['ait', 'ont'],
  'eûmes': ['eumes', 'eûtes'], 'fûmes': ['fumes', 'fûtes'],
};

export function generateVerbesAvoirEtre() {
  const sel = loadSelection();
  const verbId = pick(sel.verbs);
  const tenseId = pick(sel.tenses);
  const persons = personsFor(tenseId);
  const pronoun = pick(persons);
  const correct = formOf(verbId, tenseId, pronoun);
  const tense = tenseById[tenseId];

  const options = new Set([correct]);

  // 1) l'autre verbe, même temps, même personne (ait / est, ont / sont...)
  const other = verbId === 'avoir' ? 'être' : 'avoir';
  if (Math.random() < 0.6) options.add(formOf(other, tenseId, pronoun));

  // 2) pièges homophones
  const traps = TRAPS[correct] || [];
  if (traps.length && Math.random() < 0.7) options.add(pick(traps));

  // 3) même verbe, même temps, autres personnes
  fillOptions(options, persons.map((p) => formOf(verbId, tenseId, p)).filter((f) => f !== correct));

  // 4) même verbe, même personne, autres temps du même mode
  const sameMode = TENSES.filter((t) => t.mode === tense.mode && t.id !== tenseId && !!t.imperatif === !!tense.imperatif);
  fillOptions(options, sameMode.map((t) => formOf(verbId, t.id, pronoun)).filter((f) => f !== correct));

  // 5) n'importe quoi d'autre du même verbe
  fillOptions(options, Object.values(VERBES[verbId]).flat().filter((f) => typeof f === 'string' && f !== correct));

  const prefix = promptPrefix(pronoun, tenseId);
  const capital = prefix.charAt(0).toUpperCase() + prefix.slice(1) + ' ';

  return {
    category: 'verbes_avoir_etre',
    type: 'conjugaison',
    text: `${capital}___  (${VERBES[verbId].label} · ${tenseLabel(tenseId)})`,
    correct,
    options: shuffle([...options].slice(0, 4)),
    explanation: `${pronounPrefix(pronoun, correct, tenseId)}${correct} — ${VERBES[verbId].label} au ${tenseLabel(tenseId).toLowerCase()}. ${tense.tip}`,
  };
}
