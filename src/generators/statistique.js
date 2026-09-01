import { numericOptions, fillOptions } from './options.js';
// Statistique generator — bar charts, pictograms, table reading
// Targets May 8 2026 test weaknesses: légende multiplication, fin de semaine vocab,
// place value carry, total of all categories
// Curriculum: Theme 5 + Theme 6 (Au château, Dans la forêt)

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

// 4-category themes (forêt / château / animaux)
const themes4 = [
  { title: 'Les animaux du zoo', labels: ['lions', 'singes', 'oiseaux', 'serpents'], unit: 'animaux', symbol: '🦁' },
  { title: 'Les fruits récoltés', labels: ['pommes', 'poires', 'cerises', 'fraises'], unit: 'fruits', symbol: '🍎' },
  { title: 'Les fleurs du jardin', labels: ['roses', 'tulipes', 'marguerites', 'violettes'], unit: 'fleurs', symbol: '🌸' },
  { title: 'Les jouets de Delphine', labels: ['tambours', 'toupies', 'balles', 'cubes'], unit: 'jouets', symbol: '🪀' },
  { title: 'Les collations en forêt', labels: ['guimauves', 'muffins', 'noix', 'fruits secs'], unit: 'amis', symbol: '🍪' },
  { title: 'Les insectes de la forêt', labels: ['fourmis', 'abeilles', 'papillons', 'sauterelles'], unit: 'insectes', symbol: '🐜' },
];

// 5-category theme variant (Theme 6 collations)
const themes5 = [
  { title: 'Les collations en forêt', labels: ['guimauves', 'muffins', 'noix', 'barres tendres', 'fruits secs'], unit: 'amis', symbol: '🍪' },
];

// Weekly themes — 7 days, used for fin-de-semaine vocab questions
const weekDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const weeklyThemes = [
  { title: 'La distance parcourue par le roi', unit: 'km', context: 'le roi a couru' },
  { title: 'Les fleurs cueillies par Pétula', unit: 'fleurs', context: 'Pétula a cueilli' },
  { title: 'Les pages lues cette semaine', unit: 'pages', context: 'tu as lu' },
  { title: 'Les heures de jeu de Foin-Foin', unit: 'heures', context: 'Foin-Foin a joué' },
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildOptions(correct) {
  const options = new Set([correct]);
  fillOptions(options, numericOptions(correct, { spread: 15, count: 8 }));
  return shuffle([...options].slice(0, 4));
}

// ===== BAR CHART (4 categories) =====
function generateBarChartQuestion() {
  const useFive = Math.random() < 0.3;
  const theme = useFive ? pick(themes5) : pick(themes4);
  const step = Math.random() < 0.5 ? 5 : 10;
  const values = theme.labels.map(() => rand(1, 10) * step);

  const types = [
    () => {
      const idx = rand(0, theme.labels.length - 1);
      return {
        text: `Combien de ${theme.labels[idx]} y a-t-il ?`,
        correct: values[idx],
        explanation: `On lit la barre des ${theme.labels[idx]} : ${values[idx]}.`,
      };
    },
    () => {
      const maxVal = Math.max(...values);
      const minVal = Math.min(...values);
      const isMax = Math.random() < 0.5;
      const targetVal = isMax ? maxVal : minVal;
      const targetIdx = values.indexOf(targetVal);
      return {
        text: isMax
          ? `Quelle catégorie a le PLUS GRAND nombre ? Combien ?`
          : `Quelle catégorie a le PLUS PETIT nombre ? Combien ?`,
        correct: targetVal,
        explanation: `${theme.labels[targetIdx]} = ${targetVal}.`,
      };
    },
    () => {
      let i1 = rand(0, theme.labels.length - 1);
      let i2 = rand(0, theme.labels.length - 1);
      while (i2 === i1) i2 = rand(0, theme.labels.length - 1);
      if (values[i1] < values[i2]) [i1, i2] = [i2, i1];
      const diff = values[i1] - values[i2];
      return {
        text: `Combien de ${theme.labels[i1]} de PLUS que de ${theme.labels[i2]} ?`,
        correct: diff,
        explanation: `${values[i1]} − ${values[i2]} = ${diff}`,
      };
    },
    () => {
      const total = values.reduce((a, b) => a + b, 0);
      return {
        text: `Combien de ${theme.unit} en TOUT ?`,
        correct: total,
        explanation: `${values.join(' + ')} = ${total}`,
        hint: 'Additionne TOUTES les barres.',
      };
    },
  ];

  const q = pick(types)();
  const chartData = theme.labels.map((label, i) => ({ label, value: values[i] }));

  return {
    category: 'statistique',
    type: 'bar_chart',
    text: q.text,
    correct: q.correct,
    explanation: q.explanation,
    hint: q.hint,
    chartData,
    chartTitle: theme.title,
    unit: theme.unit,
    options: buildOptions(q.correct),
  };
}

// ===== WEEKLY BAR CHART (7 days — fin de semaine vocab) =====
function generateWeeklyChartQuestion() {
  const theme = pick(weeklyThemes);
  // Realistic weekly values (1-9 km/units)
  const values = weekDays.map(() => rand(1, 9));

  // Indices: lun=0, mar=1, mer=2, jeu=3, ven=4, sam=5, dim=6
  const finDeSemaineSum = values[5] + values[6]; // sam + dim
  const semaineSum = values[0] + values[1] + values[2] + values[3] + values[4]; // lun-ven
  const totalSum = values.reduce((a, b) => a + b, 0);

  const types = [
    // Fin de semaine = sam + dim
    {
      text: `Combien de ${theme.unit} ${theme.context} pendant LA FIN DE SEMAINE ? (samedi + dimanche)`,
      correct: finDeSemaineSum,
      explanation: `Fin de semaine = samedi + dimanche = ${values[5]} + ${values[6]} = ${finDeSemaineSum}`,
      hint: 'Fin de semaine = samedi ET dimanche.',
    },
    // Toute la semaine = all 7 days
    {
      text: `Combien de ${theme.unit} ${theme.context} pendant TOUTE LA SEMAINE ?`,
      correct: totalSum,
      explanation: `${values.join(' + ')} = ${totalSum}`,
      hint: 'Toute la semaine = les 7 jours ensemble.',
    },
    // Just the school days (semaine = lun-ven, intentional contrast)
    {
      text: `Combien de ${theme.unit} ${theme.context} du LUNDI au VENDREDI ?`,
      correct: semaineSum,
      explanation: `${values.slice(0, 5).join(' + ')} = ${semaineSum}`,
      hint: '5 jours : lundi, mardi, mercredi, jeudi, vendredi.',
    },
    // How many on a specific day
    (() => {
      const idx = rand(0, 6);
      return {
        text: `Combien de ${theme.unit} ${theme.context} ${weekDays[idx].toUpperCase()} ?`,
        correct: values[idx],
        explanation: `On lit la barre de ${weekDays[idx]} : ${values[idx]}.`,
      };
    })(),
  ];

  // Day-name question — separate because it returns a STRING answer with day options
  const dayNameQuestionTypes = [
    () => {
      const maxVal = Math.max(...values);
      const maxIdx = values.indexOf(maxVal);
      return {
        text: `QUEL JOUR a le PLUS de ${theme.unit} ?`,
        correct: weekDays[maxIdx],
        explanation: `${weekDays[maxIdx]} = ${maxVal} ${theme.unit} (la plus grande barre).`,
        hint: `On cherche la PLUS GRANDE barre. La réponse est un JOUR.`,
        isDayQuestion: true,
      };
    },
    () => {
      const minVal = Math.min(...values);
      const minIdx = values.indexOf(minVal);
      return {
        text: `QUEL JOUR a le MOINS de ${theme.unit} ?`,
        correct: weekDays[minIdx],
        explanation: `${weekDays[minIdx]} = ${minVal} ${theme.unit} (la plus petite barre).`,
        hint: `On cherche la PLUS PETITE barre. La réponse est un JOUR.`,
        isDayQuestion: true,
      };
    },
  ];

  const useDayQ = Math.random() < 0.3;
  const q = useDayQ ? pick(dayNameQuestionTypes)() : pick(types);
  const chartData = weekDays.map((label, i) => ({ label, value: values[i] }));

  let options;
  if (q.isDayQuestion) {
    // Pick 4 distinct day options including the correct one
    const otherDays = weekDays.filter((d) => d !== q.correct);
    options = shuffle([q.correct, ...shuffle(otherDays).slice(0, 3)]);
  } else {
    options = buildOptions(q.correct);
  }

  return {
    category: 'statistique',
    type: 'weekly_chart',
    text: q.text,
    correct: q.correct,
    explanation: q.explanation,
    hint: q.hint,
    chartData,
    chartTitle: theme.title,
    unit: theme.unit,
    options,
  };
}

// ===== PICTOGRAM (légende — multiplication) =====
function generatePictogramQuestion() {
  const theme = pick(themes4);
  const legend = pick([2, 5, 10]);
  const symbolCounts = theme.labels.map(() => rand(1, 6));
  const values = symbolCounts.map((c) => c * legend);

  const types = [
    () => {
      const idx = rand(0, 3);
      return {
        text: `D'après la légende (1 symbole = ${legend}), combien de ${theme.labels[idx]} y a-t-il ?`,
        correct: values[idx],
        explanation: `${symbolCounts[idx]} symbole(s) × ${legend} = ${values[idx]}`,
        hint: `Compte les symboles, puis multiplie par ${legend}.`,
      };
    },
    () => {
      let i1 = rand(0, 3);
      let i2 = rand(0, 3);
      while (i2 === i1) i2 = rand(0, 3);
      if (values[i1] < values[i2]) [i1, i2] = [i2, i1];
      const diff = values[i1] - values[i2];
      return {
        text: `Combien de ${theme.labels[i1]} de PLUS que de ${theme.labels[i2]} ? (1 symbole = ${legend})`,
        correct: diff,
        explanation: `${values[i1]} − ${values[i2]} = ${diff}`,
        hint: `D'abord trouve la valeur de chacun (× ${legend}), puis soustrais.`,
      };
    },
    () => {
      const total = values.reduce((a, b) => a + b, 0);
      return {
        text: `Combien de ${theme.unit} en TOUT ? (1 symbole = ${legend})`,
        correct: total,
        explanation: `${values.join(' + ')} = ${total}`,
        hint: `Trouve la valeur de chaque ligne, puis additionne.`,
      };
    },
  ];

  const q = pick(types)();
  const chartData = theme.labels.map((label, i) => ({
    label,
    value: values[i],
    symbols: symbolCounts[i],
  }));

  return {
    category: 'statistique',
    type: 'pictogram',
    text: q.text,
    correct: q.correct,
    explanation: q.explanation,
    hint: q.hint,
    chartData,
    chartTitle: theme.title,
    legend,
    legendUnit: theme.unit,
    symbol: theme.symbol,
    options: buildOptions(q.correct),
  };
}

// ===== TABLE (collations: garçons + filles + total) =====
function generateTableQuestion() {
  // Mimics the "collations en forêt" test layout: rows = collations, cols = garçons/filles, last col = total
  const collations = ['guimauves', 'muffins', 'noix', 'barres tendres', 'fruits secs'];
  // Pick 3-5 rows
  const numRows = rand(3, 5);
  const usedRows = shuffle(collations).slice(0, numRows);
  const cols = ['Filles', 'Garçons'];

  const data = usedRows.map(() => [rand(2, 13), rand(2, 13)]);
  const rowTotals = data.map((row) => row[0] + row[1]);

  // Pick a missing total (the test mistake was 8+7=75 — train this!)
  const hideRow = rand(0, numRows - 1);
  const correct = rowTotals[hideRow];
  const a = data[hideRow][0];
  const b = data[hideRow][1];

  return {
    category: 'statistique',
    type: 'table',
    text: `Quel est le TOTAL pour les ${usedRows[hideRow]} ? (Filles + Garçons)`,
    correct,
    explanation: `${a} + ${b} = ${correct}`,
    hint: `Additionne les filles et les garçons. Attention à la retenue !`,
    tableData: {
      rows: usedRows,
      cols,
      data,
      hideRow,
      hideCol: -1, // hide the row total instead of a cell
      rowTotals: rowTotals.map((t, i) => (i === hideRow ? '?' : t)),
    },
    chartTitle: 'Les collations préférées',
    options: buildOptions(correct),
  };
}

// ===== TABLE — find a specific value comparison =====
function generateComparisonQuestion() {
  // "Quelle collation est appréciée AUTANT par les filles que par les garçons ?"
  // Or "...préférée des garçons / filles?" type questions
  const theme = pick(themes4);
  const data = theme.labels.map(() => [rand(2, 12), rand(2, 12)]);

  // Force at least one tie so "appréciée autant" question has an answer
  const tieIdx = rand(0, theme.labels.length - 1);
  const tieVal = rand(3, 8);
  data[tieIdx] = [tieVal, tieVal];

  const filleVals = data.map((d) => d[0]);
  const garconVals = data.map((d) => d[1]);

  const types = [
    () => {
      const maxF = Math.max(...filleVals);
      const idx = filleVals.indexOf(maxF);
      return {
        text: `Quelle catégorie est PRÉFÉRÉE des filles ? (la plus choisie)`,
        correct: theme.labels[idx],
        explanation: `${theme.labels[idx]} : ${maxF} filles (le plus grand nombre de filles).`,
        hint: `Cherche la colonne "Filles" et trouve le PLUS GRAND nombre.`,
      };
    },
    () => {
      const maxG = Math.max(...garconVals);
      const idx = garconVals.indexOf(maxG);
      return {
        text: `Quelle catégorie est PRÉFÉRÉE des garçons ? (la plus choisie)`,
        correct: theme.labels[idx],
        explanation: `${theme.labels[idx]} : ${maxG} garçons (le plus grand nombre de garçons).`,
        hint: `Cherche la colonne "Garçons" et trouve le PLUS GRAND nombre.`,
      };
    },
    () => {
      // Least popular overall
      const minTotal = Math.min(...data.map((d) => d[0] + d[1]));
      const idx = data.findIndex((d) => d[0] + d[1] === minTotal);
      return {
        text: `Quelle catégorie est la MOINS POPULAIRE (en tout) ?`,
        correct: theme.labels[idx],
        explanation: `${theme.labels[idx]} : ${data[idx][0]} + ${data[idx][1]} = ${minTotal} (le plus petit total).`,
        hint: `Compte le total filles + garçons pour chaque ligne, puis trouve le plus PETIT.`,
      };
    },
    () => {
      // Tied category — answer is the category name
      return {
        text: `Quelle catégorie est appréciée AUTANT par les filles que par les garçons ?`,
        correct: theme.labels[tieIdx],
        explanation: `${theme.labels[tieIdx]} : ${tieVal} filles et ${tieVal} garçons (les deux sont égaux).`,
        hint: `Cherche une ligne où le nombre de filles = le nombre de garçons.`,
      };
    },
  ];

  const q = pick(types)();
  const rowTotals = data.map((d) => d[0] + d[1]);

  // Options are category names — pick correct + 3 distractors from theme.labels
  const otherLabels = theme.labels.filter((l) => l !== q.correct);
  const options = shuffle([q.correct, ...shuffle(otherLabels).slice(0, 3)]);

  return {
    category: 'statistique',
    type: 'comparison_table',
    text: q.text,
    correct: q.correct,
    explanation: q.explanation,
    hint: q.hint,
    tableData: {
      rows: theme.labels,
      cols: ['Filles', 'Garçons'],
      data,
      hideRow: -1,
      hideCol: -1,
      rowTotals,
    },
    chartTitle: theme.title,
    options,
  };
}

export function generateStatistique() {
  const r = Math.random();
  // Distribution targeting May 8 weaknesses:
  // 25% pictogram (légende — biggest fail at 0/3)
  // 25% weekly chart (fin de semaine vocab — failed)
  // 20% bar chart (read values — failed)
  // 15% table totals (8+7=75 carry — failed)
  // 15% comparison (préférée / autant — failed)
  if (r < 0.25) return generatePictogramQuestion();
  if (r < 0.50) return generateWeeklyChartQuestion();
  if (r < 0.70) return generateBarChartQuestion();
  if (r < 0.85) return generateTableQuestion();
  return generateComparisonQuestion();
}
