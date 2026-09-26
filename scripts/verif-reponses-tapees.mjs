// Vérifie le jugement des réponses tapées, et QUELLES questions passent en
// « tapé » dans les vrais générateurs. À relancer après toute modif de
// src/utils/reponseTapee.js:  node scripts/verif-reponses-tapees.mjs
//
// Pourquoi ce fichier: `vite build` ne prouve rien (il passe sur des
// composants qui plantent au rendu) et le 88 % de matcha_nombres venait
// justement d'une hypothèse jamais vérifiée.
import { modeTape, memeReponse, diagnosticTape } from '../src/utils/reponseTapee.js';

let échecs = 0;
function verifie(nom, obtenu, attendu) {
  const ok = JSON.stringify(obtenu) === JSON.stringify(attendu);
  if (!ok) échecs++;
  console.log((ok ? '  ok   ' : '  ÉCHEC') + '  ' + nom
    + (ok ? '' : `\n         attendu: ${JSON.stringify(attendu)}\n         obtenu : ${JSON.stringify(obtenu)}`));
}

console.log('\n— Quelles questions deviennent tapées —');
verifie('matcha blocs', modeTape({ category: 'matcha_nombres', type: 'blocs', correct: 1626 }), 'nombre');
verifie('matcha lettres→chiffres', modeTape({ category: 'matcha_nombres', type: 'lettres_chiffres', correct: 8504 }), 'nombre');
verifie('matcha ajouter_deux', modeTape({ category: 'matcha_nombres', type: 'ajouter_deux', correct: 2398 }), 'nombre');
verifie('matcha comparer garde ses choix', modeTape({ category: 'matcha_nombres', type: 'comparer', correct: '>' }), null);
verifie('matcha ordre garde ses choix', modeTape({ category: 'matcha_nombres', type: 'ordre', correct: '1 , 2' }), null);
verifie('matcha position_nom garde ses choix', modeTape({ category: 'matcha_nombres', type: 'position_nom', correct: 'dizaines' }), null);
verifie('matcha chiffres→lettres garde ses choix', modeTape({ category: 'matcha_nombres', type: 'chiffres_lettres', correct: 'deux mille' }), null);
verifie('terme manquant', modeTape({ category: 'terme', type: 'terme_manquant', correct: 27 }), 'nombre');
verifie('calcul (digit pad existant)', modeTape({ category: 'calcul', useDigitPad: true, correct: 42 }), 'nombre');
verifie('passé composé conjugué', modeTape({ category: 'passe_compose', type: 'conjugate_er', correct: "j'ai mangé" }), 'mot');
verifie('passé composé auxiliaire', modeTape({ category: 'passe_compose', type: 'auxiliary', correct: 'avoir' }), null);
verifie('adjectif intouché', modeTape({ category: 'adjectif', type: 'feminin', correct: 'grande' }), null);
verifie('nyla intouchée', modeTape({ category: 'nyla_count', type: 'compter', correct: 4 }), null);
verifie('phrase trop longue refusée', modeTape({ category: 'conjugaison', type: 'conjugaison', correct: 'une phrase beaucoup trop longue à taper' }), null);

console.log('\n— Ce qu’on accepte (nombres) —');
verifie('2407', memeReponse('2407', 2407, 'nombre'), true);
verifie('« 2 407 » avec espace', memeReponse('2 407', 2407, 'nombre'), true);
verifie('247 refusé', memeReponse('247', 2407, 'nombre'), false);
verifie('vide refusé', memeReponse('', 2407, 'nombre'), false);

console.log('\n— Ce qu’on accepte (mots) —');
verifie('majuscule', memeReponse("J'ai mangé", "j'ai mangé", 'mot'), true);
verifie('apostrophe courbe', memeReponse('j’ai mangé', "j'ai mangé", 'mot'), true);
verifie('sans le pronom', memeReponse('ai mangé', "j'ai mangé", 'mot'), true);
verifie('avec le pronom en trop', memeReponse('je suis', 'suis', 'mot'), true);
verifie('espaces en trop', memeReponse('  nous avons   mangé ', 'nous avons mangé', 'mot'), true);
verifie('accent manquant refusé', memeReponse('j\'ai mange', "j'ai mangé", 'mot'), false);
verifie('mauvais auxiliaire refusé', memeReponse('j\'ai allé', 'je suis allé', 'mot'), false);
verifie('vide refusé', memeReponse('', "j'ai mangé", 'mot'), false);

console.log('\n— Ses trois malentendus, reconnus —');
verifie('620 écrit 6200 (zéro en trop)', diagnosticTape('6200', 620, 'nombre'), 'Un zéro en trop. 3 chiffres suffisent — compte-les.');
verifie('2 407 écrit 247 (colonne vide)', diagnosticTape('247', 2407, 'nombre'), "Il manque le 0 de la colonne vide. Une colonne sans rien, ça s'écrit 0.");
verifie('5 140 écrit 5 014 (désordre)', diagnosticTape('5014', 5140, 'nombre'), 'Tu as les bons chiffres, mais pas à la bonne place.');
verifie('2 398 écrit 2 358 (la moitié de la consigne)', diagnosticTape('2358', 2398, 'nombre', { deuxConsignes: true }), 'Il te manque exactement 4 dizaines — la deuxième moitié de la consigne.');
verifie('4 358 écrit 2 358 (2 um oubliées)', diagnosticTape('2358', 4358, 'nombre', { deuxConsignes: true }), 'Il te manque exactement 2 unités de mille — la deuxième moitié de la consigne.');
// Sans consigne en deux temps (un terme manquant), on ne lui invente pas une
// deuxième moitié qui n'existe pas.
verifie('11 écrit 1 (terme manquant)', diagnosticTape('1', 11, 'nombre'), 'Il te manque exactement 1 dizaine (10).');
verifie('à un près', diagnosticTape('62', 63, 'nombre'), 'À un près. Recompte une dernière fois, lentement.');
// « 1 » au lieu de « 10 » dans un problème de bonbons: pas une histoire de
// colonnes. Les messages de valeur de position sont réservés aux vrais nombres.
verifie('10 écrit 1: pas de leçon de colonnes', diagnosticTape('1', 10, 'nombre'), null);
verifie('6 écrit 60: pas de leçon de colonnes', diagnosticTape('60', 6, 'nombre'), null);
verifie('réponse sans rapport: pas de « presque »', diagnosticTape('17', 2398, 'nombre'), null);
verifie('accent oublié', diagnosticTape('j ai mange', "j'ai mangé", 'mot'), "C'est le bon mot — il manque juste l'accent. En français, l'accent fait partie du mot.");
verifie('une lettre en trop', diagnosticTape("j'ai mangés", "j'ai mangé", 'mot'), 'Tu y es presque: une lettre ou deux à changer.');
verifie('autre auxiliaire: pas de « presque »', diagnosticTape("j'ai allé", 'je suis allé', 'mot'), null);
verifie('bonne réponse: pas de diagnostic', diagnosticTape('2398', 2398, 'nombre'), null);

// ===== Sur les vrais générateurs: combien de questions deviennent tapées, et
// est-ce qu'aucune ne se retrouve sans choix ET sans façon de répondre? =====
//
// Les générateurs importent « ../utils/studyRounds » sans l'extension .js: Vite
// le résout, node brut non. On passe donc par esbuild (déjà là, c'est Vite) pour
// les regrouper dans un seul module temporaire.
console.log('\n— Sur 400 questions de chaque générateur —');
const { build } = await import('esbuild');
const { tmpdir } = await import('node:os');
const { join } = await import('node:path');
const { fileURLToPath, pathToFileURL } = await import('node:url');
const racine = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const paquet = join(tmpdir(), `sb-generateurs-${process.pid}.mjs`);
await build({
  stdin: {
    contents: `
      export { generateMatchaNombres } from './src/generators/matcha1.js';
      export { generateTerme } from './src/generators/terme.js';
      export { generateRelational } from './src/generators/relational.js';
      export { generateMental } from './src/generators/mental.js';
      export { generatePasseCompose } from './src/generators/passeCompose.js';
      export { generatePresentIndicatif } from './src/generators/presentIndicatif.js';
      export { generateConjugaison } from './src/generators/conjugaison.js';
    `,
    resolveDir: racine,
    sourcefile: 'generateurs.js',
    loader: 'js',
  },
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: paquet,
  logLevel: 'error',
});
// Les générateurs lisent localStorage (niveaux, anti-répétition). En node il
// n'existe pas: une mémoire vide suffit, on ne teste pas la progression ici.
if (typeof globalThis.localStorage === 'undefined') {
  const m = new Map();
  globalThis.localStorage = {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    clear: () => m.clear(),
  };
}
const {
  generateMatchaNombres, generateTerme, generateRelational, generateMental,
  generatePasseCompose, generatePresentIndicatif, generateConjugaison,
} = await import(pathToFileURL(paquet).href);

const générateurs = {
  matcha_nombres: generateMatchaNombres,
  terme: generateTerme,
  relational: generateRelational,
  mental: generateMental,
  passe_compose: generatePasseCompose,
  present_indicatif: generatePresentIndicatif,
  conjugaison: generateConjugaison,
};

for (const [nom, gen] of Object.entries(générateurs)) {
  const parType = {};
  for (let i = 0; i < 400; i++) {
    const q = gen();
    const m = modeTape(q);
    const clé = q.type || '(sans type)';
    parType[clé] = parType[clé] || { tapé: 0, choix: 0, mode: m };
    parType[clé][m ? 'tapé' : 'choix']++;
    // Un piège réel: une question tapée dont la bonne réponse ne se retape pas
    // exactement (espaces, majuscule) serait impossible à réussir.
    if (m && !memeReponse(q.correct, q.correct, m)) {
      échecs++;
      console.log(`  ÉCHEC  ${nom}/${clé}: sa propre réponse « ${q.correct} » est jugée fausse`);
    }
    if (!m && !Array.isArray(q.options)) {
      échecs++;
      console.log(`  ÉCHEC  ${nom}/${clé}: ni choix ni réponse tapée — écran sans issue`);
    }
    if (m === 'nombre' && !Number.isFinite(Number(q.correct))) {
      échecs++;
      console.log(`  ÉCHEC  ${nom}/${clé}: mode nombre mais réponse « ${q.correct} »`);
    }
  }
  const lignes = Object.entries(parType)
    .map(([t, v]) => `${t}=${v.mode || 'choix'}`)
    .join(' · ');
  const tapés = Object.values(parType).reduce((s, v) => s + v.tapé, 0);
  console.log(`  ${nom}: ${tapés}/400 tapées  (${lignes})`);
}

await (await import('node:fs/promises')).rm(paquet, { force: true });

console.log(échecs === 0 ? '\n✅ Tout passe.\n' : `\n❌ ${échecs} échec(s).\n`);
process.exit(échecs === 0 ? 0 : 1);
