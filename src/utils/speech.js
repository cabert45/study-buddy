let speechEnabled = true;
let cachedVoice = null;
let voicesLoaded = false;

export function setSpeechEnabled(enabled) {
  speechEnabled = enabled;
}

export function isSpeechEnabled() {
  return speechEnabled;
}

// Quality ranking for French voices
function voiceScore(voice) {
  const name = voice.name.toLowerCase();
  const lang = voice.lang.toLowerCase();

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

  const frenchVoices = voices.filter(v => v.lang.startsWith('fr'));
  if (frenchVoices.length === 0) return null;

  // Sort by quality score, pick best
  frenchVoices.sort((a, b) => voiceScore(b) - voiceScore(a));
  cachedVoice = frenchVoices[0];
  voicesLoaded = true;

  console.log('Selected French voice:', cachedVoice.name, cachedVoice.lang,
    `(score: ${voiceScore(cachedVoice)}, out of ${frenchVoices.length} French voices)`);

  // Store for debug display
  window.__selectedVoice = `${cachedVoice.name} (${cachedVoice.lang}) - score: ${voiceScore(cachedVoice)}`;
  window.__allFrenchVoices = frenchVoices.map(v => `${v.name} [${v.lang}] score:${voiceScore(v)}`).join(', ');

  return cachedVoice;
}

// Preload voices — Chrome loads them async
if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadBestVoice();
  window.speechSynthesis.onvoiceschanged = () => {
    loadBestVoice();
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

export function speak(text, lang = 'fr') {
  if (!speechEnabled || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const cleaned = cleanForSpeech(text);
  const u = new SpeechSynthesisUtterance(cleaned);

  const voice = lang === 'en' ? getEnglishVoice() : getVoice();
  if (voice) {
    u.voice = voice;
    u.lang = voice.lang;
  } else {
    u.lang = lang === 'en' ? 'en-US' : 'fr-FR';
  }

  u.rate = 0.85;
  u.pitch = 1.0;
  window.speechSynthesis.speak(u);
}

// Speak slowly for dictée — clearer pronunciation
export function speakSlow(text) {
  if (!speechEnabled || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const cleaned = cleanForSpeech(text);
  const u = new SpeechSynthesisUtterance(cleaned);

  const voice = getVoice();
  if (voice) {
    u.voice = voice;
    u.lang = voice.lang;
  } else {
    u.lang = 'fr-FR';
  }

  u.rate = 0.6;
  u.pitch = 1.0;
  window.speechSynthesis.speak(u);
}
