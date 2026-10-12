// Les journées sans école — celles qui sont CONFIRMÉES sur une feuille.
//
// Même règle que le reste du calendrier (voir data/cahierFrancais): on
// n'invente pas une journée pédagogique. Tant qu'elle n'est pas écrite sur une
// feuille de l'enseignante ou dans l'agenda, elle n'est pas ici.
//
// Un congé ne retire pas le travail du jour: le parent demande 1 h par jour,
// tous les jours (voir la mémoire `app-structure-quotidienne`). Il sert à
// expliquer la semaine courte — et à rappeler qu'une remise peut remonter.
export const CONGES = [
  { date: [2026, 10, 12], nom: 'Congé — Action de grâce' },
];
