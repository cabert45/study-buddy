// Niveau de difficulté qui monte tout seul quand Ryan maîtrise.
//
// Le 20 sept. 2026 il a fait 15/15 en problèmes — et l'app lui redonnait
// exactement le même niveau d'aide le lendemain. Un enfant qui réussit tout
// n'apprend plus rien: il s'entraîne à ce qu'il sait déjà.
//
// Le principe: chaque catégorie a un NIVEAU de 1 à 4. On monte quand une
// session est quasi parfaite, on redescend quand ça décroche. L'aide se retire
// une couche à la fois — jamais d'un coup, sinon c'est la falaise et les
// larmes (« Try Again » marche seulement si la marche est franchissable).
//
// Pour les problèmes écrits, les 4 niveaux retirent l'échafaudage dans cet
// ordre — du plus soutenu au plus proche de l'examen:
//   1. Il choisit les deux nombres dans une liste, puis il calcule.
//   2. Les nombres sont déjà placés: il ne fait que calculer, étape par étape.
//   3. Plus d'étapes du tout: il lit le problème et donne la réponse.
//   4. Même chose, avec des nombres plus gros.

const KEY = 'sb_level_';
const HIST = 'sb_level_hist_';

export const NIVEAU_MIN = 1;
export const NIVEAU_MAX = 4;

// Une session quasi parfaite fait monter; une session ratée fait redescendre.
const SEUIL_MONTEE = 0.9;   // 9/10, 14/15, 15/15…
const SEUIL_DESCENTE = 0.6; // sous 60 %, l'aide revient

export function getLevel(category) {
  try {
    const n = parseInt(localStorage.getItem(KEY + category) || '1', 10);
    return Math.min(NIVEAU_MAX, Math.max(NIVEAU_MIN, Number.isNaN(n) ? 1 : n));
  } catch {
    return 1;
  }
}

export function setLevel(category, niveau) {
  try {
    localStorage.setItem(KEY + category, String(Math.min(NIVEAU_MAX, Math.max(NIVEAU_MIN, niveau))));
  } catch {}
}

// Historique court, pour que le parent voie la progression dans le tableau de bord
function pushHistorique(category, entree) {
  try {
    const liste = JSON.parse(localStorage.getItem(HIST + category) || '[]');
    liste.push(entree);
    while (liste.length > 20) liste.shift();
    localStorage.setItem(HIST + category, JSON.stringify(liste));
  } catch {}
}

export function getHistorique(category) {
  try {
    return JSON.parse(localStorage.getItem(HIST + category) || '[]');
  } catch {
    return [];
  }
}

/**
 * À appeler à la fin d'une session. Rend ce qui s'est passé, pour l'annoncer
 * à l'enfant: { avant, apres, monte, descend, max }.
 * Une session trop courte (moins de 5 questions) ne change rien: un 3/3 ne
 * prouve pas la maîtrise.
 */
export function recordSession(category, correct, total) {
  const avant = getLevel(category);
  if (!category || !total || total < 5) return { avant, apres: avant, monte: false, descend: false, max: avant === NIVEAU_MAX };

  const ratio = correct / total;
  let apres = avant;
  if (ratio >= SEUIL_MONTEE) apres = Math.min(NIVEAU_MAX, avant + 1);
  else if (ratio < SEUIL_DESCENTE) apres = Math.max(NIVEAU_MIN, avant - 1);

  if (apres !== avant) setLevel(category, apres);
  pushHistorique(category, { d: new Date().toISOString().slice(0, 10), c: correct, t: total, n: apres });

  return {
    avant,
    apres,
    monte: apres > avant,
    descend: apres < avant,
    max: apres === NIVEAU_MAX && avant === NIVEAU_MAX && ratio >= SEUIL_MONTEE,
  };
}

// Ce que le niveau change pour les problèmes écrits
export const aideProblemes = (niveau) => ({
  choisirLesNombres: niveau <= 1, // la liste de nombres à piger
  etapesGuidees: niveau <= 2,     // la démarche calcul par calcul
  grosNombres: niveau >= 4,
});

export const NIVEAU_LABELS = {
  1: 'Guidé — tu choisis les nombres',
  2: 'Étape par étape',
  3: 'Tout seul',
  4: 'Tout seul, gros nombres',
};
