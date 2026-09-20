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
  // sinon l'identifiant d'une voix du compte (voir /api/tts/voices).
  ttsVoice: 'auto',
  color: 'orange',
  mascot: 'default',
  font: 'default',
};

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
  { id: 'rouge', label: 'Rouge', ...P('#ef4444', '#b91c1c', '#ef4444', '#dc2626', '#991b1b', '#fee2e2', '#fff5f5', '#fee2e2', '#fecaca', ['#7f1d1d', '#b91c1c', '#ef4444'], '#fecaca', '#fca5a5', '#fdba74') },
  { id: 'orange', label: 'Orange', swatch: '#e2762b' }, // les couleurs d'origine (index.css)
  { id: 'jaune', label: 'Jaune', ...P('#facc15', '#b45309', '#d9a100', '#eab308', '#854d0e', '#fef9c3', '#fffdf0', '#fef9c3', '#fde68a', ['#713f12', '#a16207', '#ca8a04'], '#fef08a', '#fde047', '#fdba74') },
  { id: 'vert', label: 'Vert', ...P('#22c55e', '#15803d', '#22c55e', '#16a34a', '#166534', '#dcfce7', '#f4fdf6', '#dcfce7', '#bbf7d0', ['#14532d', '#15803d', '#16a34a'], '#bbf7d0', '#86efac', '#fde047') },
  { id: 'bleu', label: 'Bleu', ...P('#3b82f6', '#1d4ed8', '#3b82f6', '#2563eb', '#1e40af', '#dbeafe', '#f3f8ff', '#dbeafe', '#bfdbfe', ['#1e3a8a', '#1d4ed8', '#3b82f6'], '#bfdbfe', '#93c5fd', '#67e8f9') },
  { id: 'indigo', label: 'Indigo', ...P('#6366f1', '#4338ca', '#6366f1', '#4f46e5', '#3730a3', '#e0e7ff', '#f5f6ff', '#e0e7ff', '#c7d2fe', ['#312e81', '#4338ca', '#6366f1'], '#c7d2fe', '#a5b4fc', '#c4b5fd') },
  { id: 'violet', label: 'Violet', ...P('#a855f7', '#7e22ce', '#a855f7', '#9333ea', '#6b21a8', '#f3e8ff', '#faf5ff', '#f3e8ff', '#e9d5ff', ['#581c87', '#7e22ce', '#a855f7'], '#e9d5ff', '#d8b4fe', '#f9a8d4') },
  { id: 'rose', label: 'Rose', ...P('#ec4899', '#db2777', '#f472b6', '#ec4899', '#9d174d', '#fce7f3', '#fff4f9', '#fce7f3', '#fbcfe8', ['#831843', '#be185d', '#ec4899'], '#fbcfe8', '#f9a8d4', '#f0abfc') },
  { id: 'arc', label: 'Arc-en-ciel', rainbow: true, ...P('linear-gradient(135deg,#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#8b5cf6)', '#7c3aed', '#db2777', '#8b5cf6', '#6d28d9', '#f3e8ff', '#fffaf7', '#f5f3ff', '#e9d5ff', ['#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#2563eb', '#7c3aed'], '#fef9c3', '#f9a8d4', '#93c5fd') },
];

const RAINBOW = 'linear-gradient(135deg,#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#8b5cf6)';

const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};
const rgba = (hex, a) => `rgba(${rgb(hex).split(' ').join(', ')}, ${a})`;

function colorVars(c) {
  const hero = `linear-gradient(135deg, ${c.hero.join(', ')})`;
  return {
    '--cream': c.cream, '--peach': c.peach, '--sand': c.sand, '--lava': c.lava, '--lava-l': c.lavaL,
    '--fox': c.fox, '--fox-d': c.foxD, '--fox-belly': c.belly,
    '--c-cream': rgb(c.cream), '--c-peach': rgb(c.peach), '--c-sand': rgb(c.sand),
    '--c-lava': rgb(c.lava), '--c-lava-l': rgb(c.lavaL), '--c-fox': rgb(c.fox),
    '--c-fox-d': rgb(c.foxD), '--c-fox-belly': rgb(c.belly),
    '--sb-grad': c.rainbow ? RAINBOW : `linear-gradient(135deg, ${c.lava} 0%, ${c.lavaL} 100%)`,
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
export function loadSettings(profile) {
  try {
    const raw = localStorage.getItem(KEY(profile));
    return { ...DEFAULT_SETTINGS, ...(raw ? JSON.parse(raw) : {}) };
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
  setVoicePrefs({ enabled: !s.muted, accent: s.accent, voice: s.voice, ttsVoice: s.ttsVoice });
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
