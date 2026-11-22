// La leçon de maths de la semaine — ligne « Mathématiques » de la feuille de
// Mme Haidar, avec sa page dans l'Aide-mémoire Matcha.
//
// Pourquoi ce fichier existe: le Coach annonçait « Cahier Matcha — la
// décomposition et la valeur de position » en dur, tous les jours, pour
// toujours. C'était vrai la semaine du 28 septembre et faux la semaine
// suivante. Le français suivait déjà la feuille (la liste, les stratégies, le
// module Jazz); les maths, non — le seul créneau de l'heure quotidienne qui
// ne savait pas quelle semaine on était.
//
// Même règle que les trois autres calendriers: `confirme: true` = lu sur la
// feuille papier. Sans ça, c'est une estimation, et c'est la feuille qui
// tranche (voir docs/passation-ryan.md).
import { refScolaire } from '../utils/semaineScolaire';

export const MATHS_SEMAINES = [
  {
    debut: [2026, 9, 21], mode: 'matcha_nombres', confirme: true,
    nom: 'la comparaison des nombres', page: 'p. 8',
  },
  {
    debut: [2026, 9, 28], mode: 'matcha_nombres', confirme: true,
    nom: 'la décomposition et la valeur de position', page: 'p. 9',
  },
  {
    // Aucune feuille pour cette semaine-là: on reste sur le cahier.
    debut: [2026, 10, 5], mode: 'matcha_nombres',
    nom: 'la décomposition et la valeur de position', page: 'p. 9',
  },
  {
    // Feuille « Du 12 au 16 octobre 2026 »: « Mathématiques: La mesure du
    // temps et l'heure · Aide-mémoire Matcha p.12-13 ».
    debut: [2026, 10, 12], mode: 'heure', confirme: true,
    nom: "la mesure du temps et l'heure", page: 'p. 12-13',
  },
  {
    // Feuille « Du 19 au 23 octobre 2026 »: « Mathématiques: L'ordre des
    // nombres · Aide-mémoire Matcha p.14 ».
    debut: [2026, 10, 19], mode: 'matcha_ordre', confirme: true,
    nom: "l'ordre des nombres", page: 'p. 14',
  },
  {
    // Plan du 26 au 30 oct.: « Consolidation des notions abordées depuis le
    // début de l'année » + évaluations. Un mélange de tout le Matcha vu,
    // pondéré par SES erreurs (voir matcha_revision dans PracticeSession).
    debut: [2026, 10, 26], mode: 'matcha_revision', confirme: true,
    nom: 'révision de tout depuis septembre', page: '',
  },
  {
    // Feuille du 2 au 6 nov.: « Mathématiques: Aide-mémoire p. 16 et 17 » +
    // une évaluation. Le parent, le 28 oct.: en classe, la page de Matcha est
    // « L'arrondissement et l'approximation » (et les fractions viennent
    // après). matcha_ordre porte l'arrondi et ses exercices n° 7, 8, 10, 12.
    debut: [2026, 11, 2], mode: 'matcha_ordre', confirme: true,
    nom: "l'arrondissement et l'approximation", page: 'p. 16-17',
  },
  {
    // Feuille du 9 au 13 nov.: « Consolidation des notions étudiées dans les
    // thèmes 1 et 2 » · « Révision du thème (pages 90 à 93) ». L'évaluation
    // d'étape (thèmes 1 et 2) était le LUNDI 9 — déjà passée.
    debut: [2026, 11, 9], mode: 'matcha_revision', confirme: true,
    nom: 'consolidation des thèmes 1 et 2', page: 'p. 90 à 93',
  },
  {
    // Feuille du 16 au 20 nov.: « La soustraction de grands nombres:
    // aide-mémoire Matcha p. 22 » puis « le sens de la multiplication:
    // aide-mémoire Matcha p. 23 ». Deux leçons dans la semaine, dans cet
    // ordre: la p. 22 jusqu'au mardi, la p. 23 à partir du mercredi
    // (`ensuite`). L'agenda montre les deux.
    debut: [2026, 11, 16], mode: 'soustraction_grands', confirme: true,
    nom: 'la soustraction de grands nombres, puis le sens de la multiplication', page: 'p. 22-23',
    jour: { nom: 'la soustraction de grands nombres', page: 'p. 22' },
    ensuite: { desJour: 3, mode: 'sens_multiplication', nom: 'le sens de la multiplication', page: 'p. 23' },
  },
  {
    // Feuille du 23 au 27 nov.: « Consolidation du sens de la multiplication.
    // Le sens de la division: aide-mémoire Matcha p. 24 ». La consolidation
    // le dimanche et le lundi, la division (nouvelle) à partir du mardi.
    debut: [2026, 11, 23], mode: 'sens_division', confirme: true,
    nom: 'consolidation de la multiplication, puis le sens de la division', page: 'p. 23-24',
    jour: { mode: 'sens_multiplication', nom: 'consolidation du sens de la multiplication', page: 'p. 23' },
    ensuite: { desJour: 2, mode: 'sens_division', nom: 'le sens de la division', page: 'p. 24' },
  },
];

const dateOf = ([y, m, d]) => new Date(y, m - 1, d);

function semaineIndex(rawDate) {
  const date = refScolaire(rawDate);
  let idx = -1;
  MATHS_SEMAINES.forEach((w, i) => { if (dateOf(w.debut) <= date) idx = i; });
  return idx;
}

export function mathsCetteSemaine(date = new Date()) {
  const i = semaineIndex(date);
  return i >= 0 ? MATHS_SEMAINES[i] : MATHS_SEMAINES[0];
}

// La leçon du JOUR, quand la semaine en a deux (feuille du 16 nov.: p. 22 au
// début de la semaine, p. 23 à partir du mercredi). Le dimanche prépare le
// lundi; le samedi garde la 2e leçon.
export function mathsDuJour(date = new Date()) {
  const m = mathsCetteSemaine(date);
  if (!m.ensuite) return m;
  const j = date.getDay();
  const deuxieme = j === 6 || (j >= m.ensuite.desJour && j <= 5);
  return deuxieme
    ? { ...m, mode: m.ensuite.mode, nom: m.ensuite.nom, page: m.ensuite.page }
    : { ...m, ...(m.jour || {}) };
}

// « 📘 Cahier Matcha — la mesure du temps et l'heure (p. 12-13) »
export function labelMaths(m) {
  if (!m) return '📘 Cahier Matcha';
  return `📘 Cahier Matcha — ${m.nom}${m.page ? ` (${m.page})` : ''}`;
}
