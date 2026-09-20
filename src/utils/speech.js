let speechEnabled = true;
let cachedVoice = null;
let voicesLoaded = false;
// Choix de ⚙️ Réglages (voir utils/settings.js): accent ('auto', 'fr-CA', 'fr-FR'…)
// et, en option, le nom exact d'une voix de l'appareil.
let prefAccent = 'auto';
let prefVoice = '';
// Voix ElevenLabs choisie: 'auto' (celle réglée sur le serveur), 'appareil'
// (la voix de l'iPad / du PC, comme avant) ou l'identifiant d'une voix du compte.
let prefTtsVoice = 'auto';

export function setSpeechEnabled(enabled) {
  speechEnabled = enabled;
}

export function setVoicePrefs({ enabled = true, accent = 'auto', voice = '', ttsVoice = 'auto' } = {}) {
  speechEnabled = enabled;
  prefAccent = accent || 'auto';
  prefVoice = voice || '';
  prefTtsVoice = ttsVoice || 'auto';
  cachedVoice = null;
  if (!enabled) stopSpeech();
  if (typeof window !== 'undefined' && window.speechSynthesis) loadBestVoice();
}

// Android écrit « fr_CA », les autres « fr-CA »
export const normLang = (lang) => String(lang || '').replace('_', '-').toLowerCase();

// Les voix françaises de l'appareil, de la meilleure à la moins bonne
export function listFrenchVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices()
    .filter(v => normLang(v.lang).startsWith('fr'))
    .sort((a, b) => voiceScore(b) - voiceScore(a));
}

export function isSpeechEnabled() {
  return speechEnabled;
}

// Quality ranking for French voices
function voiceScore(voice) {
  const name = voice.name.toLowerCase();
  const lang = normLang(voice.lang);

  // Google voices are highest quality in Chrome
  if (name.includes('google') && lang.startsWith('fr')) return 100;

  // Microsoft natural/neural voices (Windows 11)
  if (name.includes('natural') && lang.startsWith('fr')) return 90;
  if (name.includes('denise') && lang.startsWith('fr')) return 85;
  if (name.includes('sylvie') && lang.startsWith('fr')) return 85;

  // Canadian French preferred for Québec
  if (lang === 'fr-ca') return 80;

  // macOS voices
  if (name.includes('amelie')) return 78; // Canadian French on Mac
  if (name.includes('thomas')) return 75;
  if (name.includes('marie')) return 72;

  // Microsoft standard voices
  if (name.includes('hortense') && lang.startsWith('fr')) return 70;
  if (name.includes('paul') && lang.startsWith('fr')) return 68;
  if (name.includes('claude') && lang.startsWith('fr')) return 68;
  if (name.includes('julie') && lang.startsWith('fr')) return 68;

  // Any French voice
  if (lang === 'fr-fr') return 50;
  if (lang.startsWith('fr')) return 40;

  return 0;
}

function loadBestVoice() {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const frenchVoices = listFrenchVoices();
  if (frenchVoices.length === 0) return null;

  // Voix choisie dans Réglages, sinon la meilleure de l'accent choisi, sinon la meilleure
  const accentVoices = prefAccent === 'auto' ? frenchVoices
    : frenchVoices.filter(v => normLang(v.lang) === prefAccent.toLowerCase());
  cachedVoice = (prefVoice && frenchVoices.find(v => v.name === prefVoice))
    || accentVoices[0] || frenchVoices[0];
  voicesLoaded = true;

  console.log('Selected French voice:', cachedVoice.name, cachedVoice.lang,
    `(score: ${voiceScore(cachedVoice)}, out of ${frenchVoices.length} French voices)`);

  // Store for debug display
  window.__selectedVoice = `${cachedVoice.name} (${cachedVoice.lang}) - score: ${voiceScore(cachedVoice)}`;
  window.__allFrenchVoices = frenchVoices.map(v => `${v.name} [${v.lang}] score:${voiceScore(v)}`).join(', ');

  return cachedVoice;
}

const voiceListeners = new Set();
// Pour Réglages: être prévenu quand la liste des voix arrive (Chrome la charge en différé)
export function onVoicesChanged(fn) {
  voiceListeners.add(fn);
  return () => voiceListeners.delete(fn);
}

// Preload voices — Chrome loads them async
if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadBestVoice();
  // onvoiceschanged (pas addEventListener): les vieux Safari n'en ont pas d'autre
  window.speechSynthesis.onvoiceschanged = () => {
    loadBestVoice();
    voiceListeners.forEach(fn => { try { fn(); } catch {} });
  };
}

function getVoice() {
  if (cachedVoice) return cachedVoice;
  return loadBestVoice();
}

// Clean text for speech — strip underscores, repeated punctuation, brackets
function cleanForSpeech(text) {
  if (!text) return '';
  return String(text)
    .replace(/_+/g, ' ... ')           // underscores → pause
    .replace(/\(([^)]+)\)/g, ', $1, ') // (gris) → ", gris,"
    .replace(/→/g, ' devient ')        // arrows
    .replace(/[★⭐🌟🎯🎧📝✏️🔢🧠🔍🧩🔗⚖️🎴🐟⚡📊👨‍🚀👋🌋🏰🐜📌🎨🧮]/g, '') // emojis
    .replace(/\s+/g, ' ')              // collapse whitespace
    .trim();
}

function getEnglishVoice() {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  // Prefer Google English, then any en-US/en-GB
  const google = voices.find(v => v.name.toLowerCase().includes('google') && v.lang.startsWith('en'));
  if (google) return google;
  const enUS = voices.find(v => v.lang === 'en-US');
  if (enUS) return enUS;
  const enGB = voices.find(v => v.lang === 'en-GB');
  if (enGB) return enGB;
  const anyEn = voices.find(v => v.lang.startsWith('en'));
  return anyEn || null;
}

// ---- Voix ElevenLabs -------------------------------------------------------
// La voix de l'appareil hache les mots de dictée et sonne robotique. Quand le
// serveur a une clé ElevenLabs (voir /api/tts dans server.js), on joue plutôt un
// MP3: la même voix sur l'iPad, le PC et le téléphone, et un vrai français.
//
// Règle de base: la voix premium ne doit JAMAIS rendre un écran muet. Pas de
// réseau, serveur en panne, quota dépassé, MP3 refusé par le navigateur → on
// repasse aussitôt à la voix de l'appareil, sans autre signe pour l'enfant que
// le son qui change.
//
// L'anglais (vocabulaire d'anglais de Ryan) reste sur la voix de l'appareil:
// une voix française qui prononce « butterfly » n'apprend rien à personne.

const TTS_BASELINE_RATE = 0.85; // la vitesse « normale » des appels speak()

// Ce que le serveur répond à /api/tts/status. null = pas encore demandé.
let ttsStatus = null;
let ttsProbe = null;

function probeTts() {
  if (ttsStatus) return Promise.resolve(ttsStatus);
  if (ttsProbe) return ttsProbe;
  ttsProbe = fetch('/api/tts/status')
    .then(r => (r.ok ? r.json() : { enabled: false }))
    .catch(() => ({ enabled: false }))
    .then((s) => { ttsStatus = s || { enabled: false }; return ttsStatus; });
  return ttsProbe;
}

if (typeof window !== 'undefined') probeTts();

// Vrai si la voix premium est branchée ET choisie pour ce profil.
export function ttsReady() {
  if (prefTtsVoice === 'appareil') return false;
  if (!ttsStatus || !ttsStatus.enabled) return false;
  // 'auto' n'est utilisable que si le serveur a une voix par défaut
  return prefTtsVoice !== 'auto' || !!ttsStatus.defaultVoice;
}

// Les voix du compte ElevenLabs, pour la liste de ⚙️ Réglages.
export async function listPremiumVoices() {
  try {
    const r = await fetch('/api/tts/voices');
    if (!r.ok) return [];
    const data = await r.json();
    return data.voices || [];
  } catch {
    return [];
  }
}

function ttsUrl(text, slow) {
  const p = new URLSearchParams({ text });
  if (prefTtsVoice && prefTtsVoice !== 'auto') p.set('voice', prefTtsVoice);
  if (slow) p.set('slow', '1');
  return `/api/tts?${p}`;
}

// Un seul élément <audio> réutilisé pour tous les clips. iOS n'autorise le son
// que sur un élément « débloqué » par un geste (voir unlockAudio): en garder un
// seul, c'est n'avoir qu'une chose à débloquer.
let audioEl = null;
function getAudio() {
  if (audioEl) return audioEl;
  audioEl = new Audio();
  audioEl.preload = 'auto';
  return audioEl;
}

// iOS/Safari refuse de jouer un son tant que l'utilisateur n'a pas touché
// l'écran. Au tout premier toucher on joue un silence: l'élément est dès lors
// « autorisé », et plus tard l'app peut parler toute seule (« Bonjour Ryan! » à
// l'ouverture d'une carte, par exemple) sans attendre un autre clic.
let audioUnlocked = false;
const SILENCE = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAgD4AAAB9AAACABAAZGF0YQAAAAA=';

function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  try {
    const a = getAudio();
    a.src = SILENCE;
    const p = a.play();
    if (p && p.then) p.then(() => { a.pause(); a.currentTime = 0; }).catch(() => {});
  } catch {}
}

if (typeof window !== 'undefined') {
  // « once »: un seul toucher suffit pour toute la session.
  ['pointerdown', 'touchend', 'keydown'].forEach((ev) =>
    window.addEventListener(ev, unlockAudio, { once: true, capture: true })
  );
}

// Joue le MP3. Rejette si quoi que ce soit cloche — l'appelant repasse alors à
// la voix de l'appareil.
function playPremium(text, { slow = false, rate = TTS_BASELINE_RATE } = {}) {
  const gen = speechGen;
  const a = getAudio();
  return new Promise((resolve, reject) => {
    a.onerror = () => reject(new Error('audio'));
    a.onended = () => resolve();
    a.src = ttsUrl(text, slow);
    // Les appels demandent 0.8 ou 0.85; le MP3, lui, est enregistré à vitesse
    // normale. On garde l'écart relatif, borné pour ne donner ni une voix
    // d'écureuil ni un disque rayé.
    a.playbackRate = Math.min(1.4, Math.max(0.7, rate / TTS_BASELINE_RATE));
    const p = a.play();
    if (p && p.then) {
      p.then(() => {
        // Écran quitté pendant le chargement: on se tait (stopSpeech a déjà
        // appelé pause(), mais un play() en vol peut le reprendre).
        if (gen !== speechGen) { try { a.pause(); } catch {} resolve(); }
      }).catch(() => reject(new Error('play')));
    }
  });
}

// Au tout premier chargement, /api/tts/status n'a pas encore répondu: on ne sait
// pas encore si la voix premium existe. Plutôt que de laisser la toute première
// phrase sortir avec l'ancienne voix, on attend cette seule réponse (un aller-
// retour vers notre propre serveur) puis on reparle. Une fois par ouverture.
function deferUntilProbed(lang, replay) {
  if (lang === 'en' || prefTtsVoice === 'appareil' || ttsStatus !== null) return false;
  const gen = speechGen;
  probeTts().then(() => { if (gen === speechGen && speechEnabled) replay(); });
  return true;
}

// ---- Arrêter la voix quand on quitte un écran ----
// Chaque changement d'écran appelle stopSpeech(): la phrase en cours est coupée ET
// toute lecture programmée avec speakAfter() avant ce moment est annulée (sinon une
// carte qui disait « lis le mot dans 300 ms » parlait encore une fois de retour au menu).
let speechGen = 0;

export function stopSpeech() {
  speechGen++;
  try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch {}
  try { if (audioEl) { audioEl.onended = null; audioEl.onerror = null; audioEl.pause(); } } catch {}
}

// setTimeout pour la voix: ne parle pas si on a changé d'écran entre-temps.
// Retourne la fonction de nettoyage (à renvoyer depuis un useEffect).
export function speakAfter(ms, fn) {
  const gen = speechGen;
  const t = setTimeout(() => { if (gen === speechGen) fn(); }, ms);
  return () => clearTimeout(t);
}

// La voix de l'appareil: le chemin d'origine, qui reste le filet de sécurité.
function speakDevice(cleaned, lang, rate) {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(cleaned);

  const voice = lang === 'en' ? getEnglishVoice() : getVoice();
  if (voice) {
    u.voice = voice;
    u.lang = voice.lang;
  } else {
    u.lang = lang === 'en' ? 'en-US' : (prefAccent === 'auto' ? 'fr-FR' : prefAccent);
  }

  u.rate = rate;
  u.pitch = 1.0;
  window.speechSynthesis.speak(u);
}

export function speak(text, lang = 'fr', rate = 0.85) {
  if (!speechEnabled || !window.speechSynthesis) return;
  const cleaned = cleanForSpeech(text);
  if (!cleaned) return;
  if (deferUntilProbed(lang, () => speak(text, lang, rate))) return;

  // L'anglais reste sur la voix de l'appareil (accent).
  if (lang !== 'en' && ttsReady()) {
    const gen = speechGen;
    window.speechSynthesis.cancel(); // couper une phrase de l'appareil encore en cours
    playPremium(cleaned, { rate }).catch(() => {
      if (gen === speechGen && speechEnabled) speakDevice(cleaned, lang, rate);
    });
    return;
  }

  speakDevice(cleaned, lang, rate);
}

// Speak slowly for dictée — clearer pronunciation
export function speakSlow(text) {
  if (!speechEnabled || !window.speechSynthesis) return;
  const cleaned = cleanForSpeech(text);
  if (!cleaned) return;
  if (deferUntilProbed('fr', () => speakSlow(text))) return;

  if (ttsReady()) {
    const gen = speechGen;
    window.speechSynthesis.cancel();
    playPremium(cleaned, { slow: true }).catch(() => {
      if (gen === speechGen && speechEnabled) speakDevice(cleaned, 'fr', 0.6);
    });
    return;
  }

  speakDevice(cleaned, 'fr', 0.6);
}
