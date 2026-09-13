// What's new — log of feature releases shown in-app
// When `id` is new (not in localStorage seen list), notification fires.

export const whatsNew = [
  {
    id: '2026-09-13-ryan-cahier-jazz',
    date: '2026-09-13',
    profile: 'ryan',
    title: 'Tes cahiers Jazz et Matcha sont dans l\'app! 📒📘',
    body: "Nouveau: 📒 Mon cahier Jazz (Français) et 📘 Mon cahier Matcha (Maths). Tu pratiques ce que tu fais en classe cette semaine — le déterminant, les blocs, la valeur de position — avec les trucs du cahier, et tu prends un pas d'avance sur la semaine prochaine. Ton Coach le fait avec toi chaque jour. Une erreur? Try again — c'est comme ça qu'on apprend. 🦁",
  },
  {
    id: '2026-09-13-cayla-univers-social-d1',
    date: '2026-09-13',
    profile: 'cayla',
    title: 'Univers social — Dossier 1: tes 29 mots 🏺',
    body: "Tes mots de vocabulaire sur la sédentarisation sont dans l'app, avec tes notes et tes pastilles. Fais les Cartes (définis chaque mot dans tes mots), puis le Test en choix multiple. Les mots rouges et jaunes passent en premier.",
  },
  {
    id: '2026-09-08-cayla-secondaire-verbes',
    date: '2026-09-08',
    profile: 'cayla',
    title: 'Bienvenue au secondaire! 📗 Verbes avoir & être',
    body: "Ton profil est passé en secondaire 1. Nouveau module: AVOIR et ÊTRE à tous les modes et temps (indicatif, conditionnel, subjonctif, impératif). Lis le tableau, écris les formes comme au test, ou fais du choix multiple. Commence par le niveau 1 (temps simples).",
  },
  {
    id: '2026-09-01-rentree-3e-annee',
    date: '2026-09-01',
    profile: 'ryan',
    title: 'Bonne rentrée — bienvenue en 3e année! 🍁',
    body: "L'app est passée en mode 3e année. Ton Coach a un nouveau plan quotidien (~35 min après l'école) et la fenêtre 📗 3e année regroupe tes exercices. Tes affaires de 2e année sont gardées dans l'onglet archive.",
  },
  {
    id: '2026-05-03-pemdas-adaptive',
    date: '2026-05-03',
    profile: 'cayla',
    title: '25+ nouveaux exercices PEMDAS',
    body: 'J\'ai ajouté des exercices avec parenthèses, exposants, divisions et opérations multiples. L\'app va maintenant t\'envoyer plus de questions sur les types qui te donnent du fil à retordre.',
  },
  {
    id: '2026-05-02-cayla-journal',
    date: '2026-05-02',
    profile: 'cayla',
    title: 'Mon journal',
    body: 'Nouveau! Écris ta gratitude, tes défis et tes améliorations chaque jour. Garde ta série!',
  },
  {
    id: '2026-05-02-flashcards',
    date: '2026-05-02',
    profile: 'all',
    title: 'Flashcards de dictée',
    body: 'Nouveau mode flashcard: tape les mots au lieu de choisir parmi des options. Plus proche du vrai test!',
  },
];

const SEEN_KEY = 'sb_whats_new_seen';

export function getUnseenForProfile(profile) {
  let seen = [];
  try { seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'); } catch {}
  return whatsNew.filter(n =>
    !seen.includes(n.id) && (n.profile === 'all' || n.profile === profile)
  );
}

export function markSeen(id) {
  let seen = [];
  try { seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'); } catch {}
  if (!seen.includes(id)) {
    seen.push(id);
    localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
  }
}

export function markAllSeen(profile) {
  const unseen = getUnseenForProfile(profile);
  unseen.forEach(n => markSeen(n.id));
}
