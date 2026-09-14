/**
 * studio/designer.mjs — le graphiste de Study Buddy (Nano Banana Pro via l'API Interactions de
 * Gemini, même appel que content-engine/designer.mjs de Spotlight). Dessine les images des
 * questions de Ryan dans le style de ses cahiers.
 *
 *   node studio/designer.mjs "<brief>" [--aspect 4:3] [--size 1K|2K] [--model pro|flash]
 *        [--out name] [--ref page.jpg]...   (les --ref = photos de pages du cahier, style seulement)
 *
 * Écrit studio/out/<name>.jpg (hors git). Rien ne va dans l'app sans être vérifié:
 * copier l'image approuvée dans public/visuels/ à la main.
 *
 * Clé: GEMINI_API_KEY dans studio/.env, sinon lue dans le .env de Spotlight (jamais copiée ici).
 * Coût: ~0,13 $ par image 2K en pro.
 */
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));

function readEnv(file) {
  if (!fs.existsSync(file)) return {};
  return Object.fromEntries(fs.readFileSync(file, 'utf8').split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]));
}
const KEY = readEnv(path.join(here, '.env')).GEMINI_API_KEY
  || readEnv(path.join(os.homedir(), 'Downloads', 'spotlight-main', 'spotlight', 'apps', 'api', '.env')).GEMINI_API_KEY;

const MODELS = { pro: 'gemini-3-pro-image', flash: 'gemini-3.1-flash-image' };
const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/interactions';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const flagValues = new Set(args.flatMap((a, i) => (a.startsWith('--') ? [args[i + 1]] : [])));
const brief = args.find((a) => !a.startsWith('--') && !flagValues.has(a));
const refs = args.flatMap((a, i) => (a === '--ref' ? [args[i + 1]] : []));
const aspect = opt('aspect', '4:3');
const size = opt('size', '1K');
const model = MODELS[opt('model', 'pro')] || MODELS.pro;
const name = opt('out', 'img-' + new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19));

if (!brief) { console.error('usage: node studio/designer.mjs "<brief>" [--aspect 4:3] [--size 1K] [--out name] [--ref page.jpg]'); process.exit(1); }
if (!KEY) { console.error('GEMINI_API_KEY introuvable (studio/.env ou le .env de Spotlight)'); process.exit(1); }

const styleMd = fs.readFileSync(path.join(here, 'style', 'STYLE.md'), 'utf8');
const block = styleMd.split('## Prompt block (prepend to every generation)')[1]?.split('## Rules')[0]?.trim() || '';
const prompt = `${block}\n\nBrief: ${brief}\n\nOutput one illustration only.`;

const input = [{ type: 'text', text: prompt }];
for (const f of refs) {
  if (!fs.existsSync(f)) { console.error(`référence introuvable: ${f}`); process.exit(1); }
  input.push({ type: 'image', mime_type: f.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg', data: fs.readFileSync(f).toString('base64') });
}

const body = { model, input, response_format: { type: 'image', mime_type: 'image/jpeg', aspect_ratio: aspect, image_size: size } };
const t0 = Date.now();
const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'x-goog-api-key': KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const raw = await res.text();
if (!res.ok) { console.error(`Gemini ${res.status}: ${raw.slice(0, 400)}`); process.exit(2); }
const parsed = JSON.parse(raw);
const b64 = parsed?.output_image?.data || (parsed?.steps || []).flatMap((s) => s?.content || [])
  .map((b) => (b?.type === 'image' && b?.data) || b?.inline_data?.data || b?.inlineData?.data)
  .find((d) => typeof d === 'string' && d.length > 100);
if (!b64) { console.error('pas d\'image dans la réponse; clés=' + Object.keys(parsed)); process.exit(3); }

fs.mkdirSync(path.join(here, 'out'), { recursive: true });
const file = path.join(here, 'out', `${name}.jpg`);
fs.writeFileSync(file, Buffer.from(b64, 'base64'));
console.log(`saved ${file} (${Math.round(fs.statSync(file).size / 1024)} KB, ${model}, ${aspect} ${size}, ${((Date.now() - t0) / 1000).toFixed(0)}s, refs=${refs.length})`);
