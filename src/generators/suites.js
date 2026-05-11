// Suites et régularités — Ryan 2e année (Nougat p.6, 17)
// Final exam item. Patterns: +1, +2, +5, +10, -2, alternating, doubling.
import { withFresh } from '../utils/antiRepeat';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// ===== Type 1: Find next number (linear pattern) =====
function generateNext() {
  const stepPool = [1, 2, 3, 5, 10, -1, -2, -5, -10];
  const step = pick(stepPool);
  const start = step > 0 ? rand(2, 50) : rand(50, 99);
  const seq = [start, start + step, start + 2 * step, start + 3 * step];
  if (seq.some((v) => v < 0 || v > 100)) return generateNext();
  const correct = start + 4 * step;
  if (correct < 0 || correct > 110) return generateNext();
  const distractors = new Set();
  distractors.add(start + 5 * step);
  distractors.add(correct + step);
  distractors.add(correct - step);
  distractors.add(correct + 1);
  distractors.add(correct - 1);
  distractors.delete(correct);
  const dArr = [...distractors].filter(x => x >= 0 && x <= 120).slice(0, 3);
  const options = shuffle([correct, ...dArr]);
  const stepLabel = step > 0 ? `+${step}` : `${step}`;
  return {
    category: 'suites',
    type: 'next',
    text: `Quel nombre vient APRÈS dans la suite?\n\n${seq.join(', ')}, ___`,
    correct,
    options,
    explanation: `La régularité est ${stepLabel} chaque fois.\n${seq[3]} ${step > 0 ? '+' : '−'} ${Math.abs(step)} = ${correct}.`,
    hint: `Calcule la différence entre deux nombres voisins (ex: ${seq[1]} − ${seq[0]} = ${step}).`,
  };
}

// ===== Type 2: Find missing number in middle =====
function generateMissing() {
  const step = pick([1, 2, 3, 5, 10, -2, -5]);
  const start = step > 0 ? rand(2, 40) : rand(40, 80);
  const seq = [start, start + step, start + 2 * step, start + 3 * step, start + 4 * step];
  if (seq.some((v) => v < 0 || v > 100)) return generateMissing();
  const hideIdx = rand(1, 3);
  const correct = seq[hideIdx];
  const display = seq.map((v, i) => (i === hideIdx ? '___' : v));
  const distractors = new Set();
  distractors.add(correct + step);
  distractors.add(correct - step);
  distractors.add(correct + 1);
  distractors.add(correct - 1);
  distractors.delete(correct);
  const dArr = [...distractors].filter(x => x >= 0 && x <= 120).slice(0, 3);
  const options = shuffle([correct, ...dArr]);
  const stepLabel = step > 0 ? `+${step}` : `${step}`;
  return {
    category: 'suites',
    type: 'missing',
    text: `Quel nombre MANQUE dans la suite?\n\n${display.join(', ')}`,
    correct,
    options,
    explanation: `La régularité est ${stepLabel}. Le nombre qui manque est ${correct}.`,
    hint: 'Trouve la régularité (+ ou − combien à chaque fois?).',
  };
}

// ===== Type 3: Identify the rule =====
function generateRule() {
  const step = pick([1, 2, 3, 5, 10, -2, -5, -10]);
  const start = step > 0 ? rand(5, 30) : rand(40, 80);
  const seq = [start, start + step, start + 2 * step, start + 3 * step];
  if (seq.some((v) => v < 0 || v > 100)) return generateRule();
  const correctLabel = step > 0 ? `+${step} chaque fois` : `${step} chaque fois`;
  const distractorPool = [`+${Math.abs(step) + 1} chaque fois`, `−${Math.abs(step)} chaque fois`, `×${Math.abs(step)} chaque fois`, `+${Math.abs(step) - 1} chaque fois`];
  const distractors = distractorPool.filter((d) => d !== correctLabel).slice(0, 3);
  const options = shuffle([correctLabel, ...distractors]);
  return {
    category: 'suites',
    type: 'rule',
    text: `Quelle est la RÉGULARITÉ de cette suite?\n\n${seq.join(', ')}...`,
    correct: correctLabel,
    options,
    explanation: `Entre deux nombres voisins: ${seq[1]} − ${seq[0]} = ${step}. Régularité = ${correctLabel}.`,
    hint: 'Calcule la différence entre deux nombres voisins.',
  };
}

// ===== Type 4: Alternating patterns =====
function generateAlternating() {
  // Pattern: +a, +b, +a, +b, ...
  const a = pick([1, 2, 3]);
  const b = pick([2, 4, 5, 10]);
  if (a === b) return generateAlternating();
  const start = rand(5, 30);
  const seq = [start, start + a, start + a + b, start + 2 * a + b, start + 2 * a + 2 * b];
  if (seq.some((v) => v > 100)) return generateAlternating();
  const correct = start + 3 * a + 2 * b; // next
  const distractors = new Set([correct + 1, correct - 1, correct + a, correct + b]);
  distractors.delete(correct);
  const dArr = [...distractors].slice(0, 3);
  const options = shuffle([correct, ...dArr]);
  return {
    category: 'suites',
    type: 'alternating',
    text: `Quel nombre vient APRÈS?\n\n${seq.join(', ')}, ___`,
    correct,
    options,
    explanation: `La régularité ALTERNE: +${a}, +${b}, +${a}, +${b}...\nAprès ${seq[4]}, on ajoute ${a} → ${correct}.`,
    hint: `Regarde la régularité: elle change peut-être à chaque étape (alterne)!`,
  };
}

function buildOne() {
  const r = Math.random();
  if (r < 0.40) return generateNext();
  if (r < 0.70) return generateMissing();
  if (r < 0.90) return generateRule();
  return generateAlternating();
}

export function generateSuites() {
  return withFresh('suites', buildOne, 80, 25, (q) => `${q.type}|${q.text}`);
}
