// Mode invité — pour un·e camarade de classe de Cayla (secondaire 1, Collège Laval).
//
// Lien: https://<app>/laval  → l'appareil passe en mode invité:
//   - ne voit JAMAIS l'écran des profils de la famille (Ryan, Cayla, Nyla), ni journal,
//     tableau de bord, famille, notifications de la famille
//   - voit seulement les modules de secondaire 1 (Univers social, Sciences, Verbes)
//   - progrès anonyme: profil « invite-xxxxxxxx » propre à l'appareil, aucun nom demandé
// Pour sortir du mode invité sur un appareil de la famille: ouvrir https://<app>/famille
//
// Solution temporaire (13-14 sept. 2026) en attendant de vrais comptes parent/enfant.

const GUEST_KEY = 'sb_guest';
const PROFILE_KEY = 'sb_profile';

function randomId() {
  try { return crypto.randomUUID().replace(/-/g, '').slice(0, 8); }
  catch { return Math.random().toString(36).slice(2, 10); }
}

// À appeler une fois au démarrage, avant le premier rendu
export function initGuestFromUrl() {
  try {
    const path = window.location.pathname.replace(/\/+$/, '').toLowerCase();
    if (path === '/laval' || path === '/invite') {
      localStorage.setItem(GUEST_KEY, 'laval-sec1');
      const cur = localStorage.getItem(PROFILE_KEY) || '';
      if (!cur.startsWith('invite-')) localStorage.setItem(PROFILE_KEY, `invite-${randomId()}`);
      // On garde /laval dans l'adresse: un favori ou un rechargement reste en mode invité
    } else if (path === '/famille') {
      localStorage.removeItem(GUEST_KEY);
      if ((localStorage.getItem(PROFILE_KEY) || '').startsWith('invite-')) localStorage.removeItem(PROFILE_KEY);
      window.history.replaceState(null, '', '/');
    }
  } catch {}
}

export function isGuest() {
  try { return !!localStorage.getItem(GUEST_KEY); } catch { return false; }
}

export function guestProfile() {
  try {
    let p = localStorage.getItem(PROFILE_KEY) || '';
    if (!p.startsWith('invite-')) { p = `invite-${randomId()}`; localStorage.setItem(PROFILE_KEY, p); }
    return p;
  } catch { return 'invite-anon'; }
}
