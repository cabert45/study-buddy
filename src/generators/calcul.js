// Calcul generator — addition with carrying, subtraction with borrowing
// Ryan's #1 weakness

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

function generateAddition(forceCarry) {
  let a, b;
  do {
    a = rand(12, 60);
    b = rand(12, 39);
  } while (
    a + b > 99 ||
    (forceCarry && (a % 10) + (b % 10) < 10) ||
    (!forceCarry && (a % 10) + (b % 10) >= 10)
  );
  const correct = a + b;

  // Common errors: forgot to carry, wrong units
  const carryError = (Math.floor(a / 10) + Math.floor(b / 10)) * 10 + ((a % 10) + (b % 10)) % 10;
  const offByTen = correct - 10;
  const wrongOp = Math.abs(a - b);

  const options = new Set([correct]);
  if (carryError !== correct && carryError > 0 && carryError <= 99) options.add(carryError);
  if (offByTen > 0 && offByTen <= 99) options.add(offByTen);
  if (wrongOp > 0 && wrongOp <= 99) options.add(wrongOp);
  // Fill to 4 options
  while (options.size < 4) {
    const fake = correct + rand(-5, 5);
    if (fake !== correct && fake > 0 && fake <= 99) options.add(fake);
  }

  return {
    category: 'calcul',
    type: 'addition',
    text: `${a} + ${b} = ?`,
    a,
    b,
    correct,
    options: shuffle([...options].slice(0, 4)),
    visual: { a, b, op: '+' },
  };
}

function generateSubtraction(forceBorrow) {
  let a, b;
  do {
    a = rand(21, 89);
    b = rand(12, a - 1);
  } while (
    b >= a ||
    a - b < 1 ||
    (forceBorrow && (a % 10) >= (b % 10)) ||
    (!forceBorrow && (a % 10) < (b % 10))
  );
  const correct = a - b;

  // Common errors: borrowing error, off by one
  const borrowError = Math.abs((a % 10) - (b % 10)) + (Math.floor(a / 10) - Math.floor(b / 10)) * 10;
  const offByOne = correct + 1;
  const wrongOp = a + b;

  const options = new Set([correct]);
  if (borrowError !== correct && borrowError > 0 && borrowError <= 99) options.add(borrowError);
  if (offByOne <= 99) options.add(offByOne);
  if (wrongOp <= 99) options.add(wrongOp);
  while (options.size < 4) {
    const fake = correct + rand(-5, 5);
    if (fake !== correct && fake > 0 && fake <= 99) options.add(fake);
  }

  return {
    category: 'calcul',
    type: 'subtraction',
    text: `${a} − ${b} = ?`,
    a,
    b,
    correct,
    options: shuffle([...options].slice(0, 4)),
    visual: { a, b, op: '−' },
  };
}

export function generateCalcul() {
  // 60% forced carry/borrow, 40% normal
  const forceHard = Math.random() < 0.6;
  if (Math.random() < 0.5) {
    return generateAddition(forceHard);
  } else {
    return generateSubtraction(forceHard);
  }
}
