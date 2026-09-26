// Quand l'app tourne la page de la semaine.
//   node scripts/verif-semaine.mjs
//
// Pourquoi ce fichier: le samedi 26 sept. 2026 au soir, le chemin du Coach
// affichait encore « Dictée — Liste 2 » et « Stratégies C et D », alors que la
// liste 2 avait été remise la veille. Son père: « pour sa dictée, ça devrait
// changer automatiquement le vendredi après-midi ».
//
// La dictée et la remise des devoirs tombent le vendredi. Donc à partir du
// vendredi midi, « cette semaine » veut dire la semaine qui commence lundi —
// pour la liste d'orthographe, les stratégies des tables ET le cahier Jazz,
// qui doivent avancer ensemble.
import { build } from 'esbuild';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { rm } from 'node:fs/promises';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const paquet = join(tmpdir(), `sb-semaine-${process.pid}.mjs`);
await build({
  stdin: {
    contents: `
      export { listeCetteSemaine } from './src/data/orthographeQuotidien.js';
      export { strategiesCetteSemaine } from './src/data/tablesStrategies.js';
      export { moduleCetteSemaine, titreModule } from './src/data/cahierFrancais.js';
    `,
    resolveDir: racine, sourcefile: 'semaine.js', loader: 'js',
  },
  bundle: true, format: 'esm', platform: 'node', outfile: paquet, logLevel: 'error',
});
if (typeof globalThis.localStorage === 'undefined') {
  const m = new Map();
  globalThis.localStorage = {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k), clear: () => m.clear(),
  };
}
const { listeCetteSemaine, strategiesCetteSemaine, moduleCetteSemaine } = await import(pathToFileURL(paquet).href);

let échecs = 0;
// [ description, date, liste attendue, stratégies attendues, notion attendue ]
const CAS = [
  ['jeudi 24 sept., en classe',        new Date(2026, 8, 24, 16, 0), 2, 'C,D', 'Le déterminant'],
  ['vendredi 25 sept., le matin',      new Date(2026, 8, 25, 9, 0),  2, 'C,D', 'Le déterminant'],
  ['vendredi 25 sept., après la dictée', new Date(2026, 8, 25, 15, 0), 3, 'E,F', 'Le verbe'],
  ['samedi 26 sept.',                  new Date(2026, 8, 26, 17, 30), 3, 'E,F', 'Le verbe'],
  ['dimanche 27 sept.',                new Date(2026, 8, 27, 10, 0),  3, 'E,F', 'Le verbe'],
  ['lundi 28 sept., en classe',        new Date(2026, 8, 28, 8, 0),   3, 'E,F', 'Le verbe'],
  ['jeudi 1er oct.',                   new Date(2026, 9, 1, 18, 0),   3, 'E,F', 'Le verbe'],
  ['vendredi 2 oct., après-midi',      new Date(2026, 9, 2, 14, 0),   4, 'G,H', "L'adjectif"],
];

for (const [quand, date, liste, strats, notion] of CAS) {
  const l = listeCetteSemaine(date);
  const s = strategiesCetteSemaine(date).map((x) => x.id).join(',');
  const m = moduleCetteSemaine(date);
  const n = m ? m.notions[0] : '(aucun)';
  const ok = l.numero === liste && s === strats && n === notion;
  if (!ok) échecs++;
  console.log(`  ${ok ? 'ok   ' : 'ÉCHEC'}  ${quand.padEnd(34)} liste ${l.numero} · stratégies ${s} · ${n}`);
  if (!ok) console.log(`         attendu: liste ${liste} · stratégies ${strats} · ${notion}`);
}

await rm(paquet, { force: true });
console.log(échecs === 0 ? '\n✅ La semaine tourne le vendredi après-midi.\n' : `\n❌ ${échecs} échec(s).\n`);
process.exit(échecs === 0 ? 0 : 1);
