// Mode invité — pour un·e camarade de classe de Cayla (secondaire 1, Collège Laval).
//
// Lien: https://<app>/laval  → l'appareil passe en mode invité:
//   - ne voit JAMAIS l'écran des profils de la famille (Ryan, Cayla, Nyla), ni journal,
//     tableau de bord, famille, notifications de la famille
//   - voit seulement les modules de secondaire 1 (Univers social, Sciences, Verbes)
//   - progrès anonyme: profil « invite-xxxxxxxx » propre à l'appareil, aucun nom demandé
// Pour sortir du mode invité sur un appareil de la famille: ouvrir https://<app>/famille
// (ou /family, /sortie: le 26 sept. 2026 l'adresse a été tapée en anglais sur le PC de
//  la maison, aucune porte ne s'est ouverte, et l'écran des camarades est resté collé.)
//
// Solution temporaire (13-14 sept. 2026) en attendant de vrais comptes parent/enfant.

const GUEST_KEY = 'sb_guest';
const PROFILE_KEY = 'sb_profile';
// Un appareil où quelqu'un a déjà ouvert un profil de la famille reste un appareil
// de la famille: /laval s'y affiche pour la visite en cours seulement (onglet), puis
// « / » revient aux profils. Sinon le lien des camarades restait collé sur nos appareils.
const FAMILY_KEY = 'sb_family_device';
const SESSION_KEY = 'sb_guest_session';
// Les adresses qui ramènent un appareil à la famille. Une seule orthographe ne
// suffit pas: on tape l'anglais sans y penser, et une porte qui ne s'ouvre pas
// ressemble à une app cassée.
const SORTIES = ['/famille', '/family', '/sortie'];

export function markFamilyDevice() {
  try { localStorage.setItem(FAMILY_KEY, '1'); } catch {}
}

export function isFamilyDevice() {
  try { return localStorage.getItem(FAMILY_KEY) === '1'; } catch { return false; }
}

function randomId() {
  try { return crypto.randomUUID().replace(/-/g, '').slice(0, 8); }
  catch { return Math.random().toString(36).slice(2, 10); }
}

// À appeler une fois au démarrage, avant le premier rendu
export function initGuestFromUrl() {
  try {
    const path = window.location.pathname.replace(/\/+$/, '').toLowerCase();
    if (path === '/laval' || path === '/invite') {
      if (isFamilyDevice()) sessionStorage.setItem(SESSION_KEY, '1'); // visite ponctuelle
      else localStorage.setItem(GUEST_KEY, 'laval-sec1');
      const cur = localStorage.getItem(PROFILE_KEY) || '';
      if (!cur.startsWith('invite-')) localStorage.setItem(PROFILE_KEY, `invite-${randomId()}`);
      // On garde /laval dans l'adresse: un favori ou un rechargement reste en mode invité
    } else if (isFamilyDevice()) {
      // appareil de la famille: toute autre adresse (dont « / ») revient aux profils
      try { sessionStorage.removeItem(SESSION_KEY); } catch {}
      if (SORTIES.includes(path)) {
        localStorage.removeItem(GUEST_KEY);
        if ((localStorage.getItem(PROFILE_KEY) || '').startsWith('invite-')) localStorage.removeItem(PROFILE_KEY);
        window.history.replaceState(null, '', '/');
      }
    } else if (SORTIES.includes(path)) {
      localStorage.removeItem(GUEST_KEY);
      try { sessionStorage.removeItem(SESSION_KEY); } catch {}
      if ((localStorage.getItem(PROFILE_KEY) || '').startsWith('invite-')) localStorage.removeItem(PROFILE_KEY);
      window.history.replaceState(null, '', '/');
    }
  } catch {}
}

// Sortie du mode invité depuis l'app (appareil de la famille ouvert sur /laval par erreur).
// Déclenchée en touchant 5 fois le logo de l'accueil invité, puis en tapant « famille ».
export function leaveGuestMode() {
  try {
    localStorage.removeItem(GUEST_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    if ((localStorage.getItem(PROFILE_KEY) || '').startsWith('invite-')) localStorage.removeItem(PROFILE_KEY);
  } catch {}
  window.location.replace('/');
}

export function isGuest() {
  try { return !!localStorage.getItem(GUEST_KEY) || sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; }
}

// Compteur anonyme: « open » une fois par chargement de l'app, puis chaque module ouvert
let openedPinged = false;
export function pingGuest(event) {
  if (!isGuest()) return;
  if (event === 'open') { if (openedPinged) return; openedPinged = true; }
  try {
    fetch('/api/guest/ping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: guestProfile(), event }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

export function guestProfile() {
  try {
    let p = localStorage.getItem(PROFILE_KEY) || '';
    if (!p.startsWith('invite-')) { p = `invite-${randomId()}`; localStorage.setItem(PROFILE_KEY, p); }
    return p;
  } catch { return 'invite-anon'; }
}
