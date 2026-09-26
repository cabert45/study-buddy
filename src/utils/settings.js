import { useEffect, useState } from 'react';
import { setVoicePrefs } from './speech';

// ⚙️ Réglages — demandés par Cayla le 14 sept. 2026: couper la voix, changer
// l'accent, la couleur (rose, bleu, toutes les couleurs de l'arc-en-ciel), la
// mascotte (ours…) et la façon dont les mots sont écrits (police).
//
// Un jeu de réglages par profil (Ryan, Cayla, Nyla, chaque invité), dans le
// localStorage de l'appareil. Les couleurs et polices sont posées en variables
// CSS directement sur <html>: elles passent donc par-dessus :root et les skins
// (skins.css), et tout ce qui lit bg-cream / text-fox-d / var(--sb-grad)… suit.

const KEY = (profile) => `sb_settings_${profile || 'famille'}`;
const EVENT = 'sb-settings';

export const DEFAULT_SETTINGS = {
  muted: false,
  accent: 'auto',  // 'auto' | 'fr-CA' | 'fr-FR' | 'fr-BE' | 'fr-CH'
  voice: '',       // nom exact d'une voix de l'appareil ('' = la meilleure)
  // Voix ElevenLabs: 'auto' = celle du serveur, 'appareil' = la voix de l'iPad,
  // sinon l'identifiant d'une voix (voir /api/tts/voices).
  //
  // Par defaut: Emilie, une voix FRANCAISE (accent neutre, ni quebecois ni
  // parisien). Ce n'etait pas 'auto' par hasard — 'auto' prend la voix du
  // serveur, et celle-la vient du compte partage avec Prepara, qui enseigne
  // l'anglais: ses 22 voix sont anglaises. Elles lisent le francais avec une
  // bouche anglaise, et Nyla entendait « sixe » au lieu de « six ». Nommer la
  // voix ici plutot que de dependre d'ELEVENLABS_VOICE_ID garantit que tous
  // les appareils parlent francais, sans toucher aux variables du deploiement.
  // Chacun peut en changer dans ⚙️ Reglages.
  ttsVoice: 'DmA5Za3LKQf1NQcbHfdZ',
  debit: 'normal',  // 'lente' | 'normal' | 'rapide' — la vitesse de la voix
  color: 'orange',
  mascot: 'default',
  font: 'default',
};

export const DEBITS = [
  { id: 'lente', label: 'Doucement', emoji: '🐢', factor: 0.78 },
  { id: 'normal', label: 'Normal', emoji: '🙂', factor: 1 },
  { id: 'rapide', label: 'Vite', emoji: '🐇', factor: 1.22 },
];

export const ACCENTS = [
  { id: 'auto', label: 'La meilleure', flag: '✨' },
  { id: 'fr-CA', label: 'Québec', flag: '🇨🇦' },
  { id: 'fr-FR', label: 'France', flag: '🇫🇷' },
  { id: 'fr-BE', label: 'Belgique', flag: '🇧🇪' },
  { id: 'fr-CH', label: 'Suisse', flag: '🇨🇭' },
];

// ---- Couleurs ----
// lava/lava-l = boutons et barres; fox = accent; foxD = texte d'accent (lisible sur blanc);
// belly/peach/sand = fonds pâles; cream = fond de la page; hero = grand bandeau foncé.
const P = (swatch, lava, lavaL, fox, foxD, belly, cream, peach, sand, hero, eyebrow, glow1, glow2) =>
  ({ swatch, lava, lavaL, fox, foxD, belly, cream, peach, sand, hero, eyebrow, glow1, glow2 });

export const COLORS = [
  // Les couleurs simples
  { id: 'rouge', label: 'Rouge', ...P('#ef4444', '#b91c1c', '#ef4444', '#dc2626', '#991b1b', '#fee2e2', '#fff5f5', '#fee2e2', '#fecaca', ['#7f1d1d', '#b91c1c', '#ef4444'], '#fecaca', '#fca5a5', '#fdba74') },
  { id: 'orange', label: 'Orange', swatch: '#e2762b' }, // les couleurs d'origine (index.css)
  { id: 'jaune', label: 'Jaune', ...P('#facc15', '#b45309', '#d9a100', '#eab308', '#854d0e', '#fef9c3', '#fffdf0', '#fef9c3', '#fde68a', ['#713f12', '#a16207', '#ca8a04'], '#fef08a', '#fde047', '#fdba74') },
  { id: 'vert', label: 'Vert', ...P('#22c55e', '#15803d', '#22c55e', '#16a34a', '#166534', '#dcfce7', '#f4fdf6', '#dcfce7', '#bbf7d0', ['#14532d', '#15803d', '#16a34a'], '#bbf7d0', '#86efac', '#fde047') },
  { id: 'bleu', label: 'Bleu', ...P('#3b82f6', '#1d4ed8', '#3b82f6', '#2563eb', '#1e40af', '#dbeafe', '#f3f8ff', '#dbeafe', '#bfdbfe', ['#1e3a8a', '#1d4ed8', '#3b82f6'], '#bfdbfe', '#93c5fd', '#67e8f9') },
  { id: 'indigo', label: 'Indigo', ...P('#6366f1', '#4338ca', '#6366f1', '#4f46e5', '#3730a3', '#e0e7ff', '#f5f6ff', '#e0e7ff', '#c7d2fe', ['#312e81', '#4338ca', '#6366f1'], '#c7d2fe', '#a5b4fc', '#c4b5fd') },
  { id: 'violet', label: 'Violet', ...P('#a855f7', '#7e22ce', '#a855f7', '#9333ea', '#6b21a8', '#f3e8ff', '#faf5ff', '#f3e8ff', '#e9d5ff', ['#581c87', '#7e22ce', '#a855f7'], '#e9d5ff', '#d8b4fe', '#f9a8d4') },
  { id: 'rose', label: 'Rose', ...P('#ec4899', '#db2777', '#f472b6', '#ec4899', '#9d174d', '#fce7f3', '#fff4f9', '#fce7f3', '#fbcfe8', ['#831843', '#be185d', '#ec4899'], '#fbcfe8', '#f9a8d4', '#f0abfc') },

  // Les gourmandises: une couleur ET des dessins qui flottent sur la page (deco)
  { id: 'brownie', label: 'Brownie au chocolat', groupe: 'gourmandise', deco: ['🍫', '🍪', '🥛'],
    ...P('#6b4226', '#5b3a29', '#8b5e3c', '#8b5e3c', '#5b3a29', '#f1e2d4', '#fdf8f3', '#f3e5d8', '#e2c9b0', ['#2f1c12', '#4a2c1c', '#7b4b2a'], '#f5d9bd', '#d7b08c', '#f0c9a0') },
  { id: 'creme-glacee', label: 'Crème glacée', groupe: 'gourmandise', deco: ['🍦', '🍨', '🍒'],
    ...P('#f9a8d4', '#db2777', '#f472b6', '#e879f9', '#a21caf', '#fce7f3', '#fffafd', '#fdf2f8', '#fbcfe8', ['#9d174d', '#db2777', '#f472b6'], '#fbcfe8', '#a7f3d0', '#fcd34d') },
  { id: 'barbe-papa', label: 'Barbe à papa', groupe: 'gourmandise', deco: ['🍭', '☁️', '🎡'],
    ...P('#f0abfc', '#c026d3', '#60a5fa', '#d946ef', '#86198f', '#fae8ff', '#fdf9ff', '#fae8ff', '#f5d0fe', ['#701a75', '#a21caf', '#60a5fa'], '#f5d0fe', '#f0abfc', '#93c5fd') },
  { id: 'bleuet', label: 'Muffin aux bleuets', groupe: 'gourmandise', deco: ['🫐', '🧁', '🌾'],
    ...P('#6366f1', '#3730a3', '#6366f1', '#4f46e5', '#312e81', '#e0e7ff', '#f7f7ff', '#e8e6ff', '#cdd0fb', ['#1e1b4b', '#3730a3', '#6366f1'], '#c7d2fe', '#a5b4fc', '#fcd34d') },
  { id: 'limonade', label: 'Limonade', groupe: 'gourmandise', deco: ['🍋', '🥤', '🧊'],
    ...P('#fde047', '#a16207', '#eab308', '#ca8a04', '#854d0e', '#fef9c3', '#fffef2', '#fef9c3', '#fef08a', ['#713f12', '#a16207', '#eab308'], '#fef08a', '#fde047', '#bbf7d0') },
  { id: 'melon', label: 'Melon d’eau', groupe: 'gourmandise', deco: ['🍉', '🌞', '🧃'],
    ...P('#f87171', '#be123c', '#fb7185', '#e11d48', '#9f1239', '#ffe4e6', '#fff6f6', '#ffe4e6', '#fecdd3', ['#4c0519', '#9f1239', '#22c55e'], '#fecdd3', '#fda4af', '#86efac') },
  { id: 'caramel', label: 'Caramel fondant', groupe: 'gourmandise', deco: ['🍮', '🍯', '🥄'],
    ...P('#d97706', '#b45309', '#f59e0b', '#d97706', '#92400e', '#fef3c7', '#fffbf2', '#fef3c7', '#fde68a', ['#78350f', '#b45309', '#f59e0b'], '#fde68a', '#fcd34d', '#fbbf24') },
  { id: 'matcha', label: 'Thé matcha', groupe: 'gourmandise', deco: ['🍵', '🍡', '🌿'],
    ...P('#84cc16', '#4d7c0f', '#84cc16', '#65a30d', '#3f6212', '#ecfccb', '#f9fdf0', '#ecfccb', '#d9f99d', ['#1a2e05', '#3f6212', '#65a30d'], '#d9f99d', '#bef264', '#fde68a') },
  { id: 'beigne', label: 'Beigne glacé', groupe: 'gourmandise', deco: ['🍩', '✨', '🎉'],
    ...P('#fb7185', '#be185d', '#fb7185', '#e11d48', '#9f1239', '#ffe4e6', '#fff7f4', '#ffe9e2', '#fecdd3', ['#7f1d3a', '#be185d', '#fb923c'], '#fecdd3', '#fda4af', '#fdba74') },
  { id: 'menthe', label: 'Menthe chocolat', groupe: 'gourmandise', deco: ['🌱', '🍫', '🍬'],
    ...P('#2dd4bf', '#0f766e', '#2dd4bf', '#0d9488', '#115e59', '#ccfbf1', '#f2fdfb', '#ccfbf1', '#99f6e4', ['#134e4a', '#0f766e', '#5b3a29'], '#99f6e4', '#5eead4', '#d7b08c') },
];

const RAINBOW = 'linear-gradient(135deg,#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#8b5cf6)';

const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};
const rgba = (hex, a) => `rgba(${rgb(hex).split(' ').join(', ')}, ${a})`;

// Les gourmandises sement leurs dessins derriere la page (skins.css: body::after)
function decoLayer(emojis) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'>`
    + `<text x='22' y='56' font-size='34'>${emojis[0]}</text>`
    + `<text x='140' y='40' font-size='26'>${emojis[1] || emojis[0]}</text>`
    + `<text x='96' y='132' font-size='30'>${emojis[2] || emojis[0]}</text>`
    + `<text x='176' y='182' font-size='28'>${emojis[0]}</text>`
    + `<text x='34' y='196' font-size='24'>${emojis[1] || emojis[0]}</text>`
    + `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function colorVars(c) {
  const hero = `linear-gradient(135deg, ${c.hero.join(', ')})`;
  return {
    '--cream': c.cream, '--peach': c.peach, '--sand': c.sand, '--lava': c.lava, '--lava-l': c.lavaL,
    '--fox': c.fox, '--fox-d': c.foxD, '--fox-belly': c.belly,
    '--c-cream': rgb(c.cream), '--c-peach': rgb(c.peach), '--c-sand': rgb(c.sand),
    '--c-lava': rgb(c.lava), '--c-lava-l': rgb(c.lavaL), '--c-fox': rgb(c.fox),
    '--c-fox-d': rgb(c.foxD), '--c-fox-belly': rgb(c.belly),
    '--sb-grad': `linear-gradient(135deg, ${c.lava} 0%, ${c.lavaL} 100%)`,
    '--sb-grad-shadow': rgba(c.lava, 0.28),
    '--sb-hero': hero,
    '--sb-hero-shadow': rgba(c.hero[0], 0.28),
    '--sb-glow-1': rgba(c.glow1, 0.55),
    '--sb-glow-2': rgba(c.glow2, 0.35),
    '--sb-hero-eyebrow': c.eyebrow,
    '--sb-hero-muted': 'rgba(255, 255, 255, 0.88)',
    '--sb-brand-fg': c.foxD, '--sb-brand-bg': c.peach, '--sb-brand-ring': c.sand,
    '--sb-progress': c.fox, '--sb-track': c.sand,
    // Bandeau « Bonjour » de l'accueil (Ryan/Nyla) et halo derrière la page
    '--sb-banner': c.rainbow
      ? 'linear-gradient(135deg, #fee2e2, #ffedd5 20%, #fef9c3 40%, #dcfce7 60%, #dbeafe 80%, #ede9fe)'
      : `linear-gradient(135deg, ${c.peach}, ${c.belly} 55%, ${c.sand})`,
    '--sb-page-glow': c.rainbow
      ? 'radial-gradient(ellipse at 10% 0%, #fecaca66, transparent 45%), radial-gradient(ellipse at 50% 0%, #fef08a55, transparent 45%), radial-gradient(ellipse at 90% 0%, #bfdbfe66, transparent 45%), radial-gradient(ellipse at 50% 100%, #ddd6fe55, transparent 55%)'
      : `radial-gradient(ellipse at 18% 0%, ${c.sand}99, transparent 55%), radial-gradient(ellipse at 85% 4%, ${c.belly}cc, transparent 50%), radial-gradient(ellipse at 50% 100%, ${c.sand}55, transparent 55%)`,
    '--sb-page-deco': c.deco ? decoLayer(c.deco) : 'none',
  };
}

// ---- Écriture (polices Google Fonts, chargées seulement si on les choisit) ----
export const FONTS = [
  { id: 'default', label: 'Normale', family: null },
  { id: 'bulles', label: 'Bulles', family: "'Fredoka', system-ui, sans-serif", css: 'Fredoka:wght@400;500;600;700' },
  { id: 'crayon', label: 'Au crayon', family: "'Patrick Hand', 'Comic Sans MS', cursive", css: 'Patrick+Hand' },
  { id: 'attachee', label: 'Attachée', family: "'Playwrite CA', 'Segoe Script', cursive", css: 'Playwrite+CA:wght@300;400' },
  { id: 'bd', label: 'Bande dessinée', family: "'Comic Neue', 'Comic Sans MS', cursive", css: 'Comic+Neue:wght@400;700' },
  { id: 'livre', label: 'Livre', family: "'Merriweather', Georgia, serif", css: 'Merriweather:wght@400;700;900' },
  { id: 'machine', label: 'Machine à écrire', family: "'Courier Prime', 'Courier New', monospace", css: 'Courier+Prime:wght@400;700' },
  { id: 'facile', label: 'Facile à lire', family: "'Lexend', system-ui, sans-serif", css: 'Lexend:wght@400;500;600;700' },
  { id: 'ronde', label: 'Toute ronde', family: "'Baloo 2', system-ui, sans-serif", css: 'Baloo+2:wght@500;600;700;800' },
  { id: 'marqueur', label: 'Au marqueur', family: "'Permanent Marker', 'Comic Sans MS', cursive", css: 'Permanent+Marker' },
  { id: 'cahier', label: 'Cahier d’école', family: "'Caveat', 'Segoe Script', cursive", css: 'Caveat:wght@500;600;700' },
  { id: 'affiche', label: 'Grosse affiche', family: "'Luckiest Guy', 'Comic Sans MS', cursive", css: 'Luckiest+Guy' },
  { id: 'fleurie', label: 'Fleurie', family: "'Gloria Hallelujah', cursive", css: 'Gloria+Hallelujah' },
  { id: 'jeu-video', label: 'Jeu vidéo', family: "'Press Start 2P', monospace", css: 'Press+Start+2P' },
  { id: 'sage', label: 'Bien sage', family: "'Nunito', system-ui, sans-serif", css: 'Nunito:wght@400;600;700;800' },
];

const loadedFonts = new Set();
export function loadFonts(fonts = FONTS) {
  const todo = fonts.filter((f) => f.css && !loadedFonts.has(f.id));
  if (!todo.length) return;
  todo.forEach((f) => loadedFonts.add(f.id));
  try {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${todo.map((f) => `family=${f.css}`).join('&')}&display=swap`;
    document.head.appendChild(link);
  } catch {}
}

// ---- Lecture / écriture ----
// Cayla a fait retirer l'arc-en-ciel et la licorne le 22 sept. 2026: si un profil
// les avait choisis, on le ramene doucement sur un voisin.
const REMPLACE = { color: { arc: 'barbe-papa' }, mascot: { licorne: 'chat' } };

export function loadSettings(profile) {
  try {
    const raw = localStorage.getItem(KEY(profile));
    const s = { ...DEFAULT_SETTINGS, ...(raw ? JSON.parse(raw) : {}) };
    if (REMPLACE.color[s.color]) s.color = REMPLACE.color[s.color];
    if (REMPLACE.mascot[s.mascot]) s.mascot = REMPLACE.mascot[s.mascot];
    return s;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(profile, patch) {
  const next = { ...loadSettings(profile), ...patch };
  try { localStorage.setItem(KEY(profile), JSON.stringify(next)); } catch {}
  applySettings(next);
  try { window.dispatchEvent(new CustomEvent(EVENT, { detail: { profile, settings: next } })); } catch {}
  return next;
}

let appliedVars = [];
export function applySettings(s = DEFAULT_SETTINGS) {
  const debit = DEBITS.find((d) => d.id === s.debit) || DEBITS[1];
  setVoicePrefs({ enabled: !s.muted, accent: s.accent, voice: s.voice, ttsVoice: s.ttsVoice, speed: debit.factor });
  try {
    const el = document.documentElement;
    appliedVars.forEach((v) => el.style.removeProperty(v));
    appliedVars = [];
    const set = (k, v) => { el.style.setProperty(k, v); appliedVars.push(k); };

    const color = COLORS.find((c) => c.id === s.color);
    if (color && color.lava) {
      Object.entries(colorVars(color)).forEach(([k, v]) => set(k, v));
      el.dataset.color = color.id;
    } else {
      delete el.dataset.color;
    }

    const font = FONTS.find((f) => f.id === s.font);
    if (font && font.family) {
      loadFonts([font]);
      set('--font-body', font.family);
      set('--font-heading', font.family);
      el.dataset.font = font.id;
    } else {
      delete el.dataset.font;
    }

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && color && color.lava) meta.setAttribute('content', color.lava);
    else if (meta && meta.dataset.default) meta.setAttribute('content', meta.dataset.default);
  } catch {}
}

// Mascotte par défaut de chaque profil: lion pour Ryan (skin courage), aucune sur
// l'accueil secondaire (Cayla, invités), renard pour les autres.
export function mascotFor(profile, s) {
  if (s && s.mascot && s.mascot !== 'default') return s.mascot;
  if (profile === 'ryan') return 'lion';
  if (profile === 'cayla' || String(profile || '').startsWith('invite-')) return 'aucun';
  return 'renard';
}

// Hook: les réglages du profil, mis à jour en direct quand on les change
export function useSettings(profile) {
  const [settings, setSettings] = useState(() => loadSettings(profile));
  useEffect(() => {
    setSettings(loadSettings(profile));
    const on = (e) => { if (e.detail?.profile === profile) setSettings(e.detail.settings); };
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, [profile]);
  return settings;
}
