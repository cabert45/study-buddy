// L'avancement du chemin du jour, gardé sur l'appareil.
//
// Pourquoi ça existe: « Commencer » ouvre l'exercice et QUITTE le Coach. Au
// retour, le plan se reconstruisait et le chemin repartait du départ — donc
// impossible de finir ses trois cases en une journée. Les cases déjà montées
// sont écrites ici, avec la date du jour: demain, la liste repart vide toute
// seule, sans ménage à faire.

function cleDuJour(profile, date = new Date()) {
  const jour = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return `sb_coach_fait_${profile}_${jour}`;
}

export function chargerAvancement(profile) {
  try {
    const v = JSON.parse(localStorage.getItem(cleDuJour(profile)) || '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function sauverAvancement(profile, done) {
  try { localStorage.setItem(cleDuJour(profile), JSON.stringify(done)); } catch {}
}

// Combien de cases ont été montées aujourd'hui — pour l'afficher sur l'accueil.
export function coachFaitAujourdhui(profile) {
  return chargerAvancement(profile).length;
}
