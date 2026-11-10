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
    // Pages 6 à 18 photographiées le 19 oct. (les p. 19-20 manquent).
    date: [2026, 10, 22], jours: 4,
    nom: "Test d'univers social",
    mode: 'us_iroquoiens',
    label: 'Univers social — les Iroquoiens vers 1500',
    icon: '🗺️',
    source: 'Terminus, p. 6 à 20',
  },
  {
    // Plan du 26 au 30 oct.: « Univers social — Révision: pages 6 à 20 », et
    // « Devoir plus évaluations ». La date de l'évaluation n'est pas écrite:
    // `revision: true` = on révise toute la semaine, SANS compte à rebours
    // (un « c'est vendredi » inventé lui mentirait).
    date: [2026, 10, 30], jours: 4, revision: true,
    nom: "Révision d'univers social",
    mode: 'us_iroquoiens',
    label: 'Univers social — révision Terminus p. 6 à 20',
    icon: '🗺️',
    source: 'Terminus, p. 6 à 20',
  },
  {
    // « Évaluation en mathématique » de la feuille du 2 au 6 nov. — passée le
    // mercredi 4 (dit par le parent le jour même). Déjà passée: elle marque le
    // jour dans l'agenda, le Coach ne la révise plus.
    date: [2026, 11, 4], jours: 0, passe: true,
    nom: 'Évaluation de mathématiques',
    mode: 'matcha_ordre',
    label: "Maths — l'arrondissement et l'approximation",
    icon: '🧮',
    source: 'Aide-mémoire Matcha p. 16-17',
  },
  {
    // Plan du 2 au 6 nov.: « Univers social — Révision: pages 6 à 20 » et
    // « Évaluation en univers social ». Toujours sans date écrite → révision
    // sans compte à rebours.
    date: [2026, 11, 6], jours: 4, revision: true,
    nom: "Évaluation d'univers social",
    mode: 'us_iroquoiens',
    label: 'Univers social — évaluation, Terminus p. 6 à 20',
    icon: '🗺️',
    source: 'Terminus, p. 6 à 20',
  },
  // ===== Feuille du 9 au 13 novembre 2026 =====
  {
    date: [2026, 11, 9], jours: 0, passe: true,
    nom: "Évaluation d'étape de mathématiques (thèmes 1 et 2)",
    mode: 'matcha_revision',
    label: 'Maths — évaluation d’étape, thèmes 1 et 2',
    icon: '🧮',
    source: 'Matcha, thèmes 1 et 2',
  },
  {
    // « Évaluation du cahier: Éclair de génie (pages 13 à 20) ». L'app n'a que
    // les p. 3 à 12 (sciences_queue): sans mode, le Coach en fait une étape
    // papier — relire les pages avec lui — en attendant les photos.
    date: [2026, 11, 11], jours: 3,
    nom: 'Évaluation de sciences',
    label: 'Sciences — relire Éclair de génie p. 13 à 20',
    icon: '🔬',
    source: 'Éclair de génie, p. 13 à 20',
  },
  {
    // « Évaluation d'univers social (Terminus pages 13 à 22) ». us_iroquoiens
    // couvre les p. 13 à 18; les p. 19 à 22 n'ont jamais été photographiées.
    date: [2026, 11, 12], jours: 4,
    nom: "Évaluation d'univers social",
    mode: 'us_iroquoiens',
    label: 'Univers social — Terminus p. 13 à 22',
    icon: '🗺️',
    source: 'Terminus, p. 13 à 22',
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
    // Déjà passé (dit par le parent): on ne le révise plus, même le jour même.
    if (t.passe) return;
    if (reste < 0 || reste > t.jours) return;
    if (!trouve || reste < trouve.reste) trouve = { ...t, reste };
  });
  return trouve;
}

// TOUS les tests à réviser, du plus proche au plus loin — sans celui du jour
// (le jour même, on ne révise plus). Feuille du 9 nov.: sciences le mercredi
// ET univers social le jeudi. Avec un seul test à la fois, le plus proche
// cachait l'autre, et le mercredi (sciences « aujourd'hui ») il n'en restait
// aucun: l'univers social n'aurait été révisé que... le jeudi même.
export function testsAReviser(date = new Date()) {
  const ref = refScolaire(date);
  const jour = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  return TESTS
    .filter((t) => !t.passe)
    .map((t) => ({ ...t, reste: Math.round((dateOf(t.date) - jour) / 86400000) }))
    .filter((t) => t.reste > 0 && t.reste <= t.jours)
    .sort((a, b) => a.reste - b.reste);
}

// « c'est jeudi », « c'est demain », « dans 3 jours »
export function quandLeTest(reste) {
  if (reste === 0) return "c'est aujourd'hui";
  if (reste === 1) return "c'est demain";
  return `dans ${reste} jours`;
}
