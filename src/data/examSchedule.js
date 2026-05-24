// End-of-year exam schedule (Mme Bertheau, 2e année 2025-2026)
// Shared between Coach (planning) and Agenda (visualization)

export const EXAMS = [
  {
    name: 'Rédaction',
    date: new Date(2026, 4, 27), // mercredi 27 mai
    icon: '✍️',
    cahier: 'Pomélo p.13, 26-27',
    modes: [
      { mode: 'histoire', label: "Parties d'une histoire (rédaction)", icon: '📖' },
      { mode: 'present_indicatif', label: 'Présent 1er groupe (rédaction)', icon: '✏️' },
    ],
  },
  {
    name: 'Résolution de problèmes',
    date: new Date(2026, 5, 3), // mercredi 3 juin
    icon: '🧩',
    cahier: 'Nougat p.3, 23',
    modes: [
      { mode: 'multi_step', label: 'Problèmes à étapes', icon: '🧩' },
      { mode: 'terme', label: 'Terme manquant', icon: '➕' },
      { mode: 'relational', label: 'De plus / de moins', icon: '⚖️' },
    ],
  },
  {
    name: 'Compréhension de lecture',
    date: new Date(2026, 5, 5), // vendredi 5 juin
    icon: '📖',
    cahier: 'Pomélo p.26-27',
    modes: [
      { mode: 'comprehension', label: 'Compréhension — lis et réponds', icon: '📖' },
    ],
  },
  {
    name: "Test math (toute l'année)",
    date: new Date(2026, 5, 8), // lundi 8 juin
    icon: '🧮',
    cahier: 'Nougat p.6-48',
    modes: [
      { mode: 'fractions', label: 'Fractions', icon: '🍕' },
      { mode: 'mult_div', label: 'Sens × et ÷', icon: '✖️' },
      { mode: 'suites', label: 'Suites & régularités', icon: '🔢' },
      { mode: 'representer', label: 'Représenter un nombre', icon: '📏' },
      { mode: 'figures', label: 'Figures & solides', icon: '⬜' },
      { mode: 'mesure', label: 'Mesure en cm', icon: '📐' },
      { mode: 'calcul', label: '+ 3 chiffres (avec échange)', icon: '🔢' },
      { mode: 'pair_impair', label: 'Pair / Impair', icon: '🎯' },
      { mode: 'statistique', label: 'Diagrammes & tableaux', icon: '📊' },
    ],
  },
  {
    name: 'Anglais',
    date: new Date(2026, 5, 10), // mercredi 10 juin
    icon: '🇬🇧',
    cahier: 'Cahier anglais',
    modes: [
      { mode: 'english_oral', label: 'Days, months, seasons', icon: '🌎' },
    ],
  },
];

// Dictée Theme 7 — Ryan's class cycles S1→S4 every Tuesday starting 26 mai
export const DICTEE_T7_START = new Date(2026, 4, 26);

export const DICTEE_WEEKS = [
  { mode: 'dictee_s1', short: 'S1', label: 'Consonnes doubles', preview: 'arroser, carotte, mettre, patte, cannelle...' },
  { mode: 'dictee_s2', short: 'S2', label: 'Lettre muette (féminin)', preview: 'bas/basse, charmant/charmante, haut/haute...' },
  { mode: 'dictee_s3', short: 'S3', label: 's muet final', preview: 'alors, jamais, parfois, toujours...' },
  { mode: 'dictee_s4', short: 'S4', label: "Ne s'écrit pas comme prononcé", preview: 'automne, femme, monsieur, soixante...' },
];

export function dicteeWeekForDate(d) {
  const days = Math.floor((d - DICTEE_T7_START) / 86400000);
  const idx = Math.max(0, Math.min(3, Math.floor(days / 7)));
  return { ...DICTEE_WEEKS[idx], idx };
}

export function daysBetween(a, b) {
  const ms = new Date(b.getFullYear(), b.getMonth(), b.getDate())
           - new Date(a.getFullYear(), a.getMonth(), a.getDate());
  return Math.round(ms / 86400000);
}

// Helper: French day-of-week + date label
export function frDateLabel(d) {
  const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}
