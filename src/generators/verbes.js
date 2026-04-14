// Verbes utiles generator — Theme 4
// 6 key verbs: aimer, aller, avoir, dire, être, faire
// Conjugation matching, pronoun-verb agreement

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const conjugations = {
  être: { je: 'suis', tu: 'es', il: 'est', nous: 'sommes', vous: 'êtes', ils: 'sont' },
  avoir: { je: 'ai', tu: 'as', il: 'a', nous: 'avons', vous: 'avez', ils: 'ont' },
  aimer: { je: 'aime', tu: 'aimes', il: 'aime', nous: 'aimons', vous: 'aimez', ils: 'aiment' },
  aller: { je: 'vais', tu: 'vas', il: 'va', nous: 'allons', vous: 'allez', ils: 'vont' },
  dire: { je: 'dis', tu: 'dis', il: 'dit', nous: 'disons', vous: 'dites', ils: 'disent' },
  faire: { je: 'fais', tu: 'fais', il: 'fait', nous: 'faisons', vous: 'faites', ils: 'font' },
};

const pronounLabels = {
  je: 'Je', tu: 'Tu', il: 'Il/Elle', nous: 'Nous', vous: 'Vous', ils: 'Ils/Elles',
};

// Sentences where you identify which verb is used
const identifySentences = [
  { sentence: 'Nous disons merci à notre entraîneur.', verb: 'dire', bold: 'disons' },
  { sentence: 'Il est le meilleur joueur de l\'équipe.', verb: 'être', bold: 'est' },
  { sentence: 'Ce soir, nous allons nous entraîner.', verb: 'aller', bold: 'allons' },
  { sentence: 'Ils ont hâte de jouer au hockey.', verb: 'avoir', bold: 'ont' },
  { sentence: 'Je fais du ski chaque hiver.', verb: 'faire', bold: 'fais' },
  { sentence: 'Tu aimes le chocolat chaud.', verb: 'aimer', bold: 'aimes' },
  { sentence: 'Vous dites toujours la vérité.', verb: 'dire', bold: 'dites' },
  { sentence: 'Elle va à l\'école.', verb: 'aller', bold: 'va' },
  { sentence: 'Nous avons un beau château.', verb: 'avoir', bold: 'avons' },
  { sentence: 'Ils font des biscuits.', verb: 'faire', bold: 'font' },
];

// Pronoun matching sentences
const pronounSentences = [
  { sentence: '___ aime manger beaucoup.', correct: 'Il', options: ['Il', 'Nous'] },
  { sentence: '___ va pondre un oeuf.', correct: 'Elle', options: ['Vous', 'Elle'] },
  { sentence: '___ sommes souvent dans l\'eau.', correct: 'Nous', options: ['Je', 'Nous'] },
  { sentence: '___ font des crottes roses.', correct: 'Ils', options: ['Ils', 'Tu'] },
  { sentence: '___ sont près de la mer.', correct: 'Elles', options: ['Je', 'Elles'] },
  { sentence: '___ avons très froid l\'hiver.', correct: 'Nous', options: ['Nous', 'Tu'] },
  { sentence: '___ faites un cri différent.', correct: 'Vous', options: ['Vous', 'Il'] },
  { sentence: '___ vas sur la banquise.', correct: 'Tu', options: ['Tu', 'Nous'] },
  { sentence: '___ suis pris dans la glace.', correct: 'Je', options: ['Je', 'Ils'] },
];

export function generateVerbes() {
  const r = Math.random();
  const verbs = Object.keys(conjugations);

  if (r < 0.35) {
    // Pick the right conjugation for a pronoun
    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    const pronouns = Object.keys(conjugations[verb]);
    const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
    const correct = conjugations[verb][pronoun];

    // Get wrong options from same verb (different pronouns) or different verbs
    const options = new Set([correct]);
    // Add from same verb
    for (const p of pronouns) {
      if (options.size < 4) options.add(conjugations[verb][p]);
    }
    // Add from other verbs if needed
    while (options.size < 4) {
      const otherVerb = verbs[Math.floor(Math.random() * verbs.length)];
      options.add(conjugations[otherVerb][pronoun]);
    }

    return {
      category: 'verbes',
      type: 'conjugation',
      text: `${pronounLabels[pronoun]} ___ (${verb})`,
      correct,
      options: shuffle([...options].slice(0, 4)),
      explanation: `${pronounLabels[pronoun]} ${correct} (verbe ${verb})`,
    };
  }

  if (r < 0.65) {
    // Choose the correct conjugated form
    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    const pronouns = Object.keys(conjugations[verb]);
    const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
    const correct = `${pronounLabels[pronoun]} ${conjugations[verb][pronoun]}`;
    const correctForm = conjugations[verb][pronoun];

    // Options: different forms of same verb
    const forms = Object.entries(conjugations[verb]);
    const options = [correctForm];
    for (const [, form] of shuffle(forms)) {
      if (options.length < 3 && !options.includes(form)) options.push(form);
    }
    // Pad with form from another verb
    while (options.length < 3) {
      const otherVerb = verbs[Math.floor(Math.random() * verbs.length)];
      options.push(conjugations[otherVerb][pronoun]);
    }

    return {
      category: 'verbes',
      type: 'choose_form',
      text: `${pronounLabels[pronoun]} ___ le hockey. (${verb})`,
      correct: correctForm,
      options: shuffle([...new Set(options)].slice(0, 3)),
      explanation: `${pronounLabels[pronoun]} ${correctForm} (verbe ${verb})`,
    };
  }

  if (r < 0.82) {
    // Identify which verb is used in a sentence
    const q = identifySentences[Math.floor(Math.random() * identifySentences.length)];
    const options = new Set([q.verb]);
    while (options.size < 4) {
      options.add(verbs[Math.floor(Math.random() * verbs.length)]);
    }

    return {
      category: 'verbes',
      type: 'identify_verb',
      text: `Quel verbe? "${q.sentence}" (mot en gras: ${q.bold})`,
      correct: q.verb,
      options: shuffle([...options]),
      explanation: `"${q.bold}" vient du verbe ${q.verb}`,
    };
  }

  // Match pronoun to sentence
  const q = pronounSentences[Math.floor(Math.random() * pronounSentences.length)];
  const allPronouns = ['Je', 'Tu', 'Il', 'Elle', 'Nous', 'Vous', 'Ils', 'Elles'];
  const options = new Set([q.correct, ...q.options]);
  while (options.size < 4) {
    options.add(allPronouns[Math.floor(Math.random() * allPronouns.length)]);
  }

  return {
    category: 'verbes',
    type: 'pronom',
    text: q.sentence.replace('___', '?'),
    correct: q.correct,
    options: shuffle([...options].slice(0, 4)),
    explanation: `${q.correct} ${q.sentence.replace('___ ', '')}`,
  };
}
