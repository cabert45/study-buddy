// Terme Manquant generator — finding the missing number
// Ryan's #2 weakness

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

const patterns = [
  // ? + b = c  → answer = c − b
  {
    generate: () => {
      const answer = rand(10, 50);
      const b = rand(10, 49);
      const c = answer + b;
      if (c > 99) return null;
      return {
        text: `? + ${b} = ${c}`,
        hint: `Pour trouver ?, fais la soustraction: ${c} − ${b}`,
        correct: answer,
        strategy: 'soustraction',
      };
    },
  },
  // a + ? = c  → answer = c − a
  {
    generate: () => {
      const a = rand(10, 50);
      const answer = rand(10, 49);
      const c = a + answer;
      if (c > 99) return null;
      return {
        text: `${a} + ? = ${c}`,
        hint: `Pour trouver ?, fais la soustraction: ${c} − ${a}`,
        correct: answer,
        strategy: 'soustraction',
      };
    },
  },
  // ? − b = c  → answer = c + b
  {
    generate: () => {
      const b = rand(10, 40);
      const c = rand(10, 40);
      const answer = c + b;
      if (answer > 99) return null;
      return {
        text: `? − ${b} = ${c}`,
        hint: `Pour trouver ?, fais l'addition: ${c} + ${b}`,
        correct: answer,
        strategy: 'addition',
      };
    },
  },
  // a − ? = c  → answer = a − c
  {
    generate: () => {
      const a = rand(30, 89);
      const c = rand(10, a - 10);
      const answer = a - c;
      if (answer < 1 || answer > 99) return null;
      return {
        text: `${a} − ? = ${c}`,
        hint: `Pour trouver ?, fais la soustraction: ${a} − ${c}`,
        correct: answer,
        strategy: 'soustraction',
      };
    },
  },
];

export function generateTerme() {
  let question = null;
  while (!question) {
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    question = pattern.generate();
  }

  const { correct } = question;
  const options = new Set([correct]);
  // Common wrong answers: ±1, ±10
  [correct + 1, correct - 1, correct + 10, correct - 10].forEach((v) => {
    if (v > 0 && v <= 99) options.add(v);
  });
  while (options.size < 4) {
    const fake = correct + rand(-8, 8);
    if (fake !== correct && fake > 0 && fake <= 99) options.add(fake);
  }

  return {
    category: 'terme',
    type: 'terme_manquant',
    text: question.text,
    correct: question.correct,
    hint: question.hint,
    strategy: question.strategy,
    options: shuffle([...options].slice(0, 4)),
  };
}
