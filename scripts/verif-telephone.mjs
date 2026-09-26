// Vérifier un écran dans un VRAI téléphone, sans rien installer.
//
// Pourquoi ce fichier existe: `vite build` passe sur du code cassé. Pendant la
// session du 22-26 sept. 2026, il a laissé passer cinq bugs que ce script a
// trouvés en une minute chacun:
//   - la page d'accueil de Ryan faisait 695 px de large sur un téléphone;
//   - une liste déclarée avant la variable dont elle dépend (écran blanc);
//   - une question sans réponse attendue, donc « Vérifier » mort;
//   - des cases figées à 3/4 chiffres qui bloquaient un nombre à 2 chiffres;
//   - l'effet d'un enfant écrasé par celui du parent (question 4 impossible).
//
// Utilisation:
//   1) lancer l'app:      npx vite build && npx vite preview --port 4173
//   2) lancer Chrome:     chrome --headless=new --remote-debugging-port=9222 \
//                           --user-data-dir=<dossier temporaire> about:blank
//   3) node scripts/verif-telephone.mjs <url> <sortie.png> "<actions>" [largeur]
//
// Les actions sont séparées par «  ||  » et jouées dans l'ordre:
//   Ryan              clique le premier bouton dont le texte contient « Ryan »
//   fill:8,6,0        remplit les <input> dans l'ordre
//   type:Bonjour.     écrit dans le premier <textarea>
//
// Le script imprime ce qui dépasse l'écran et les cibles tactiles sous 40 px
// (la norme est 44), puis enregistre une capture pleine hauteur.
//
// Pour ouvrir l'app directement sur un profil sans cliquer, poser
// localStorage.sb_profile dans une petite page de test qui charge le bundle.
// Capture une page dans un vrai Chrome en émulation téléphone (CDP).
// node phone.mjs <url> <sortie.png> [<clics: texte1||texte2>] [largeur]
import { writeFileSync } from 'node:fs';

const [url, out, clics = '', width = '390'] = process.argv.slice(2);

const list = await (await fetch('http://127.0.0.1:9222/json/list')).json();
const page = list.find((t) => t.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const send = (method, params = {}) =>
  new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); }
});
await new Promise((r) => ws.addEventListener('open', r));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: Number(width), height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true });
await send('Page.navigate', { url });
await wait(3500);

// Clique sur le premier élément cliquable dont le texte contient la chaîne
for (const cible of clics.split('||').map((s) => s.trim()).filter(Boolean)) {
  if (cible.startsWith('fill:')) {
    const vals = cible.slice(5).split(',');
    const r = await send('Runtime.evaluate', {
      expression: `(() => {
        const els = [...document.querySelectorAll('input')];
        const vals = ${JSON.stringify(vals)};
        if (els.length !== vals.length) return 'ATTENDU ' + vals.length + ' CASES, TROUVE ' + els.length;
        const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        els.forEach((el, i) => { set.call(el, vals[i]); el.dispatchEvent(new Event('input', { bubbles: true })); });
        return 'rempli: ' + vals.join('');
      })()`,
      returnByValue: true,
    });
    console.log('  ' + r.result.value);
    await wait(500);
    continue;
  }
  if (cible.startsWith('type:')) {
    const txt = cible.slice(5);
    const r = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('textarea, input[type=text]');
        if (!el) return 'PAS DE CHAMP';
        const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement : HTMLInputElement;
        Object.getOwnPropertyDescriptor(proto.prototype, 'value').set.call(el, ${JSON.stringify(txt)});
        el.dispatchEvent(new Event('input', { bubbles: true }));
        return 'ecrit: ' + ${JSON.stringify(txt)};
      })()`,
      returnByValue: true,
    });
    console.log('  ' + r.result.value);
    await wait(600);
    continue;
  }
  const expr = `(() => {
    const t = ${JSON.stringify(cible)};
    const els = [...document.querySelectorAll('button,a,[role=button]')];
    const el = els.find((e) => (e.textContent || '').includes(t));
    if (!el) return 'INTROUVABLE: ' + t;
    el.click();
    return 'clic: ' + t;
  })()`;
  const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
  console.log('  ' + r.result.value);
  await wait(1800);
}

// Mesure des débordements
const mesure = `(() => {
  const vw = document.documentElement.clientWidth;
  const l = ['viewport=' + vw + '  scrollWidth=' + document.documentElement.scrollWidth];
  const vus = new Set();
  document.querySelectorAll('body *').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 && r.height < 1) return;
    if (r.right > vw + 1 || r.left < -1) {
      const cls = typeof el.className === 'string' ? el.className : '';
      if (vus.has(el.tagName + cls)) return; vus.add(el.tagName + cls);
      l.push('  DEPASSE ' + el.tagName.toLowerCase() + ' left=' + Math.round(r.left) + ' right=' + Math.round(r.right) + ' | ' + cls.slice(0,60) + ' | «' + (el.textContent||'').trim().slice(0,22) + '»');
    }
  });
  // cibles tactiles trop petites (Apple/Google recommandent 44px)
  document.querySelectorAll('button,a,input').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && r.height < 40) {
      const cls = typeof el.className === 'string' ? el.className : '';
      if (vus.has('P' + cls)) return; vus.add('P' + cls);
      l.push('  PETIT h=' + Math.round(r.height) + ' | «' + (el.textContent||'').trim().slice(0,30) + '»');
    }
  });
  return l.join('\\n');
})()`;
const r = await send('Runtime.evaluate', { expression: mesure, returnByValue: true });
console.log(r.result.value);

const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
writeFileSync(out, Buffer.from(data, 'base64'));
console.log('  -> ' + out);
ws.close();
process.exit(0);
