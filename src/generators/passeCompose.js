// Passé composé — Ryan 2e année
// Final exam: duo-tang rouge + rédaction (May 27) + compréhension (June 5)
// He's at 9/17, struggles with the concept. Add persistent rule banner + better explanations.
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

// Verbes en -ER (1er groupe) — participe passé en -É
const erVerbs = [
  'manger', 'parler', 'danser', 'jouer', 'chanter', 'aimer',
  'travailler', 'écouter', 'regarder', 'trouver', 'donner',
  'gagner', 'porter', 'commencer', 'amuser', 'passer',
  'penser', 'appeler', 'demander', 'préparer',
];

// Verbes avec ÊTRE — verbes de mouvement (small but important list)
const etreVerbs = ['aller', 'arriver', 'rester', 'tomber', 'monter', 'partir', 'venir', 'entrer', 'sortir', 'rentrer'];

const avoir = { je: 'ai', tu: 'as', il: 'a', elle: 'a', nous: 'avons', vous: 'avez', ils: 'ont', elles: 'ont' };
const etre  = { je: 'suis', tu: 'es', il: 'est', elle: 'est', nous: 'sommes', vous: 'êtes', ils: 'sont', elles: 'sont' };

const pronouns = ['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles'];

function pastParticiple(verb) {
  if (verb.endsWith('er')) return verb.slice(0, -2) + 'é';
  if (verb === 'finir') return 'fini';
  if (verb === 'partir') return 'parti';
  if (verb === 'venir') return 'venu';
  if (verb === 'sortir') return 'sorti';
  return verb;
}

function usesEtre(verb) {
  return etreVerbs.includes(verb);
}

function conjugatePC(verb, pronoun) {
  const pp = pastParticiple(verb);
  const useEtre = usesEtre(verb);
  const auxTable = useEtre ? etre : avoir;
  const aux = auxTable[pronoun];
  // élision: je + ai → j'ai
  if (pronoun === 'je' && !useEtre) return `j'ai ${pp}`;
  return `${pronoun} ${aux} ${pp}`;
}

// === Persistent rule banner — shown every question ===
const PC_RULE = `PASSÉ COMPOSÉ = AUXILIAIRE + PARTICIPE PASSÉ

Verbes en -ER → participe passé en -É
(chanter → chanté · manger → mangé · jouer → joué)

AVEC AVOIR (presque tous les verbes):
j'AI chanté · tu AS chanté · il A chanté
nous AVONS chanté · vous AVEZ chanté · ils ONT chanté

AVEC ÊTRE (verbes de mouvement: aller, arriver, rester, tomber, monter, partir, venir):
je SUIS allé · tu ES allé · il EST allé
nous SOMMES allés · vous ÊTES allés · ils SONT allés`;

// === Type 1: Conjugate -ER verb with AVOIR ===
function generateConjugateEr() {
  const verb = pick(erVerbs);
  const pronoun = pick(pronouns);
  const correct = conjugatePC(verb, pronoun);
  const pp = pastParticiple(verb);
  const auxText = pronoun === 'je' ? "j'ai" : `${pronoun} ${avoir[pronoun]}`;

  // Strong distractors
  const wrongPron = pronouns.find((p) => p !== pronoun && avoir[p] !== avoir[pronoun]);
  const distractors = [
    // Wrong auxiliary (être instead of avoir)
    pronoun === 'je' ? `je suis ${pp}` : `${pronoun} ${etre[pronoun]} ${pp}`,
    // Infinitive instead of participe
    pronoun === 'je' ? `j'ai ${verb}` : `${pronoun} ${avoir[pronoun]} ${verb}`,
    // Wrong auxiliary form (mix pronoun endings)
    pronoun === 'je' ? `je ${avoir[wrongPron]} ${pp}` : `${pronoun} ${avoir[wrongPron]} ${pp}`,
  ];
  const options = shuffle([correct, ...distractors]);

  return {
    category: 'passe_compose',
    rule: PC_RULE,
    type: 'conjugate_er',
    text: `Conjugue « ${verb} » au PASSÉ COMPOSÉ avec « ${pronoun} »:`,
    correct,
    options,
    explanation: `${pronoun} → auxiliaire AVOIR au présent (${avoir[pronoun]}) + participe passé (${pp}) = ${correct}.\nDeux mots: l'AUXILIAIRE (${auxText.split(' ').pop()}) + le PARTICIPE (${pp}).`,
    hint: '1) Choisis l\'auxiliaire AVOIR au présent (j\'ai, tu as, il a...). 2) Ajoute le verbe en -É.',
  };
}

// === Type 2: Conjugate -ER verb with ÊTRE (movement verbs) ===
function generateConjugateEtre() {
  const verb = pick(etreVerbs.filter((v) => v.endsWith('er'))); // only -er movement verbs
  const pronoun = pick(pronouns);
  const correct = conjugatePC(verb, pronoun);
  const pp = pastParticiple(verb);

  const wrongPron = pronouns.find((p) => p !== pronoun && etre[p] !== etre[pronoun]);
  const distractors = [
    // Wrong auxiliary (avoir instead of être)
    pronoun === 'je' ? `j'ai ${pp}` : `${pronoun} ${avoir[pronoun]} ${pp}`,
    // Infinitive
    `${pronoun} ${etre[pronoun]} ${verb}`,
    // Wrong être form
    `${pronoun} ${etre[wrongPron]} ${pp}`,
  ];
  const options = shuffle([correct, ...distractors]);

  return {
    category: 'passe_compose',
    rule: PC_RULE,
    type: 'conjugate_etre',
    text: `Conjugue « ${verb} » au PASSÉ COMPOSÉ avec « ${pronoun} »:`,
    correct,
    options,
    explanation: `« ${verb} » est un verbe de MOUVEMENT — il prend ÊTRE!\n${pronoun} → être au présent (${etre[pronoun]}) + ${pp} = ${correct}.`,
    hint: `« ${verb} » est un verbe de mouvement → il prend ÊTRE (pas AVOIR!).`,
  };
}

// === Type 3: Fill in a context sentence (time-marker triggers passé composé) ===
function generateContextFill() {
  const timeMarkers = [
    'Hier,',
    'La semaine dernière,',
    'Ce matin,',
    'Hier soir,',
    "L'année dernière,",
    'Avant-hier,',
  ];
  const marker = pick(timeMarkers);
  const verb = pick(erVerbs);
  const pronoun = pick(['je', 'tu', 'il', 'elle', 'nous', 'vous']);
  const correct = conjugatePC(verb, pronoun);
  const sentence = `${marker} ___ au parc.`.replace('___', correct);
  const sentenceBlank = `${marker} ___ au parc.`;

  // Distractors: same verb in WRONG tense
  const distractors = [
    pronoun === 'je' ? `je ${verb.slice(0, -2)}e` : `${pronoun} ${verb.slice(0, -2)}e`, // présent
    pronoun === 'je' ? `je ${verb}` : `${pronoun} ${verb}`,                              // infinitif
    pronoun === 'je' ? `je ${verb}ai` : `${pronoun} ${verb}ai`,                          // futur
  ];
  const options = shuffle([correct, ...distractors]);

  return {
    category: 'passe_compose',
    rule: PC_RULE,
    type: 'context_fill',
    text: `Complète au PASSÉ COMPOSÉ:\n\n« ${sentenceBlank} »\n\n(verbe: ${verb}, pronom: ${pronoun})`,
    correct,
    options,
    explanation: `« ${marker} » = c'est dans le passé → on utilise le PASSÉ COMPOSÉ.\n${pronoun} + ${avoir[pronoun]} (avoir) + ${pastParticiple(verb)} = ${correct}.`,
    hint: 'Cherche le mot-temps (Hier, La semaine dernière...). Le passé composé a 2 mots: auxiliaire + verbe en -é.',
  };
}

// === Type 4: -ER vs -É — the key trap ===
function generateErVsE() {
  const verb = pick(erVerbs);
  const pp = pastParticiple(verb);
  const useInfinitive = Math.random() < 0.5;

  let sentenceBlank, correct, why;
  if (useInfinitive) {
    // After another verb → infinitive (-er)
    const sentences = [
      `Je vais ___ demain.`,
      `Tu dois ___ maintenant.`,
      `Il aime ___ le soir.`,
      `Nous voulons ___ ensemble.`,
      `Pour bien ___, il faut s'entraîner.`,
    ];
    sentenceBlank = pick(sentences);
    correct = verb;
    why = `Après "vais/dois/aime/voulons/pour" → INFINITIF (-er). Truc: remplace par "vendre" — ça marche → -er.`;
  } else {
    // After avoir/être → past participle (-é)
    const sentences = [
      `Hier, j'ai ___ avec mes amis.`,
      `Elle a ___ ce matin.`,
      `Nous avons ___ la chanson.`,
      `Tu as ___ très fort.`,
    ];
    sentenceBlank = pick(sentences);
    correct = pp;
    why = `Après "ai/as/a/avons/avez/ont" → PARTICIPE PASSÉ (-é). Truc: remplace par "vendu" — ça marche → -é.`;
  }

  const options = shuffle([verb, pp]).concat(shuffle([verb + 's', pp + 's']));

  return {
    category: 'passe_compose',
    rule: PC_RULE,
    type: 'er_vs_e',
    text: `Complète la phrase:\n\n« ${sentenceBlank} »\n\n(verbe: ${verb})`,
    correct,
    options: shuffle([verb, pp, verb + 's', pp + 's']).slice(0, 4),
    explanation: `« ${sentenceBlank.replace('___', correct)} »\n\n💡 ${why}`,
    hint: 'Truc: remplace par "vendre" (-re) OU "vendu" (-u). Si "vendre" marche → -ER. Si "vendu" marche → -É.',
  };
}

// === Type 5: Choose the right auxiliary ===
function generateAuxiliary() {
  const verb = Math.random() < 0.4 ? pick(etreVerbs.filter((v) => v.endsWith('er'))) : pick(erVerbs);
  const useEtre = usesEtre(verb);
  const correct = useEtre ? 'être (je suis, tu es, il est...)' : 'avoir (j\'ai, tu as, il a...)';
  const options = shuffle([
    'avoir (j\'ai, tu as, il a...)',
    'être (je suis, tu es, il est...)',
    'aller (je vais...)',
    'aucun auxiliaire',
  ]);

  return {
    category: 'passe_compose',
    rule: PC_RULE,
    type: 'auxiliary',
    text: `Au passé composé, quel AUXILIAIRE utilise-t-on avec le verbe « ${verb} »?`,
    correct,
    options,
    explanation: useEtre
      ? `« ${verb} » est un verbe de MOUVEMENT → il prend ÊTRE.\nExemple: ${conjugatePC(verb, 'il')}.`
      : `« ${verb} » est un verbe d'action normal → il prend AVOIR.\nExemple: ${conjugatePC(verb, 'il')}.`,
    hint: 'La PETITE liste qui prend ÊTRE: aller, arriver, rester, tomber, monter, partir, venir, entrer, sortir, rentrer. Tous les autres prennent AVOIR.',
  };
}

// === Type 6: Identify the tense ===
function generateIdentify() {
  const verb = pick(erVerbs);
  const pp = pastParticiple(verb);
  const pronoun = pick(['je', 'tu', 'il', 'elle', 'nous', 'vous']);
  const types = [
    { sentence: `Hier, ${pronoun === 'je' ? "j'ai" : `${pronoun} ${avoir[pronoun]}`} ${pp} avec mes amis.`, tense: 'Passé composé' },
    { sentence: `${pronoun === 'je' ? 'Je' : pronoun.charAt(0).toUpperCase() + pronoun.slice(1)} ${verb.slice(0, -2)}e maintenant.`, tense: 'Présent' },
    { sentence: `Demain, ${pronoun === 'je' ? 'je' : pronoun} ${verb}ai très fort.`, tense: 'Futur' },
    { sentence: `${pronoun === 'je' ? 'Je vais' : pronoun + ' va'} ${verb} bientôt.`, tense: 'Infinitif (après "aller")' },
  ];
  const item = pick(types);
  const options = shuffle(['Passé composé', 'Présent', 'Futur', 'Infinitif (après "aller")']);

  return {
    category: 'passe_compose',
    rule: PC_RULE,
    type: 'identify',
    text: `« ${item.sentence} » — Le verbe est à quel temps?`,
    correct: item.tense,
    options,
    explanation: `${item.tense}. ${item.tense === 'Passé composé' ? '(avoir/être + verbe en -é)' : item.tense === 'Présent' ? '(action en train de se passer)' : item.tense === 'Futur' ? '(verbe entier + ai/as/a/ons/ez/ont)' : '(après "aller", "vouloir", "pouvoir"...)'}`,
    hint: 'Cherche les mots-temps (Hier = passé · Maintenant = présent · Demain = futur · Après "aller" = infinitif).',
  };
}

function buildOne() {
  const r = Math.random();
  if (r < 0.25) return generateConjugateEr();
  if (r < 0.40) return generateConjugateEtre();
  if (r < 0.60) return generateContextFill();
  if (r < 0.80) return generateErVsE();
  if (r < 0.92) return generateAuxiliary();
  return generateIdentify();
}

export function generatePasseCompose() {
  return withFresh('passe_compose', buildOne, 100, 25, (q) => `${q.type}|${q.text}`);
}
