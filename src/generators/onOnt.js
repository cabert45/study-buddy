// ON vs ONT generator
// Ryan scored 7/14 — confuses "on" (pronoun = il/elle) with "ont" (avoir, 3rd person plural)
// Rule: "on" can be replaced by "il" or "elle". "ont" can be replaced by "avaient"

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const sentences = [
  // ON (pronom — can replace with "il/elle")
  { sentence: '___ mange des pommes.', correct: 'On', hint: 'Remplace par "il": Il mange des pommes. → On' },
  { sentence: '___ joue dehors après l\'école.', correct: 'On', hint: 'Remplace par "il": Il joue dehors. → On' },
  { sentence: '___ va au parc cet après-midi.', correct: 'On', hint: 'Remplace par "elle": Elle va au parc. → On' },
  { sentence: '___ peut voir les étoiles ce soir.', correct: 'On', hint: 'Remplace par "il": Il peut voir les étoiles. → On' },
  { sentence: '___ entend les oiseaux chanter.', correct: 'On', hint: 'Remplace par "il": Il entend les oiseaux. → On' },
  { sentence: '___ doit se coucher tôt.', correct: 'On', hint: 'Remplace par "il": Il doit se coucher tôt. → On' },
  { sentence: '___ fait du ski en hiver.', correct: 'On', hint: 'Remplace par "elle": Elle fait du ski. → On' },
  { sentence: '___ construit un fort de neige.', correct: 'On', hint: 'Remplace par "il": Il construit un fort. → On' },
  { sentence: '___ adore le chocolat chaud.', correct: 'On', hint: 'Remplace par "il": Il adore le chocolat. → On' },
  { sentence: '___ prépare le souper ensemble.', correct: 'On', hint: 'Remplace par "elle": Elle prépare le souper. → On' },

  // ONT (verbe avoir, 3e personne pluriel — can replace with "avaient")
  { sentence: 'Les enfants ___ faim.', correct: 'ont', hint: 'Remplace par "avaient": Les enfants avaient faim. → ont' },
  { sentence: 'Ils ___ beaucoup de jouets.', correct: 'ont', hint: 'Remplace par "avaient": Ils avaient beaucoup de jouets. → ont' },
  { sentence: 'Les élèves ___ fini leurs devoirs.', correct: 'ont', hint: 'Remplace par "avaient": Les élèves avaient fini. → ont' },
  { sentence: 'Mes amis ___ un nouveau jeu.', correct: 'ont', hint: 'Remplace par "avaient": Mes amis avaient un nouveau jeu. → ont' },
  { sentence: 'Les menuisiers ___ raboté les planches.', correct: 'ont', hint: 'Remplace par "avaient": Les menuisiers avaient raboté. → ont' },
  { sentence: 'Les passants ___ entendu hurler les loups.', correct: 'ont', hint: 'Remplace par "avaient": Les passants avaient entendu. → ont' },
  { sentence: 'Les joueurs ___ eu du mal à obtenir la victoire.', correct: 'ont', hint: 'Remplace par "avaient": Les joueurs avaient eu du mal. → ont' },
  { sentence: 'Les sondes ___ parcouru un long chemin.', correct: 'ont', hint: 'Remplace par "avaient": Les sondes avaient parcouru. → ont' },
  { sentence: 'Les crocodiles ___ la peau très dure.', correct: 'ont', hint: 'Remplace par "avaient": Les crocodiles avaient la peau dure. → ont' },
  { sentence: 'Elles ___ une belle maison.', correct: 'ont', hint: 'Remplace par "avaient": Elles avaient une belle maison. → ont' },

  // Tricky ones — from exam patterns
  { sentence: 'Ce soir, ___ va tous au cinéma.', correct: 'on', hint: 'Remplace par "il": Il va au cinéma. → on' },
  { sentence: 'Les alpinistes ___ rassemblé leur matériel.', correct: 'ont', hint: 'Remplace par "avaient": Les alpinistes avaient rassemblé. → ont' },
  { sentence: '___ devrait aller au restaurant.', correct: 'On', hint: 'Remplace par "il": Il devrait aller au restaurant. → On' },
  { sentence: 'Les histoires des frères Grimm ___ toujours du succès.', correct: 'ont', hint: 'Remplace par "avaient": avaient toujours du succès. → ont' },
  { sentence: '___ a vu beaucoup d\'oiseaux migrateurs.', correct: 'On', hint: 'Remplace par "il": Il a vu beaucoup d\'oiseaux. → On' },
  { sentence: 'Notre voisin ___ un beau jardin.', correct: 'a', hint: 'Attention! C\'est "a" (il/elle a), pas "on" ni "ont"' },
];

// Filter out the trick "a" question sometimes
const onOntOnly = sentences.filter(s => s.correct === 'On' || s.correct === 'on' || s.correct === 'ont');

export function generateOnOnt() {
  const q = onOntOnly[Math.floor(Math.random() * onOntOnly.length)];
  const correct = q.correct.toLowerCase() === 'on' ? 'on' : 'ont';

  return {
    category: 'on_ont',
    type: 'on_ont',
    text: q.sentence.replace('___', '______'),
    correct,
    options: shuffle(['on', 'ont']),
    explanation: q.hint,
    hint: 'Truc: remplace par "avaient". Si ça marche → ONT. Sinon → ON.',
  };
}
