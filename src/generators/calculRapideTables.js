// Calcul rapide — les tables + / − du cahier de stratégies (CSSMI, A à T).
//
// POURQUOI CE FICHIER REMPLACE `strategies` DANS LE COACH (12 oct. 2026).
// Le parent, en regardant l'écran: « enlève ces tables plus-moins. Ça devrait
// être calculé. En 2e année on avait fait quelque chose pour le calcul rapide,
// fais pareil — ces stratégies-là sont très bizarres. »
//
// Il a raison, et c'est vérifiable dans le générateur `strategies`: sur six
// types de questions, UN SEUL demandait de calculer. Les cinq autres parlaient
// de la stratégie au lieu de la faire:
//   « Quel DOUBLE (jumeaux) se cache dans cette soustraction? »
//   « Quelle ADDITION t'aide à trouver la réponse? »
//   « On passe par 10. Quelle décomposition est la bonne? »
// Pour un enfant de 8 ans, ce sont des questions SUR le vocabulaire des
// adultes, pas sur les nombres. Et ça se mesurait: il « réussissait » des
// questions de stratégie sans savoir répondre à 7 − 7.
//
// Ici, même forme que le calcul rapide de 2e année (`calculRapide3`): le fait,
// une case, on écrit la réponse. La stratégie n'est plus la QUESTION — elle
// redevient ce qu'elle doit être, l'explication d'UNE ligne quand il se trompe.
//
// Les faits restent ceux de la feuille de l'enseignante: les stratégies de la
// semaine d'abord, puis tout ce qui a déjà été vu, en cumulatif.
import { withFresh } from '../utils/antiRepeat';
import { strategiesCetteSemaine, strategiesVues, ecrireQuestion } from '../data/tablesStrategies';

const CATEGORY = 'calcul_rapide_tables';

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Les faits de la semaine pèsent plus lourd, mais on n'abandonne jamais les
// anciens: une table oubliée en novembre coûte autant qu'une table jamais vue.
function tirerFait() {
  const semaine = strategiesCetteSemaine();
  const vues = strategiesVues();
  const source = (Math.random() < 0.6 && semaine.length) ? semaine : (vues.length ? vues : semaine);
  const strat = pick(source);
  if (!strat || !strat.faits || !strat.faits.length) return null;
  return { strat, fait: pick(strat.faits) };
}

function buildOne() {
  const tire = tirerFait();
  if (!tire) return null;
  const { strat, fait } = tire;
  return {
    category: CATEGORY,
    type: `fait_${strat.id}`,
    // « 7 − 7 = ? »: PracticeSession reconnaît cette forme et affiche le calcul
    // à côté de la case, comme sur une feuille de calcul rapide.
    text: `${ecrireQuestion(fait)} = ?`,
    correct: fait.r,
    tape: 'nombre',
    explanation: `${ecrireQuestion(fait)} = ${fait.r}.\n\n`
      + `Stratégie ${strat.id} — ${strat.titre}: ${strat.regle}\n`
      + `Exemple: ${strat.exemple}`,
    hint: `${strat.titre} (${strat.court}). Exemple: ${strat.exemple}`,
  };
}

export function generateCalculRapideTables() {
  return withFresh(CATEGORY, buildOne, 60, 20, (q) => (q ? q.text : ''));
}

export default generateCalculRapideTables;
