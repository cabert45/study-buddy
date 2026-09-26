// Deux voix en même temps? On appelle directement `utils/speech.js` et on note
// qui parle quand, sur les deux canaux: la voix de l'appareil
// (speechSynthesis) et le MP3 premium (ElevenLabs).
//
// Pourquoi ce fichier: le 26 sept. 2026, une voix premium choisie dans
// ⚙️ Réglages a fait parler l'app à deux voix en même temps. Les deux canaux ne
// se voyaient pas — `speechSynthesis.cancel()` n'arrête pas un MP3, et jouer un
// MP3 n'arrêtait pas la voix de l'appareil. Tant que tout passait par
// l'appareil, personne ne pouvait s'en rendre compte.
//
// Utilisation (le serveur de DEV, parce qu'il sert les modules source):
//   1) npx vite --port 5173 --host 127.0.0.1
//   2) chrome --headless=new --remote-debugging-port=9222 \
//        --autoplay-policy=no-user-gesture-required \
//        --user-data-dir=<dossier temporaire> about:blank
//   3) node scripts/verif-deux-voix.mjs http://127.0.0.1:5173/
//
// La voix premium est simulée (un bip WAV servi à la place de /api/tts): rien
// ne touche la clé ElevenLabs ni les réglages réels des enfants. Sort en code 1
// si une voix démarre pendant que l'autre parle.
const base = process.argv[2] || 'http://127.0.0.1:5173/';

function wav(seconds = 3, freq = 440, rate = 8000) {
  const n = Math.floor(seconds * rate);
  const data = Buffer.alloc(n);
  for (let i = 0; i < n; i++) data[i] = 128 + Math.round(60 * Math.sin((2 * Math.PI * freq * i) / rate));
  const head = Buffer.alloc(44);
  head.write('RIFF', 0); head.writeUInt32LE(36 + n, 4); head.write('WAVE', 8);
  head.write('fmt ', 12); head.writeUInt32LE(16, 16); head.writeUInt16LE(1, 20);
  head.writeUInt16LE(1, 22); head.writeUInt32LE(rate, 24); head.writeUInt32LE(rate, 28);
  head.writeUInt16LE(1, 32); head.writeUInt16LE(8, 34);
  head.write('data', 36); head.writeUInt32LE(n, 40);
  return Buffer.concat([head, data]).toString('base64');
}
const BIP = wav();

const list = await (await fetch('http://127.0.0.1:9222/json/list')).json();
const page = list.find((t) => t.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const send = (method, params = {}) =>
  new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
ws.addEventListener('message', async (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); return; }
  if (m.method !== 'Fetch.requestPaused') return;
  const { requestId, request } = m.params;
  const estStatus = request.url.includes('/api/tts/status');
  try {
    await send('Fetch.fulfillRequest', {
      requestId,
      responseCode: 200,
      responseHeaders: [{ name: 'Content-Type', value: estStatus ? 'application/json' : 'audio/wav' }],
      body: estStatus ? Buffer.from(JSON.stringify({ enabled: true, defaultVoice: 'test' })).toString('base64') : BIP,
    });
  } catch (err) { console.log('fulfill raté:', err.message); }
});
await new Promise((r) => ws.addEventListener('open', r));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const evAsync = async (expression) =>
  (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value;

await send('Page.enable');
await send('Runtime.enable');
await send('Network.enable');
try { await send('Network.setBypassServiceWorker', { bypass: true }); } catch {}

await send('Page.addScriptToEvaluateOnNewDocument', {
  source: `
    window.__journal = [];
    const t0 = Date.now();
    const note = (o) => window.__journal.push({ ms: Date.now() - t0, ...o });
    const origPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.__audio = this;
      note({ quoi: 'PREMIUM play' });
      this.addEventListener('playing', () => note({ quoi: 'premium: ça joue' }), { once: true });
      this.addEventListener('ended', () => note({ quoi: 'premium: fini' }), { once: true });
      this.addEventListener('error', () => note({ quoi: 'premium: ERREUR ' + (this.error && this.error.code) }), { once: true });
      const pr = origPlay.apply(this, arguments);
      if (pr && pr.then) pr.then(() => {}, (e) => note({ quoi: 'premium: play() refusé ' + (e && e.name) }));
      return pr;
    };
    const origPause = HTMLMediaElement.prototype.pause;
    HTMLMediaElement.prototype.pause = function () { note({ quoi: 'premium: pause()' }); return origPause.apply(this, arguments); };
    const ss = window.speechSynthesis;
    const origCancel = ss.cancel.bind(ss);
    ss.cancel = () => { note({ quoi: 'appareil: cancel()' }); return origCancel(); };
    const origSpeak = ss.speak.bind(ss);
    ss.speak = (u) => {
      const a = window.__audio;
      note({ quoi: 'APPAREIL speak', texte: String(u.text).slice(0, 40), pendantLePremium: !!a && !a.paused && !a.ended });
      return origSpeak(u);
    };
  `,
});
await send('Fetch.enable', { patterns: [{ urlPattern: '*/api/tts*' }] });
await send('Page.navigate', { url: base });
await wait(2500);

// Le scénario: une phrase française (voix premium) puis, pendant qu'elle joue,
// un mot d'anglais — que l'app dit TOUJOURS avec la voix de l'appareil, parce
// qu'une voix française qui prononce « butterfly » n'apprend rien à personne.
const resultat = await evAsync(`(async () => {
  const m = await import('/src/utils/speech.js');
  window.__m = m;
  m.setVoicePrefs({ enabled: true, accent: 'auto', voice: '', ttsVoice: 'auto', speed: 1 });
  await new Promise((r) => setTimeout(r, 600));      // laisser /api/tts/status répondre
  window.__journal.push({ ms: 0, quoi: '— 1. le MP3 joue, puis un mot d’anglais —' });
  m.speak('Bonjour Ryan, écoute bien la question.'); // premium
  await new Promise((r) => setTimeout(r, 700));
  m.speak('butterfly', 'en');                        // appareil
  await new Promise((r) => setTimeout(r, 900));
  // L'ordre inverse: la voix de l'appareil parle, puis speakAndWait lance un
  // MP3 — c'est le chemin du tuteur oral, qui ne coupait rien du tout.
  window.__journal.push({ ms: 0, quoi: '— 2. l’appareil parle, puis speakAndWait —' });
  m.speak('butterfly', 'en');
  await new Promise((r) => setTimeout(r, 250));
  m.speakAndWait('Maintenant, épelle le mot.');
  await new Promise((r) => setTimeout(r, 900));
  return JSON.stringify(window.__journal);
})()`);

const lignes = JSON.parse(resultat || '[]');
console.log('\n— Qui parle, et quand —');
for (const l of lignes) {
  console.log(`  ${String(l.ms).padStart(6)} ms  ${l.quoi}${l.texte ? '  « ' + l.texte + ' »' : ''}${l.pendantLePremium ? '   ⚠ PENDANT LE PREMIUM' : ''}`);
}
const collisions = lignes.filter((l) => l.pendantLePremium);
console.log(collisions.length
  ? `\n❌ ${collisions.length} fois: la voix de l'appareil part pendant que le MP3 joue. DEUX VOIX.`
  : '\n✅ Jamais deux voix en même temps.');
ws.close();
process.exit(collisions.length ? 1 : 0);
