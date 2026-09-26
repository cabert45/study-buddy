// Joue une VRAIE session dans un vrai Chrome et raconte ce qu'elle voit:
// comment chaque question se répond (choix, pavé de chiffres, champ texte),
// ce que l'app corrige, et si un écran se retrouve sans issue.
//
// Pourquoi ce fichier existe: `vite build` passe sur du code cassé, et les
// tests unitaires ne voient pas les phrases dites au mauvais moment. En une
// session il a trouvé deux corrections qui enseignaient le faux:
//   - « la deuxième moitié de la consigne » sur un terme manquant, qui n'a
//     qu'une consigne;
//   - « il manque le 0 de la colonne vide » à un enfant qui a répondu 1 au
//     lieu de 10 dans un problème de bonbons.
//
// Utilisation:
//   1) npx vite build && npx vite preview --port 4173 --host 127.0.0.1
//   2) chrome --headless=new --remote-debugging-port=9222 \
//        --user-data-dir=<dossier temporaire> about:blank
//   3) node scripts/verif-session.mjs <url> "<chemin de clics>" <nb> [sortie.png]
//
// Le chemin de clics est séparé par «  ||  », par exemple:
//   "Mathématiques||Terme manquant"   "Passé composé"   "🧠 Mental"
// nb = combien de questions jouer (0 = juste ouvrir et photographier).
//
// Il répond juste une question sur deux quand il peut calculer la réponse à
// partir de l'énoncé (« ? + 37 = 47 »), sinon il tape n'importe quoi: le but
// est de voir les DEUX écrans, celui qui félicite et celui qui corrige.
// TAPE=123456 node scripts/verif-session.mjs ... force ce qu'il tape (utile
// pour vérifier qu'une case laisse écrire un nombre trop long au lieu de
// bloquer la touche et de souffler la longueur de la réponse).
import { writeFileSync } from 'node:fs';

const [url, cible, nbTxt = '6', out] = process.argv.slice(2);
const nb = Number(nbTxt);

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
await wait(3500);

const clic = (t) => ev(`(() => {
  const els = [...document.querySelectorAll('button,a,[role=button]')];
  const el = els.find((e) => (e.textContent || '').includes(${JSON.stringify(t)}));
  if (!el) return 'INTROUVABLE: ' + ${JSON.stringify(t)};
  el.click(); return 'clic: ' + ${JSON.stringify(t)};
})()`);

const clicExact = (t) => ev(`(() => {
  const el = [...document.querySelectorAll('button')].find((e) => (e.textContent || '').trim() === ${JSON.stringify(t)});
  if (!el) return 'INTROUVABLE'; el.click(); return 'ok';
})()`);

// Ce que l'écran offre pour répondre
const etat = () => ev(`(() => {
  const carte = document.querySelector('.border-l-lava') || document.querySelector('.bg-white.rounded-2xl');
  const txt = carte ? carte.innerText : document.body.innerText;
  const question = (carte ? (carte.querySelector('p.text-xl, .text-lg.font-heading') || {}).innerText : '') || '';
  const champ = !!document.querySelector('input[type=text]');
  const pave = [...document.querySelectorAll('button')].some((b) => b.textContent.trim() === 'OK');
  const grille = [...document.querySelectorAll('div.grid')].find((g) => g.children.length >= 2
    && [...g.children].every((c) => c.tagName === 'BUTTON')
    && !g.querySelector('button').textContent.match(/^[0-9⌫]$/));
  const choix = grille ? [...grille.children].map((b) => b.textContent.trim()) : [];
  return JSON.stringify({ question: question.trim(), champ, pave, choix, texte: txt.slice(0, 700) });
})()`);

console.log(await clic('Ryan'));
await wait(1000);
await clic('Plus tard');   // la bannière « Installer Study Buddy »
await wait(1200);
for (const c of cible.split('||')) { console.log(await clic(c.trim())); await wait(1400); }
await wait(1500);

let fini = false;
for (let i = 1; i <= nb && !fini; i++) {
  const e = JSON.parse(await etat());
  const commentRepondre = e.champ ? 'champ texte' : e.pave ? 'pavé de chiffres' : e.choix.length ? `${e.choix.length} choix` : 'RIEN';
  console.log(`\nQ${i} [${commentRepondre}] ${e.question.replace(/\n/g, ' / ').slice(0, 90)}`);
  if (commentRepondre === 'RIEN') { console.log('  ⚠ ÉCRAN SANS ISSUE\n' + e.texte); break; }
  if (e.champ && e.choix.length) console.log('  ⚠ champ ET choix en même temps');

  if (e.pave) {
    // « ? + 45 = 72 », « 45 + 9 = ? »: on calcule la bonne réponse quand on peut
    const m = e.question.replace(/\s/g, '').match(/^(\?|\d+)([+−–-])(\?|\d+)=(\?|\d+)$/);
    let rep = null;
    if (m) {
      const [, a, op, b, c] = m;
      const n = Number;
      if (c === '?') rep = op === '+' ? n(a) + n(b) : n(a) - n(b);
      else if (a === '?') rep = op === '+' ? n(c) - n(b) : n(c) + n(b);
      else if (b === '?') rep = op === '+' ? n(c) - n(a) : n(a) - n(c);
    }
    const aTaper = i % 2 === 1 && rep !== null ? String(rep) : (process.env.TAPE || '1');
    console.log(`  je tape ${aTaper}${rep !== null ? ` (attendu: ${rep})` : ' (réponse inconnue, sûrement fausse)'}`);
    for (const d of aTaper.split('')) { await clicExact(d); await wait(80); }
    const dansLaCase = await ev(`[...document.querySelectorAll('.border-fox')].map((e) => e.textContent.trim()).filter(Boolean).join(' ')`);
    if (dansLaCase !== aTaper) console.log(`  la case montre: ${dansLaCase}`);
    await clicExact('OK');
  } else if (e.champ) {
    const aTaper = process.env.TAPE || (i % 2 === 1 ? 'zzz' : 'j’ai mange');
    console.log(`  j'écris « ${aTaper} »`);
    await ev(`(() => {
      const el = document.querySelector('input[type=text]');
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, ${JSON.stringify(aTaper)});
      el.dispatchEvent(new Event('input', { bubbles: true }));
    })()`);
    await wait(300);
    await clic('Vérifier ma réponse');
  } else {
    await clicExact(e.choix[0]);
  }
  await wait(1500);

  const bloc = JSON.parse(await etat()).texte;
  const verdict = /Bravo/.test(bloc) ? '✅ Bravo'
    : /Presque/.test(bloc) ? '🤏 Presque'
      : /La r[ée]ponse est/.test(bloc) ? '🔁 faux' : '?';
  const ligne = (bloc.match(/(Presque!.*|La r[ée]ponse est.*|Tu as écrit:.*)/g) || []).slice(0, 3).join(' | ');
  console.log(`  → ${verdict}  ${ligne}`);
  if (verdict === '?') { console.log('  ⚠ aucune correction affichée\n' + bloc.slice(0, 400)); break; }

  if (String(await clic('Suivant')).startsWith('INTROUVABLE')) { await clic('Voir mes resultats'); fini = true; }
  await wait(1600);
}

// Débordements et cibles tactiles (la norme Apple/Google est 44 px)
console.log('\n' + await ev(`(() => {
  const vw = document.documentElement.clientWidth;
  const l = ['viewport=' + vw + ' scrollWidth=' + document.documentElement.scrollWidth];
  const vus = new Set();
  document.querySelectorAll('body *').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 && r.height < 1) return;
    if (r.right > vw + 1 || r.left < -1) {
      const cls = typeof el.className === 'string' ? el.className : '';
      if (vus.has(el.tagName + cls)) return; vus.add(el.tagName + cls);
      l.push('  DEPASSE ' + el.tagName.toLowerCase() + ' right=' + Math.round(r.right) + ' | «' + (el.textContent || '').trim().slice(0, 30) + '»');
    }
  });
  document.querySelectorAll('button,input').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && r.height < 40) {
      const cls = typeof el.className === 'string' ? el.className : '';
      if (vus.has('P' + cls)) return; vus.add('P' + cls);
      l.push('  PETIT h=' + Math.round(r.height) + ' | «' + (el.textContent || '').trim().slice(0, 30) + '»');
    }
  });
  return l.join('\\n');
})()`));

console.log(erreurs.length ? '\n⚠ ERREURS JS:\n' + erreurs.join('\n') : '\nAucune erreur JS.');

if (out) {
  const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  writeFileSync(out, Buffer.from(data, 'base64'));
  console.log('-> ' + out);
}
ws.close();
process.exit(0);
