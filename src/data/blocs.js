// « Mes blocs » — la fondation de 2e année sur laquelle repose la 3e année.
//
// L'idée que le parent explique déjà à Ryan avec des LEGO: on ne construit pas
// un étage sur une base qui bouge. Chaque bloc est une compétence de 2e année,
// et `debloque` dit exactement quelle notion de 3e année s'appuie dessus — donc
// pourquoi ça vaut la peine de le solidifier maintenant.
//
// `mode` pointe vers un générateur existant: tester un bloc, c'est simplement
// une courte série de questions sans aide.
//
// Le français passe en premier: il vaut 60 % à l'examen d'admission et un
// résultat sous 60 % dans une matière = refus automatique (Collège Laval).

export const BLOC_TEST_LENGTH = 6;

// Seuils sur 6 questions
export const SEUIL_SOLIDE = 5; // 5 ou 6 → le bloc tient
export const SEUIL_FRAGILE = 3; // 3 ou 4 → fissuré, à retravailler

export function etatPourScore(correct, total = BLOC_TEST_LENGTH) {
  const ratio = correct / total;
  if (ratio >= SEUIL_SOLIDE / BLOC_TEST_LENGTH) return 'solide';
  if (ratio >= SEUIL_FRAGILE / BLOC_TEST_LENGTH) return 'fragile';
  return 'refaire';
}

export const ETATS = {
  neuf: { label: 'Pas encore testé', color: '#9aa0a6', bg: '#eceff1', short: '?' },
  solide: { label: 'Solide', color: '#1b7f4b', bg: '#d9f2e4', short: '✓' },
  fragile: { label: 'Fissuré', color: '#9a6300', bg: '#fdeec9', short: '~' },
  refaire: { label: 'À reprendre', color: '#a8321f', bg: '#fbdcd6', short: '!' },
};

// rangee 1 = tout en bas du mur (le plus porteur)
export const BLOCS = [
  // ================= FRANÇAIS =================
  {
    id: 'fr_verbe', matiere: 'francais', rangee: 1, mode: 'verbes',
    nom: 'Trouver le verbe',
    aide: 'Repérer le verbe dans une phrase et dire son infinitif.',
    debloque: 'Le radical et la terminaison, et TOUS les temps: imparfait, futur, conditionnel.',
  },
  {
    id: 'fr_classes', matiere: 'francais', rangee: 1, mode: 'classe_de_mots',
    nom: 'Les classes de mots',
    aide: 'Nom, déterminant, adjectif, verbe, pronom.',
    debloque: 'Le sujet et l’accord du verbe conjugué (Aide-mémoire p.16-18).',
  },
  {
    id: 'fr_gn', matiere: 'francais', rangee: 1, mode: 'groupe_nom',
    nom: 'Le groupe du nom',
    aide: 'Dét + nom + adjectif: repérer le GN au complet.',
    debloque: 'L’expansion et la construction du GN (p.6-7).',
  },
  {
    id: 'fr_present', matiere: 'francais', rangee: 2, mode: 'present_indicatif',
    nom: 'Le présent',
    aide: 'Verbes en -er: e, es, e, ons, ez, ent.',
    debloque: 'L’imparfait, le futur simple, le conditionnel, le futur proche.',
  },
  {
    id: 'fr_accord', matiere: 'francais', rangee: 2, mode: 'adjectif',
    nom: 'L’accord de l’adjectif',
    aide: 'Genre et nombre: une petite fille, des petites filles.',
    debloque: 'L’adjectif placé après le verbe être (p.19).',
  },
  {
    id: 'fr_pluriel', matiere: 'francais', rangee: 2, mode: 'pluriels_ryan',
    nom: 'Pluriel et féminin',
    aide: 'chevaux, gâteaux, heureuse, première…',
    debloque: 'Tous les accords dans le GN (p.9-15).',
  },
  {
    id: 'fr_passe', matiere: 'francais', rangee: 3, mode: 'passe_compose',
    nom: 'Le passé composé',
    aide: 'Le bon auxiliaire, et pas de « s » au participe avec avoir.',
    debloque: 'Les temps composés de 3e année.',
  },
  {
    id: 'fr_homophones', matiere: 'francais', rangee: 3, mode: 'homophones',
    nom: 'Les homophones',
    aide: 'a/à · et/est · son/sont · on/ont.',
    debloque: 'Écrire un texte sans fautes bêtes.',
  },
  {
    id: 'fr_apostrophe', matiere: 'francais', rangee: 3, mode: 'apostrophe',
    nom: 'L’apostrophe',
    aide: "l'ami, j'ai, c'est, d'accord.",
    debloque: 'L’apostrophe et la ponctuation (p.23).',
  },
  {
    id: 'fr_mbmp', matiere: 'francais', rangee: 3, mode: 'm_devant_bmp',
    nom: 'm devant b, m, p',
    aide: 'tomber, immense, campagne.',
    debloque: 'Les mots à savoir écrire (p.41).',
  },
  {
    id: 'fr_lecture', matiere: 'francais', rangee: 3, mode: 'comprehension',
    nom: 'Comprendre un texte',
    aide: 'Lire, retrouver l’info, remettre en ordre.',
    debloque: 'Les stratégies de lecture (p.35).',
  },

  // ================= MATHS =================
  {
    id: 'ma_faits', matiere: 'maths', rangee: 1, mode: 'mental',
    nom: 'Les faits par cœur',
    aide: 'Additions et soustractions jusqu’à 20, sans compter sur ses doigts.',
    debloque: 'L’addition et la soustraction de grands nombres (p.59, 76).',
  },
  {
    id: 'ma_position', matiere: 'maths', rangee: 1, mode: 'representer',
    nom: 'La valeur de position',
    aide: 'Centaines, dizaines, unités — et décomposer un nombre.',
    debloque: 'L’arrondissement (p.50) et les nombres décimaux (p.107).',
  },
  {
    id: 'ma_echange', matiere: 'maths', rangee: 2, mode: 'calcul',
    nom: 'Calculer avec échange',
    aide: 'Retenue et emprunt: 347 + 285, 502 − 267.',
    debloque: 'Les grands nombres de la 3e année.',
  },
  {
    id: 'ma_terme', matiere: 'maths', rangee: 2, mode: 'terme',
    nom: 'Le terme manquant',
    aide: '25 + ? = 61.',
    debloque: 'Les expressions équivalentes (p.99) et le terme manquant (p.101).',
  },
  {
    id: 'ma_multdiv', matiere: 'maths', rangee: 2, mode: 'mult_div',
    nom: 'Le sens de × et ÷',
    aide: 'Groupes égaux et partage.',
    debloque: 'Le répertoire mémorisé × et ÷ (p.92) — la colonne vertébrale de l’année.',
  },
  {
    id: 'ma_problemes', matiere: 'maths', rangee: 2, mode: 'multi_step',
    nom: 'Les problèmes à étapes',
    aide: 'Comprendre la question, écrire sa démarche, répondre par une phrase.',
    debloque: 'Je raisonne et le Recueil de situations-problèmes (chaque thème).',
  },
  {
    id: 'ma_fractions', matiere: 'maths', rangee: 3, mode: 'fractions',
    nom: 'Les fractions',
    aide: 'Demi, tiers, quart — et des parts égales.',
    debloque: 'Comparer une fraction à 0, ½ ou 1 (p.93).',
  },
  {
    id: 'ma_mesure', matiere: 'maths', rangee: 3, mode: 'mesure',
    nom: 'Mesurer en cm',
    aide: 'Bien partir du 0 de la règle.',
    debloque: 'Le millimètre (p.120) et le périmètre (p.122).',
  },
  {
    id: 'ma_figures', matiere: 'maths', rangee: 3, mode: 'figures',
    nom: 'Les figures',
    aide: 'Carré, rectangle, triangle, cercle, cube…',
    debloque: 'Les polygones (p.65), les quadrilatères (p.67), le dallage (p.117).',
  },
  {
    id: 'ma_diagrammes', matiere: 'maths', rangee: 3, mode: 'statistique',
    nom: 'Les diagrammes',
    aide: 'Lire la légende AVANT de répondre.',
    debloque: 'Les tableaux et « utiliser un tableau » (p.104).',
  },
];

export function blocsParMatiere(matiere) {
  return BLOCS.filter((b) => b.matiere === matiere);
}

export function blocById(id) {
  return BLOCS.find((b) => b.id === id);
}
