// Skin actif = attribut data-skin sur <html> (voir src/skins.css).
// Pour l'instant choisi selon le profil; avec les comptes, il sera enregistré
// sur le profil de l'enfant et choisi dans « Choisis ton style ».

export function skinForProfile(profile) {
  if (!profile) return null;
  if (profile === 'cayla' || String(profile).startsWith('invite-')) return 'secondaire';
  return null;
}

export function applySkin(skin) {
  try {
    const el = document.documentElement;
    if (skin) el.dataset.skin = skin;
    else delete el.dataset.skin;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      if (!meta.dataset.default) meta.dataset.default = meta.getAttribute('content') || '';
      meta.setAttribute('content', skin === 'indigo' ? '#f6f7fb' : meta.dataset.default);
    }
  } catch {}
}
