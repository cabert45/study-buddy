// L'avancement du chemin du jour, gardé sur l'appareil.
//
// Pourquoi ça existe: « Commencer » ouvre l'exercice et QUITTE le Coach. Au
// retour, le plan se reconstruisait et le chemin repartait du départ — donc
// impossible de finir ses trois cases en une journée. Les cases sont écrites
// ici avec la date du jour: demain, la liste repart vide toute seule.
//
// TROIS ÉTATS, PAS DEUX (26 sept. 2026). Le parent: « s'il a fini quelque
// chose, je ne veux pas que le système le fasse recommencer; il doit savoir ce
// que Ryan a commencé sans finir, ou ce qu'il a fini. »
//
// Avant, une case était cochée au moment où l'exercice s'OUVRAIT. Deux
// conséquences, aussi mauvaises l'une que l'autre: s'il abandonnait après deux
// questions, l'app le comptait comme fait et passait à la suite; et une case
// « faite » ne pouvait plus être reprise.
//
//   commence  il l'a ouvert, il n'a pas terminé  → on peut REPRENDRE
//   fini      la série est allée jusqu'au bout   → on passe à la suite
//   (absent)  pas encore touché
const ETATS = ['commence', 'fini'];

function cleDuJour(profile, date = new Date()) {
  const jour = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return `sb_coach_fait_${profile}_${jour}`;
}

// Ancien format: un tableau d'index terminés ([0, 1, 2]). On le relit comme
// « tout fini », sinon un enfant à mi-journée verrait son chemin se vider.
function normaliser(brut) {
  if (Array.isArray(brut)) {
    const m = {};
    brut.forEach((i) => { if (Number.isInteger(i) && i >= 0) m[i] = 'fini'; });
    return m;
  }
  if (brut && typeof brut === 'object') {
    const m = {};
    for (const [k, v] of Object.entries(brut)) {
      if (ETATS.includes(v) && /^\d+$/.test(k)) m[k] = v;
    }
    return m;
  }
  return {};
}

export function chargerAvancement(profile) {
  try {
    return normaliser(JSON.parse(localStorage.getItem(cleDuJour(profile)) || '{}'));
  } catch {
    return {};
  }
}

export function sauverAvancement(profile, etats) {
  try { localStorage.setItem(cleDuJour(profile), JSON.stringify(etats || {})); } catch {}
}

// Marquer une case. Une case FINIE ne redevient jamais « commencée »: s'il
// rouvre un exercice déjà terminé pour le plaisir, ça ne doit pas défaire son
// travail de la journée.
export function marquerEtape(profile, index, etat) {
  if (!ETATS.includes(etat)) return chargerAvancement(profile);
  const etats = chargerAvancement(profile);
  if (etats[index] === 'fini' && etat === 'commence') return etats;
  etats[index] = etat;
  sauverAvancement(profile, etats);
  return etats;
}

export const estFini = (etats, i) => etats?.[i] === 'fini';
export const estCommence = (etats, i) => etats?.[i] === 'commence';

// Combien de cases ont été TERMINÉES aujourd'hui — pour l'accueil.
export function coachFaitAujourdhui(profile) {
  return Object.values(chargerAvancement(profile)).filter((v) => v === 'fini').length;
}

// Où le chemin s'ouvre: la première case PAS FINIE, dans l'ordre. Si c'est une
// case commencée, il la reprend là où il en était plutôt que d'en ouvrir une
// neuve — et il reste libre d'en toucher une autre, toutes sont cliquables.
export function prochaineEtape(etats, total) {
  for (let i = 0; i < total; i++) if (etats[i] !== 'fini') return i;
  return total;
}
