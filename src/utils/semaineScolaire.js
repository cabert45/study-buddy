// Quand la semaine de travail change, pour toute l'app.
//
// Son père, le 26 sept. 2026, à propos de la dictée: « ça devrait changer
// automatiquement le vendredi après-midi ». C'est juste, et c'est le calendrier
// de l'école qui le dit: la dictée et la remise des devoirs tombent le
// vendredi. Vendredi midi, la liste de la semaine est FINIE — continuer à la
// faire réviser, c'est lui faire perdre sa fin de semaine sur des mots déjà
// évalués, alors que la fin de semaine, c'est 2 h de travail.
//
// La règle: à partir du vendredi midi, « cette semaine » veut dire la semaine
// qui commence lundi. Avant, il restait seulement le décalage du dimanche, ce
// qui laissait le samedi sur l'ancienne liste — exactement la journée où il
// s'assoit le plus longtemps.
//
// Un seul endroit pour la règle: la liste d'orthographe, les stratégies des
// tables et le module du cahier Jazz avancent ENSEMBLE. Une semaine à moitié
// tournée (liste 3 avec les stratégies de la semaine passée) serait pire que
// pas de décalage du tout.
const MIDI = 12;

export function refScolaire(date = new Date()) {
  const jour = date.getDay();          // 0 = dimanche, 5 = vendredi, 6 = samedi
  let avance = 0;
  if (jour === 5 && date.getHours() >= MIDI) avance = 3; // vendredi après-midi → lundi
  else if (jour === 6) avance = 2;                       // samedi → lundi
  else if (jour === 0) avance = 1;                       // dimanche → lundi
  if (!avance) return date;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + avance);
}
