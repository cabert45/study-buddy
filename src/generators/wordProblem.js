// Word Problem generator — multi-step problems
// Ryan's #3 weakness: scored 0/11 on Section 22
// Updated with actual exam themes: zoo, château, poissons, autobus

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
  // Zoo bus problem (from actual exam: 47 élèves + 46 élèves dans les autobus)
  () => {
    const a = rand(20, 49);
    const b = rand(20, 49);
    if (a + b > 99) return null;
    const correct = a + b;
    return {
      text: `La sortie au zoo est terminée. Il y a ${a} élèves dans le 1er autobus et ${b} dans le 2e autobus. Combien d'élèves sont allés au zoo?`,
      steps: [
        { label: 'Étape 1', text: `${a} + ${b} = ${correct}`, operation: 'addition' },
      ],
      operationQuestion: 'Quelle opération faut-il faire?',
      correctOperation: 'addition',
      correct,
    };
  },
  // Château princess problem (from exam: princess gives/receives)
  () => {
    const n1 = pickName();
    const total = rand(40, 80);
    const give = rand(10, 25);
    const correct = total - give;
    if (correct < 1) return null;
    return {
      text: `La princesse ${n1} a ${total} pierres précieuses. Elle en donne ${give} au chevalier. Combien lui reste-t-il de pierres?`,
      steps: [
        { label: 'Étape 1', text: `${total} − ${give} = ${correct}`, operation: 'soustraction' },
      ],
      operationQuestion: 'Quelle opération faut-il faire?',
      correctOperation: 'soustraction',
      correct,
    };
  },
  // Fish/poisson problem (from exam: "Des poissons pour les animaux du zoo")
  () => {
    const oiseaux = rand(15, 40);
    const mammiferes = rand(15, 40);
    if (oiseaux + mammiferes > 99) return null;
    const correct = oiseaux + mammiferes;
    return {
      text: `Nougat doit donner ${oiseaux} kg de poissons aux oiseaux et ${mammiferes} kg aux mammifères. Combien de kg de poissons faut-il en tout?`,
      steps: [
        { label: 'Étape 1', text: `${oiseaux} + ${mammiferes} = ${correct}`, operation: 'addition' },
      ],
      operationQuestion: 'Quelle opération faut-il faire?',
      correctOperation: 'addition',
      correct,
    };
  },
  // Add then subtract (billes, bonbons)
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
      operationQuestion: 'Quelle est la première opération?',
      correctOperation: 'addition',
      correct,
    };
  },
  // Subtract then subtract (from exam pattern)
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
      operationQuestion: 'Quelle est la première opération?',
      correctOperation: 'soustraction',
      correct,
    };
  },
  // "Sacs de X" — bags of items (from exam: sacs de cailloux)
  () => {
    const n1 = pickName();
    const sacs = rand(2, 5);
    const perSac = rand(3, 8);
    const extra = rand(5, 20);
    const total = sacs * perSac + extra;
    if (total > 99) return null;
    return {
      text: `${n1} a ${sacs} sacs de ${perSac} cailloux et ${extra} cailloux en plus. Combien a-t-il de cailloux en tout?`,
      steps: [
        { label: 'Étape 1', text: `${sacs} × ${perSac} = ${sacs * perSac} (les sacs)`, operation: 'addition' },
        { label: 'Étape 2', text: `${sacs * perSac} + ${extra} = ${total}`, operation: 'addition' },
      ],
      operationQuestion: 'Que faut-il calculer en premier: les sacs ou les cailloux en plus?',
      correctOperation: 'addition',
      correct: total,
    };
  },
  // Château: princess plants roses (from exam: "Le jardinier plante 22 rosiers")
  () => {
    const total = rand(40, 80);
    const part = rand(20, total - 5);
    const correct = total - part;
    if (correct < 1) return null;
    return {
      text: `Le jardinier plante ${total} rosiers dans le jardin. Le jardin du château en avait déjà ${part}. Combien de rosiers y avait-il avant dans le jardin?`,
      steps: [
        { label: 'Étape 1', text: `${total} − ${part} = ${correct}`, operation: 'soustraction' },
      ],
      operationQuestion: 'Quelle opération faut-il faire?',
      correctOperation: 'soustraction',
      correct,
    };
  },
  // Train/wagon problem (from exam: "14 wagons, 10 visiteurs chaque")
  () => {
    const wagons = rand(5, 10);
    const perWagon = 10;
    const total = wagons * perWagon;
    if (total > 99) return null;
    return {
      text: `Un petit train de ${wagons} wagons fait le tour du zoo. Chaque wagon peut contenir ${perWagon} visiteurs. Combien de visiteurs le train peut-il transporter?`,
      steps: [
        { label: 'Étape 1', text: `${wagons} × ${perWagon} = ${total}`, operation: 'addition' },
      ],
      operationQuestion: 'Quelle opération faut-il faire?',
      correctOperation: 'addition',
      correct: total,
    };
  },
  // Points game (from exam: Daphnée et Chloé, jeu de poches)
  () => {
    const n1 = pickName();
    const n2 = pickName([n1]);
    const scores1 = [rand(5, 15), rand(5, 15), rand(5, 15)];
    const scores2 = [rand(5, 15), rand(5, 15), rand(5, 15)];
    const total1 = scores1.reduce((a, b) => a + b, 0);
    const total2 = scores2.reduce((a, b) => a + b, 0);
    if (total1 > 99 || total2 > 99) return null;
    const winner = total1 > total2 ? n1 : n2;
    const correct = Math.abs(total1 - total2);
    if (correct < 1) return null;
    return {
      text: `${n1} a ${scores1[0]}, ${scores1[1]} et ${scores1[2]} points. ${n2} a ${scores2[0]}, ${scores2[1]} et ${scores2[2]} points. Combien de points de plus a ${winner}?`,
      steps: [
        { label: 'Étape 1', text: `${n1}: ${scores1.join(' + ')} = ${total1}`, operation: 'addition' },
        { label: 'Étape 2', text: `${n2}: ${scores2.join(' + ')} = ${total2}`, operation: 'addition' },
        { label: 'Étape 3', text: `${Math.max(total1, total2)} − ${Math.min(total1, total2)} = ${correct}`, operation: 'soustraction' },
      ],
      operationQuestion: 'Que faut-il faire en premier?',
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
    operationQuestion: question.operationQuestion,
    correctOperation: question.correctOperation,
    options: shuffle([...options].slice(0, 4)),
  };
}
