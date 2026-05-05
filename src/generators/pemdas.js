// PEMDAS generator — 6e année (Cayla)
// Order of operations: Parentheses, Exponents, Multiply, Divide, Add, Subtract
// Templates are categorized so we can track which TYPES she struggles with
// and surface those more often (adaptive selection).

const MASTERY_KEY = 'sb_pemdas_mastery_cayla';

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

// ===== Templates organized by CATEGORY =====
// Each category has an id we use for adaptive tracking.

const templates = [
  // ---- Category: add_mult (Addition + Multiplication, no parentheses) ----
  { cat: 'add_mult', level: 1, gen: () => {
    const a = rand(2, 10), b = rand(2, 8), c = rand(2, 5);
    return { text: `${a} + ${b} × ${c}`, correct: a + b * c, wrong: (a + b) * c,
      hint: `× d'abord: ${b} × ${c} = ${b * c}, puis ${a} + ${b * c} = ${a + b * c}` };
  }},
  { cat: 'add_mult', level: 1, gen: () => {
    const a = rand(2, 10), b = rand(2, 8), c = rand(2, 5);
    return { text: `${a} × ${b} + ${c}`, correct: a * b + c, wrong: a * (b + c),
      hint: `× d'abord: ${a} × ${b} = ${a * b}, puis + ${c} = ${a * b + c}` };
  }},
  { cat: 'add_mult', level: 1, gen: () => {
    const a = rand(3, 10), b = rand(2, 6), c = rand(2, 8);
    return { text: `${a} + ${b} × ${c} + 1`, correct: a + b * c + 1, wrong: (a + b) * c + 1,
      hint: `${b} × ${c} = ${b * c}. Puis ${a} + ${b * c} + 1 = ${a + b * c + 1}` };
  }},

  // ---- Category: sub_mult (Subtraction + Multiplication) ----
  { cat: 'sub_mult', level: 1, gen: () => {
    const b = rand(2, 6), c = rand(2, 5), a = rand(b * c + 1, b * c + 15);
    return { text: `${a} − ${b} × ${c}`, correct: a - b * c, wrong: (a - b) * c,
      hint: `× d'abord: ${b} × ${c} = ${b * c}, puis ${a} − ${b * c} = ${a - b * c}` };
  }},
  { cat: 'sub_mult', level: 2, gen: () => {
    const b = rand(2, 6), c = rand(2, 5), a = rand(b * c + 5, b * c + 20), d = rand(1, 5);
    return { text: `${a} − ${b} × ${c} + ${d}`, correct: a - b * c + d, wrong: (a - b) * c + d,
      hint: `${b} × ${c} = ${b * c}. ${a} − ${b * c} = ${a - b * c}. + ${d} = ${a - b * c + d}` };
  }},

  // ---- Category: parens_simple (Parentheses change order) ----
  { cat: 'parens_simple', level: 2, gen: () => {
    const a = rand(2, 10), b = rand(2, 8), c = rand(2, 5);
    return { text: `(${a} + ${b}) × ${c}`, correct: (a + b) * c, wrong: a + b * c,
      hint: `Parenthèses d'abord: ${a} + ${b} = ${a + b}. Puis × ${c} = ${(a + b) * c}` };
  }},
  { cat: 'parens_simple', level: 2, gen: () => {
    const a = rand(10, 25), b = rand(2, 8), c = rand(2, 5);
    return { text: `(${a} − ${b}) × ${c}`, correct: (a - b) * c, wrong: a - b * c,
      hint: `Parenthèses: ${a} − ${b} = ${a - b}. Puis × ${c} = ${(a - b) * c}` };
  }},
  { cat: 'parens_simple', level: 2, gen: () => {
    const c = rand(2, 5), b = rand(2, 8), a = rand(2, 10);
    return { text: `${c} × (${a} + ${b})`, correct: c * (a + b), wrong: c * a + b,
      hint: `Parenthèses: ${a} + ${b} = ${a + b}. Puis ${c} × ${a + b} = ${c * (a + b)}` };
  }},
  { cat: 'parens_simple', level: 2, gen: () => {
    const a = rand(15, 40), b = rand(3, 10), c = rand(2, 6);
    return { text: `${a} − (${b} + ${c})`, correct: a - (b + c), wrong: a - b + c,
      hint: `Parenthèses: ${b} + ${c} = ${b + c}. Puis ${a} − ${b + c} = ${a - (b + c)}` };
  }},

  // ---- Category: division ----
  { cat: 'division', level: 2, gen: () => {
    const b = rand(2, 6), c = rand(2, 10), a = b * c, d = rand(2, 10);
    return { text: `${a} ÷ ${b} + ${d}`, correct: a / b + d, wrong: a / (b + d),
      hint: `÷ d'abord: ${a} ÷ ${b} = ${c}. Puis + ${d} = ${c + d}` };
  }},
  { cat: 'division', level: 2, gen: () => {
    const b = rand(2, 6), c = rand(3, 8), a = b * c, d = rand(2, 8);
    return { text: `${a} ÷ ${b} − ${d}`, correct: a / b - d, wrong: a / (b - d),
      hint: `÷ d'abord: ${a} ÷ ${b} = ${c}. Puis − ${d} = ${c - d}` };
  }},
  { cat: 'division', level: 3, gen: () => {
    const b = rand(2, 5), inner = rand(3, 8), a = b * inner, c = rand(2, 6), d = rand(1, 5);
    return { text: `${a} ÷ ${b} + ${c} × ${d}`, correct: inner + c * d, wrong: a / (b + c) * d,
      hint: `${a} ÷ ${b} = ${inner} et ${c} × ${d} = ${c * d}. Total: ${inner + c * d}` };
  }},
  { cat: 'division', level: 3, gen: () => {
    const inner = rand(2, 6), b = rand(2, 5), a = inner * b;
    return { text: `(${a} + ${b}) ÷ ${b}`, correct: (a + b) / b, wrong: a + b / b,
      hint: `Parenthèses: ${a} + ${b} = ${a + b}. Puis ÷ ${b} = ${(a + b) / b}` };
  }},

  // ---- Category: multi_op (3+ operations mixed) ----
  { cat: 'multi_op', level: 3, gen: () => {
    const a = rand(2, 5), b = rand(2, 6), c = rand(2, 5), d = rand(2, 6);
    return { text: `${a} × ${b} + ${c} × ${d}`, correct: a * b + c * d, wrong: a * (b + c) * d,
      hint: `Deux × d'abord: ${a * b} + ${c * d} = ${a * b + c * d}` };
  }},
  { cat: 'multi_op', level: 3, gen: () => {
    const a = rand(3, 8), b = rand(2, 5), c = rand(2, 5), d = rand(2, 4);
    const correct = a * b - c * d;
    if (correct < 0) return { text: '4 × 5 − 2 × 3', correct: 14, wrong: 18,
      hint: '20 − 6 = 14' };
    return { text: `${a} × ${b} − ${c} × ${d}`, correct, wrong: a * (b - c) * d,
      hint: `${a * b} − ${c * d} = ${correct}` };
  }},
  { cat: 'multi_op', level: 4, gen: () => {
    const a = rand(2, 5), b = rand(2, 5), c = rand(2, 10), d = rand(2, 5), e = rand(1, 5);
    const correct = a * b + c - d * e;
    if (correct < 0) return null;
    return { text: `${a} × ${b} + ${c} − ${d} × ${e}`, correct, wrong: ((a * b + c - d) * e),
      hint: `Multiplications: ${a * b}, ${d * e}. Puis ${a * b} + ${c} − ${d * e} = ${correct}` };
  }},

  // ---- Category: parens_mult (Parentheses with multiplication outside) ----
  { cat: 'parens_mult', level: 3, gen: () => {
    const a = rand(2, 6), b = rand(2, 6), c = rand(2, 6), d = rand(1, 5);
    const correct = a * (b + c) - d;
    if (correct < 0) return null;
    return { text: `${a} × (${b} + ${c}) − ${d}`, correct, wrong: a * b + c - d,
      hint: `(${b}+${c}) = ${b + c}. ${a} × ${b + c} = ${a * (b + c)}. − ${d} = ${correct}` };
  }},
  { cat: 'parens_mult', level: 3, gen: () => {
    const a = rand(2, 5), b = rand(3, 8), c = rand(2, 5), d = rand(1, 4);
    return { text: `${a} × (${b} − ${c}) + ${d}`, correct: a * (b - c) + d, wrong: a * b - c + d,
      hint: `(${b}−${c}) = ${b - c}. ${a} × ${b - c} = ${a * (b - c)}. + ${d} = ${a * (b - c) + d}` };
  }},

  // ---- Category: nested_parens (Parens inside parens or with multiple ops) ----
  { cat: 'nested_parens', level: 4, gen: () => {
    const a = rand(2, 5), b = rand(2, 5), c = rand(2, 5), d = rand(1, 5);
    return { text: `${a} × (${b} + ${c} × ${d})`, correct: a * (b + c * d), wrong: a * (b + c) * d,
      hint: `Dans la parenthèse, × d'abord: ${c} × ${d} = ${c * d}. Puis ${b} + ${c * d} = ${b + c * d}. Puis ${a} × ${b + c * d} = ${a * (b + c * d)}` };
  }},
  { cat: 'nested_parens', level: 4, gen: () => {
    const a = rand(3, 8), b = rand(2, 5), c = rand(2, 5), d = rand(2, 4);
    const correct = (a + b) * (c + d);
    return { text: `(${a} + ${b}) × (${c} + ${d})`, correct, wrong: a + b * c + d,
      hint: `Chaque parenthèse: (${a}+${b}) = ${a + b}, (${c}+${d}) = ${c + d}. Puis ${a + b} × ${c + d} = ${correct}` };
  }},

  // ---- Category: exponents ----
  { cat: 'exponents', level: 4, gen: () => {
    const a = rand(2, 6), b = rand(1, 5);
    return { text: `${a}² + ${b}`, correct: a * a + b, wrong: (a + b) * (a + b),
      hint: `${a}² = ${a} × ${a} = ${a * a}. Puis + ${b} = ${a * a + b}` };
  }},
  { cat: 'exponents', level: 4, gen: () => {
    const a = rand(2, 5), b = rand(2, 4);
    return { text: `${a}² × ${b}`, correct: a * a * b, wrong: (a * b) * (a * b),
      hint: `${a}² = ${a * a}. Puis × ${b} = ${a * a * b}` };
  }},
  { cat: 'exponents', level: 4, gen: () => {
    const a = rand(2, 5), b = rand(2, 6), c = rand(2, 5);
    return { text: `${a}² + ${b} × ${c}`, correct: a * a + b * c, wrong: (a * a + b) * c,
      hint: `${a}² = ${a * a}, ${b} × ${c} = ${b * c}. Total: ${a * a + b * c}` };
  }},
  { cat: 'exponents', level: 5, gen: () => {
    const a = rand(2, 5), b = rand(2, 4), c = rand(1, 5);
    return { text: `(${a} + ${b})² − ${c}`, correct: (a + b) ** 2 - c, wrong: a * a + b * b - c,
      hint: `(${a}+${b})² = ${a + b}² = ${(a + b) ** 2}. − ${c} = ${(a + b) ** 2 - c}` };
  }},
];

// ===== Mastery tracking per CATEGORY =====
function loadMastery() {
  try { return JSON.parse(localStorage.getItem(MASTERY_KEY) || '{}'); } catch { return {}; }
}

function saveMastery(data) {
  try { localStorage.setItem(MASTERY_KEY, JSON.stringify(data)); } catch {}
}

export function recordPemdasAnswer(cat, isCorrect) {
  const data = loadMastery();
  const c = data[cat] || { correct: 0, wrong: 0, attempts: 0 };
  c.attempts++;
  if (isCorrect) c.correct++; else c.wrong++;
  data[cat] = c;
  saveMastery(data);
}

function categoryPriority(cat) {
  const data = loadMastery();
  const stats = data[cat];
  if (!stats || stats.attempts < 2) return 80; // new/few attempts → high priority
  const pct = stats.correct / stats.attempts;
  if (pct < 0.5) return 100; // failing → top priority
  if (pct < 0.7) return 70;
  if (pct < 0.85) return 40;
  return 15; // mastered → low priority
}

function pickWeightedTemplate() {
  // Group templates by category, weight category by priority
  const byCategory = {};
  templates.forEach(t => {
    if (!byCategory[t.cat]) byCategory[t.cat] = [];
    byCategory[t.cat].push(t);
  });

  // Build weighted pool of categories
  const cats = Object.keys(byCategory);
  const weighted = [];
  cats.forEach(c => {
    const p = categoryPriority(c);
    const count = Math.max(1, Math.round(p / 10));
    for (let i = 0; i < count; i++) weighted.push(c);
  });

  // Pick a category, then a random template from that category
  const pickedCat = weighted[Math.floor(Math.random() * weighted.length)];
  const cat = pickedCat || cats[0];
  const list = byCategory[cat];
  return list[Math.floor(Math.random() * list.length)];
}

export function getPemdasMasterySummary() {
  const data = loadMastery();
  const cats = ['add_mult', 'sub_mult', 'parens_simple', 'division', 'multi_op', 'parens_mult', 'nested_parens', 'exponents'];
  return cats.map(c => {
    const s = data[c] || { correct: 0, wrong: 0, attempts: 0 };
    return {
      category: c,
      attempts: s.attempts,
      pct: s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : null,
    };
  });
}

export function generatePemdas() {
  let question = null;
  let attempts = 0;
  let pickedCat = null;
  while (!question && attempts < 50) {
    const tmpl = pickWeightedTemplate();
    pickedCat = tmpl.cat;
    question = tmpl.gen();
    if (question && (question.correct < 0 || question.correct > 999 || !Number.isInteger(question.correct))) {
      question = null;
    }
    attempts++;
  }

  if (!question) {
    question = { text: '3 + 4 × 2', correct: 11, wrong: 14,
      hint: 'Multiplication d\'abord: 4 × 2 = 8, puis 3 + 8 = 11' };
    pickedCat = 'add_mult';
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
    pemdasCategory: pickedCat, // sub-category for adaptive tracking
    type: 'pemdas',
    text: `${question.text} = ?`,
    correct: question.correct,
    options: shuffle([...options].slice(0, 4)),
    explanation: question.hint,
    hint: question.hint,
  };
}
