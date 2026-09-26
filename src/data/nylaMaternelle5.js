// Nyla — maternelle 5 ans (rentrée septembre 2026).
//
// Elle ne lit pas encore. Tout ce qui est ici sert à des exercices où la
// CONSIGNE est parlée et où les RÉPONSES sont des images — jamais des mots à
// déchiffrer. Seule exception assumée: son prénom, parce que reconnaître son
// propre prénom écrit est justement une compétence de la maternelle 5 ans.
//
// Domaines couverts (programme-cycle de l'éducation préscolaire):
//   • les couleurs
//   • trier et classer (trouver l'intrus)
//   • comparer des grandeurs (plus gros, plus petit)
//   • les saisons, la météo, s'habiller selon le temps
//   • reconnaître son prénom et ceux de la famille

// ===== Les couleurs =====
// Chaque couleur a un carré (pour « trouve le rouge ») et des objets du
// quotidien de cette couleur (pour « de quelle couleur est la banane? »).
export const couleurs = [
  { nom: 'rouge', carre: '🟥', objets: [{ mot: 'pomme', icon: '🍎' }, { mot: 'fraise', icon: '🍓' }, { mot: 'cœur', icon: '❤️' }] },
  { nom: 'bleu', carre: '🟦', objets: [{ mot: 'baleine', icon: '🐳' }, { mot: 'jean', icon: '👖' }, { mot: 'goutte', icon: '💧' }] },
  { nom: 'jaune', carre: '🟨', objets: [{ mot: 'banane', icon: '🍌' }, { mot: 'soleil', icon: '☀️' }, { mot: 'citron', icon: '🍋' }] },
  { nom: 'vert', carre: '🟩', objets: [{ mot: 'arbre', icon: '🌳' }, { mot: 'grenouille', icon: '🐸' }, { mot: 'brocoli', icon: '🥦' }] },
  { nom: 'orange', carre: '🟧', objets: [{ mot: 'carotte', icon: '🥕' }, { mot: 'citrouille', icon: '🎃' }, { mot: 'renard', icon: '🦊' }] },
  { nom: 'violet', carre: '🟪', objets: [{ mot: 'raisin', icon: '🍇' }, { mot: 'aubergine', icon: '🍆' }] },
  { nom: 'brun', carre: '🟫', objets: [{ mot: 'ours', icon: '🐻' }, { mot: 'chocolat', icon: '🍫' }] },
  { nom: 'noir', carre: '⬛', objets: [{ mot: 'pneu', icon: '🛞' }, { mot: 'corbeau', icon: '🐦‍⬛' }] },
  { nom: 'blanc', carre: '⬜', objets: [{ mot: 'nuage', icon: '☁️' }, { mot: 'neige', icon: '❄️' }] },
];

// ===== Trier et classer — trouver l'intrus =====
// Une famille d'objets + un intrus qui vient d'une autre famille.
export const categories = [
  { nom: 'des animaux', membres: ['🐱', '🐶', '🐰', '🐻', '🐷', '🐴'], intrus: ['🍎', '🚗', '👟', '🪑'] },
  { nom: 'des fruits', membres: ['🍎', '🍌', '🍓', '🍇', '🍐', '🍊'], intrus: ['🐱', '🚗', '🧦', '🪑'] },
  { nom: 'des légumes', membres: ['🥕', '🥦', '🌽', '🥔', '🍅'], intrus: ['🍫', '🐶', '⚽', '👕'] },
  { nom: 'des véhicules', membres: ['🚗', '🚌', '🚲', '✈️', '⛵', '🚂'], intrus: ['🍎', '🐱', '🌳', '👒'] },
  { nom: 'des vêtements', membres: ['👕', '👖', '🧥', '🧦', '👗', '🧤'], intrus: ['🍌', '🐟', '🚗', '🌳'] },
  { nom: 'des fleurs et des arbres', membres: ['🌸', '🌻', '🌳', '🌷', '🌲'], intrus: ['🚗', '🐶', '🍕', '👟'] },
  { nom: 'des choses à manger', membres: ['🍕', '🍰', '🍞', '🧀', '🥛', '🍎'], intrus: ['🚲', '🐱', '✏️', '🧦'] },
  { nom: "des choses de l'école", membres: ['✏️', '📖', '✂️', '🎒', '📏'], intrus: ['🐷', '🍌', '⛵', '🧥'] },
  { nom: 'des insectes', membres: ['🐝', '🦋', '🐞', '🐜', '🦗'], intrus: ['🐶', '🍎', '🚗', '🌳'] },
  { nom: 'des oiseaux', membres: ['🐦', '🦉', '🦆', '🐔', '🦅'], intrus: ['🐟', '🐱', '🌸', '🚗'] },
];

// ===== Comparer des grandeurs =====
// Classés du plus petit au plus gros — les générateurs se servent de l'ordre.
export const parTaille = [
  { mot: 'fourmi', icon: '🐜' },
  { mot: 'souris', icon: '🐭' },
  { mot: 'oiseau', icon: '🐦' },
  { mot: 'chat', icon: '🐱' },
  { mot: 'chien', icon: '🐶' },
  { mot: 'cochon', icon: '🐷' },
  { mot: 'cheval', icon: '🐴' },
  { mot: 'vache', icon: '🐮' },
  { mot: 'girafe', icon: '🦒' },
  { mot: 'éléphant', icon: '🐘' },
  { mot: 'baleine', icon: '🐳' },
];

export const parLongueur = [
  { mot: 'crayon', icon: '✏️' },
  { mot: 'règle', icon: '📏' },
  { mot: 'parapluie', icon: '☂️' },
  { mot: 'vélo', icon: '🚲' },
  { mot: 'voiture', icon: '🚗' },
  { mot: 'autobus', icon: '🚌' },
  { mot: 'train', icon: '🚂' },
];

// ===== Les saisons, la météo, s'habiller =====
export const saisons = [
  {
    nom: 'hiver', icon: '❄️',
    indices: ['❄️', '⛄', '🛷', '🎿'],
    vetements: ['🧥', '🧤', '🧣', '👢'],
    phrase: 'Il neige et il fait très froid.',
  },
  {
    nom: 'printemps', icon: '🌷',
    indices: ['🌷', '🌧️', '🌱', '🐣'],
    vetements: ['🧥', '👟', '☂️'],
    phrase: 'Il pleut et les fleurs poussent.',
  },
  {
    nom: 'été', icon: '☀️',
    indices: ['☀️', '🏖️', '🍦', '🩴'],
    vetements: ['👕', '🩳', '🕶️', '👒'],
    phrase: 'Il fait chaud et le soleil brille.',
  },
  {
    nom: 'automne', icon: '🍂',
    indices: ['🍂', '🎃', '🌰', '🍁'],
    vetements: ['🧥', '👖', '👟'],
    phrase: 'Les feuilles tombent des arbres.',
  },
];

export const meteo = [
  { nom: 'du soleil', icon: '☀️', phrase: 'Le ciel est bleu et il fait chaud.' },
  { nom: 'de la pluie', icon: '🌧️', phrase: "L'eau tombe du ciel." },
  { nom: 'de la neige', icon: '❄️', phrase: 'Tout devient blanc dehors.' },
  { nom: 'du vent', icon: '💨', phrase: 'Les feuilles volent partout.' },
  { nom: 'des nuages', icon: '☁️', phrase: 'Le ciel est tout gris.' },
  { nom: 'un orage', icon: '⛈️', phrase: 'Ça fait boum et ça éclaire!' },
];

// ===== Mon prénom et ceux de la famille =====
// `pieges` = des mots qui se ressemblent beaucoup: c'est ça, l'exercice.
// Un enfant de 5 ans reconnaît la FORME de son prénom, alors il faut que les
// mauvaises réponses aient presque la même forme.
export const prenomsFamille = [
  { prenom: 'Nyla', qui: 'toi', icon: '🌟', pieges: ['Nyra', 'Lyna', 'Nyle', 'Naly'] },
  { prenom: 'Ryan', qui: 'ton grand frère', icon: '🦁', pieges: ['Ryam', 'Rayn', 'Ryna', 'Byan'] },
  { prenom: 'Cayla', qui: 'ta grande sœur', icon: '💜', pieges: ['Cayta', 'Calya', 'Caylo', 'Gayla'] },
  { prenom: 'papa', qui: 'ton papa', icon: '👨', pieges: ['papo', 'pama', 'bapa', 'papu'] },
  { prenom: 'maman', qui: 'ta maman', icon: '👩', pieges: ['mamon', 'manan', 'namam', 'mamam'] },
];
