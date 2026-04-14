// Statistique generator — bar charts, pictograms, table reading
// Matches Ryan's textbook: Theme 5, Section 24
// Questions about reading data from charts and doing comparisons

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

// Themed data sets for charts
const chartThemes = [
  {
    title: 'Les animaux du zoo',
    labels: ['lions', 'singes', 'oiseaux', 'serpents'],
    unit: 'animaux',
  },
  {
    title: 'Les chevaux du château',
    labels: ['cheval de course', 'cheval de trait', 'cheval de combat', 'poney'],
    unit: 'chevaux',
  },
  {
    title: 'Les employés du château',
    labels: ['valet', 'cuisinier', 'chevalier', 'jardinier'],
    unit: 'employés',
  },
  {
    title: 'Les fruits récoltés',
    labels: ['pommes', 'poires', 'cerises', 'fraises'],
    unit: 'fruits',
  },
  {
    title: 'Les livres de la bibliothèque',
    labels: ['contes', 'aventures', 'sciences', 'poésie'],
    unit: 'livres',
  },
  {
    title: 'Les fleurs du jardin',
    labels: ['roses', 'tulipes', 'marguerites', 'violettes'],
    unit: 'fleurs',
  },
];

function generateBarChartQuestion() {
  const theme = chartThemes[Math.floor(Math.random() * chartThemes.length)];
  // Generate values in multiples of 5 or 10 for easy reading
  const step = Math.random() < 0.5 ? 5 : 10;
  const values = theme.labels.map(() => rand(1, 10) * step);

  // Pick a question type
  const questionTypes = [
    // How many of X?
    () => {
      const idx = rand(0, 3);
      return {
        text: `Dans le diagramme "${theme.title}", combien de ${theme.labels[idx]} y a-t-il?`,
        correct: values[idx],
        explanation: `On lit la barre des ${theme.labels[idx]}: elle monte jusqu'à ${values[idx]}.`,
      };
    },
    // Which has the most?
    () => {
      const maxVal = Math.max(...values);
      const maxIdx = values.indexOf(maxVal);
      // Use numeric answer: the max value
      return {
        text: `Dans le diagramme "${theme.title}", quelle catégorie a le plus grand nombre? Combien?`,
        correct: maxVal,
        explanation: `La plus grande barre est ${theme.labels[maxIdx]} avec ${maxVal}.`,
      };
    },
    // Which has the least?
    () => {
      const minVal = Math.min(...values);
      const minIdx = values.indexOf(minVal);
      return {
        text: `Dans le diagramme "${theme.title}", quel est le plus petit nombre? Combien?`,
        correct: minVal,
        explanation: `La plus petite barre est ${theme.labels[minIdx]} avec ${minVal}.`,
      };
    },
    // How many more A than B?
    () => {
      let i1 = rand(0, 3);
      let i2 = rand(0, 3);
      while (i2 === i1) i2 = rand(0, 3);
      if (values[i1] < values[i2]) [i1, i2] = [i2, i1];
      const diff = values[i1] - values[i2];
      return {
        text: `Combien de ${theme.labels[i1]} de plus que de ${theme.labels[i2]}? (${theme.title})`,
        correct: diff,
        explanation: `${values[i1]} − ${values[i2]} = ${diff}`,
      };
    },
    // Total of all categories
    () => {
      const total = values.reduce((a, b) => a + b, 0);
      return {
        text: `Combien de ${theme.unit} y a-t-il en tout? (${theme.title})`,
        correct: total,
        explanation: `${values.join(' + ')} = ${total}`,
      };
    },
  ];

  const qGen = questionTypes[Math.floor(Math.random() * questionTypes.length)];
  const q = qGen();

  // Build chart data for display
  const chartData = theme.labels.map((label, i) => ({ label, value: values[i] }));

  const options = new Set([q.correct]);
  while (options.size < 4) {
    const fake = q.correct + rand(-15, 15);
    if (fake !== q.correct && fake > 0 && fake <= 200) options.add(fake);
  }

  return {
    category: 'statistique',
    type: 'bar_chart',
    text: q.text,
    correct: q.correct,
    explanation: q.explanation,
    chartData,
    chartTitle: theme.title,
    options: shuffle([...options].slice(0, 4)),
  };
}

function generatePictogramQuestion() {
  const theme = chartThemes[Math.floor(Math.random() * chartThemes.length)];
  const legend = Math.random() < 0.5 ? 5 : 10;
  // Each label has some full symbols and maybe a half
  const symbolCounts = theme.labels.map(() => rand(1, 8));
  const values = symbolCounts.map((c) => c * legend);

  const questionTypes = [
    // How many of X?
    () => {
      const idx = rand(0, 3);
      return {
        text: `Dans le pictogramme "${theme.title}", combien de ${theme.labels[idx]} y a-t-il? (1 symbole = ${legend})`,
        correct: values[idx],
        explanation: `${symbolCounts[idx]} symboles × ${legend} = ${values[idx]}`,
      };
    },
    // How many more A than B?
    () => {
      let i1 = rand(0, 3);
      let i2 = rand(0, 3);
      while (i2 === i1) i2 = rand(0, 3);
      if (values[i1] < values[i2]) [i1, i2] = [i2, i1];
      const diff = values[i1] - values[i2];
      return {
        text: `Combien de ${theme.labels[i1]} de plus que de ${theme.labels[i2]}? (1 symbole = ${legend})`,
        correct: diff,
        explanation: `${values[i1]} − ${values[i2]} = ${diff}`,
      };
    },
    // Total
    () => {
      const total = values.reduce((a, b) => a + b, 0);
      return {
        text: `Combien de ${theme.unit} en tout dans le pictogramme? (1 symbole = ${legend})`,
        correct: total,
        explanation: `${values.join(' + ')} = ${total}`,
      };
    },
  ];

  const qGen = questionTypes[Math.floor(Math.random() * questionTypes.length)];
  const q = qGen();

  const chartData = theme.labels.map((label, i) => ({
    label,
    value: values[i],
    symbols: symbolCounts[i],
  }));

  const options = new Set([q.correct]);
  while (options.size < 4) {
    const fake = q.correct + rand(-15, 15);
    if (fake !== q.correct && fake > 0 && fake <= 200) options.add(fake);
  }

  return {
    category: 'statistique',
    type: 'pictogram',
    text: q.text,
    correct: q.correct,
    explanation: q.explanation,
    chartData,
    chartTitle: theme.title,
    legend,
    options: shuffle([...options].slice(0, 4)),
  };
}

function generateTableQuestion() {
  // Missing value in a table with row/column totals
  const rows = ['Pommes', 'Poires'];
  const cols = ['Lundi', 'Mardi', 'Mercredi'];

  const data = [
    [rand(10, 30), rand(10, 30), rand(10, 30)],
    [rand(10, 30), rand(10, 30), rand(10, 30)],
  ];

  // Pick a cell to hide
  const hideRow = rand(0, 1);
  const hideCol = rand(0, 2);
  const correct = data[hideRow][hideCol];

  // Give totals for the row and column
  const rowTotal = data[hideRow].reduce((a, b) => a + b, 0);
  const colTotal = data[0][hideCol] + data[1][hideCol];

  // Show the other values in that row
  const knownInRow = data[hideRow].filter((_, i) => i !== hideCol);
  const knownSum = knownInRow.reduce((a, b) => a + b, 0);

  return {
    category: 'statistique',
    type: 'table',
    text: `Le total de ${rows[hideRow]} pour la semaine est ${rowTotal}. ${rows[hideRow]} ${cols[hideCol].toLowerCase()} = ? sachant que les autres jours ont ${knownInRow.join(' et ')}.`,
    correct,
    explanation: `${rowTotal} − ${knownSum} = ${correct}`,
    options: shuffle([correct, correct + rand(1, 5), correct - rand(1, 5), correct + rand(6, 12)].filter((v) => v > 0)),
  };
}

export function generateStatistique() {
  const r = Math.random();
  if (r < 0.45) return generateBarChartQuestion();
  if (r < 0.75) return generatePictogramQuestion();
  return generateTableQuestion();
}
