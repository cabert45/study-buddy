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
let prefSpeed = 1; // ⚙️ Réglages: 🐢 doucement · 🙂 normal · 🐇 vite

export function setSpeechEnabled(enabled) {
  speechEnabled = enabled;
}

export function setVoicePrefs({ enabled = true, accent = 'auto', voice = '', ttsVoice = 'auto', speed = 1 } = {}) {
  speechEnabled = enabled;
  prefAccent = accent || 'auto';
  prefVoice = voice || '';
  prefTtsVoice = ttsVoice || 'auto';
  prefSpeed = Number(speed) > 0 ? Number(speed) : 1;
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

// Comment ecrire un mot pour que la voix le prononce bien.
//
// « Nyla » se lit [ni-la] en francais, et c'est ce que la voix disait: « Nila ».
// Son prenom se dit « Naila ». On ne change que ce qui est PARLE — a l'ecran
// son prenom reste ecrit Nyla, parce que c'est ainsi qu'elle doit apprendre a
// le reconnaitre (voir data/nylaMaternelle5.js, exercice « Mon prenom »).
// Verifie par aller-retour voix -> Scribe: « Naila » ressort bien « Naila ».
const PRONONCIATION = [
  [/Nyla/g, 'Naïla'],
];

// Un calcul ne se lit pas tout seul.
//
// « 4 + 4 = ? » partait tel quel à la voix, avec ses symboles. Une voix ne sait
// pas quoi en faire: elle saute le « + », ou épelle « égale point
// d'interrogation ». Ryan entendait « quatre quatre » et regardait l'écran en
// attendant la question. Un calcul se DIT: « 4 plus 4 égale combien? ».
//
// Deux pièges évités ici:
//   - le trait d'union n'est PAS un moins: « quatre-vingt-dix » doit rester un
//     nombre. Seuls le vrai signe − (U+2212) et un tiret entre deux chiffres
//     deviennent « moins ».
//   - « 2 407 » s'écrit avec une espace, comme dans le cahier Matcha, mais se
//     lit « deux mille quatre cent sept ». Sans recoller les chiffres, la voix
//     dit « deux… quatre cent sept ».
const MATHS = [
  [/(\d)[\s  ](?=\d{3}\b)/g, '$1'],          // 2 407 → 2407
  [/\s*\+\s*/g, ' plus '],
  [/\s*−\s*/g, ' moins '],                             // le vrai signe moins
  [/(\d)\s*[-–]\s*(?=\d)/g, '$1 moins '],              // 12-6, écrit au tiret
  [/(\d)\s*[×x]\s*(?=\d)/g, '$1 fois '],
  [/\s*÷\s*/g, ' divisé par '],
  [/\s*=\s*/g, ' égale '],
  [/(^|\s)\?(?=\s*$)/g, '$1combien'],                  // « … = ? » → « … égale combien »
  [/(^|\s)\?(?=\s)/g, '$1quel nombre'],                // « ? + 21 = 45 »
  [/\s*<\s*/g, ' est plus petit que '],
  [/\s*>\s*/g, ' est plus grand que '],
];

// Clean text for speech — strip underscores, repeated punctuation, brackets
export function cleanForSpeech(text) {
  if (!text) return '';
  let t = String(text);
  for (const [re, remplacement] of PRONONCIATION) t = t.replace(re, remplacement);
  for (const [re, remplacement] of MATHS) t = t.replace(re, remplacement);
  return t
    // Une ligne blanche sépare deux idées (« 7 + 7 » / « Ce sont des JUMEAUX »).
    // Sans point, la voix enchaîne tout d'un souffle et on perd la question.
    .replace(/([^.!?…:,;])\n{2,}/g, '$1. ')
    .replace(/_+/g, ' ... ')           // underscores → pause
    .replace(/\(([^)]+)\)/g, ', $1, ') // (gris) → ", gris,"
    .replace(/→/g, ' devient ')        // arrows
    .replace(/[★⭐🌟🎯🎧📝✏️🔢🧠🔍🧩🔗⚖️🎴🐟⚡📊👨‍🚀👋🌋🏰🐜📌🎨🧮]/g, '') // emojis
    .replace(/\s+/g, ' ')              // collapse whitespace
    .replace(/\s+([,.;:!?])/g, '$1')   // « mot , » → « mot, »
    .replace(/,+(?=[.?!])/g, '')       // « "1", ? » → « "1"? »
    .replace(/,\s*$/, '')              // virgule en fin de phrase
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

// Les deux voix ne se voyaient pas.
//
// `speechSynthesis.cancel()` fait taire la voix de l'appareil mais n'arrête pas
// le MP3, et jouer un MP3 n'arrêtait pas la voix de l'appareil. Tant que tout
// passait par l'appareil, chaque phrase coupait la précédente et personne ne
// remarquait rien. Le jour où une voix premium est choisie, les deux canaux
// tournent en parallèle: un mot d'anglais (toujours dit par l'appareil, parce
// qu'une voix française qui prononce « butterfly » n'apprend rien à personne)
// part par-dessus la phrase française — deux voix en même temps.
//
// Mesuré le 26 sept. 2026: `speak('Bonjour Ryan…')` puis, 700 ms plus tard,
// `speak('butterfly', 'en')` → la voix de l'appareil démarre pendant que le MP3
// joue encore. Depuis, avant de parler, on coupe LES DEUX.
//
// Ne touche pas à speechGen: couper pour parler tout de suite n'est pas la même
// chose que quitter un écran (stopSpeech), qui annule aussi ce qui est
// programmé.
function couperLesVoix() {
  try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch {}
  try { if (audioEl) { audioEl.onended = null; audioEl.onerror = null; audioEl.pause(); } } catch {}
}

// Un numéro par clip. Quand un clip plus récent a pris la main, l'ancien se tait
// au lieu de repasser à la voix de l'appareil: sinon on entendrait le MP3 de la
// nouvelle phrase ET l'ancienne phrase dite par l'appareil par-dessus.
let audioSeq = 0;

// Joue le MP3. Rejette si quoi que ce soit cloche — l'appelant repasse alors à
// la voix de l'appareil.
function playPremium(text, { slow = false, rate = TTS_BASELINE_RATE } = {}) {
  const gen = speechGen;
  couperLesVoix();
  const a = getAudio();
  const seq = ++audioSeq;
  const perime = () => seq !== audioSeq;
  return new Promise((resolve, reject) => {
    a.onerror = () => (perime() ? resolve() : reject(new Error('audio')));
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
      }).catch(() => (perime() ? resolve() : reject(new Error('play'))));
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
  audioSeq++;
  couperLesVoix();
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
  couperLesVoix(); // et pas seulement speechSynthesis.cancel(): le MP3 aussi
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

export function speak(text, lang = 'fr', baseRate = 0.85) {
  const rate = baseRate * prefSpeed;
  if (!speechEnabled || !window.speechSynthesis) return;
  const cleaned = cleanForSpeech(text);
  if (!cleaned) return;
  if (deferUntilProbed(lang, () => speak(text, lang, baseRate))) return;

  // L'anglais reste sur la voix de l'appareil (accent).
  if (lang !== 'en' && ttsReady()) {
    const gen = speechGen;
    // (playPremium coupe déjà les deux voix)
    playPremium(cleaned, { rate }).catch(() => {
      if (gen === speechGen && speechEnabled) speakDevice(cleaned, lang, rate);
    });
    return;
  }

  speakDevice(cleaned, lang, rate);
}

/**
 * Dire une phrase, et savoir QUAND elle est finie.
 *
 * `speak()` part et ne revient jamais: parfait pour une consigne qu'on lance,
 * inutilisable pour une conversation. Le tuteur parlant de Nyla doit ouvrir le
 * micro a la seconde ou la voix se tait — sinon il s'enregistre lui-meme en
 * train de poser la question, et Scribe transcrit la question au lieu de la
 * reponse de l'enfant.
 *
 * NE REJETTE JAMAIS, ET NE RESTE JAMAIS EN SUSPENS. C'est la regle importante:
 * `playPremium` ne resout que sur `onended`, et `pause()` ne declenche pas
 * `onended`. Un stopSpeech() pendant la phrase laissait donc la promesse
 * pendante pour toujours — et l'ecran du tuteur restait fige sur « … », micro
 * jamais ouvert. Deux filets: une garde de temps, et une veille sur le
 * compteur de generation (qui change des que la voix est coupee).
 *
 * `rate` par defaut 0.8. Reglage fait a l'oreille, en deux temps: 0.85 (la
 * vitesse du reste de l'app) etait trop rapide pour elle, 0.7 trop lent au
 * point de trainer. Le debit de ⚙️ Reglages (🐢 / 🙂 / 🐇) multiplie encore
 * par-dessus pour qui veut ajuster.
 */
export function speakAndWait(text, { rate = 0.8 } = {}) {
  return new Promise((resolve) => {
    if (!speechEnabled || !window.speechSynthesis) return resolve();
    const cleaned = cleanForSpeech(text);
    if (!cleaned) return resolve();

    const gen = speechGen;
    let fini = false;
    let garde = null;
    let veille = null;
    const done = () => {
      if (fini) return;
      fini = true;
      clearTimeout(garde);
      clearInterval(veille);
      resolve();
    };
    // Large: mieux vaut attendre une seconde de trop que couper la consigne.
    garde = setTimeout(done, Math.min(30000, 2500 + cleaned.length * 120));
    veille = setInterval(() => { if (gen !== speechGen) done(); }, 200);

    const premium = () => playPremium(cleaned, { rate: rate * prefSpeed })
      .then(done)
      .catch(() => {
        if (fini || gen !== speechGen || !speechEnabled) return done();
        direAppareilEtAttendre(cleaned, rate * prefSpeed).then(done);
      });

    if (ttsReady()) return premium();

    // Au tout premier tour, /api/tts/status n'a pas encore repondu: on attend
    // cette seule reponse, sinon la premiere question sortirait avec la voix
    // de l'appareil alors que la voix premium existe.
    if (ttsStatus === null && prefTtsVoice !== 'appareil') {
      probeTts().then(() => {
        if (fini) return;
        if (ttsReady()) premium();
        else direAppareilEtAttendre(cleaned, rate * prefSpeed).then(done);
      }).catch(() => { if (!fini) direAppareilEtAttendre(cleaned, rate * prefSpeed).then(done); });
      return;
    }

    direAppareilEtAttendre(cleaned, rate * prefSpeed).then(done);
  });
}

// La voix de l'appareil, avec la meme promesse de fin. Un filet de securite
// temporel parce que `onend` ne se declenche pas toujours sur iOS quand la
// phrase est coupee: sans lui, le micro ne s'ouvrirait jamais.
function direAppareilEtAttendre(texte, rate) {
  return new Promise((resolve) => {
    let fini = false;
    const done = () => { if (!fini) { fini = true; resolve(); } };
    try {
      speakDevice(texte, 'fr', rate);
      const u = window.speechSynthesis;
      const garde = setTimeout(done, Math.min(25000, 1500 + texte.length * 120));
      const tick = setInterval(() => {
        if (!u.speaking && !u.pending) { clearInterval(tick); clearTimeout(garde); done(); }
      }, 150);
    } catch { done(); }
  });
}

// Speak slowly for dictée — clearer pronunciation
export function speakSlow(text) {
  if (!speechEnabled || !window.speechSynthesis) return;
  const cleaned = cleanForSpeech(text);
  if (!cleaned) return;
  if (deferUntilProbed('fr', () => speakSlow(text))) return;

  if (ttsReady()) {
    const gen = speechGen;
    // (playPremium coupe déjà les deux voix)
    playPremium(cleaned, { slow: true, rate: TTS_BASELINE_RATE * prefSpeed }).catch(() => {
      if (gen === speechGen && speechEnabled) speakDevice(cleaned, 'fr', 0.6 * prefSpeed);
    });
    return;
  }

  speakDevice(cleaned, 'fr', 0.6 * prefSpeed);
}
