// Conjugaison complète de AVOIR et ÊTRE — Cayla, secondaire 1 (depuis sept. 2026)
//
// Tous les modes et temps du Bescherelle. Les niveaux suivent la Progression
// des apprentissages (français, 1er cycle du secondaire, Québec):
//   1 = temps simples à maîtriser
//   2 = temps composés à maîtriser (auxiliaire + participe passé)
//   3 = à reconnaître (passé antérieur, subjonctif imparfait / plus-que-parfait)
//
// Les formes sont stockées SANS pronom. `display()` ajoute « je / j' / que / qu' »
// selon la personne pour l'affichage; la pratique accepte la forme avec ou sans pronom.

export const PRONOUNS = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];
export const IMPERATIF_PERSONS = ['tu', 'nous', 'vous'];

export const TENSES = [
  // ---- Indicatif ----
  { id: 'ind_present', mode: 'Indicatif', label: 'Présent', level: 1,
    tip: 'Ce qui se passe maintenant. Les 2 verbes les plus irréguliers: apprends-les par cœur.' },
  { id: 'ind_imparfait', mode: 'Indicatif', label: 'Imparfait', level: 1,
    tip: 'Terminaisons toujours pareilles: -ais, -ais, -ait, -ions, -iez, -aient.' },
  { id: 'ind_futur_simple', mode: 'Indicatif', label: 'Futur simple', level: 1,
    tip: 'Radical aur- / ser- + -ai, -as, -a, -ons, -ez, -ont.' },
  { id: 'ind_passe_simple', mode: 'Indicatif', label: 'Passé simple', level: 1,
    tip: "Temps des récits écrits. Accent circonflexe à nous / vous: eûmes, fûtes." },
  { id: 'ind_passe_compose', mode: 'Indicatif', label: 'Passé composé', level: 2,
    tip: "Auxiliaire AVOIR au présent + participe passé (eu / été). « été » ne s'accorde jamais." },
  { id: 'ind_plus_que_parfait', mode: 'Indicatif', label: 'Plus-que-parfait', level: 2,
    tip: "Auxiliaire à l'imparfait + participe passé: j'avais eu, j'avais été." },
  { id: 'ind_futur_anterieur', mode: 'Indicatif', label: 'Futur antérieur', level: 2,
    tip: 'Auxiliaire au futur simple + participe passé: j\'aurai eu, j\'aurai été.' },
  { id: 'ind_passe_anterieur', mode: 'Indicatif', label: 'Passé antérieur', level: 3,
    tip: 'Auxiliaire au passé simple + participe passé: j\'eus eu, j\'eus été. Rare — à reconnaître.' },
  // ---- Conditionnel ----
  { id: 'cond_present', mode: 'Conditionnel', label: 'Présent', level: 1,
    tip: 'Radical du futur (aur- / ser-) + terminaisons de l\'imparfait (-ais, -ait, -ions...).' },
  { id: 'cond_passe', mode: 'Conditionnel', label: 'Passé', level: 2,
    tip: 'Auxiliaire au conditionnel présent + participe passé: j\'aurais eu, j\'aurais été.' },
  // ---- Subjonctif ----
  { id: 'subj_present', mode: 'Subjonctif', label: 'Présent', level: 1,
    tip: 'Toujours après « que ». Il faut que j\'aie / que je sois. Attention: ait (avoir) ≠ est (être).' },
  { id: 'subj_passe', mode: 'Subjonctif', label: 'Passé', level: 2,
    tip: 'Auxiliaire au subjonctif présent + participe passé: que j\'aie eu, que j\'aie été.' },
  { id: 'subj_imparfait', mode: 'Subjonctif', label: 'Imparfait', level: 3,
    tip: 'Radical du passé simple: que j\'eusse, que je fusse. Accent circonflexe à la 3e pers.: qu\'il eût, qu\'il fût.' },
  { id: 'subj_plus_que_parfait', mode: 'Subjonctif', label: 'Plus-que-parfait', level: 3,
    tip: 'Auxiliaire au subjonctif imparfait + participe passé: que j\'eusse eu, que j\'eusse été.' },
  // ---- Impératif (3 personnes seulement) ----
  { id: 'imp_present', mode: 'Impératif', label: 'Présent', level: 1, imperatif: true,
    tip: 'Un ordre, sans pronom. Aie / ayons / ayez · sois / soyons / soyez.' },
  { id: 'imp_passe', mode: 'Impératif', label: 'Passé', level: 2, imperatif: true,
    tip: 'Auxiliaire à l\'impératif présent + participe passé: aie eu, ayons été.' },
];

export const VERBES = {
  avoir: {
    label: 'avoir',
    ind_present: ['ai', 'as', 'a', 'avons', 'avez', 'ont'],
    ind_imparfait: ['avais', 'avais', 'avait', 'avions', 'aviez', 'avaient'],
    ind_futur_simple: ['aurai', 'auras', 'aura', 'aurons', 'aurez', 'auront'],
    ind_passe_simple: ['eus', 'eus', 'eut', 'eûmes', 'eûtes', 'eurent'],
    ind_passe_compose: ['ai eu', 'as eu', 'a eu', 'avons eu', 'avez eu', 'ont eu'],
    ind_plus_que_parfait: ['avais eu', 'avais eu', 'avait eu', 'avions eu', 'aviez eu', 'avaient eu'],
    ind_futur_anterieur: ['aurai eu', 'auras eu', 'aura eu', 'aurons eu', 'aurez eu', 'auront eu'],
    ind_passe_anterieur: ['eus eu', 'eus eu', 'eut eu', 'eûmes eu', 'eûtes eu', 'eurent eu'],
    cond_present: ['aurais', 'aurais', 'aurait', 'aurions', 'auriez', 'auraient'],
    cond_passe: ['aurais eu', 'aurais eu', 'aurait eu', 'aurions eu', 'auriez eu', 'auraient eu'],
    subj_present: ['aie', 'aies', 'ait', 'ayons', 'ayez', 'aient'],
    subj_passe: ['aie eu', 'aies eu', 'ait eu', 'ayons eu', 'ayez eu', 'aient eu'],
    subj_imparfait: ['eusse', 'eusses', 'eût', 'eussions', 'eussiez', 'eussent'],
    subj_plus_que_parfait: ['eusse eu', 'eusses eu', 'eût eu', 'eussions eu', 'eussiez eu', 'eussent eu'],
    imp_present: ['aie', 'ayons', 'ayez'],
    imp_passe: ['aie eu', 'ayons eu', 'ayez eu'],
    // Formes non personnelles (tableau seulement)
    infinitif: { present: 'avoir', passe: 'avoir eu' },
    participe: { present: 'ayant', passe: 'eu (eue, eus, eues)', passeCompose: 'ayant eu' },
  },
  être: {
    label: 'être',
    ind_present: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'],
    ind_imparfait: ['étais', 'étais', 'était', 'étions', 'étiez', 'étaient'],
    ind_futur_simple: ['serai', 'seras', 'sera', 'serons', 'serez', 'seront'],
    ind_passe_simple: ['fus', 'fus', 'fut', 'fûmes', 'fûtes', 'furent'],
    ind_passe_compose: ['ai été', 'as été', 'a été', 'avons été', 'avez été', 'ont été'],
    ind_plus_que_parfait: ['avais été', 'avais été', 'avait été', 'avions été', 'aviez été', 'avaient été'],
    ind_futur_anterieur: ['aurai été', 'auras été', 'aura été', 'aurons été', 'aurez été', 'auront été'],
    ind_passe_anterieur: ['eus été', 'eus été', 'eut été', 'eûmes été', 'eûtes été', 'eurent été'],
    cond_present: ['serais', 'serais', 'serait', 'serions', 'seriez', 'seraient'],
    cond_passe: ['aurais été', 'aurais été', 'aurait été', 'aurions été', 'auriez été', 'auraient été'],
    subj_present: ['sois', 'sois', 'soit', 'soyons', 'soyez', 'soient'],
    subj_passe: ['aie été', 'aies été', 'ait été', 'ayons été', 'ayez été', 'aient été'],
    subj_imparfait: ['fusse', 'fusses', 'fût', 'fussions', 'fussiez', 'fussent'],
    subj_plus_que_parfait: ['eusse été', 'eusses été', 'eût été', 'eussions été', 'eussiez été', 'eussent été'],
    imp_present: ['sois', 'soyons', 'soyez'],
    imp_passe: ['aie été', 'ayons été', 'ayez été'],
    infinitif: { present: 'être', passe: 'avoir été' },
    participe: { present: 'étant', passe: 'été (invariable)', passeCompose: 'ayant été' },
  },
};

export const VERB_IDS = Object.keys(VERBES);
export const tenseById = Object.fromEntries(TENSES.map((t) => [t.id, t]));

const VOWEL_START = /^[aeiouyâàéèêëîïôûùü]/i;

// Personnes affichées pour un temps donné
export function personsFor(tenseId) {
  return tenseById[tenseId]?.imperatif ? IMPERATIF_PERSONS : PRONOUNS;
}

// « je » → « j' » devant une voyelle; le subjonctif prend « que / qu' »
export function pronounPrefix(pronoun, form, tenseId) {
  const subj = tenseId.startsWith('subj_');
  if (tenseById[tenseId]?.imperatif) return '';
  let p;
  if (pronoun === 'je') p = VOWEL_START.test(form) ? "j'" : 'je ';
  else p = pronoun + ' ';
  if (!subj) return p;
  if (pronoun === 'il/elle' || pronoun === 'ils/elles') return "qu'" + p;
  return 'que ' + p;
}

// Préfixe d'une QUESTION (on ne sait pas encore si la forme commence par une voyelle):
// « je / j' », « que je / j' », « qu'il/elle », « (tu) » à l'impératif
export function promptPrefix(pronoun, tenseId) {
  if (tenseById[tenseId]?.imperatif) return `(${pronoun})`;
  const subj = tenseId.startsWith('subj_');
  const base = pronoun === 'je' ? "je / j'" : pronoun;
  if (!subj) return base;
  if (pronoun === 'il/elle' || pronoun === 'ils/elles') return "qu'" + base;
  return 'que ' + base;
}

// Forme complète telle qu'on la lit dans un tableau: « que j'aie eu », « sois », « nous sommes »
export function display(verbId, tenseId, pronoun) {
  const form = formOf(verbId, tenseId, pronoun);
  return pronounPrefix(pronoun, form, tenseId) + form;
}

export function formOf(verbId, tenseId, pronoun) {
  const idx = personsFor(tenseId).indexOf(pronoun);
  return VERBES[verbId][tenseId][idx];
}

// Étiquette lisible d'un temps: « Indicatif — Passé composé »
export function tenseLabel(tenseId) {
  const t = tenseById[tenseId];
  return t ? `${t.mode} — ${t.label}` : tenseId;
}

// Normalisation pour comparer une réponse tapée à la forme attendue.
// On garde les accents (eut ≠ eût!) mais on tolère le pronom, « que », les
// apostrophes typographiques et les espaces en trop.
export function normalizeAnswer(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(que |qu')/, '')
    .replace(/^(je |j'|tu |il\/elle |ils\/elles |il |elle |ils |elles |on |nous |vous )/, '')
    .trim();
}

export function isCorrectAnswer(typed, verbId, tenseId, pronoun) {
  return normalizeAnswer(typed) === normalizeAnswer(formOf(verbId, tenseId, pronoun));
}

// Tous les items (verbe × temps × personne) pour une sélection de temps
export function buildItems(verbIds, tenseIds) {
  const items = [];
  for (const v of verbIds) {
    for (const t of tenseIds) {
      for (const p of personsFor(t)) {
        items.push({
          key: `${v}|${t}|${p}`,
          verb: v,
          tense: t,
          pronoun: p,
          form: formOf(v, t, p),
          correct: display(v, t, p), // clé de maîtrise + affichage
        });
      }
    }
  }
  return items;
}

// Sélection persistée (partagée entre le tableau, la pratique et le choix multiple)
const SELECTION_KEY = 'sb_verbes_ae_selection';
export const DEFAULT_SELECTION = {
  verbs: ['avoir', 'être'],
  tenses: TENSES.filter((t) => t.level === 1).map((t) => t.id),
};

export function loadSelection() {
  try {
    const s = JSON.parse(localStorage.getItem(SELECTION_KEY) || 'null');
    if (s && Array.isArray(s.verbs) && Array.isArray(s.tenses) && s.verbs.length && s.tenses.length) {
      return {
        verbs: s.verbs.filter((v) => VERBES[v]),
        tenses: s.tenses.filter((t) => tenseById[t]),
      };
    }
  } catch {}
  return { ...DEFAULT_SELECTION };
}

export function saveSelection(sel) {
  try { localStorage.setItem(SELECTION_KEY, JSON.stringify(sel)); } catch {}
}
