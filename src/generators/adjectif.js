// Adjectif generator — Theme 5, Mini leçons 16-17
// Identify adjectives, accord (gender/number agreement), lettres muettes

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Adjective agreement data: masculin singulier → all forms
const adjectives = [
  { ms: 'petit', fs: 'petite', mp: 'petits', fp: 'petites' },
  { ms: 'grand', fs: 'grande', mp: 'grands', fp: 'grandes' },
  { ms: 'fort', fs: 'forte', mp: 'forts', fp: 'fortes' },
  { ms: 'long', fs: 'longue', mp: 'longs', fp: 'longues' },
  { ms: 'rond', fs: 'ronde', mp: 'ronds', fp: 'rondes' },
  { ms: 'lent', fs: 'lente', mp: 'lents', fp: 'lentes' },
  { ms: 'chaud', fs: 'chaude', mp: 'chauds', fp: 'chaudes' },
  { ms: 'froid', fs: 'froide', mp: 'froids', fp: 'froides' },
  { ms: 'laid', fs: 'laide', mp: 'laids', fp: 'laides' },
  { ms: 'gentil', fs: 'gentille', mp: 'gentils', fp: 'gentilles' },
  { ms: 'gris', fs: 'grise', mp: 'gris', fp: 'grises' },
  { ms: 'vivant', fs: 'vivante', mp: 'vivants', fp: 'vivantes' },
  { ms: 'géant', fs: 'géante', mp: 'géants', fp: 'géantes' },
  { ms: 'brillant', fs: 'brillante', mp: 'brillants', fp: 'brillantes' },
  { ms: 'plaisant', fs: 'plaisante', mp: 'plaisants', fp: 'plaisantes' },
  { ms: 'souriant', fs: 'souriante', mp: 'souriants', fp: 'souriantes' },
  { ms: 'bon', fs: 'bonne', mp: 'bons', fp: 'bonnes' },
  { ms: 'gros', fs: 'grosse', mp: 'gros', fp: 'grosses' },
  { ms: 'blanc', fs: 'blanche', mp: 'blancs', fp: 'blanches' },
  { ms: 'noir', fs: 'noire', mp: 'noirs', fp: 'noires' },
  { ms: 'joli', fs: 'jolie', mp: 'jolis', fp: 'jolies' },
  { ms: 'pointu', fs: 'pointue', mp: 'pointus', fp: 'pointues' },
  { ms: 'tranchant', fs: 'tranchante', mp: 'tranchants', fp: 'tranchantes' },
  { ms: 'méchant', fs: 'méchante', mp: 'méchants', fp: 'méchantes' },
  { ms: 'compétent', fs: 'compétente', mp: 'compétents', fp: 'compétentes' },
];

// Nouns with gender/number for accord exercises
const nounContexts = [
  { det: 'des', noun: 'dents', gender: 'f', number: 'p' },
  { det: 'une', noun: 'bactérie', gender: 'f', number: 's' },
  { det: 'des', noun: 'dentistes', gender: 'm', number: 'p' },
  { det: 'un', noun: 'couloir', gender: 'm', number: 's' },
  { det: 'une', noun: 'table', gender: 'f', number: 's' },
  { det: 'des', noun: 'invités', gender: 'm', number: 'p' },
  { det: 'une', noun: 'dame', gender: 'f', number: 's' },
  { det: 'un', noun: 'nez', gender: 'm', number: 's' },
  { det: 'des', noun: 'yeux', gender: 'm', number: 'p' },
  { det: 'une', noun: 'bouche', gender: 'f', number: 's' },
  { det: 'des', noun: 'oreilles', gender: 'f', number: 'p' },
  { det: 'un', noun: 'château', gender: 'm', number: 's' },
  { det: 'une', noun: 'fleur', gender: 'f', number: 's' },
  { det: 'des', noun: 'corridors', gender: 'm', number: 'p' },
  { det: 'des', noun: 'chaises', gender: 'f', number: 'p' },
  { det: 'un', noun: 'sandwich', gender: 'm', number: 's' },
  { det: 'une', noun: 'défense', gender: 'f', number: 's' },
  { det: 'des', noun: 'photos', gender: 'f', number: 'p' },
];

// Is the bolded word an adjective? (Vrai/Faux)
const vraisFaux = [
  { sentence: 'une solution géniale', bold: 'géniale', isAdj: true },
  { sentence: 'une baguette magique', bold: 'baguette', isAdj: false },
  { sentence: 'un employé fidèle', bold: 'un', isAdj: false },
  { sentence: 'des petits cornichons', bold: 'petits', isAdj: true },
  { sentence: 'un grand port', bold: 'grand', isAdj: true },
  { sentence: 'un habit noir', bold: 'noir', isAdj: true },
  { sentence: 'un employé créatif', bold: 'créatif', isAdj: true },
  { sentence: 'un jeu amusant', bold: 'amusant', isAdj: true },
  { sentence: 'un gentil cuisinier', bold: 'cuisinier', isAdj: false },
  { sentence: 'un excellent repas', bold: 'repas', isAdj: false },
];

// Lettre muette: feminine → masculine
const lettresMuettes = [
  { fem: 'petite', masc: 'petit', silent: 't' },
  { fem: 'chaude', masc: 'chaud', silent: 'd' },
  { fem: 'longue', masc: 'long', silent: 'g' },
  { fem: 'géante', masc: 'géant', silent: 't' },
  { fem: 'vivante', masc: 'vivant', silent: 't' },
  { fem: 'ronde', masc: 'rond', silent: 'd' },
  { fem: 'lente', masc: 'lent', silent: 't' },
  { fem: 'grosse', masc: 'gros', silent: 's' },
  { fem: 'grise', masc: 'gris', silent: 's' },
  { fem: 'froide', masc: 'froid', silent: 'd' },
  { fem: 'laide', masc: 'laid', silent: 'd' },
  { fem: 'forte', masc: 'fort', silent: 't' },
];

function getForm(adj, gender, number) {
  if (gender === 'm' && number === 's') return adj.ms;
  if (gender === 'f' && number === 's') return adj.fs;
  if (gender === 'm' && number === 'p') return adj.mp;
  return adj.fp;
}

export function generateAdjectif() {
  const r = Math.random();

  if (r < 0.30) {
    // Accord: pick the correct form for a noun
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const ctx = nounContexts[Math.floor(Math.random() * nounContexts.length)];
    const correct = getForm(adj, ctx.gender, ctx.number);
    const options = new Set([correct, adj.ms, adj.fs, adj.mp, adj.fp]);

    const gLabel = ctx.gender === 'f' ? 'féminin' : 'masculin';
    const nLabel = ctx.number === 'p' ? 'pluriel' : 'singulier';

    return {
      category: 'adjectif',
      type: 'accord',
      text: `${ctx.det} ___ ${ctx.noun} (${adj.ms})`,
      correct,
      options: shuffle([...options].slice(0, 4)),
      explanation: `${ctx.noun} est ${gLabel} ${nLabel} → ${correct}`,
    };
  }

  if (r < 0.50) {
    // Transform: given (adjective, target gender/number), write the form
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const targets = [
      { label: 'f. s.', g: 'f', n: 's' },
      { label: 'm. pl.', g: 'm', n: 'p' },
      { label: 'f. pl.', g: 'f', n: 'p' },
    ];
    const target = targets[Math.floor(Math.random() * targets.length)];
    const correct = getForm(adj, target.g, target.n);
    const options = new Set([correct, adj.ms, adj.fs, adj.mp, adj.fp]);

    return {
      category: 'adjectif',
      type: 'transform',
      text: `${adj.ms} → (${target.label})`,
      correct,
      options: shuffle([...options].slice(0, 4)),
      explanation: `${adj.ms} au ${target.label} = ${correct}`,
    };
  }

  if (r < 0.70) {
    // Vrai ou Faux: is the bolded word an adjective?
    const q = vraisFaux[Math.floor(Math.random() * vraisFaux.length)];
    const correct = q.isAdj ? 'Vrai' : 'Faux';

    return {
      category: 'adjectif',
      type: 'vrai_faux',
      text: `"${q.sentence}" — Le mot "${q.bold}" est un adjectif?`,
      correct,
      options: ['Vrai', 'Faux'],
      explanation: q.isAdj
        ? `Oui! "${q.bold}" décrit le nom. C'est un adjectif.`
        : `Non! "${q.bold}" n'est pas un adjectif.`,
    };
  }

  if (r < 0.85) {
    // Lettre muette: feminine → masculine
    const q = lettresMuettes[Math.floor(Math.random() * lettresMuettes.length)];
    const options = new Set([q.masc]);
    // Generate plausible wrong answers
    const word = q.fem;
    options.add(word.slice(0, -1)); // remove last letter
    options.add(word.slice(0, -2)); // remove last 2 letters
    options.add(word); // the feminine itself
    while (options.size < 4) {
      options.add(q.masc + 'e');
    }

    return {
      category: 'adjectif',
      type: 'lettre_muette',
      text: `Écris au masculin: "${q.fem}" → ?`,
      correct: q.masc,
      options: shuffle([...options].slice(0, 4)),
      explanation: `${q.fem} → ${q.masc} (la lettre muette est "${q.silent}")`,
    };
  }

  // Familles de mots: find the intruder
  const families = [
    { words: ['ronfle', 'ronflement', 'ronfler'], intruder: 'rond', base: 'ronfl-' },
    { words: ['glisser', 'glissement', 'glisse'], intruder: 'réglisse', base: 'gliss-' },
    { words: ['matinal', 'matinée', 'matin'], intruder: 'maringouin', base: 'matin-' },
    { words: ['sauter', 'sautiller', 'sursauter'], intruder: 'sauce', base: 'saut-' },
    { words: ['hiver', 'hivernal', 'hiverner'], intruder: 'livre', base: 'hiver-' },
    { words: ['jour', 'journée', 'journal'], intruder: 'jouer', base: 'jour-' },
    { words: ['dent', 'dentiste', 'dentaire'], intruder: 'dans', base: 'dent-' },
    { words: ['vol', 'voler', 'envol'], intruder: 'vélo', base: 'vol-' },
    { words: ['ski', 'skieur', 'skier'], intruder: 'soleil', base: 'ski-' },
  ];
  const fam = families[Math.floor(Math.random() * families.length)];
  const allWords = shuffle([...fam.words, fam.intruder]);

  return {
    category: 'adjectif',
    type: 'famille_mots',
    text: `Trouve l'intrus dans la famille de mots:`,
    correct: fam.intruder,
    options: allWords,
    explanation: `"${fam.intruder}" n'est pas de la famille "${fam.base}". Les autres viennent du même mot de base.`,
  };
}
