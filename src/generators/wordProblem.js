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
  // Irrelevant information — must ignore extra data
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
      operationQuestion: 'Quelle opération faut-il faire?',
      correctOperation: 'addition',
      correct,
    };
  },
  // Multi-step subtraction — boulangère pattern
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
      operationQuestion: 'Quelle est la première opération?',
      correctOperation: 'soustraction',
      correct,
    };
  },
  // Grouping in dizaines — forgeron pattern
  () => {
    const perMonth = rand(25, 45);
    const months = 2;
    const total = perMonth * months;
    const dizaines = Math.floor(total / 10);
    return {
      text: `Le forgeron fabrique ${perMonth} épées par mois. Il vend ses épées en paquets de 10. Combien de paquets de 10 peut-il vendre après ${months} mois?`,
      steps: [
        { label: 'Étape 1', text: `${perMonth} + ${perMonth} = ${total} épées` },
        { label: 'Étape 2', text: `${total} ÷ 10 = ${dizaines} paquets (${total % 10} épées restantes)` },
      ],
      operationQuestion: 'Que faut-il calculer en premier?',
      correctOperation: 'addition',
      correct: dizaines,
    };
  },
  // === NEW TEMPLATES (May 7 2026 — teacher said Ryan failing math because of these) ===

  // Garage cars problem
  () => {
    const total = rand(40, 90);
    const sortis = rand(10, total - 10);
    const correct = total - sortis;
    return {
      text: `Il y avait ${total} voitures dans le stationnement. ${sortis} sont sorties. Combien reste-t-il de voitures?`,
      steps: [{ label: 'Étape 1', text: `${total} − ${sortis} = ${correct}` }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'soustraction',
      correct,
    };
  },
  // Bibliothèque (library) problem
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
      operationQuestion: 'Quelle est la première opération?',
      correctOperation: 'soustraction',
      correct,
    };
  },
  // Pommes (apples) collection
  () => {
    const a = rand(15, 40);
    const b = rand(15, 40);
    const total = a + b;
    if (total > 99) return null;
    return {
      text: `Maman a cueilli ${a} pommes rouges et ${b} pommes vertes. Combien de pommes a-t-elle cueilli en tout?`,
      steps: [{ label: 'Calcul', text: `${a} + ${b} = ${total}` }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'addition',
      correct: total,
    };
  },
  // Birthday cake — multi-step
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
      operationQuestion: 'Quelle opération?',
      correctOperation: 'addition',
      correct: total + 1,
    };
  },
  // Bonbons + partage (sharing)
  () => {
    const bonbons = rand(20, 60);
    const enfants = rand(2, 5);
    const each = Math.floor(bonbons / enfants);
    return {
      text: `Maman a ${bonbons} bonbons. Elle veut les partager également entre ${enfants} enfants. Combien chaque enfant reçoit-il?`,
      steps: [{ label: 'Calcul', text: `${bonbons} ÷ ${enfants} = ${each}` }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'division',
      correct: each,
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
      operationQuestion: 'Quelle opération?',
      correctOperation: 'soustraction',
      correct,
    };
  },
  // Voyage / distance
  () => {
    const km1 = rand(15, 35);
    const km2 = rand(15, 35);
    const km3 = rand(10, 30);
    const total = km1 + km2 + km3;
    if (total > 99) return null;
    return {
      text: `Papa conduit ${km1} km, puis ${km2} km, puis encore ${km3} km. Combien de kilomètres a-t-il fait en tout?`,
      steps: [{ label: 'Calcul', text: `${km1} + ${km2} + ${km3} = ${total}` }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'addition',
      correct: total,
    };
  },
  // Animaux à la ferme
  () => {
    const poules = rand(15, 30);
    const lapins = rand(10, 25);
    const vaches = rand(5, 15);
    const correct = poules + lapins + vaches;
    if (correct > 99) return null;
    return {
      text: `À la ferme, il y a ${poules} poules, ${lapins} lapins et ${vaches} vaches. Combien d'animaux y a-t-il en tout?`,
      steps: [{ label: 'Calcul', text: `${poules} + ${lapins} + ${vaches} = ${correct}` }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'addition',
      correct,
    };
  },
  // Bouteilles eau
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
      operationQuestion: 'Que faut-il faire en premier?',
      correctOperation: 'soustraction',
      correct,
    };
  },
  // Pièces de monnaie
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
      operationQuestion: 'Quelle opération en premier?',
      correctOperation: 'addition',
      correct,
    };
  },
  // Compare two people — is X right? (Zack et Quentin pattern)
  () => {
    const n1 = pickName();
    const n2 = pickName([n1]);
    const a1 = rand(3, 10);
    const a2 = rand(3, 10);
    const b1 = rand(3, 10);
    const b2 = rand(3, 10);
    const total1 = a1 + a2;
    const total2 = b1 + b2;
    if (total1 > 99 || total2 > 99 || total1 === total2) return null;
    const correct = Math.max(total1, total2);
    const winner = total1 > total2 ? n1 : n2;
    return {
      text: `${n1} trouve ${a1} cailloux le matin et ${a2} l'après-midi. ${n2} trouve ${b1} cailloux le matin et ${b2} l'après-midi. ${winner} dit qu'il a trouvé le plus. Combien a ${winner}?`,
      steps: [
        { label: n1, text: `${a1} + ${a2} = ${total1}` },
        { label: n2, text: `${b1} + ${b2} = ${total2}` },
        { label: 'Réponse', text: `${winner} a ${correct} cailloux` },
      ],
      operationQuestion: 'Que faut-il faire en premier?',
      correctOperation: 'addition',
      correct,
    };
  },
  // Chart + calculation — total hours then subtract
  () => {
    const target = 45;
    const days = [rand(5, 12), rand(5, 12), rand(2, 6), rand(5, 12), rand(5, 10)];
    const done = days.reduce((a, b) => a + b, 0);
    const remaining = target - done;
    if (remaining < 1 || remaining > 30) return null;
    return {
      text: `Le roi demande ${target} heures d'entraînement. Le chevalier a fait: lundi ${days[0]}h, mardi ${days[1]}h, mercredi ${days[2]}h, jeudi ${days[3]}h, vendredi ${days[4]}h. Combien d'heures reste-t-il?`,
      steps: [
        { label: 'Total fait', text: `${days.join(' + ')} = ${done}` },
        { label: 'Reste', text: `${target} − ${done} = ${remaining}` },
      ],
      operationQuestion: 'Que faut-il calculer en premier?',
      correctOperation: 'addition',
      correct: remaining,
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
