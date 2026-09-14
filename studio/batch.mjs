/**
 * studio/batch.mjs — lance designer.mjs pour chaque brief d'un fichier JSON, 3 à la fois.
 *
 *   node studio/batch.mjs studio/briefs/jazz-t1.json [--ref page.jpg]...
 *
 * Les --ref sont ajoutées à chaque image (pages du cahier + l'image « étalon » approuvée).
 * Une image déjà présente dans studio/out/ n'est pas refaite (supprime-la pour la refaire).
 */
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const [file, ...rest] = process.argv.slice(2);
const refs = rest.flatMap((a, i) => (a === '--ref' ? ['--ref', rest[i + 1]] : []));
const briefs = JSON.parse(fs.readFileSync(file, 'utf8'));

const run = (b) => new Promise((resolve) => {
  if (fs.existsSync(path.join(here, 'out', `${b.out}.jpg`))) { console.log(`skip ${b.out} (déjà là)`); return resolve(true); }
  const p = spawn(process.execPath, [path.join(here, 'designer.mjs'), b.brief, '--aspect', b.aspect || '4:3', '--size', b.size || '1K', '--out', b.out, ...refs], { stdio: ['ignore', 'pipe', 'pipe'] });
  let log = '';
  p.stdout.on('data', (d) => { log += d; });
  p.stderr.on('data', (d) => { log += d; });
  p.on('close', (code) => { console.log(`${code === 0 ? 'OK  ' : 'FAIL'} ${b.out}: ${log.trim()}`); resolve(code === 0); });
});

const queue = [...briefs];
let ok = 0;
await Promise.all(Array.from({ length: 3 }, async () => {
  while (queue.length) { if (await run(queue.shift())) ok++; }
}));
console.log(`\n${ok}/${briefs.length} images`);
