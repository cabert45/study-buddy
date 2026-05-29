// Calcul rapide ±9 / ±10 with 3-digit numbers
// Ryan got 29/30 on small numbers but only 12/30 (twice!) on 3-digit version
// — the test had things like 155+10, 201-10, 340-9, 750+9.
// He left many BLANK (speed issue), didn't actually get them wrong.
// This mode drills the same +/-9/+/-10 trick on hundreds.
import { withFresh } from '../utils/antiRepeat';

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Build a 3-digit operand. Avoid the trivial cases where ±10 doesn't change
// the hundreds digit (so questions stay reasonably interesting).
function pickOperand() {
  return rand(100, 999);
}

const OPS = [
  { op: '+', val: 9 },
  { op: '+', val: 10 },
  { op: '-', val: 9 },
  { op: '-', val: 10 },
];

function buildOne() {
  const a = pickOperand();
  const { op, val } = OPS[rand(0, 3)];

  // For subtraction, make sure a >= val (always true since a >= 100, val ≤ 10)
  const answer = op === '+' ? a + val : a - val;

  const wrong = new Set();
  // Common mistake 1: confused +9 with +10 (off by 1)
  wrong.add(op === '+' ? answer - 1 : answer + 1);
  // Common mistake 2: forgot to borrow / wrong tens column
  wrong.add(op === '+' ? answer + 10 : answer - 10);
  // Common mistake 3: just added/subtracted the digit, ignored borrow
  wrong.add(op === '+' ? a + (val - 1) : a - (val - 1));
  // Filter and ensure 3 distractors
  const distractors = [...wrong].filter((w) => w !== answer && w > 0).slice(0, 3);
  while (distractors.length < 3) {
    const d = answer + (rand(-30, 30) || 1);
    if (d !== answer && d > 0 && !distractors.includes(d)) distractors.push(d);
  }

  const options = [answer, ...distractors].sort(() => Math.random() - 0.5);

  // Hint based on the operation
  const trick =
    op === '+' && val === 10 ? "Astuce: +10 = monter d'1 dans les dizaines (unités restent pareilles)."
    : op === '+' && val === 9 ? 'Astuce: +9 = +10 puis -1.'
    : op === '-' && val === 10 ? "Astuce: -10 = baisser d'1 dans les dizaines (unités restent pareilles)."
    : 'Astuce: -9 = -10 puis +1.';

  return {
    category: 'calcul_rapide_3',
    type: 'calcul_rapide_3',
    text: `${a} ${op} ${val} = ?`,
    correct: String(answer),
    options: options.map(String),
    explanation: `${a} ${op} ${val} = ${answer}.\n${trick}`,
    hint: trick,
  };
}

export function generateCalculRapide3() {
  return withFresh('calcul_rapide_3', buildOne, 80, 25, (q) => q.text);
}
