// « Tables +/- Stratégies » — le cahier de stratégies de calcul de la classe.
// Nathalie Vezeau, Shirley Kenney, Annie Garceau, Martine Legault, enseignantes
// CSSMI. Photographié le 20 sept. 2026 (stratégies A à T).
//
// La feuille de devoirs du 21 au 25 sept. 2026 dit « Tables +/- Stratégies CD »:
// ça veut dire les stratégies C et D de ce cahier — les doubles (jumeaux) en
// addition, et reconnaître les doubles dans la soustraction.
//
// L'idée du cahier: on n'apprend PAS les tables une par une par cœur. Chaque
// stratégie est un raccourci de raisonnement qui règle une famille entière de
// faits d'un coup. C'est exactement ce qui manque à Ryan — son calcul rapide
// s'écroule quand il compte au lieu de reconnaître.
//
// Les faits sont CALCULÉS, pas recopiés: pas de faute de transcription possible.

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

// Un fait = { a, op, b, r } → « a op b = r »
const add = (a, b) => ({ a, op: '+', b, r: a + b });
const sub = (a, b) => ({ a, op: '-', b, r: a - b });

export const STRATEGIES = [
  {
    id: 'A', titre: "L'effet du zéro dans l'addition", court: '+ 0', op: '+',
    regle: "Un nombre auquel on additionne 0 (élément neutre) a toujours le même nombre comme réponse.",
    exemple: '5 + 0 = 5',
    faits: [...range(0, 10).map((n) => add(n, 0)), ...range(1, 10).map((n) => add(0, n))],
  },
  {
    id: 'B', titre: "L'effet du zéro dans la soustraction", court: '− 0', op: '-',
    regle: "Un nombre auquel on soustrait 0 (élément neutre) a ce même nombre comme réponse.",
    exemple: '5 − 0 = 5',
    faits: range(0, 10).map((n) => sub(n, 0)),
  },
  {
    id: 'C', titre: 'Les doubles (jumeaux)', court: 'doubles', op: '+',
    regle: "Ce sont les additions où les deux termes sont jumeaux (identiques). On les apprend rapidement par cœur avec facilité.",
    exemple: '4 + 4 = 8',
    faits: range(0, 10).map((n) => add(n, n)),
  },
  {
    id: 'D', titre: 'Reconnaître les doubles (jumeaux) dans la soustraction', court: 'doubles −', op: '-',
    regle: "Lorsqu'on connaît les jumeaux, on apprend rapidement ces équations. La réponse à deux termes jumeaux, à laquelle on enlève un jumeau, égale inévitablement un jumeau.",
    exemple: '12 − 6 = 6',
    faits: range(0, 10).map((n) => sub(n + n, n)),
  },
  {
    id: 'E', titre: 'Un de plus', court: '+ 1', op: '+',
    regle: "Un nombre auquel on ajoute 1 a toujours comme réponse le nombre qui vient immédiatement après.",
    exemple: '9 + 1 = 10',
    faits: [...range(0, 10).map((n) => add(n, 1)), ...range(0, 10).map((n) => add(1, n))],
  },
  {
    id: 'F', titre: 'Un de moins', court: '− 1', op: '-',
    regle: "Un nombre auquel on enlève 1 a toujours comme réponse le nombre qui vient immédiatement avant.",
    exemple: '8 − 1 = 7',
    faits: range(1, 11).map((n) => sub(n, 1)),
  },
  {
    id: 'G', titre: 'Faire 5', court: 'faire 5', op: '+',
    regle: "Il s'agit d'ajouter à un nombre la quantité qui lui manque pour former 5. C'est une réalité numérique que les enfants reconnaissent facilement.",
    exemple: '2 + 3 = 5',
    faits: range(0, 5).map((n) => add(n, 5 - n)),
  },
  {
    id: 'H', titre: "L'opération inverse (5)", court: '5 − ?', op: '-',
    regle: "Il s'agit de reconnaître les termes d'une addition pour résoudre la soustraction qui y est associée (opérations inverses).",
    exemple: '5 − 2 = 3',
    faits: range(0, 5).map((n) => sub(5, n)),
  },
  {
    id: 'I', titre: 'Est égal à zéro', court: '= 0', op: '-',
    regle: "Une quantité moins la même quantité donne toujours 0.",
    exemple: '7 − 7 = 0',
    faits: range(0, 10).map((n) => sub(n, n)),
  },
  {
    id: 'J', titre: 'Est égal à un', court: '= 1', op: '-',
    regle: "Lorsque le deuxième terme que l'on soustrait au premier est le nombre qui vient immédiatement avant le premier terme, la réponse est toujours 1.",
    exemple: '7 − 6 = 1',
    faits: range(1, 11).map((n) => sub(n, n - 1)),
  },
  {
    id: 'K', titre: '2 de plus', court: '+ 2', op: '+',
    regle: "Un nombre auquel on ajoute 2 a toujours comme réponse 2 de plus que lui. C'est un fait numérique que les enfants apprennent rapidement.",
    exemple: '7 + 2 = 9',
    faits: [...range(0, 10).map((n) => add(n, 2)), ...range(0, 10).map((n) => add(2, n))],
  },
  {
    id: 'L', titre: '2 de moins', court: '− 2', op: '-',
    regle: "Un nombre auquel on enlève 2 a toujours comme réponse 2 de moins que lui.",
    exemple: '9 − 2 = 7',
    faits: [...range(2, 12).map((n) => sub(n, 2)), ...range(2, 12).map((n) => sub(n, n - 2))],
  },
  {
    id: 'M', titre: 'Faire 10', court: 'faire 10', op: '+',
    regle: "Il s'agit d'ajouter à un nombre la quantité qui lui manque pour former une dizaine.",
    exemple: '6 + 4 = 10',
    faits: range(0, 10).map((n) => add(n, 10 - n)),
  },
  {
    id: 'N', titre: "L'opération inverse (10)", court: '10 − ?', op: '-',
    regle: "Il s'agit de reconnaître les termes d'une addition pour résoudre la soustraction qui y est associée (opérations inverses).",
    exemple: '10 − 4 = 6',
    faits: range(0, 10).map((n) => sub(10, n)),
  },
  {
    id: 'O', titre: '10 de plus', court: '+ 10', op: '+',
    regle: "Lorsqu'on ajoute 10 à un nombre, c'est comme si on ajoutait une dizaine à la position des dizaines tout en conservant le même chiffre à la position des unités.",
    exemple: '1 + 10 = 11',
    faits: [...range(0, 10).map((n) => add(n, 10)), ...range(0, 9).map((n) => add(10, n))],
  },
  {
    id: 'P', titre: '10 de moins', court: '− 10', op: '-',
    regle: "Lorsqu'on enlève 10 à un nombre, c'est comme si on enlevait une dizaine à la position des dizaines tout en conservant le même chiffre à la position des unités.",
    exemple: '19 − 10 = 9',
    faits: [...range(10, 20).map((n) => sub(n, 10)), ...range(10, 20).map((n) => sub(n, n - 10))],
  },
  {
    id: 'Q', titre: '3 de plus ou 3 de moins', court: '± 3', op: '+',
    regle: "Pour additionner ou soustraire 3 à un nombre, on part de ce nombre et on ajoute ou retranche 3 en comptant sur nos doigts. L'enfant doit partir du plus grand nombre, peu importe l'ordre des nombres additionnés.",
    exemple: '3 + 5 = 8 devient 5 + 3 = 8',
    faits: [
      ...range(0, 10).map((n) => add(n, 3)), ...range(0, 10).map((n) => add(3, n)),
      ...range(3, 13).map((n) => sub(n, 3)), ...range(3, 13).map((n) => sub(n, n - 3)),
    ],
  },
  {
    id: 'R', titre: 'Les presque doubles (additions)', court: 'presque doubles +', op: '+',
    regle: "On fait comme si les deux termes étaient jumeaux et on ajoute 1.",
    exemple: 'dans 4 + 5, on y voit 4 + 4 = 8 et 8 + 1 = 9',
    faits: [...range(0, 9).map((n) => add(n, n + 1)), ...range(0, 9).map((n) => add(n + 1, n))],
  },
  {
    id: 'S', titre: 'Les presque doubles (soustractions)', court: 'presque doubles −', op: '-',
    regle: "On fait comme si les deux termes étaient jumeaux et on enlève 1.",
    exemple: 'dans 11 − 6, on y voit 12 − 6 = 6 et 6 − 1 = 5',
    faits: [
      ...range(0, 9).map((n) => sub(2 * n + 1, n)),
      ...range(0, 9).map((n) => sub(2 * n + 1, n + 1)),
    ],
  },
  {
    id: 'T', titre: 'Former des dizaines', court: 'faire une dizaine', op: '+',
    regle: "Pour additionner deux termes dont la somme est supérieure à 10, on enlève au deuxième terme ce qui manque au premier pour former une dizaine. Puis on ajoute à la dizaine ce qui reste du 2e terme.",
    exemple: '9 + 6 = 15 devient (9 + 1) + 5 = 15',
    faits: [
      ...range(1, 10).map((n) => add(9, n)),
      ...range(2, 10).map((n) => add(8, n)),
    ],
  },
];

// Le cahier imprime certains faits dans les deux colonnes (1 + 1 dans « +1 »,
// 2 + 2 dans « +2 », 20 − 10 dans « −10 »...). On les dédoublonne: sinon ces
// faits-là sortiraient deux fois plus souvent que les autres à la pratique.
for (const s of STRATEGIES) {
  const vus = new Set();
  s.faits = s.faits.filter((f) => {
    const cle = `${f.a}${f.op}${f.b}`;
    if (vus.has(cle)) return false;
    vus.add(cle);
    return true;
  });
}

export const strategieById = (id) => STRATEGIES.find((s) => s.id === id) || null;

// Semaine de classe (lundi) → stratégies à l'étude.
// CONFIRMÉ: semaine du 21 sept. 2026 = « Stratégies CD » (feuille de devoirs).
// Avant et après = estimation (2 lettres par semaine), à corriger à chaque
// nouvelle feuille.
export const STRATEGIE_SEMAINES = [
  { debut: [2026, 9, 14], ids: ['A', 'B'] },
  { debut: [2026, 9, 21], ids: ['C', 'D'], confirme: true },
  { debut: [2026, 9, 28], ids: ['E', 'F'] },
  { debut: [2026, 10, 5], ids: ['G', 'H'] },
  { debut: [2026, 10, 13], ids: ['I', 'J'] },
  { debut: [2026, 10, 19], ids: ['K', 'L'] },
  { debut: [2026, 10, 26], ids: ['M', 'N'] },
  { debut: [2026, 11, 2], ids: ['O', 'P'] },
  { debut: [2026, 11, 9], ids: ['Q'] },
  { debut: [2026, 11, 16], ids: ['R', 'S'] },
  { debut: [2026, 11, 23], ids: ['T'] },
];

const dateOf = ([y, m, d]) => new Date(y, m - 1, d);

function semaineIndex(date) {
  let idx = -1;
  STRATEGIE_SEMAINES.forEach((w, i) => { if (dateOf(w.debut) <= date) idx = i; });
  return idx;
}

// Les stratégies travaillées en classe cette semaine
export function strategiesCetteSemaine(date = new Date()) {
  const i = semaineIndex(date);
  const w = i >= 0 ? STRATEGIE_SEMAINES[i] : STRATEGIE_SEMAINES[0];
  return w.ids.map(strategieById).filter(Boolean);
}

// Toutes celles déjà vues — le répertoire se construit en s'empilant
export function strategiesVues(date = new Date()) {
  const i = semaineIndex(date);
  if (i < 0) return STRATEGIE_SEMAINES[0].ids.map(strategieById);
  return STRATEGIE_SEMAINES.slice(0, i + 1)
    .flatMap((w) => w.ids)
    .map(strategieById)
    .filter(Boolean);
}

// Écriture d'un fait: « 12 − 6 = 6 »
export const ecrireFait = (f) => `${f.a} ${f.op} ${f.b} = ${f.r}`;
export const ecrireQuestion = (f) => `${f.a} ${f.op} ${f.b}`;
