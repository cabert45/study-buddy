// Les tests annoncés sur la feuille de devoirs — ceux qui ne reviennent pas
// chaque semaine (la dictée, elle, est déjà dans le plan).
//
// Pourquoi un fichier à part plutôt que `EXAMS` (data/examSchedule): remplir
// `EXAMS` fait basculer le Coach dans la machinerie de 2e année et lui fait
// ABANDONNER le plan de la semaine (la liste, les stratégies, le module Jazz,
// les maths). Voir `EXAMS.length === 0` dans Coach.jsx. Ici, le test vient
// s'AJOUTER au plan de la semaine au lieu de le remplacer.
//
// `jours` = combien de jours avant le test on commence à le réviser.
import { refScolaire } from '../utils/semaineScolaire';

export const TESTS = [
  {
    date: [2026, 10, 15], jours: 4,
    nom: 'Mini-test de sciences',
    mode: 'sciences_queue',
    label: 'Sciences — pourquoi certains animaux ont-ils une queue?',
    icon: '🔬',
    source: 'Éclair de génie, p. 3 à 12',
    // Résultat: 18/20. Ses deux fautes: « garder l'équilibre » pas coché
    // (q. 2), et « tous les animaux ont une colonne vertébrale » = VRAI (q. 3c).
  },
  {
    // Feuille du 19 au 23 oct.: « Révision des pages 6 à 20 dans Terminus,
    // test à venir! » · « 22 octobre: Test d'univers social ».
    // Pas de `mode`: aucune photo de Terminus encore. Le Coach en fait une
    // révision sur papier, cahier ouvert, avec un adulte.
    date: [2026, 10, 22], jours: 4,
    nom: "Test d'univers social",
    label: 'Univers social — relire Terminus p. 6 à 20 avec un adulte',
    icon: '🗺️',
    source: 'Terminus, p. 6 à 20',
  },
];

const dateOf = ([y, m, d]) => new Date(y, m - 1, d);

// Le test le plus proche qui tombe dans sa fenêtre de révision, ou null.
export function testAReviser(date = new Date()) {
  const ref = refScolaire(date);
  const jour = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  let trouve = null;
  TESTS.forEach((t) => {
    const quand = dateOf(t.date);
    const reste = Math.round((quand - jour) / 86400000);
    if (reste < 0 || reste > t.jours) return;
    if (!trouve || reste < trouve.reste) trouve = { ...t, reste };
  });
  return trouve;
}

// « c'est jeudi », « c'est demain », « dans 3 jours »
export function quandLeTest(reste) {
  if (reste === 0) return "c'est aujourd'hui";
  if (reste === 1) return "c'est demain";
  return `dans ${reste} jours`;
}
