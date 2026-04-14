// PEMDAS generator — 6e année
// Order of operations: Parentheses, Exponents, Multiply, Divide, Add, Subtract
// Cayla's practice

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

const templates = [
  // Level 1: Addition + Multiplication (no parentheses)
  // e.g., 3 + 4 × 2 = 11 (not 14)
  () => {
    const a = rand(2, 10);
    const b = rand(2, 8);
    const c = rand(2, 5);
    const correct = a + b * c;
    const wrongLeftToRight = (a + b) * c;
    return {
      text: `${a} + ${b} × ${c}`,
      correct,
      wrong: wrongLeftToRight,
      hint: `Multiplication d'abord: ${b} × ${c} = ${b * c}, puis ${a} + ${b * c} = ${correct}`,
      level: 1,
    };
  },
  // Level 1: Subtraction + Multiplication
  () => {
    const b = rand(2, 6);
    const c = rand(2, 5);
    const a = rand(b * c + 1, b * c + 15);
    const correct = a - b * c;
    return {
      text: `${a} − ${b} × ${c}`,
      correct,
      wrong: (a - b) * c,
      hint: `Multiplication d'abord: ${b} × ${c} = ${b * c}, puis ${a} − ${b * c} = ${correct}`,
      level: 1,
    };
  },
  // Level 2: Parentheses change the order
  // e.g., (3 + 4) × 2 = 14
  () => {
    const a = rand(2, 10);
    const b = rand(2, 8);
    const c = rand(2, 5);
    const correct = (a + b) * c;
    return {
      text: `(${a} + ${b}) × ${c}`,
      correct,
      wrong: a + b * c,
      hint: `Parenthèses d'abord: (${a} + ${b}) = ${a + b}, puis ${a + b} × ${c} = ${correct}`,
      level: 2,
    };
  },
  // Level 2: Parentheses with subtraction
  () => {
    const a = rand(10, 25);
    const b = rand(2, 8);
    const c = rand(2, 5);
    const correct = (a - b) * c;
    if (correct < 0) return null;
    return {
      text: `(${a} − ${b}) × ${c}`,
      correct,
      wrong: a - b * c,
      hint: `Parenthèses d'abord: (${a} − ${b}) = ${a - b}, puis ${a - b} × ${c} = ${correct}`,
      level: 2,
    };
  },
  // Level 2: Division + Addition
  () => {
    const b = rand(2, 6);
    const c = rand(2, 10);
    const a = b * c; // make division clean
    const d = rand(2, 10);
    const correct = a / b + d;
    return {
      text: `${a} ÷ ${b} + ${d}`,
      correct,
      wrong: a / (b + d),
      hint: `Division d'abord: ${a} ÷ ${b} = ${c}, puis ${c} + ${d} = ${correct}`,
      level: 2,
    };
  },
  // Level 3: Two operations, mixed
  // e.g., 2 × 3 + 4 × 5
  () => {
    const a = rand(2, 5);
    const b = rand(2, 6);
    const c = rand(2, 5);
    const d = rand(2, 6);
    const correct = a * b + c * d;
    return {
      text: `${a} × ${b} + ${c} × ${d}`,
      correct,
      wrong: a * (b + c) * d,
      hint: `Multiplications d'abord: ${a} × ${b} = ${a * b} et ${c} × ${d} = ${c * d}, puis ${a * b} + ${c * d} = ${correct}`,
      level: 3,
    };
  },
  // Level 3: Parentheses with multiply and add
  () => {
    const a = rand(2, 6);
    const b = rand(2, 6);
    const c = rand(2, 6);
    const d = rand(1, 5);
    const correct = a * (b + c) - d;
    if (correct < 0) return null;
    return {
      text: `${a} × (${b} + ${c}) − ${d}`,
      correct,
      wrong: a * b + c - d,
      hint: `Parenthèses: (${b} + ${c}) = ${b + c}, puis ${a} × ${b + c} = ${a * (b + c)}, puis − ${d} = ${correct}`,
      level: 3,
    };
  },
  // Level 3: Division with parentheses
  () => {
    const inner = rand(2, 8);
    const b = rand(2, 5);
    const a = inner * b; // clean division
    const c = rand(2, 6);
    const d = rand(1, inner);
    const correct = a / b + c * d;
    return {
      text: `${a} ÷ ${b} + ${c} × ${d}`,
      correct,
      wrong: a / (b + c) * d,
      hint: `Division et multiplication d'abord: ${a} ÷ ${b} = ${inner} et ${c} × ${d} = ${c * d}, puis ${inner} + ${c * d} = ${correct}`,
      level: 3,
    };
  },
  // Level 4: Three operations
  () => {
    const a = rand(2, 5);
    const b = rand(2, 5);
    const c = rand(2, 10);
    const d = rand(2, 5);
    const e = rand(1, 5);
    const correct = a * b + c - d * e;
    if (correct < 0) return null;
    return {
      text: `${a} × ${b} + ${c} − ${d} × ${e}`,
      correct,
      wrong: ((a * b + c - d) * e),
      hint: `Multiplications: ${a} × ${b} = ${a * b}, ${d} × ${e} = ${d * e}. Puis ${a * b} + ${c} − ${d * e} = ${correct}`,
      level: 4,
    };
  },
  // Level 4: Nested parentheses
  () => {
    const a = rand(2, 5);
    const b = rand(2, 5);
    const c = rand(2, 5);
    const d = rand(1, 5);
    const correct = a * (b + c * d);
    return {
      text: `${a} × (${b} + ${c} × ${d})`,
      correct,
      wrong: a * (b + c) * d,
      hint: `Dans les parenthèses, × d'abord: ${c} × ${d} = ${c * d}. Puis ${b} + ${c * d} = ${b + c * d}. Puis ${a} × ${b + c * d} = ${correct}`,
      level: 4,
    };
  },
  // Level 4: Exponents (basic squares)
  () => {
    const a = rand(2, 6);
    const b = rand(1, 5);
    const correct = a * a + b;
    return {
      text: `${a}² + ${b}`,
      correct,
      wrong: (a + b) * (a + b),
      hint: `${a}² = ${a} × ${a} = ${a * a}. Puis ${a * a} + ${b} = ${correct}`,
      level: 4,
    };
  },
  // Level 4: Exponent with multiply
  () => {
    const a = rand(2, 5);
    const b = rand(2, 4);
    const correct = a * a * b;
    return {
      text: `${a}² × ${b}`,
      correct,
      wrong: (a * b) * (a * b),
      hint: `${a}² = ${a * a}. Puis ${a * a} × ${b} = ${correct}`,
      level: 4,
    };
  },
];

export function generatePemdas() {
  let question = null;
  let attempts = 0;
  while (!question && attempts < 50) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    question = template();
    if (question && (question.correct < 0 || question.correct > 999 || !Number.isInteger(question.correct))) {
      question = null;
    }
    attempts++;
  }

  if (!question) {
    question = {
      text: '3 + 4 × 2',
      correct: 11,
      wrong: 14,
      hint: 'Multiplication d\'abord: 4 × 2 = 8, puis 3 + 8 = 11',
      level: 1,
    };
  }

  const { correct, wrong } = question;
  const options = new Set([correct]);
  if (wrong !== correct && wrong > 0) options.add(wrong);
  while (options.size < 4) {
    const fake = correct + rand(-10, 10);
    if (fake !== correct && fake > 0 && fake <= 999) options.add(fake);
  }

  return {
    category: 'pemdas',
    type: 'pemdas',
    text: `${question.text} = ?`,
    correct: question.correct,
    options: shuffle([...options].slice(0, 4)),
    explanation: question.hint,
    hint: question.hint,
    level: question.level,
  };
}
