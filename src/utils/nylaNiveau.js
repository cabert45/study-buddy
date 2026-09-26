// Nyla — les paliers de difficulté.
//
// Le problème à régler: ses exercices étaient bloqués sur le plus facile
// (compter jusqu'à 10, additionner jusqu'à 5 + 5). Elle avait tout juste à
// chaque fois, donc elle n'apprenait plus rien — juste « trop facile ».
//
// Ici, un exercice est découpé en paliers du plus simple au plus exigeant.
// Un palier s'ouvre seulement quand le précédent est SOLIDE: au moins 8
// réponses enregistrées et 80 % de réussite. Elle ne tombe donc jamais d'un
// coup sur quelque chose de trop dur, et elle ne reste pas non plus coincée
// sur ce qu'elle sait déjà.
//
// Les paliers ouverts restent tous en jeu: pickAdaptive() (utils/skillStats)
// fait ensuite remonter ce qu'elle rate et disparaître ce qu'elle maîtrise.
import { getSkillStats } from './skillStats';

const REPONSES_MIN = 8;
const REUSSITE_MIN = 0.8;

/**
 * Combien de paliers sont ouverts pour cette catégorie.
 * `types` = les identifiants de type, du plus facile au plus difficile.
 * `min` = combien de paliers sont ouverts dès le premier jour (2 par défaut:
 * un seul type, ce serait aussi monotone que le problème qu'on corrige).
 */
export function paliersOuverts(category, types, { min = 1, stats = getSkillStats() } = {}) {
  let ouverts = min;
  for (let i = min - 1; i < types.length - 1; i++) {
    const s = stats[`${category}|${types[i]}`];
    if (!s) break;
    const n = s.right + s.wrong;
    if (n >= REPONSES_MIN && s.right / n >= REUSSITE_MIN) ouverts++;
    else break;
  }
  return Math.min(ouverts, types.length);
}

/**
 * Filtre une liste d'entrées pickAdaptive sur les paliers ouverts.
 * `entries` doit être ordonnée du plus facile au plus difficile.
 * Les entrées `horsPalier: true` (formats qui ne sont pas une question de
 * difficulté, comme « trouve l'intrus ») sont toujours gardées.
 */
export function entreesOuvertes(category, entries, min = 2) {
  const paliers = entries.filter((e) => !e.horsPalier);
  const n = paliersOuverts(category, paliers.map((e) => e.type), { min });
  const gardes = new Set(paliers.slice(0, n).map((e) => e.type));
  return entries.filter((e) => e.horsPalier || gardes.has(e.type));
}
