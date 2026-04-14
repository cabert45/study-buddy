// Conjugaison generator — 6e année (Cayla)
// Present, imparfait, futur simple, passé composé

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const pronouns = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];
const pronounLabels = { 'je': 'Je', 'tu': 'Tu', 'il/elle': 'Il/Elle', 'nous': 'Nous', 'vous': 'Vous', 'ils/elles': 'Ils/Elles' };

const verbs = {
  // Present
  'manger (présent)': { 'je': 'mange', 'tu': 'manges', 'il/elle': 'mange', 'nous': 'mangeons', 'vous': 'mangez', 'ils/elles': 'mangent' },
  'finir (présent)': { 'je': 'finis', 'tu': 'finis', 'il/elle': 'finit', 'nous': 'finissons', 'vous': 'finissez', 'ils/elles': 'finissent' },
  'prendre (présent)': { 'je': 'prends', 'tu': 'prends', 'il/elle': 'prend', 'nous': 'prenons', 'vous': 'prenez', 'ils/elles': 'prennent' },
  'venir (présent)': { 'je': 'viens', 'tu': 'viens', 'il/elle': 'vient', 'nous': 'venons', 'vous': 'venez', 'ils/elles': 'viennent' },
  'pouvoir (présent)': { 'je': 'peux', 'tu': 'peux', 'il/elle': 'peut', 'nous': 'pouvons', 'vous': 'pouvez', 'ils/elles': 'peuvent' },
  'vouloir (présent)': { 'je': 'veux', 'tu': 'veux', 'il/elle': 'veut', 'nous': 'voulons', 'vous': 'voulez', 'ils/elles': 'veulent' },
  'voir (présent)': { 'je': 'vois', 'tu': 'vois', 'il/elle': 'voit', 'nous': 'voyons', 'vous': 'voyez', 'ils/elles': 'voient' },
  'savoir (présent)': { 'je': 'sais', 'tu': 'sais', 'il/elle': 'sait', 'nous': 'savons', 'vous': 'savez', 'ils/elles': 'savent' },
  // Imparfait
  'manger (imparfait)': { 'je': 'mangeais', 'tu': 'mangeais', 'il/elle': 'mangeait', 'nous': 'mangions', 'vous': 'mangiez', 'ils/elles': 'mangeaient' },
  'finir (imparfait)': { 'je': 'finissais', 'tu': 'finissais', 'il/elle': 'finissait', 'nous': 'finissions', 'vous': 'finissiez', 'ils/elles': 'finissaient' },
  'être (imparfait)': { 'je': 'étais', 'tu': 'étais', 'il/elle': 'était', 'nous': 'étions', 'vous': 'étiez', 'ils/elles': 'étaient' },
  'avoir (imparfait)': { 'je': 'avais', 'tu': 'avais', 'il/elle': 'avait', 'nous': 'avions', 'vous': 'aviez', 'ils/elles': 'avaient' },
  // Futur simple
  'manger (futur)': { 'je': 'mangerai', 'tu': 'mangeras', 'il/elle': 'mangera', 'nous': 'mangerons', 'vous': 'mangerez', 'ils/elles': 'mangeront' },
  'finir (futur)': { 'je': 'finirai', 'tu': 'finiras', 'il/elle': 'finira', 'nous': 'finirons', 'vous': 'finirez', 'ils/elles': 'finiront' },
  'être (futur)': { 'je': 'serai', 'tu': 'seras', 'il/elle': 'sera', 'nous': 'serons', 'vous': 'serez', 'ils/elles': 'seront' },
  'avoir (futur)': { 'je': 'aurai', 'tu': 'auras', 'il/elle': 'aura', 'nous': 'aurons', 'vous': 'aurez', 'ils/elles': 'auront' },
  'aller (futur)': { 'je': 'irai', 'tu': 'iras', 'il/elle': 'ira', 'nous': 'irons', 'vous': 'irez', 'ils/elles': 'iront' },
  'faire (futur)': { 'je': 'ferai', 'tu': 'feras', 'il/elle': 'fera', 'nous': 'ferons', 'vous': 'ferez', 'ils/elles': 'feront' },
};

export function generateConjugaison() {
  const verbKeys = Object.keys(verbs);
  const verbKey = verbKeys[Math.floor(Math.random() * verbKeys.length)];
  const conjugation = verbs[verbKey];
  const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
  const correct = conjugation[pronoun];

  // Wrong options: same verb different pronoun + different verb same pronoun
  const options = new Set([correct]);

  // From same verb
  for (const p of pronouns) {
    if (options.size < 4 && conjugation[p] !== correct) {
      options.add(conjugation[p]);
    }
  }

  // From other verbs
  while (options.size < 4) {
    const otherKey = verbKeys[Math.floor(Math.random() * verbKeys.length)];
    const otherForm = verbs[otherKey][pronoun];
    if (otherForm !== correct) options.add(otherForm);
  }

  return {
    category: 'conjugaison',
    type: 'conjugaison',
    text: `${pronounLabels[pronoun]} ___ (${verbKey})`,
    correct,
    options: shuffle([...options].slice(0, 4)),
    explanation: `${pronounLabels[pronoun]} ${correct} (${verbKey})`,
  };
}
