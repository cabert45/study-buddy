// Univers social — Terminus 3e année, Expédition 1 « Les Iroquoiens vers 1500 »
// Pages 6 à 18 photographiées par le parent le 19 oct. 2026 (les p. 19-20
// manquent encore). Test en classe le JEUDI 22 OCTOBRE 2026.
//
// Rien n'est inventé: tout vient des pages du cahier, mot pour mot quand c'est
// une définition — c'est ce que le test lui demandera.
//
// LES ERREURS DE RYAN, vues sur ses pages déjà remplies:
//
//   1. **Il écrit la DÉFINITION au lieu du MOT.** Page 11, question 4, les
//      quatre réponses sont fausses de la même façon: « terrain arrondi »,
//      « terrain plat », « des montagnes », « cours d'eau » — au lieu de
//      colline, plaine, vallée, fleuve. Il a recopié un morceau de l'aide.
//   2. **Les plantes servent à SE SOIGNER.** Ratée deux fois: page 14 (plantes
//      reliées à « faire des feux », bois et écorce à « se soigner ») et
//      page 15 (plantes → « se vêtir »).
//   3. **Une ressource peut avoir PLUSIEURS utilités.** Page 15, les animaux:
//      il a coché « se nourrir » seulement. On chasse pour se nourrir ET pour
//      se vêtir (les peaux, les fourrures).
//   Et l'orthographe: « érière » pour Érié, « sedenterre » pour sédentaire.

// ===== Les mots du cahier (les encadrés « définition ») =====
// `relief: true` = les quatre de la page 11, qu'il a ratés — ils se TAPENT.
export const MOTS = [
  { mot: 'colline', def: 'petite élévation de terrain arrondi', relief: true, piege: 'terrain arrondi' },
  { mot: 'plaine', def: 'grande étendue de terrain plat', relief: true, piege: 'terrain plat' },
  { mot: 'vallée', def: 'creux entre des montagnes', relief: true, piege: 'des montagnes' },
  { mot: 'fleuve', def: "grand cours d'eau", relief: true, piege: "cours d'eau" },
  { mot: 'nomade', def: 'qui se déplace souvent et habite à des endroits différents' },
  { mot: 'sédentaire', def: 'qui vit longtemps au même endroit, qui a une habitation fixe' },
  { mot: 'Autochtones', def: "premiers peuples d'un territoire et leurs descendants" },
  { mot: 'société', def: 'groupe de personnes vivant sur le même territoire et partageant le même mode de vie' },
  { mot: 'atout', def: 'avantage' },
  { mot: 'contrainte', def: 'inconvénient' },
  { mot: 'portage', def: 'action de porter un canot pour contourner un obstacle' },
  { mot: 'chute', def: "partie d'un cours d'eau où l'eau tombe de très haut" },
  { mot: 'rapide', def: "partie d'un cours d'eau très agitée" },
  { mot: 'fertile', def: "qui favorise l'agriculture" },
  { mot: 'feuillu', def: 'arbre avec des feuilles qui poussent au printemps et qui tombent à l’automne' },
  { mot: 'conifère', def: 'arbre avec des aiguilles qui produit des fruits en forme de cône (cocottes)' },
];

// ===== Les ressources et leurs utilités (p. 13 à 15) =====
// `utilites` = TOUTES ses utilités: c'est le piège de la page 15.
export const RESSOURCES = [
  { nom: 'les plantes', utilites: ['se soigner'] },
  { nom: "le bois et l'écorce", utilites: ['faire des feux', 'construire des habitations (et le canot)'] },
  { nom: 'les petits fruits, les noix et les champignons', utilites: ['se nourrir'] },
  { nom: 'les poissons', utilites: ['se nourrir'] },
  { nom: 'les animaux', utilites: ['se nourrir', 'se vêtir'] },
];

// ===== Atout ou contrainte? (p. 9 à 12) =====
export const ATOUTS = [
  "Les nombreux cours d'eau sur le territoire",
  'Des déplacements plus faciles en été',
  "Les cours d'eau donnent de l'eau pour boire et arroser les champs",
  'Le sol très fertile des plaines',
  "L'été chaud, avec de la pluie abondante",
];
export const CONTRAINTES = [
  'La présence de rapides sur les rivières',
  'Les chutes, impossibles à traverser en canot',
  "L'hiver long et froid",
  "Les cours d'eau et les sols gelés l'hiver",
];

// ===== Été ou hiver? (p. 12) =====
export const ETE = ['Chaud et court', 'Il pleut beaucoup', 'Les déplacements sont plus faciles', "L'agriculture est possible"];
export const HIVER = ['Long et froid', 'La neige est abondante', 'Le sol est gelé', 'Les déplacements sont difficiles', "L'agriculture est impossible"];

// ===== Les arbres (p. 13) =====
export const FEUILLUS = ["l'érable", 'le chêne', 'le bouleau'];
export const CONIFERES = ['le sapin', "l'épinette", 'le cèdre'];
