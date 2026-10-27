// Photographie des écrans SANS jouer de session — sûr sur le site en ligne:
// rien n'est répondu, donc rien n'est écrit dans l'historique de l'enfant.
//
//   node scripts/verif-ecrans.mjs <url> <profil> "<clic1||clic2>" <sortie.png> [attente ms après chaque clic]
//
// « @La famille » = un bouton-icône, trouvé par son aria-label.
// Pourquoi pas verif-session: le site en ligne charge plus lentement, et
// verif-session cliquait le profil avant que la page soit prête.
import { writeFileSync } from 'node:fs';

const [url, profil, chemin = '', out, attenteTxt = '4000'] = process.argv.slice(2);
const list = await (await fetch('http://127.0.0.1:9222/json/list')).json();
const page = list.find((t) => t.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const erreurs = [];
const send = (method, params = {}) =>
  new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); }
  if (m.method === 'Runtime.exceptionThrown') erreurs.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
});
await new Promise((r) => ws.addEventListener('open', r));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const ev = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true })).result.value;

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Page.navigate', { url });
await wait(4000);
// Le profil est choisi d'avance (comme sur l'appareil de l'enfant), puis on recharge.
await ev(`localStorage.setItem('sb_profile', ${JSON.stringify(profil)}); 'ok'`);
await send('Page.navigate', { url });
await wait(6000);

const clic = (t) => ev(`(() => {
  const els = [...document.querySelectorAll('button,a,[role=button]')];
  const t = ${JSON.stringify(t)};
  const el = t.startsWith('@')
    ? els.find((e) => e.getAttribute('aria-label') === t.slice(1))
    : els.find((e) => (e.textContent || '').includes(t));
  if (!el) return 'INTROUVABLE: ' + t;
  el.click(); return 'clic: ' + t;
})()`);
for (const t of chemin.split('||').filter(Boolean)) {
  console.log(await clic(t));
  await wait(Number(attenteTxt));
}
// TEXTE="Ce que Ryan" → imprime les lignes de l'écran à partir de ce texte
// (utile dans un panneau qui défile, que la capture ne montre pas en entier).
if (process.env.TEXTE) {
  const lignes = await ev(`document.body.innerText.split('\\n').map((l) => l.trim()).filter(Boolean)`);
  const i = lignes.findIndex((l) => l.toLowerCase().includes(process.env.TEXTE.toLowerCase()));
  console.log(i < 0 ? 'TEXTE introuvable' : lignes.slice(i, i + 30).join('\n'));
}
console.log(erreurs.length ? '⚠ ERREURS JS:\n' + erreurs.join('\n') : 'Aucune erreur JS.');
if (out) {
  const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  writeFileSync(out, Buffer.from(data, 'base64'));
  console.log('-> ' + out);
}
ws.close();
process.exit(0);
