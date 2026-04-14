let speechEnabled = true;

export function setSpeechEnabled(enabled) {
  speechEnabled = enabled;
}

export function isSpeechEnabled() {
  return speechEnabled;
}

// Preferred French voices (best quality first)
const preferredVoices = [
  'Google français',        // Chrome's built-in French (best quality)
  'Microsoft Claude',       // Windows French voices
  'Microsoft Paul',
  'Microsoft Hortense',
  'Microsoft Julie',
  'Thomas',                 // macOS French
  'Amelie',                 // macOS Canadian French
  'Marie',
];

function getBestFrenchVoice() {
  const voices = window.speechSynthesis.getVoices();

  // First try preferred voices by name
  for (const pref of preferredVoices) {
    const match = voices.find(v =>
      v.name.toLowerCase().includes(pref.toLowerCase()) && v.lang.startsWith('fr')
    );
    if (match) return match;
  }

  // Then try any voice with fr-CA (Canadian French — closest to Québec)
  const frCA = voices.find(v => v.lang === 'fr-CA');
  if (frCA) return frCA;

  // Then fr-FR
  const frFR = voices.find(v => v.lang === 'fr-FR');
  if (frFR) return frFR;

  // Any French voice
  const anyFr = voices.find(v => v.lang.startsWith('fr'));
  if (anyFr) return anyFr;

  return null;
}

// Preload voices (Chrome loads them async)
if (window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

export function speak(text) {
  if (!speechEnabled || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'fr-CA'; // Canadian French for Québec
  u.rate = 0.85;

  const voice = getBestFrenchVoice();
  if (voice) {
    u.voice = voice;
    u.lang = voice.lang; // match the voice's language
  }

  window.speechSynthesis.speak(u);
}

// Speak slowly for dictée — clearer pronunciation
export function speakSlow(text) {
  if (!speechEnabled || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'fr-CA';
  u.rate = 0.65; // slower for spelling

  const voice = getBestFrenchVoice();
  if (voice) {
    u.voice = voice;
    u.lang = voice.lang;
  }

  window.speechSynthesis.speak(u);
}
