// Word Problem generator — multi-step problems
// Ryan's #3 weakness: scored 0/11 on Section 22
// Updated with actual exam themes: zoo, château, poissons, autobus
// May 8 2026: added stepCalcs to force démarche (show your work) instead of mental math

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const names = ['Noa', 'Léo', 'Ryan', 'Sofia', 'Justin', 'Rémi', 'Olivia', 'Mathieu', 'Daphnée', 'Chloé'];

function pickName(exclude = []) {
  const available = names.filter((n) => !exclude.includes(n));
  return available[Math.floor(Math.random() * available.length)];
}

const templates = [
  // Zoo bus problem
  () => {
    const a = rand(20, 49);
    const b = rand(20, 49);
    if (a + b > 99) return null;
    const correct = a + b;
    return {
      text: `La sortie au zoo est terminée. Il y a ${a} élèves dans le 1er autobus et ${b} dans le 2e autobus. Combien d'élèves sont allés au zoo?`,
      steps: [{ label: 'Étape 1', text: `${a} + ${b} = ${correct}`, operation: 'addition' }],
      stepCalcs: [{ a, b, op: '+', result: correct, label: 'Combien en tout?' }],
      operationQuestion: 'Quelle opération faut-il faire?',
      correctOperation: 'addition',
      correct,
    };
  },
  // Château princess problem
  () => {
    const n1 = pickName();
    const total = rand(40, 80);
    const give = rand(10, 25);
    const correct = total - give;
    if (correct < 1) return null;
    return {
      text: `La princesse ${n1} a ${total} pierres précieuses. Elle en donne ${give} au chevalier. Combien lui reste-t-il de pierres?`,
      steps: [{ label: 'Étape 1', text: `${total} − ${give} = ${correct}`, operation: 'soustraction' }],
      stepCalcs: [{ a: total, b: give, op: '−', result: correct, label: 'Combien reste-t-il?' }],
      operationQuestion: 'Quelle opération faut-il faire?',
      correctOperation: 'soustraction',
      correct,
    };
  },
  // Fish/poisson problem
  () => {
    const oiseaux = rand(15, 40);
    const mammiferes = rand(15, 40);
    if (oiseaux + mammiferes > 99) return null;
    const correct = oiseaux + mammiferes;
    return {
      text: `Nougat doit donner ${oiseaux} kg de poissons aux oiseaux et ${mammiferes} kg aux mammifères. Combien de kg de poissons faut-il en tout?`,
      steps: [{ label: 'Étape 1', text: `${oiseaux} + ${mammiferes} = ${correct}`, operation: 'addition' }],
      stepCalcs: [{ a: oiseaux, b: mammiferes, op: '+', result: correct, label: 'Combien en tout?' }],
      operationQuestion: 'Quelle opération faut-il faire?',
      correctOperation: 'addition',
      correct,
    };
  },
  // Add then subtract (billes)
  () => {
    const n1 = pickName();
    const a = rand(20, 50);
    const b = rand(10, 25);
    const c = rand(10, a + b - 5);
    if (a + b - c < 1 || a + b > 99) return null;
    const correct = a + b - c;
    return {
      text: `${n1} a ${a} billes. Il en reçoit ${b}, puis il en donne ${c}. Combien lui reste-t-il de billes?`,
      steps: [
        { label: 'Étape 1', text: `${a} + ${b} = ${a + b}`, operation: 'addition' },
        { label: 'Étape 2', text: `${a + b} − ${c} = ${correct}`, operation: 'soustraction' },
      ],
      stepCalcs: [
        { a, b, op: '+', result: a + b, label: 'D\'abord, combien de billes après en avoir reçu?' },
        { a: a + b, b: c, op: '−', result: correct, label: 'Ensuite, combien après en avoir donné?' },
      ],
      operationQuestion: 'Quelle est la première opération?',
      correctOperation: 'addition',
      correct,
    };
  },
  // Subtract then subtract
  () => {
    const n1 = pickName();
    const a = rand(50, 89);
    const b = rand(10, 25);
    const c = rand(10, a - b - 5);
    if (a - b - c < 1) return null;
    const correct = a - b - c;
    return {
      text: `${n1} a ${a} autocollants. Il en perd ${b}, puis il en donne ${c}. Combien lui reste-t-il?`,
      steps: [
        { label: 'Étape 1', text: `${a} − ${b} = ${a - b}`, operation: 'soustraction' },
        { label: 'Étape 2', text: `${a - b} − ${c} = ${correct}`, operation: 'soustraction' },
      ],
      stepCalcs: [
        { a, b, op: '−', result: a - b, label: 'D\'abord, combien après avoir perdu?' },
        { a: a - b, b: c, op: '−', result: correct, label: 'Ensuite, combien après avoir donné?' },
      ],
      operationQuestion: 'Quelle est la première opération?',
      correctOperation: 'soustraction',
      correct,
    };
  },
  // Sacs de cailloux (skip — uses multiplication, not 2nd grade level)
  // Jardinier rosiers
  () => {
    const total = rand(40, 80);
    const part = rand(20, total - 5);
    const correct = total - part;
    if (correct < 1) return null;
    return {
      text: `Le jardinier plante ${total} rosiers dans le jardin. Le jardin du château en avait déjà ${part}. Combien de rosiers y avait-il avant dans le jardin?`,
      steps: [{ label: 'Étape 1', text: `${total} − ${part} = ${correct}`, operation: 'soustraction' }],
      stepCalcs: [{ a: total, b: part, op: '−', result: correct, label: 'Combien y avait-il avant?' }],
      operationQuestion: 'Quelle opération faut-il faire?',
      correctOperation: 'soustraction',
      correct,
    };
  },
  // Irrelevant info — must ignore extra data
  () => {
    const n1 = pickName();
    const roses = rand(10, 30);
    const roses2 = rand(10, 30);
    const marguerites = rand(20, 40);
    if (roses + roses2 > 99) return null;
    const correct = roses + roses2;
    return {
      text: `Le jardinier coupe ${roses} roses pour la princesse Delphine, ${roses2} roses pour la princesse Carla et ${marguerites} marguerites pour la princesse Chloé. Combien de roses le jardinier a-t-il coupées?`,
      steps: [
        { label: 'Attention', text: `Les marguerites ne comptent pas! On demande les ROSES.` },
        { label: 'Calcul', text: `${roses} + ${roses2} = ${correct}` },
      ],
      stepCalcs: [{ a: roses, b: roses2, op: '+', result: correct, label: 'Combien de ROSES en tout? (ignore les marguerites!)' }],
      operationQuestion: 'Quelle opération faut-il faire?',
      correctOperation: 'addition',
      correct,
    };
  },
  // Boulangère petits pains (sub then sub)
  () => {
    const total = rand(50, 90);
    const eat1 = rand(10, 25);
    const eat2 = rand(10, total - eat1 - 5);
    if (total - eat1 - eat2 < 1) return null;
    const correct = total - eat1 - eat2;
    return {
      text: `La boulangère a préparé ${total} petits pains. Les chevaliers en mangent ${eat1} pour déjeuner. Les jardiniers en mangent ${eat2} pour dîner. Combien de petits pains reste-t-il pour le souper?`,
      steps: [
        { label: 'Étape 1', text: `${total} − ${eat1} = ${total - eat1}` },
        { label: 'Étape 2', text: `${total - eat1} − ${eat2} = ${correct}` },
      ],
      stepCalcs: [
        { a: total, b: eat1, op: '−', result: total - eat1, label: 'Après le déjeuner, combien reste?' },
        { a: total - eat1, b: eat2, op: '−', result: correct, label: 'Après le dîner, combien reste?' },
      ],
      operationQuestion: 'Quelle est la première opération?',
      correctOperation: 'soustraction',
      correct,
    };
  },
  // Garage cars
  () => {
    const total = rand(40, 90);
    const sortis = rand(10, total - 10);
    const correct = total - sortis;
    return {
      text: `Il y avait ${total} voitures dans le stationnement. ${sortis} sont sorties. Combien reste-t-il de voitures?`,
      steps: [{ label: 'Étape 1', text: `${total} − ${sortis} = ${correct}` }],
      stepCalcs: [{ a: total, b: sortis, op: '−', result: correct, label: 'Combien reste-t-il?' }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'soustraction',
      correct,
    };
  },
  // Bibliothèque (sub then add)
  () => {
    const livresOriginal = rand(30, 70);
    const empruntes = rand(10, 25);
    const rendus = rand(5, 20);
    const correct = livresOriginal - empruntes + rendus;
    if (correct < 0 || correct > 99) return null;
    return {
      text: `La bibliothèque a ${livresOriginal} livres. Les enfants empruntent ${empruntes} livres. Plus tard, ${rendus} livres sont rendus. Combien y a-t-il de livres maintenant?`,
      steps: [
        { label: 'Étape 1', text: `${livresOriginal} − ${empruntes} = ${livresOriginal - empruntes}` },
        { label: 'Étape 2', text: `${livresOriginal - empruntes} + ${rendus} = ${correct}` },
      ],
      stepCalcs: [
        { a: livresOriginal, b: empruntes, op: '−', result: livresOriginal - empruntes, label: 'Après les emprunts, combien reste?' },
        { a: livresOriginal - empruntes, b: rendus, op: '+', result: correct, label: 'Après les retours, combien?' },
      ],
      operationQuestion: 'Quelle est la première opération?',
      correctOperation: 'soustraction',
      correct,
    };
  },
  // Pommes (apples)
  () => {
    const a = rand(15, 40);
    const b = rand(15, 40);
    const total = a + b;
    if (total > 99) return null;
    return {
      text: `Maman a cueilli ${a} pommes rouges et ${b} pommes vertes. Combien de pommes a-t-elle cueilli en tout?`,
      steps: [{ label: 'Calcul', text: `${a} + ${b} = ${total}` }],
      stepCalcs: [{ a, b, op: '+', result: total, label: 'Combien de pommes en tout?' }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'addition',
      correct: total,
    };
  },
  // Birthday cake
  () => {
    const invites = rand(15, 30);
    const cousinsExtra = rand(3, 8);
    const total = invites + cousinsExtra;
    if (total > 99) return null;
    return {
      text: `Ryan invite ${invites} amis à sa fête. Il invite aussi ${cousinsExtra} cousins. Combien de personnes seront à la fête en tout (avec Ryan)?`,
      steps: [
        { label: 'Étape 1', text: `${invites} + ${cousinsExtra} = ${total} invités` },
        { label: 'Étape 2', text: `${total} + 1 (Ryan) = ${total + 1}` },
      ],
      stepCalcs: [
        { a: invites, b: cousinsExtra, op: '+', result: total, label: 'Combien d\'invités?' },
        { a: total, b: 1, op: '+', result: total + 1, label: 'Et avec Ryan?' },
      ],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'addition',
      correct: total + 1,
    };
  },
  // Argent / money
  () => {
    const argent = rand(50, 99);
    const cout = rand(15, argent - 5);
    const correct = argent - cout;
    return {
      text: `Olivia a ${argent}$ dans sa tirelire. Elle achète un jouet à ${cout}$. Combien d'argent lui reste-t-il?`,
      steps: [{ label: 'Calcul', text: `${argent} − ${cout} = ${correct}` }],
      stepCalcs: [{ a: argent, b: cout, op: '−', result: correct, label: 'Combien lui reste-t-il?' }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'soustraction',
      correct,
    };
  },
  // Voyage / distance (3-term sum split into 2 binary)
  () => {
    const km1 = rand(15, 35);
    const km2 = rand(15, 35);
    const km3 = rand(10, 30);
    const total = km1 + km2 + km3;
    if (total > 99) return null;
    return {
      text: `Papa conduit ${km1} km, puis ${km2} km, puis encore ${km3} km. Combien de kilomètres a-t-il fait en tout?`,
      steps: [{ label: 'Calcul', text: `${km1} + ${km2} + ${km3} = ${total}` }],
      stepCalcs: [
        { a: km1, b: km2, op: '+', result: km1 + km2, label: 'D\'abord les 2 premiers trajets' },
        { a: km1 + km2, b: km3, op: '+', result: total, label: 'Puis ajoute le 3e trajet' },
      ],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'addition',
      correct: total,
    };
  },
  // Animaux à la ferme (3-term sum split)
  () => {
    const poules = rand(15, 30);
    const lapins = rand(10, 25);
    const vaches = rand(5, 15);
    const correct = poules + lapins + vaches;
    if (correct > 99) return null;
    return {
      text: `À la ferme, il y a ${poules} poules, ${lapins} lapins et ${vaches} vaches. Combien d'animaux y a-t-il en tout?`,
      steps: [{ label: 'Calcul', text: `${poules} + ${lapins} + ${vaches} = ${correct}` }],
      stepCalcs: [
        { a: poules, b: lapins, op: '+', result: poules + lapins, label: 'Poules + lapins' },
        { a: poules + lapins, b: vaches, op: '+', result: correct, label: 'Ajoute les vaches' },
      ],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'addition',
      correct,
    };
  },
  // Bouteilles eau (sub then add)
  () => {
    const totalBouteilles = rand(40, 90);
    const bues = rand(10, 30);
    const enPlus = rand(5, 15);
    const correct = totalBouteilles - bues + enPlus;
    if (correct > 99) return null;
    return {
      text: `Le club de soccer a ${totalBouteilles} bouteilles d'eau. Les joueurs en boivent ${bues}. L'entraîneur en achète ${enPlus} de plus. Combien de bouteilles y a-t-il maintenant?`,
      steps: [
        { label: 'Étape 1', text: `${totalBouteilles} − ${bues} = ${totalBouteilles - bues}` },
        { label: 'Étape 2', text: `${totalBouteilles - bues} + ${enPlus} = ${correct}` },
      ],
      stepCalcs: [
        { a: totalBouteilles, b: bues, op: '−', result: totalBouteilles - bues, label: 'Après que les joueurs ont bu' },
        { a: totalBouteilles - bues, b: enPlus, op: '+', result: correct, label: 'Après l\'achat' },
      ],
      operationQuestion: 'Que faut-il faire en premier?',
      correctOperation: 'soustraction',
      correct,
    };
  },
  // Pièces de monnaie (add then sub)
  () => {
    const pieces1 = rand(10, 30);
    const pieces2 = rand(10, 30);
    const perdu = rand(3, 10);
    const correct = pieces1 + pieces2 - perdu;
    if (correct < 0 || correct > 99) return null;
    return {
      text: `Léa a ${pieces1} pièces de monnaie. Sa grand-mère lui en donne ${pieces2}. Mais elle en perd ${perdu} au parc. Combien lui reste-t-il?`,
      steps: [
        { label: 'Étape 1', text: `${pieces1} + ${pieces2} = ${pieces1 + pieces2}` },
        { label: 'Étape 2', text: `${pieces1 + pieces2} − ${perdu} = ${correct}` },
      ],
      stepCalcs: [
        { a: pieces1, b: pieces2, op: '+', result: pieces1 + pieces2, label: 'Après le cadeau de grand-mère' },
        { a: pieces1 + pieces2, b: perdu, op: '−', result: correct, label: 'Après avoir perdu au parc' },
      ],
      operationQuestion: 'Quelle opération en premier?',
      correctOperation: 'addition',
      correct,
    };
  },
];

export function generateWordProblem() {
  let question = null;
  let attempts = 0;
  while (!question && attempts < 50) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    question = template();
    attempts++;
  }
  if (!question) {
    const a = rand(20, 50);
    const b = rand(10, 25);
    question = {
      text: `Ryan a ${a} billes. Il en reçoit ${b}. Combien en a-t-il maintenant?`,
      steps: [{ label: 'Étape 1', text: `${a} + ${b} = ${a + b}` }],
      stepCalcs: [{ a, b, op: '+', result: a + b, label: 'Combien en tout?' }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'addition',
      correct: a + b,
    };
  }

  const { correct } = question;
  const options = new Set([correct]);
  while (options.size < 4) {
    const fake = correct + rand(-10, 10);
    if (fake !== correct && fake > 0 && fake <= 99) options.add(fake);
  }

  return {
    category: 'multi_step',
    type: 'word_problem',
    text: question.text,
    correct: question.correct,
    steps: question.steps,
    stepCalcs: question.stepCalcs,
    operationQuestion: question.operationQuestion,
    correctOperation: question.correctOperation,
    options: shuffle([...options].slice(0, 4)),
  };
}
