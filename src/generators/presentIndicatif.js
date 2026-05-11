// Présent de l'indicatif — verbes 1er groupe (-ER)
// Ryan 2e année — cahier bleu + final exam
// Règle: enlève -er, ajoute -e/-es/-e/-ons/-ez/-ent
// chanter → je chante, tu chantes, il/elle chante, nous chantons, vous chantez, ils/elles chantent
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
  'écouter', 'demander', 'préparer',
];

const endings = {
  'je': 'e',
  'tu': 'es',
  'il': 'e',
  'elle': 'e',
  'nous': 'ons',
  'vous': 'ez',
  'ils': 'ent',
  'elles': 'ent',
};

const pronouns = ['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles'];

function radical(verb) {
  // -er → drop -er
  return verb.slice(0, -2);
}

function conjugate(verb, pronoun) {
  return radical(verb) + endings[pronoun];
}

function buildSentence(verb, pronoun) {
  const conj = conjugate(verb, pronoun);
  // élision: je + voyelle → j'
  if (pronoun === 'je') {
    const r = radical(verb);
    if (/^[aeiouéèêâîôûh]/i.test(r)) {
      return `j'${conj}`;
    }
    return `je ${conj}`;
  }
  return `${pronoun} ${conj}`;
}

function buildOne() {
  const r = Math.random();

  // Type 1 (50%) — Conjugue le verbe au présent
  if (r < 0.5) {
    const verb = pick(erVerbs);
    const pronoun = pick(pronouns);
    const correct = buildSentence(verb, pronoun);
    const rad = radical(verb);

    // Distractors:
    // - infinitif: "je chanter"
    // - wrong ending: "je chantons" (mix pronoun)
    // - futur-style: "je chanterai"
    const wrong1 = pronoun === 'je' ? `je ${verb}` : `${pronoun} ${verb}`;
    const otherPronoun = pronouns.find((p) => p !== pronoun && endings[p] !== endings[pronoun]);
    const wrong2 = pronoun === 'je' ? `je ${rad}${endings[otherPronoun]}` : `${pronoun} ${rad}${endings[otherPronoun]}`;
    const wrong3 = pronoun === 'je' ? `je ${verb}ai` : `${pronoun} ${verb}ai`;

    const options = shuffle([correct, wrong1, wrong2, wrong3]);

    return {
      category: 'present_indicatif',
      type: 'conjugate',
      text: `Conjugue "${verb}" au PRÉSENT avec "${pronoun}":`,
      correct,
      options,
      explanation: `Présent 1er groupe = radical (${rad}) + terminaison (${endings[pronoun]}) → ${correct}.\nRappel: je=e, tu=es, il/elle=e, nous=ons, vous=ez, ils/elles=ent`,
      hint: `Enlève -er du verbe (${verb} → ${rad}), puis ajoute la bonne terminaison.`,
    };
  }

  // Type 2 (30%) — Identifie la terminaison
  if (r < 0.8) {
    const pronoun = pick(pronouns);
    const correct = endings[pronoun];
    const allEndings = [...new Set(Object.values(endings))];
    const distractors = allEndings.filter((e) => e !== correct);
    const options = shuffle([correct, ...distractors.slice(0, 3)]);

    return {
      category: 'present_indicatif',
      type: 'ending',
      text: `Au présent, quelle terminaison pour "${pronoun}"?`,
      correct,
      options,
      explanation: `${pronoun} → terminaison "${correct}"\n(je=e, tu=es, il/elle=e, nous=ons, vous=ez, ils/elles=ent)`,
      hint: 'Pense à la chanson des terminaisons.',
    };
  }

  // Type 3 (20%) — Choisis la bonne phrase au présent
  const verb = pick(erVerbs);
  const pronoun = pick(pronouns);
  const correct = buildSentence(verb, pronoun);
  const rad = radical(verb);

  // Distractors with same verb, different tense/form
  const infinitive = pronoun === 'je' ? `je ${verb}` : `${pronoun} ${verb}`;
  const futur = pronoun === 'je' ? `je ${verb}ai` : `${pronoun} ${verb}ai`;
  const passe = pronoun === 'je' ? `j'ai ${rad}é` : `${pronoun} a ${rad}é`;

  const options = shuffle([correct, infinitive, futur, passe]);

  return {
    category: 'present_indicatif',
    type: 'choose_present',
    text: `Quelle phrase est au PRÉSENT avec "${pronoun}" et "${verb}"?`,
    correct,
    options,
    explanation: `Au présent: ${correct} (radical + terminaison du présent).`,
    hint: `Le présent n'a pas "-er" complet, ni "ai" à la fin, ni "j'ai" devant.`,
  };
}

export function generatePresentIndicatif() {
  return withFresh('present_indicatif', buildOne, 100, 25);
}
