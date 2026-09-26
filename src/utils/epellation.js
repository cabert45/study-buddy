// Entendre un enfant ÉPELER un mot, et en retirer des lettres.
//
// Mesuré avant d'écrire une ligne (26 sept 2026), en envoyant de la vraie voix
// à Scribe. Le résultat décide de tout:
//
//   « S A V A N T »            -> « S A V A N T »        parfait
//   « M A I S O N »            -> « M-A-I-S-O-N »        parfait
//   « esse, a, vé, a, enne, té » -> « Yes A V A N T »     récupérable
//   « S... A... V... A... N... T » -> « Ça se-- euh, va, euh, et en... te »
//
// Autrement dit: quand on épelle NETTEMENT, la transcription est excellente.
// Quand on hésite — et un enfant de huit ans hésite — elle part en bouillie.
// C'est pour ça que ce fichier existe: il rattrape ce qui est rattrapable et,
// surtout, il sait dire « je n'ai pas compris » au lieu d'inventer une faute
// que Ryan n'a pas faite. Lui annoncer une erreur imaginaire serait pire que
// de ne rien annoncer du tout — il pleure quand il se trompe.
//
// Le dernier filet reste humain: le texte entendu s'affiche et se corrige
// avant d'être jugé (comme « Vous avez dit » chez Prepara).

// Le nom des lettres, tel qu'on les prononce — et tel que Scribe les écrit.
const NOMS = {
  a: 'a', ah: 'a',
  be: 'b', bé: 'b', bee: 'b',
  ce: 'c', cé: 'c', se: 'c', say: 'c',
  de: 'd', dé: 'd',
  e: 'e', eu: 'e',
  ef: 'f', eff: 'f', effe: 'f', ef2: 'f',
  ge: 'g', gé: 'g', je: 'g',
  ache: 'h', hache: 'h', ash: 'h',
  i: 'i',
  ji: 'j', gi: 'j',
  ka: 'k', k: 'k',
  el: 'l', elle: 'l', ell: 'l',
  em: 'm', emme: 'm', aime: 'm',
  en: 'n', enne: 'n', aine: 'n',
  o: 'o', oh: 'o',
  pe: 'p', pé: 'p',
  ku: 'q', qu: 'q', cu: 'q', queue: 'q',
  er: 'r', erre: 'r', air: 'r', aire: 'r',
  // « yes »: ce n'est pas de l'anglais, c'est Scribe qui entend « esse ».
  // Mesuré: « esse, a, vé, a, enne, té » ressort « Yes A V A N T ».
  es: 's', esse: 's', ess: 's', yes: 's',
  te: 't', té: 't',
  u: 'u',
  ve: 'v', vé: 'v',
  ix: 'x', ixe: 'x',
  ze: 'z', zed: 'z', zede: 'z', zède: 'z',
};

// « double vé », « i grec »: deux mots pour une lettre.
const COMPOSES = [
  [/double\s*v[eé]?/g, ' w '],
  [/i\s*grec/g, ' y '],
  [/e\s*accent\s*aigu/g, ' é '],
  [/e\s*accent\s*grave/g, ' è '],
  [/c\s*c[eé]?dille/g, ' ç '],
];

// Des mots parasites que Scribe entend quand l'enfant hesite.
const BRUIT = new Set(['euh', 'heu', 'hum', 'ben', 'bah', 'attends', 'ça', 'ca',
  'et', 'puis', 'alors', 'hein', 'oui', 'non', 'je', 'sais', 'pas', 'le', 'la']);

function sansAccentMinuscule(s) {
  return String(s || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/**
 * Les lettres entendues dans une transcription d'epellation.
 * Rend { lettres: 'savant', surs: true|false }.
 * `surs` est faux quand il a fallu deviner beaucoup: on ne corrige pas un
 * enfant sur une transcription dont on n'est pas sur.
 */
export function lettresEntendues(transcript) {
  let t = String(transcript || '').toLowerCase();
  for (const [re, rempl] of COMPOSES) t = t.replace(re, rempl);
  // « M-A-I-S-O-N » et « M.A.I.S.O.N » sont des suites de lettres
  t = t.replace(/[-.,;:!?()«»"]/g, ' ');

  const jetons = t.split(/\s+/).filter(Boolean);
  const lettres = [];
  let devines = 0;
  let ignores = 0;

  for (const brut of jetons) {
    const j = sansAccentMinuscule(brut);
    if (!j) continue;
    if (BRUIT.has(j)) { ignores++; continue; }

    // Une seule lettre: c'est le cas propre, et de loin le plus frequent.
    if (/^[a-zç]$/.test(j)) { lettres.push(j); continue; }

    // Le nom d'une lettre (« esse », « vé »).
    if (NOMS[j]) { lettres.push(NOMS[j]); devines++; continue; }

    // « savant » dit d'un trait au lieu d'etre epele: on prend le mot tel quel.
    if (/^[a-zç]{2,}$/.test(j) && jetons.length <= 2) {
      lettres.push(...j.split(''));
      continue;
    }

    // Un paquet du genre « resonn »: Scribe a colle plusieurs lettres.
    if (/^[a-zç]{2,}$/.test(j)) { lettres.push(...j.split('')); devines += j.length; continue; }

    ignores++;
  }

  return {
    lettres: lettres.join(''),
    // Trop de devinettes ou trop de bruit: on preferera redemander.
    surs: devines <= 2 && ignores <= 2 && lettres.length > 0,
  };
}

/**
 * Compare ce qu'on a entendu au mot attendu.
 * Rend { verdict: 'bravo' | 'presque' | 'encore' | 'incompris', ... }
 *   - 'incompris' = la transcription n'est pas exploitable. On REDEMANDE,
 *     on n'annonce pas une faute.
 */
export function jugerEpellation(mot, transcript) {
  const cible = sansAccentMinuscule(mot).replace(/[^a-zç]/g, '');
  const { lettres, surs } = lettresEntendues(transcript);

  if (!lettres) return { verdict: 'incompris', entendu: '' };
  if (lettres === cible) return { verdict: 'bravo', entendu: lettres };

  // On compare par DISTANCE D'EDITION, pas position par position. « cat » pour
  // « chat », c'est UNE lettre oubliee — mais lettre a lettre, tout est
  // decale apres le trou et on compterait trois fautes. L'enfant aurait
  // entendu « recommence » pour un h manquant.
  const d = distance(cible, lettres);

  if (!surs && d > 1) return { verdict: 'incompris', entendu: lettres };
  if (d <= 2) {
    const i = premiereDifference(cible, lettres);
    return {
      verdict: 'presque',
      entendu: lettres,
      position: i,
      bonneLettre: cible[i],
      trop: lettres.length > cible.length,
      manque: lettres.length < cible.length,
    };
  }
  return { verdict: 'encore', entendu: lettres };
}

// Distance d'edition (Levenshtein): combien d'ajouts, de retraits ou de
// remplacements separent les deux mots.
function distance(a, b) {
  const m = a.length;
  const n = b.length;
  let prec = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(
        prec[j] + 1,
        cur[j - 1] + 1,
        prec[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    prec = cur;
  }
  return prec[n];
}

// La premiere lettre qui ne colle pas — celle qu'on peut lui nommer.
function premiereDifference(cible, lettres) {
  const n = Math.min(cible.length, lettres.length);
  for (let i = 0; i < n; i++) if (cible[i] !== lettres[i]) return i;
  return n;
}

// Le mot epele lettre par lettre, pour l'afficher ou le faire dire a la voix
// apres trois essais: « S, A, V, A, N, T ».
export function epeler(mot) {
  return String(mot).toUpperCase().split('').join(', ');
}
