// Pair/Impair (even/odd) generator
// Ryan scored 0.5/3.5 on this — confused which numbers are even vs odd

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

export function generatePairImpair() {
  const templates = [
    // Simple: is this number pair or impair?
    () => {
      const num = rand(10, 99);
      const isPair = num % 2 === 0;
      return {
        text: `${num} est un nombre...`,
        correct: isPair ? 0 : 1,
        options: shuffle([0, 1, 2, 3]),
        optionLabels: { 0: 'Pair', 1: 'Impair', 2: isPair ? 'Impair' : 'Pair', 3: `${num + 1} est ${isPair ? 'impair' : 'pair'}` },
        explanation: isPair
          ? `${num} est pair car il se termine par ${num % 10} (0, 2, 4, 6, 8 = pair)`
          : `${num} est impair car il se termine par ${num % 10} (1, 3, 5, 7, 9 = impair)`,
      };
    },
    // Which of these numbers is pair?
    () => {
      const pair = rand(5, 45) * 2; // guaranteed even
      const impair1 = pair + 1;
      const impair2 = pair - 1;
      const impair3 = pair + 3 <= 99 ? pair + 3 : pair - 3;
      return {
        text: `Quel nombre est pair?`,
        correct: pair,
        options: shuffle([pair, impair1, impair2, impair3]),
        explanation: `${pair} est pair car il se termine par ${pair % 10}`,
      };
    },
    // Which of these numbers is impair?
    () => {
      const impair = rand(5, 44) * 2 + 1; // guaranteed odd
      const pair1 = impair + 1;
      const pair2 = impair - 1;
      const pair3 = impair + 3 <= 99 ? impair + 3 : impair - 3;
      // Make sure pair3 is actually even
      const p3 = pair3 % 2 === 0 ? pair3 : pair3 + 1;
      return {
        text: `Quel nombre est impair?`,
        correct: impair,
        options: shuffle([impair, pair1, pair2, Math.min(p3, 99)]),
        explanation: `${impair} est impair car il se termine par ${impair % 10}`,
      };
    },
  ];

  const template = templates[Math.floor(Math.random() * templates.length)];
  const q = template();

  // If we have optionLabels, it's the pair/impair choice format
  if (q.optionLabels) {
    return {
      category: 'pair_impair',
      type: 'pair_impair_identify',
      text: q.text,
      correct: q.correct,
      options: [0, 1],
      optionLabels: { 0: 'Pair', 1: 'Impair' },
      explanation: q.explanation,
    };
  }

  return {
    category: 'pair_impair',
    type: 'pair_impair',
    text: q.text,
    correct: q.correct,
    options: q.options.filter((v, i, a) => a.indexOf(v) === i).slice(0, 4),
    explanation: q.explanation,
  };
}
