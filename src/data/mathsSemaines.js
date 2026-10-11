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

// « 📘 Cahier Matcha — la mesure du temps et l'heure (p. 12-13) »
export function labelMaths(m) {
  if (!m) return '📘 Cahier Matcha';
  return `📘 Cahier Matcha — ${m.nom}${m.page ? ` (${m.page})` : ''}`;
}
