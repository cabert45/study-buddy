// What's new — log of feature releases shown in-app
// When `id` is new (not in localStorage seen list), notification fires.

export const whatsNew = [
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
