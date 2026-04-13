let speechEnabled = true;

export function setSpeechEnabled(enabled) {
  speechEnabled = enabled;
}

export function isSpeechEnabled() {
  return speechEnabled;
}

export function speak(text) {
  if (!speechEnabled || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'fr-FR';
  u.rate = 0.85;
  const voices = window.speechSynthesis.getVoices();
  const fr = voices.find((v) => v.lang.startsWith('fr'));
  if (fr) u.voice = fr;
  window.speechSynthesis.speak(u);
}
