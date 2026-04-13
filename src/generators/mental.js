// Mental Math generator — reinforcement
// Ryan scores well here, but needs speed practice

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

const strategies = [
  // +0
  () => {
    const a = rand(10, 90);
    return { text: `${a} + 0 = ?`, correct: a, strategy: 'effet du 0' };
  },
  // +1
  () => {
    const a = rand(10, 88);
    return { text: `${a} + 1 = ?`, correct: a + 1, strategy: '+1' };
  },
  // -1
  () => {
    const a = rand(11, 90);
    return { text: `${a} − 1 = ?`, correct: a - 1, strategy: '−1' };
  },
  // +2
  () => {
    const a = rand(10, 87);
    return { text: `${a} + 2 = ?`, correct: a + 2, strategy: '+2' };
  },
  // -2
  () => {
    const a = rand(12, 90);
    return { text: `${a} − 2 = ?`, correct: a - 2, strategy: '−2' };
  },
  // +10
  () => {
    const a = rand(10, 79);
    return { text: `${a} + 10 = ?`, correct: a + 10, strategy: '+10' };
  },
  // -10
  () => {
    const a = rand(20, 90);
    return { text: `${a} − 10 = ?`, correct: a - 10, strategy: '−10' };
  },
  // doubles
  () => {
    const a = rand(5, 45);
    return { text: `${a} + ${a} = ?`, correct: a * 2, strategy: 'doubles' };
  },
];

export function generateMental() {
  const strat = strategies[Math.floor(Math.random() * strategies.length)];
  const q = strat();

  const options = new Set([q.correct]);
  while (options.size < 4) {
    const fake = q.correct + rand(-3, 3);
    if (fake !== q.correct && fake >= 0 && fake <= 99) options.add(fake);
  }

  return {
    category: 'mental',
    type: 'mental',
    text: q.text,
    correct: q.correct,
    options: shuffle([...options].slice(0, 4)),
    strategy: q.strategy,
  };
}
