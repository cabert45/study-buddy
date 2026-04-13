// Expression comparison generator — < > =
// From Ryan's exam: compare expressions like "300 + 40 + 4 ○ 300 + 28"
// and simpler ones like "6 + 0 ○ 9 + 1"

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
  // Simple: a + b ○ c + d (small numbers, mental math strategies)
  () => {
    const a = rand(3, 15);
    const b = rand(0, 5);
    const c = rand(3, 15);
    const d = rand(0, 5);
    const left = a + b;
    const right = c + d;
    return {
      leftExpr: `${a} + ${b}`,
      rightExpr: `${c} + ${d}`,
      leftVal: left,
      rightVal: right,
    };
  },
  // Addition vs subtraction: a + b ○ c - d
  () => {
    const a = rand(5, 12);
    const b = rand(0, 3);
    const c = rand(10, 18);
    const d = rand(0, 5);
    return {
      leftExpr: `${a} + ${b}`,
      rightExpr: `${c} − ${d}`,
      leftVal: a + b,
      rightVal: c - d,
    };
  },
  // 2-digit: a + b ○ c + d
  () => {
    const a = rand(20, 60);
    const b = rand(10, 30);
    const c = rand(20, 60);
    const d = rand(10, 30);
    if (a + b > 99 || c + d > 99) return null;
    return {
      leftExpr: `${a} + ${b}`,
      rightExpr: `${c} + ${d}`,
      leftVal: a + b,
      rightVal: c + d,
    };
  },
  // 2-digit subtraction: a - b ○ c - d
  () => {
    const a = rand(40, 90);
    const b = rand(10, 30);
    const c = rand(40, 90);
    const d = rand(10, 30);
    return {
      leftExpr: `${a} − ${b}`,
      rightExpr: `${c} − ${d}`,
      leftVal: a - b,
      rightVal: c - d,
    };
  },
];

export function generateCompare() {
  let q = null;
  let attempts = 0;
  while (!q && attempts < 20) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    q = template();
    attempts++;
  }
  if (!q) {
    q = { leftExpr: '10 + 5', rightExpr: '8 + 6', leftVal: 15, rightVal: 14 };
  }

  const { leftVal, rightVal } = q;
  let correct;
  if (leftVal < rightVal) correct = '<';
  else if (leftVal > rightVal) correct = '>';
  else correct = '=';

  return {
    category: 'compare',
    type: 'compare',
    text: `${q.leftExpr}  ○  ${q.rightExpr}`,
    correct,
    options: shuffle(['<', '>', '=']),
    isCompare: true,
    explanation: `${q.leftExpr} = ${leftVal} et ${q.rightExpr} = ${rightVal}, donc ${leftVal} ${correct} ${rightVal}`,
    leftExpr: q.leftExpr,
    rightExpr: q.rightExpr,
    leftVal,
    rightVal,
  };
}
