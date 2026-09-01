// Distracteurs à choix multiples — helpers garantis de se terminer.
//
// Plusieurs générateurs remplissaient leurs options avec une boucle du genre
//   while (options.size < 4) { const fake = correct + rand(-5, 5);
//                              if (fake !== correct && fake > 0 && fake <= 99) options.add(fake); }
// Ce plafond fixe à 99 (ou 999) bouclait à l'infini dès que la bonne réponse
// dépassait le plafond: aucun candidat ne pouvait plus être accepté, la boucle
// tournait pour toujours et l'onglet gelait. D'autres faisaient
//   while (options.size < 4) { options.add(uneSeuleValeurConstante); }
// qui ne peut jamais faire grossir un Set au-delà de 1 ajout.
//
// Les deux helpers ci-dessous sont bornés: ils préfèrent rendre moins de
// 4 options plutôt que de ne jamais rendre la main.

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Options numériques autour de `correct`.
 * L'écart s'adapte à la taille de la réponse, donc ça marche aussi bien pour
 * 7 que pour 632. `min` / `max` restent optionnels et ne sont plus des pièges:
 * si l'aléatoire n'y arrive pas, un remplissage déterministe prend le relais.
 */
export function numericOptions(correct, { spread, min = 1, max = Infinity, count = 4 } = {}) {
  const range = spread ?? Math.max(5, Math.min(25, Math.round(Math.abs(correct) * 0.15)));
  const opts = new Set([correct]);

  for (let tries = 0; opts.size < count && tries < 200; tries++) {
    const fake = correct + randInt(-range, range);
    if (fake !== correct && fake >= min && fake <= max) opts.add(fake);
  }

  // Filet déterministe: on s'éloigne pas à pas de la bonne réponse.
  for (let offset = 1; opts.size < count && offset <= 500; offset++) {
    if (correct - offset >= min) opts.add(correct - offset);
    if (opts.size < count && correct + offset <= max) opts.add(correct + offset);
  }

  return shuffle([...opts].slice(0, count));
}

/**
 * Complète un Set d'options avec des candidats (mots, formes verbales…).
 * S'arrête quand il y a assez d'options OU quand les candidats sont épuisés —
 * jamais de boucle infinie même si tous les candidats font doublon.
 */
export function fillOptions(options, candidates, count = 4) {
  for (const c of shuffle(candidates)) {
    if (options.size >= count) break;
    if (c != null && c !== '') options.add(c);
  }
  return options;
}
