// Relational generator — "de plus que" / "de moins que" problems
// Ryan's #4 weakness — includes chain relationships from exam
// Exam example: "Sofia a 5 animaux. Éloé en a 2 de plus que Sofia.
//                Enzo en a 2 de plus qu'Arielle. Rose en a 1 de plus que Josée."

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

const names = ['Noa', 'Léo', 'Ryan', 'Sofia', 'Justin', 'Rémi', 'Olivia', 'Mathieu', 'Éloé', 'Enzo', 'Rose', 'Arielle', 'Josée', 'Anthony'];
const itemsList = ['animaux en peluche', 'autocollants', 'billes', 'bonbons', 'livres', 'cartes'];

function pick(arr, exclude = []) {
  const available = arr.filter((n) => !exclude.includes(n));
  return available[Math.floor(Math.random() * available.length)];
}

const templates = [
  // Simple: direct comparison
  () => {
    const n1 = pick(names);
    const n2 = pick(names, [n1]);
    const item = pick(itemsList);
    const base = rand(15, 60);
    const diff = rand(2, 12);
    const isPlus = Math.random() < 0.5;

    let text, correct, trap;
    if (isPlus) {
      correct = base + diff;
      trap = base - diff;
      text = `${n1} a ${base} ${item}. ${n2} en a ${diff} de plus que ${n1}. Combien ${n2} a-t-il de ${item}?`;
    } else {
      correct = base - diff;
      trap = base + diff;
      text = `${n1} a ${base} ${item}. ${n2} en a ${diff} de moins que ${n1}. Combien ${n2} a-t-il de ${item}?`;
    }
    if (correct < 1 || correct > 99) return null;

    return {
      text,
      correct,
      trap,
      base,
      relation: isPlus ? 'de plus' : 'de moins',
      explanation: isPlus
        ? `${diff} de plus que ${base} → ${base} + ${diff} = ${correct}`
        : `${diff} de moins que ${base} → ${base} − ${diff} = ${correct}`,
    };
  },
  // Chain: A has X, B has Y de plus que A, how many does B have?
  // Then: how many total?
  () => {
    const n1 = pick(names);
    const n2 = pick(names, [n1]);
    const item = pick(itemsList);
    const base = rand(10, 30);
    const diff = rand(2, 5);
    const isPlus = Math.random() < 0.5;

    let n2Amount, text, correct, trap;
    if (isPlus) {
      n2Amount = base + diff;
      correct = base + n2Amount;
      trap = base + diff; // just the second person's amount
      text = `${n1} a ${base} ${item}. ${n2} en a ${diff} de plus que ${n1}. Combien ont-ils en tout?`;
    } else {
      n2Amount = base - diff;
      if (n2Amount < 1) return null;
      correct = base + n2Amount;
      trap = base - diff;
      text = `${n1} a ${base} ${item}. ${n2} en a ${diff} de moins que ${n1}. Combien ont-ils en tout?`;
    }
    if (correct > 99 || correct < 1) return null;

    return {
      text,
      correct,
      trap,
      base,
      relation: isPlus ? 'de plus' : 'de moins',
      explanation: isPlus
        ? `${n2}: ${base} + ${diff} = ${n2Amount}. Total: ${base} + ${n2Amount} = ${correct}`
        : `${n2}: ${base} − ${diff} = ${n2Amount}. Total: ${base} + ${n2Amount} = ${correct}`,
    };
  },
  // Stuffed animals pattern (from exam: each child has X de plus/moins)
  () => {
    const n1 = pick(names);
    const n2 = pick(names, [n1]);
    const n3 = pick(names, [n1, n2]);
    const item = pick(itemsList);
    const base = rand(5, 15);
    const diff1 = rand(1, 3);
    const n2Amount = base + diff1;
    const diff2 = rand(1, 3);
    const n3Amount = n2Amount + diff2;
    if (n3Amount > 50) return null;

    const correct = n3Amount;
    const trap = base + diff2; // common error: applying diff2 to base instead of n2Amount

    return {
      text: `${n1} a ${base} ${item}. ${n2} en a ${diff1} de plus que ${n1}. ${n3} en a ${diff2} de plus que ${n2}. Combien ${n3} a-t-il de ${item}?`,
      correct,
      trap,
      base,
      relation: 'de plus (chaîne)',
      explanation: `${n2}: ${base} + ${diff1} = ${n2Amount}. ${n3}: ${n2Amount} + ${diff2} = ${n3Amount}`,
    };
  },
];

export function generateRelational() {
  let question = null;
  let attempts = 0;
  while (!question && attempts < 30) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    question = template();
    attempts++;
  }
  if (!question) {
    // Fallback
    question = {
      text: 'Léo a 20 billes. Sofia en a 5 de plus que Léo. Combien Sofia a-t-elle de billes?',
      correct: 25,
      trap: 15,
      base: 20,
      relation: 'de plus',
      explanation: '5 de plus que 20 → 20 + 5 = 25',
    };
  }

  const { correct, trap, base } = question;
  const options = new Set([correct]);
  if (trap > 0 && trap <= 99) options.add(trap);
  if (base > 0 && base <= 99 && base !== correct) options.add(base);
  while (options.size < 4) {
    const fake = correct + rand(-5, 5);
    if (fake !== correct && fake > 0 && fake <= 99) options.add(fake);
  }

  return {
    category: 'relational',
    type: 'relational',
    text: question.text,
    correct,
    options: shuffle([...options].slice(0, 4)),
    relation: question.relation,
    explanation: question.explanation,
  };
}
