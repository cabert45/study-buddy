// Passé composé generator — Friday test prep
// Test on: verbes en -er (1er groupe) + verbes finir
// Critical: Ryan must distinguish infinitif -ER from passé composé -É

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Verbes en -ER (1er groupe) — past participle ends in -É
const erVerbs = [
  'manger', 'parler', 'danser', 'jouer', 'chanter', 'aimer',
  'travailler', 'arriver', 'rester', 'tomber', 'monter', 'écouter',
  'regarder', 'trouver', 'donner', 'gagner', 'porter', 'commencer',
  'amuser', 'passer', 'pincer', 'réviser', 'penser', 'appeler',
];

// Forms of avoir (auxiliary)
const avoir = {
  'j\'': 'ai',
  'tu': 'as',
  'il': 'a',
  'elle': 'a',
  'nous': 'avons',
  'vous': 'avez',
  'ils': 'ont',
  'elles': 'ont',
};

// Forms of être (auxiliary for some verbs like aller, arriver, tomber, monter, rester)
const etre = {
  'je': 'suis',
  'tu': 'es',
  'il': 'est',
  'elle': 'est',
  'nous': 'sommes',
  'vous': 'êtes',
  'ils': 'sont',
  'elles': 'sont',
};

// Verbs that use être in passé composé (need agreement with subject)
const etreVerbs = ['aller', 'arriver', 'rester', 'tomber', 'monter', 'partir', 'venir'];

// FINIR conjugation in passé composé
const finirConjugation = {
  "j'": "j'ai fini",
  'tu': 'tu as fini',
  'il': 'il a fini',
  'elle': 'elle a fini',
  'nous': 'nous avons fini',
  'vous': 'vous avez fini',
  'ils': 'ils ont fini',
  'elles': 'elles ont fini',
};

function getPastParticiple(verb) {
  // -er → -é
  if (verb.endsWith('er')) return verb.slice(0, -2) + 'é';
  if (verb === 'finir') return 'fini';
  return verb;
}

function buildPasseCompose(verb, pronoun) {
  const pp = getPastParticiple(verb);
  const useEtre = etreVerbs.includes(verb);
  const aux = useEtre ? etre[pronoun] : avoir[pronoun.endsWith("'") ? pronoun : pronoun];

  // For "je" with avoir → "j'ai"
  let pronounDisplay = pronoun;
  let auxForm;
  if (useEtre) {
    auxForm = etre[pronoun] || etre['il'];
    return `${pronoun} ${auxForm} ${pp}`;
  } else {
    if (pronoun === 'je') {
      pronounDisplay = "j'";
      auxForm = "ai";
    } else {
      auxForm = avoir[pronoun] || avoir['il'];
    }
    return `${pronounDisplay}${pronounDisplay === "j'" ? '' : ' '}${auxForm} ${pp}`;
  }
}

const pronouns = ['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles'];

export function generatePasseCompose() {
  const r = Math.random();

  if (r < 0.40) {
    // Conjugate ER verb in passé composé
    const verb = erVerbs[Math.floor(Math.random() * erVerbs.length)];
    const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
    const correct = buildPasseCompose(verb, pronoun);

    // Wrong options: wrong auxiliary, wrong participle ending, infinitive instead
    const pp = getPastParticiple(verb);
    const useEtre = etreVerbs.includes(verb);
    const wrongAux = useEtre ? avoir[pronoun] || 'a' : etre[pronoun] || 'est';
    const wrongPronoun = pronoun === 'je' ? "j'" : pronoun;

    const options = new Set([correct]);
    // Wrong: infinitive instead of past participle
    if (useEtre) {
      options.add(`${pronoun} ${etre[pronoun]} ${verb}`);
    } else {
      options.add(`${wrongPronoun}${wrongPronoun === "j'" ? '' : ' '}${avoir[pronoun] || 'a'} ${verb}`);
    }
    // Wrong: wrong auxiliary
    options.add(`${wrongPronoun}${wrongPronoun === "j'" ? '' : ' '}${wrongAux} ${pp}`);
    // Wrong: missing accent
    options.add(`${wrongPronoun}${wrongPronoun === "j'" ? '' : ' '}${useEtre ? etre[pronoun] : avoir[pronoun] || 'a'} ${pp.replace('é', 'e')}`);

    return {
      category: 'passe_compose',
      type: 'conjugate_er',
      text: `Conjugue "${verb}" au passé composé avec "${pronoun}":`,
      correct,
      options: shuffle([...options].slice(0, 4)),
      explanation: `${pronoun} + ${useEtre ? 'être' : 'avoir'} + ${pp} = ${correct}`,
    };
  }

  if (r < 0.65) {
    // FINIR conjugation
    const pronouns2 = Object.keys(finirConjugation);
    const pronoun = pronouns2[Math.floor(Math.random() * pronouns2.length)];
    const correct = finirConjugation[pronoun];

    // Wrong options
    const otherPronouns = pronouns2.filter(p => p !== pronoun);
    const wrong1 = finirConjugation[otherPronouns[0]];
    const wrong2 = finirConjugation[otherPronouns[1]];
    const wrong3 = correct.replace('fini', 'finir'); // infinitive trap

    return {
      category: 'passe_compose',
      type: 'conjugate_finir',
      text: `Conjugue "finir" au passé composé avec "${pronoun.replace("'", '')}":`,
      correct,
      options: shuffle([correct, wrong1, wrong2, wrong3]),
      explanation: `Passé composé: ${correct} (avoir + fini)`,
    };
  }

  if (r < 0.85) {
    // Infinitif vs Participe passé — THE KEY TRAP
    const verb = erVerbs[Math.floor(Math.random() * erVerbs.length)];
    const pp = getPastParticiple(verb);
    const isPasseCompose = Math.random() < 0.5;

    let sentence, correct;
    if (isPasseCompose) {
      // Use the passé composé form (-é)
      const sentences = [
        `J'ai ${pp} hier.`,
        `Tu as ${pp} ce matin.`,
        `Il a ${pp} la semaine dernière.`,
        `Nous avons ${pp} hier soir.`,
      ];
      sentence = sentences[Math.floor(Math.random() * sentences.length)];
      correct = pp; // -é
    } else {
      // Use the infinitive form (-er) — usually after another verb
      const sentences = [
        `Je vais ${verb} demain.`,
        `Tu dois ${verb} maintenant.`,
        `Il aime ${verb} le soir.`,
        `Nous voulons ${verb} ensemble.`,
      ];
      sentence = sentences[Math.floor(Math.random() * sentences.length)];
      correct = verb; // -er
    }

    // Show sentence with blank, ask which form
    const blank = isPasseCompose ? '_____' : '_____';
    const sentenceWithBlank = sentence.replace(correct, blank);

    return {
      category: 'passe_compose',
      type: 'er_vs_e',
      text: `Complète: "${sentenceWithBlank}"`,
      correct,
      options: shuffle([verb, pp, verb + 's', pp + 's']),
      explanation: isPasseCompose
        ? `Passé composé (avec avoir/être) → participe passé: ${pp}. Truc: remplace par "vendu" → ça marche!`
        : `Verbe à l'infinitif (après un autre verbe) → ${verb}. Truc: remplace par "vendre" → ça marche!`,
    };
  }

  // Identify which is which — given a sentence, is it passé composé or infinitif?
  const verb = erVerbs[Math.floor(Math.random() * erVerbs.length)];
  const pp = getPastParticiple(verb);
  const isPC = Math.random() < 0.5;

  const sentence = isPC
    ? `Hier, j'ai ${pp} dans le parc.`
    : `Demain, je vais ${verb} dans le parc.`;

  return {
    category: 'passe_compose',
    type: 'identify',
    text: `"${sentence}" — Le verbe est à quel temps?`,
    correct: isPC ? 'Passé composé' : 'Infinitif',
    options: shuffle(['Passé composé', 'Infinitif', 'Présent', 'Futur']),
    explanation: isPC
      ? `Avec "ai/as/a..." + participe passé (-é) → passé composé`
      : `Après "vais/dois/aime..." → infinitif (-er)`,
  };
}
