// Futur simple — verbes 1er groupe (-ER)
// Test à venir mercredi 13 mai (DT rouge)
// Règle 2e année: infinitif + ai/as/a/ons/ez/ont
// chanter → je chanterai, tu chanteras, il/elle chantera, nous chanterons, vous chanterez, ils/elles chanteront

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const erVerbs = [
  'chanter', 'manger', 'parler', 'danser', 'jouer', 'aimer',
  'travailler', 'arriver', 'rester', 'tomber', 'écouter',
  'regarder', 'trouver', 'donner', 'porter', 'amuser',
  'passer', 'penser', 'gagner', 'sauter', 'marcher',
];

const endings = {
  'je': 'ai',
  'tu': 'as',
  'il': 'a',
  'elle': 'a',
  'nous': 'ons',
  'vous': 'ez',
  'ils': 'ont',
  'elles': 'ont',
};

const pronouns = ['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles'];

// Persistent rule banner shown on every futur_simple question
const FUTUR_RULE = `Verbe (infinitif) + AVOIR au présent → ai · as · a · ons · ez · ont

je chanterAI · tu chanterAS · il chanterA
nous chanterONS · vous chanterEZ · ils chanterONT`;

function conjugate(verb, pronoun) {
  // Futur simple 1er groupe: infinitif + ending
  return verb + endings[pronoun];
}

function buildSentence(verb, pronoun) {
  const conj = conjugate(verb, pronoun);
  if (pronoun === 'je') {
    // élision: je + voyelle reste "je" pour futur (pas d'élision sur consonne)
    // chanter → je chanterai (pas de problème, c'est toujours consonne au début du futur)
    return `je ${conj}`;
  }
  return `${pronoun} ${conj}`;
}

export function generateFuturSimple() {
  const r = Math.random();

  // Type 1 (50%) — Conjugue le verbe au futur
  if (r < 0.5) {
    const verb = erVerbs[Math.floor(Math.random() * erVerbs.length)];
    const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
    const correct = buildSentence(verb, pronoun);

    // Distractors:
    // - infinitif (no conjugation): "je chanter"
    // - wrong ending (e.g., présent): "je chante"
    // - wrong pronoun ending (mix-up): "je chanterons"
    const wrong1 = `${pronoun === 'je' ? 'je' : pronoun} ${verb}`;
    const wrong2 = `${pronoun === 'je' ? 'je' : pronoun} ${verb.slice(0, -2) + 'e'}`;
    const otherPronoun = pronouns.find((p) => p !== pronoun && endings[p] !== endings[pronoun]);
    const wrong3 = `${pronoun === 'je' ? 'je' : pronoun} ${verb + endings[otherPronoun]}`;

    const options = shuffle([correct, wrong1, wrong2, wrong3]);

    return {
      category: 'futur_simple',
      type: 'conjugate',
      rule: FUTUR_RULE,
      text: `Conjugue "${verb}" au FUTUR avec "${pronoun}":`,
      correct,
      options,
      explanation: `Futur 1er groupe = infinitif + terminaison.\n${verb} + ${endings[pronoun]} → ${correct}`,
      hint: `Astuce: garde le verbe entier (${verb}) puis ajoute la bonne terminaison.`,
    };
  }

  // Type 2 (30%) — Identifie la terminaison
  if (r < 0.8) {
    const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
    const correct = endings[pronoun];

    // All distinct endings as distractors
    const allEndings = [...new Set(Object.values(endings))];
    const distractors = allEndings.filter((e) => e !== correct);
    const options = shuffle([correct, ...distractors.slice(0, 3)]);

    return {
      category: 'futur_simple',
      type: 'ending',
      rule: FUTUR_RULE,
      text: `Au futur, quelle terminaison pour "${pronoun}"?`,
      correct,
      options,
      explanation: `${pronoun} → terminaison "${correct}"\n(je=ai, tu=as, il/elle=a, nous=ons, vous=ez, ils/elles=ont)`,
      hint: `Pense à avoir au présent: j'ai, tu as, il a...`,
    };
  }

  // Type 3 (20%) — Choisis la bonne phrase
  const verb = erVerbs[Math.floor(Math.random() * erVerbs.length)];
  const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
  const correct = buildSentence(verb, pronoun);

  // Distractors: same verb but wrong tense / wrong ending
  const present3rd = `${pronoun === 'je' ? 'je' : pronoun} ${verb.slice(0, -2) + 'e'}`;
  const infinitive = `${pronoun === 'je' ? 'je' : pronoun} ${verb}`;
  const passeCompose = `${pronoun === 'je' ? "j'ai" : pronoun + ' a'} ${verb.slice(0, -2) + 'é'}`;

  const options = shuffle([correct, present3rd, infinitive, passeCompose]);

  return {
    category: 'futur_simple',
    type: 'choose_future',
    rule: FUTUR_RULE,
    text: `Quelle phrase est au FUTUR avec "${pronoun}" et "${verb}"?`,
    correct,
    options,
    explanation: `Au futur: ${correct} (infinitif + terminaison du futur).`,
    hint: `Le futur garde le verbe ENTIER + ajoute "ai/as/a/ons/ez/ont".`,
  };
}
