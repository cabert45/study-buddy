// Sens de la multiplication et de la division — Ryan 2e année (Nougat p.31-32)
// 2e année level: concrete grouping (3 groupes de 4 = 12) and sharing (12 partagé en 3 = 4).
// NOT abstract × tables — the SENS (meaning) of the operations.
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

const items = [
  { obj: 'pommes', sing: 'pomme', container: 'sac', containerPlur: 'sacs' },
  { obj: 'bonbons', sing: 'bonbon', container: 'boîte', containerPlur: 'boîtes' },
  { obj: 'biscuits', sing: 'biscuit', container: 'paquet', containerPlur: 'paquets' },
  { obj: 'crayons', sing: 'crayon', container: 'étui', containerPlur: 'étuis' },
  { obj: 'billes', sing: 'bille', container: 'sac', containerPlur: 'sacs' },
  { obj: 'fleurs', sing: 'fleur', container: 'vase', containerPlur: 'vases' },
];

// ===== Type 1: Multiplication as groupes égaux =====
// "3 groupes de 4 pommes = combien?"
function generateMultGroupes() {
  const groups = rand(2, 6);
  const perGroup = rand(2, 6);
  const correct = groups * perGroup;
  const item = pick(items);
  const distractors = new Set();
  distractors.add(groups + perGroup); // adds instead of multiplies
  distractors.add(correct - groups);
  distractors.add(correct + perGroup);
  distractors.add(groups * perGroup + 1);
  distractors.delete(correct);
  const dArr = [...distractors].slice(0, 3);
  const options = shuffle([correct, ...dArr]);
  return {
    category: 'mult_div',
    type: 'mult_groupes',
    text: `Il y a ${groups} ${item.containerPlur} de ${perGroup} ${item.obj} chacun. Combien de ${item.obj} en tout?`,
    correct,
    options,
    explanation: `${groups} groupes de ${perGroup} = ${groups} × ${perGroup} = ${correct}.\nMultiplication = additions répétées du même nombre: ${perGroup} + ${perGroup}${groups >= 3 ? ' + ...' : ''} (${groups} fois) = ${correct}.`,
    hint: `Imagine ${groups} ${item.containerPlur}. Dans chaque ${item.container}, il y a ${perGroup} ${item.obj}.`,
  };
}

// ===== Type 2: Multiplication as répétition =====
// "4 + 4 + 4 = combien × combien?"
function generateMultRepetition() {
  const n = rand(2, 7);
  const times = rand(2, 5);
  const correct = n * times;
  const sumStr = Array(times).fill(n).join(' + ');
  const distractors = new Set([n + times, correct + 1, correct - 1, n * (times + 1)]);
  distractors.delete(correct);
  const dArr = [...distractors].slice(0, 3);
  const options = shuffle([correct, ...dArr]);
  return {
    category: 'mult_div',
    type: 'mult_repetition',
    text: `Combien font ${sumStr}?\n\n(C'est ${times} fois le nombre ${n}.)`,
    correct,
    options,
    explanation: `${sumStr} = ${times} × ${n} = ${correct}.`,
    hint: 'C\'est une addition répétée — tu peux la transformer en multiplication.',
  };
}

// ===== Type 3: Division as partage =====
// "12 bonbons partagés en 3 amis: combien chacun?"
function generateDivPartage() {
  const friends = rand(2, 5);
  const perFriend = rand(2, 6);
  const total = friends * perFriend;
  const correct = perFriend;
  const item = pick(items);
  const distractors = new Set([total - friends, friends, total / 2, perFriend + 1]);
  distractors.delete(correct);
  distractors.delete(0);
  const dArr = [...distractors].filter(x => x > 0 && Number.isInteger(x)).slice(0, 3);
  const options = shuffle([correct, ...dArr]);
  return {
    category: 'mult_div',
    type: 'div_partage',
    text: `${total} ${item.obj} sont partagés également entre ${friends} amis. Combien de ${item.obj} chaque ami reçoit-il?`,
    correct,
    options,
    explanation: `${total} ÷ ${friends} = ${correct}.\nDivision = partage en parts égales: ${total} ${item.obj} ÷ ${friends} amis = ${correct} ${item.obj} chacun.`,
    hint: `Imagine que tu distribues les ${total} ${item.obj} un par un entre les ${friends} amis.`,
  };
}

// ===== Type 4: Division as regroupement =====
// "12 bonbons mis 4 par boîte: combien de boîtes?"
function generateDivRegroupement() {
  const perBox = rand(2, 5);
  const boxes = rand(2, 6);
  const total = perBox * boxes;
  const correct = boxes;
  const item = pick(items);
  const distractors = new Set([total - perBox, perBox, total / 2, boxes + 1]);
  distractors.delete(correct);
  const dArr = [...distractors].filter(x => x > 0 && Number.isInteger(x)).slice(0, 3);
  const options = shuffle([correct, ...dArr]);
  return {
    category: 'mult_div',
    type: 'div_regroupement',
    text: `On a ${total} ${item.obj}. On les met dans des ${item.containerPlur} de ${perBox} ${item.obj}. Combien de ${item.containerPlur}?`,
    correct,
    options,
    explanation: `${total} ÷ ${perBox} = ${correct}.\nOn divise pour savoir COMBIEN DE GROUPES de ${perBox} on peut faire.`,
    hint: `Combien de fois ${perBox} entre dans ${total}?`,
  };
}

// ===== Type 5: Recognize which operation =====
function generateChooseOp() {
  const types = [
    {
      text: 'Anna a 3 sacs de 5 pommes. Quelle opération pour trouver le TOTAL?',
      correct: 'Multiplication (3 × 5)',
      hint: 'On a des groupes égaux → on multiplie.',
    },
    {
      text: 'On partage 15 bonbons également entre 5 enfants. Quelle opération?',
      correct: 'Division (15 ÷ 5)',
      hint: 'On partage en parts égales → on divise.',
    },
    {
      text: 'Léo a 12 billes. Il les met dans des sacs de 4 billes. Combien de sacs? Quelle opération?',
      correct: 'Division (12 ÷ 4)',
      hint: 'On cherche combien de groupes → on divise.',
    },
    {
      text: 'Il y a 4 boîtes avec 6 biscuits chacune. Combien de biscuits en tout? Quelle opération?',
      correct: 'Multiplication (4 × 6)',
      hint: 'Groupes égaux → multiplication.',
    },
  ];
  const item = pick(types);
  const options = shuffle([
    'Multiplication (3 × 5)',
    'Division (15 ÷ 5)',
    'Multiplication (4 × 6)',
    'Division (12 ÷ 4)',
    'Addition',
    'Soustraction',
  ].filter((o) => o === item.correct || Math.random() < 0.6)).slice(0, 4);
  if (!options.includes(item.correct)) options[0] = item.correct;
  return {
    category: 'mult_div',
    type: 'choose_op',
    text: item.text,
    correct: item.correct,
    options: shuffle(options),
    explanation: `${item.hint}\nRéponse: ${item.correct}.`,
    hint: item.hint,
  };
}

function buildOne() {
  const r = Math.random();
  if (r < 0.30) return generateMultGroupes();
  if (r < 0.50) return generateMultRepetition();
  if (r < 0.70) return generateDivPartage();
  if (r < 0.85) return generateDivRegroupement();
  return generateChooseOp();
}

export function generateMultDiv() {
  return withFresh('mult_div', buildOne, 80, 25, (q) => `${q.type}|${q.text}`);
}
