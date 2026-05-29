// Ryan's school test results — manually captured from physical tests.
// Used by TestResults.jsx to give the parent a quick scorecard view
// alongside the in-app progress charts.

export const testResults = [
  // ===== WEEK ENDING MAY 25 (captured 2026-05-28) =====
  { date: '2026-05-25', subject: 'français', test: "L'apostrophe", score: 8.8, total: 9, teacherNote: 'Excellent', tag: 'win' },
  { date: '2026-05-25', subject: 'math', test: 'Terme manquant (calcul rapide)', score: 18, total: 20, teacherNote: 'Excellent', tag: 'win' },
  { date: '2026-05-25', subject: 'français', test: 'Biographie + Mots savants Jean Rostand', score: 15.8, total: 20, teacherNote: 'Bon travail — mots savants 8/8 PARFAIT', tag: 'win' },
  { date: '2026-05-25', subject: 'français', test: 'M devant B/M/P', score: 7, total: 8, teacherNote: 'Bon — comcombre wrong', tag: 'ok' },
  { date: '2026-05-25', subject: 'français', test: 'Accord adjectif après ÊTRE', score: 5, total: 7, teacherNote: 'Bon travail — swapped noires/ronds', tag: 'ok' },
  { date: '2026-05-25', subject: 'français', test: 'Finir au présent (3e groupe)', score: 6, total: 10, teacherNote: 'finissont/finissonts errors', tag: 'ok' },
  { date: '2026-05-25', subject: 'français', test: 'Futur des verbes ÊTRE & AVOIR', score: 10, total: 13, teacherNote: 'Bon travail — still mixes être/avoir choice', tag: 'ok' },
  { date: '2026-05-25', subject: 'français', test: "Futur de l'indicatif 1 (-er)", score: 9, total: 13.5, teacherNote: 'BIEN — ending errors (rangerez, aimeront)', tag: 'ok' },
  { date: '2026-05-25', subject: 'français', test: 'Compréhension lecture — "Un maringouin végétarien"', score: 9.75, total: 16, teacherNote: 'Format identique à examen 5 juin', tag: 'exam-prep' },
  { date: '2026-05-25', subject: 'math', test: 'Fractions reconnaître (1/2, 1/3, 1/4)', score: 9.5, total: 12, teacherNote: 'Bon travail', tag: 'ok' },
  { date: '2026-05-25', subject: 'math', test: 'Sens × et ÷ (groupes égaux, partage)', score: 7, total: 10, teacherNote: 'Word problems weak', tag: 'ok' },
  { date: '2026-05-25', subject: 'univers', test: 'Univers social Thème 1 — Ensemble c\'est mieux', score: 7, total: 10, teacherNote: 'règles/droits confusion', tag: 'ok' },
  { date: '2026-05-25', subject: 'univers', test: 'Univers social Thème 4 — Je suis comme je suis', score: 6, total: 10, teacherNote: 'bébés/différentes confusion', tag: 'ok' },
  { date: '2026-05-25', subject: 'oral', test: 'Présentation orale (insecte)', score: 15.5, total: 25, teacherNote: 'Bel effort mais oublié infos, débit', tag: 'ok' },
  { date: '2026-05-25', subject: 'math', test: 'Passé composé (auxiliaire + p.p.)', score: 9, total: 17, teacherNote: 'Reste concentré!! 0/3 conjugant infinitif', tag: 'weak' },
  { date: '2026-05-25', subject: 'math', test: 'Addition 3 chiffres avec échange', score: 7.25, total: 14, teacherNote: 'À pratiquer — answers right mais illustrations sales', tag: 'weak' },
  { date: '2026-05-25', subject: 'math', test: 'Probabilité (certain/possible/impossible)', score: 6.5, total: 13, teacherNote: 'À pratiquer', tag: 'weak' },
  { date: '2026-05-25', subject: 'math', test: 'Calcul rapide ±9/±10 (3 chiffres)', score: 12, total: 30, teacherNote: 'À pratiquer — 2e essai aussi 12/30 — speed!', tag: 'critical' },

  // ===== WEEK ENDING MAY 8 (captured earlier) =====
  { date: '2026-05-08', subject: 'math', test: 'Calcul rapide ±9/±10 (1-2 chiffres)', score: 29, total: 30, teacherNote: 'Excellent (small numbers)', tag: 'win' },
  { date: '2026-05-08', subject: 'math', test: 'Pluriel des noms', score: 16, total: 20, teacherNote: '', tag: 'ok' },
  { date: '2026-05-08', subject: 'français', test: 'Lettre muette', score: 13, total: 14, teacherNote: '', tag: 'win' },
  { date: '2026-05-08', subject: 'math', test: 'Diagrammes/tableaux (test 1)', score: 1, total: 7, teacherNote: 'À pratiquer — légendes manquantes', tag: 'critical' },
  { date: '2026-05-08', subject: 'math', test: 'Diagrammes/tableaux (test 2)', score: 4.33, total: 14, teacherNote: 'À pratiquer — fin de semaine vocab', tag: 'weak' },

  // ===== EARLIER 3e TRIMESTRE =====
  { date: '2026-05-01', subject: 'math', test: 'Situation-problèmes', score: 2.95, total: 11, teacherNote: 'À pratiquer', tag: 'critical' },
  { date: '2026-05-01', subject: 'français', test: 'Adjectif féminin', score: 1, total: 4, teacherNote: 'À pratiquer', tag: 'weak' },
  { date: '2026-04-15', subject: 'français', test: 'Dictée Thème 5', score: 3, total: 10, teacherNote: 'À pratiquer', tag: 'weak' },
  { date: '2026-04-10', subject: 'math', test: 'Addition avec retenue', score: 1, total: 8, teacherNote: 'À pratiquer', tag: 'critical' },
  { date: '2026-04-10', subject: 'math', test: 'Chaînes relationnelles', score: 0, total: 5, teacherNote: 'À pratiquer', tag: 'critical' },
  { date: '2026-04-05', subject: 'math', test: 'Situation-problèmes (1er)', score: 3, total: 12, teacherNote: 'À pratiquer', tag: 'critical' },
];

// Tag → color map for UI
export const TAG_STYLES = {
  win:        { bg: '#d1fae5', border: '#10b981', text: '#065f46', label: '🏆 Win' },
  ok:         { bg: '#fef3c7', border: '#f59e0b', text: '#78350f', label: '✓ OK' },
  weak:       { bg: '#fef0e4', border: '#c74a15', text: '#9a3a10', label: '⚠ Faible' },
  critical:   { bg: '#fce8ec', border: '#c74a60', text: '#a02a45', label: '🔴 Critique' },
  'exam-prep':{ bg: '#e8eef8', border: '#3a5bc7', text: '#2a3f8a', label: '📚 Examen' },
};

export const SUBJECT_LABELS = {
  math: '🧮 Math',
  français: '📝 Français',
  univers: '🌍 Univers social',
  oral: '🎤 Oral',
};
