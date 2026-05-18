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

// 3-digit addition WITHOUT exchange (Cahier B p.35 / AM-27)
function generate3DigitNoExchange() {
  // Pick units, tens, hundreds for both numbers such that no column exceeds 9
  let a, b;
  do {
    const u1 = rand(0, 4), u2 = rand(0, 4);
    const t1 = rand(0, 4), t2 = rand(0, 4);
    const h1 = rand(1, 4), h2 = rand(1, 4);
    a = h1 * 100 + t1 * 10 + u1;
    b = h2 * 100 + t2 * 10 + u2;
  } while (a + b > 999);
  const correct = a + b;

  const options = new Set([correct]);
  options.add(correct - 100);
  options.add(correct + 10);
  options.add(correct - 10);
  while (options.size < 4) {
    const fake = correct + rand(-9, 9);
    if (fake !== correct && fake > 0) options.add(fake);
  }

  return {
    category: 'calcul',
    type: 'addition_3digit',
    text: `${a} + ${b} = ?`,
    a,
    b,
    correct,
    options: shuffle([...options].slice(0, 4)),
  };
}

// 3-digit addition WITH exchange (Cahier B p.37 / AM-28 — Méthode Nougat)
// Mardi 19 mai test — Ryan's historical #1 weakness (1/8 on carrying)
function generate3DigitWithExchange() {
  let u1, u2, t1, t2, h1, h2, a, b, unitsCarry, tensCarry;
  let attempts = 0;
  do {
    u1 = rand(0, 9);
    u2 = rand(0, 9);
    t1 = rand(0, 9);
    t2 = rand(0, 9);
    h1 = rand(1, 4);
    h2 = rand(1, 4);
    a = h1 * 100 + t1 * 10 + u1;
    b = h2 * 100 + t2 * 10 + u2;
    unitsCarry = u1 + u2 >= 10 ? 1 : 0;
    tensCarry = t1 + t2 + unitsCarry >= 10 ? 1 : 0;
    attempts++;
  } while (
    attempts < 100 &&
    ((unitsCarry === 0 && tensCarry === 0) || a + b > 999) // must have at least one exchange, ≤ 999
  );

  const correct = a + b;

  // Real Ryan errors: "forgot to carry the 1" → result short by 10 or 100
  const forgotUnitsCarry = unitsCarry ? correct - 10 : null;
  const forgotTensCarry = tensCarry ? correct - 100 : null;
  const forgotBoth = unitsCarry && tensCarry ? correct - 110 : null;

  const options = new Set([correct]);
  if (forgotUnitsCarry && forgotUnitsCarry > 0) options.add(forgotUnitsCarry);
  if (forgotTensCarry && forgotTensCarry > 0) options.add(forgotTensCarry);
  if (forgotBoth && forgotBoth > 0 && options.size < 4) options.add(forgotBoth);
  while (options.size < 4) {
    const fake = correct + rand(-9, 9);
    if (fake !== correct && fake > 0 && fake <= 999) options.add(fake);
  }

  // Nougat step-by-step explanation
  const uSum = u1 + u2;
  const tSum = t1 + t2 + unitsCarry;
  const hSum = h1 + h2 + tensCarry;
  let steps = `Méthode Nougat — étape par étape :\n\n`;
  steps += `1️⃣ UNITÉS : ${u1} + ${u2} = ${uSum}`;
  if (unitsCarry) steps += `\n   → ${uSum} c'est trop! On échange 10 unités contre 1 dizaine.\n   → On écrit ${uSum % 10} en unités, on retient 1 dizaine.\n\n`;
  else steps += ` → on écrit ${uSum} en unités.\n\n`;

  steps += `2️⃣ DIZAINES : ${t1} + ${t2}${unitsCarry ? ' + 1 (la retenue)' : ''} = ${tSum}`;
  if (tensCarry) steps += `\n   → ${tSum} c'est trop! On échange 10 dizaines contre 1 centaine.\n   → On écrit ${tSum % 10} en dizaines, on retient 1 centaine.\n\n`;
  else steps += ` → on écrit ${tSum} en dizaines.\n\n`;

  steps += `3️⃣ CENTAINES : ${h1} + ${h2}${tensCarry ? ' + 1 (la retenue)' : ''} = ${hSum} centaines.\n\n`;
  steps += `✅ Total : ${correct}`;

  const hint = unitsCarry
    ? `Commence par les unités. ${u1} + ${u2} = ${uSum} → c'est plus que 9, donc tu dois ÉCHANGER!`
    : `Pas d'échange aux unités, mais ${t1} + ${t2} = ${t1 + t2} aux dizaines... attention!`;

  return {
    category: 'calcul',
    type: 'addition_3digit_exchange',
    text: `${a} + ${b} = ?`,
    a,
    b,
    correct,
    options: shuffle([...options].slice(0, 4)),
    explanation: steps,
    hint,
  };
}

export function generateCalcul() {
  const r = Math.random();
  // Distribution rebalanced for Mardi 19 mai tests:
  // 40% 3-digit WITH exchange (Cahier B p.37 — top priority, biggest weakness)
  // 20% 3-digit sans exchange (Cahier B p.35 — also on test)
  // 30% 2-digit forced carry/borrow (long-standing weakness, keep drilling)
  // 10% 2-digit mixed (variety)
  if (r < 0.40) return generate3DigitWithExchange();
  if (r < 0.60) return generate3DigitNoExchange();
  const forceHard = r < 0.90;
  if (Math.random() < 0.5) {
    return generateAddition(forceHard);
  } else {
    return generateSubtraction(forceHard);
  }
}
