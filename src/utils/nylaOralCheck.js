// Juger à voix haute: ce que Nyla a DIT, comparé à ce qu'on attendait.
//
// La transcription d'une enfant de cinq ans n'est jamais propre. « Compte
// jusqu'à 20 » revient en « un deux trois quatre cinq... » ou en « 1 2 3 4 5 »
// ou en « undeuxtrois », avec des hésitations, des « euh » et parfois un mot
// avalé. Un `===` sur la chaîne échouerait presque à chaque fois et elle
// entendrait « non » alors qu'elle a eu raison — exactement ce qu'il ne faut
// pas faire à un enfant qui pleure quand il se trompe.
//
// D'où trois principes:
//   1. On normalise durement (accents, tirets, ponctuation, mots parasites).
//   2. Pour une SUITE, on vérifie l'ordre, pas l'exhaustivité: si elle a dit
//      1 à 17 sur 20, c'est « presque », pas « faux » — et on sait où ça s'est
//      arrêté, donc on peut la relancer au bon endroit.
//   3. Ce qui n'est pas vérifiable localement (« nomme un mot qui rime ») part
//      au modèle. Le local répond en zéro milliseconde et gratuitement; le
//      modèle ne sert que là où il apporte vraiment un jugement.

const NOMBRES = {
  zéro: 0, zero: 0, un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7,
  huit: 8, neuf: 9, dix: 10, onze: 11, douze: 12, treize: 13, quatorze: 14, quinze: 15,
  seize: 16, dixsept: 17, dixhuit: 18, dixneuf: 19, vingt: 20,
  vingtetun: 21, vingtdeux: 22, vingttrois: 23, vingtquatre: 24, vingtcinq: 25,
  vingtsix: 26, vingtsept: 27, vingthuit: 28, vingtneuf: 29, trente: 30,
};

// Mots qui ne veulent rien dire pour la correction, mais qu'une enfant dit tout
// le temps — et que Scribe transcrit fidèlement.
const PARASITES = new Set(['euh', 'heu', 'hum', 'et', 'puis', 'après', 'alors', 'ben', 'bah',
  'je', 'sais', 'pas', 'cest', 'ça', 'la', 'le', 'les', 'de', 'du', 'des', 'un', 'une',
  'attends', 'hein', 'voilà', 'ok', 'oui']);

export function normaliser(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // accents
    .replace(/['’-]/g, '')                            // l'hiver → lhiver, dix-sept → dixsept
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// La suite de nombres entendue, dans l'ordre où elle a été dite.
export function nombresEntendus(texte) {
  const out = [];
  for (const mot of normaliser(texte).split(' ')) {
    if (!mot) continue;
    if (/^\d+$/.test(mot)) { out.push(parseInt(mot, 10)); continue; }
    const cle = mot.replace(/\s/g, '');
    if (cle in NOMBRES) out.push(NOMBRES[cle]);
  }
  return out;
}

export function motsEntendus(texte) {
  return normaliser(texte).split(' ').filter((m) => m && !PARASITES.has(m));
}

// Combien d'éléments de `attendu` ont été dits DANS L'ORDRE, depuis le début.
function prefixeCommun(dits, attendu) {
  let i = 0;
  let j = 0;
  while (i < attendu.length && j < dits.length) {
    if (dits[j] === attendu[i]) { i++; j++; } else { j++; }
  }
  return i;
}

/**
 * Juge une réponse parlée.
 * Rend { verdict: 'bravo' | 'presque' | 'encore' | 'modele', ... }
 * 'modele' = le local ne peut pas trancher, il faut demander au modèle.
 */
export function jugerOral(question, transcript) {
  const brut = String(transcript || '').trim();
  if (!brut) return { verdict: 'encore', raison: 'rien entendu' };

  // --- Une suite: les nombres, les jours ---
  if (question.verif === 'liste') {
    const numerique = typeof question.attendu[0] === 'number';
    const dits = numerique ? nombresEntendus(brut) : motsEntendus(brut).map(normaliser);
    const attendu = numerique ? question.attendu : question.attendu.map(normaliser);
    const bons = prefixeCommun(dits, attendu);

    if (bons >= attendu.length) {
      return { verdict: 'bravo', jusqua: attendu[attendu.length - 1], bons };
    }
    // Les deux tiers, c'est déjà une vraie réussite partielle: on la nomme, et
    // on redonne le point exact où reprendre.
    if (bons >= Math.max(2, Math.ceil(attendu.length * 0.6))) {
      return { verdict: 'presque', bons, bloqueA: question.attendu[bons], jusqua: question.attendu[bons - 1] };
    }
    return { verdict: 'encore', bons, bloqueA: question.attendu[bons] };
  }

  // --- Une réponse précise ---
  if (question.verif === 'exact') {
    const dit = normaliser(brut);
    const mots = motsEntendus(brut);
    const ok = question.attendu.some((a) => {
      const n = normaliser(a);
      return dit.includes(n) || mots.includes(n);
    });
    return ok ? { verdict: 'bravo' } : { verdict: 'encore' };
  }

  // --- « Nomme-moi trois … » ---
  if (question.verif === 'parmi') {
    const dit = normaliser(brut);
    const trouves = question.attendu.filter((a) => dit.includes(normaliser(a)));
    const uniques = [...new Set(trouves.map((t) => normaliser(t)))];
    const vises = question.combien || 3;
    if (uniques.length >= vises) return { verdict: 'bravo', trouves };
    if (uniques.length > 0) return { verdict: 'presque', trouves, manque: vises - uniques.length };
    return { verdict: 'encore', trouves: [] };
  }

  // --- Une consigne avec une contrainte simple ---
  if (question.commencePar) {
    const mots = motsEntendus(brut);
    const bon = mots.find((m) => m.startsWith(normaliser(question.commencePar)));
    if (bon) return { verdict: 'bravo', mot: bon };
    // Elle a dit quelque chose, mais pas avec le bon son: le modèle saura le
    // dire gentiment, et reconnaître un mot qu'on n'a pas prévu.
    return { verdict: 'modele' };
  }

  // --- Question ouverte: seul le modèle peut juger ---
  return { verdict: 'modele' };
}
