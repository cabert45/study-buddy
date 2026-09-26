// Nyla — les questions qu'on lui pose À VOIX HAUTE.
//
// Pourquoi ce fichier existe: tout le reste de son portail est à choix
// multiples, et un choix multiple bute sur le même mur à cinq ans — il faut
// lire les réponses. Des pans entiers du programme de maternelle sont donc
// restés dehors: réciter les jours de la semaine, compter de 1 à 20 d'un
// trait, dire son nom et son âge. Ça ne se coche pas, ça se DIT.
//
// Ici, l'app pose la question avec sa voix, Nyla répond en parlant, et sa
// réponse est transcrite puis vérifiée. Aucun mot à lire de bout en bout.
//
// Chaque question porte:
//   • `dire`     — ce que la voix prononce (jamais affiché comme consigne à lire)
//   • `attendu`  — ce qu'on espère entendre, pour la vérification locale
//   • `verif`    — comment juger: 'liste' (une suite), 'exact', 'parmi', 'libre'
//   • `aide`     — la relance parlée si elle bloque
//
// La vérification locale passe en premier (voir utils/nylaOralCheck.js): une
// suite de nombres ou les jours de la semaine se valident sans appeler le
// modèle — c'est instantané, gratuit, et ça marche même si le réseau tousse.

export const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
export const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet',
  'août', 'septembre', 'octobre', 'novembre', 'décembre'];
export const SAISONS = ['printemps', 'été', 'automne', 'hiver'];

// ===== Compter =====
const compter = [
  {
    id: 'compte_10', theme: 'Compter', niveau: 1,
    dire: 'Compte avec moi jusqu\'à 10. Vas-y!',
    verif: 'liste', attendu: Array.from({ length: 10 }, (_, i) => i + 1),
    aide: 'Commence: un, deux, trois... continue!',
  },
  {
    id: 'compte_20', theme: 'Compter', niveau: 2,
    dire: 'Maintenant, compte jusqu\'à 20. Prends ton temps.',
    verif: 'liste', attendu: Array.from({ length: 20 }, (_, i) => i + 1),
    aide: 'Après dix, ça fait onze, douze, treize... continue!',
  },
  {
    id: 'compte_depuis_5', theme: 'Compter', niveau: 2,
    dire: 'Compte à partir de 5, jusqu\'à 15.',
    verif: 'liste', attendu: Array.from({ length: 11 }, (_, i) => i + 5),
    aide: 'Cinq, six, sept... continue jusqu\'à quinze.',
  },
  {
    id: 'compte_rebours', theme: 'Compter', niveau: 3,
    dire: 'On compte à l\'envers! De 10 jusqu\'à 1.',
    verif: 'liste', attendu: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    aide: 'Dix, neuf, huit... comme une fusée!',
  },
  {
    id: 'compte_2en2', theme: 'Compter', niveau: 3,
    dire: 'Compte de deux en deux: deux, quatre, six... continue jusqu\'à 20.',
    verif: 'liste', attendu: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
    aide: 'On saute un nombre à chaque fois: deux, quatre, six...',
  },
];

// ===== Les jours, les mois, le temps =====
const calendrier = [
  {
    id: 'jours_semaine', theme: 'Les jours', niveau: 1,
    dire: 'Dis-moi les jours de la semaine. Commence par lundi.',
    verif: 'liste', attendu: JOURS,
    aide: 'Lundi, mardi, mercredi... continue!',
  },
  {
    id: 'jour_apres_lundi', theme: 'Les jours', niveau: 2,
    dire: 'Quel jour vient après lundi?',
    verif: 'exact', attendu: ['mardi'],
    aide: 'Lundi... et après?',
  },
  {
    id: 'jour_avant_samedi', theme: 'Les jours', niveau: 3,
    dire: 'Quel jour vient juste avant samedi?',
    verif: 'exact', attendu: ['vendredi'],
    aide: 'Pense à la semaine: jeudi, puis...?',
  },
  {
    id: 'jour_ecole', theme: 'Les jours', niveau: 2,
    dire: 'Nomme-moi deux jours où tu ne vas pas à l\'école.',
    verif: 'parmi', attendu: ['samedi', 'dimanche'], combien: 2,
    aide: 'Les jours de congé, quand papa et maman sont à la maison.',
  },
  {
    id: 'saisons', theme: 'Le temps', niveau: 2,
    dire: 'Nomme-moi les quatre saisons.',
    verif: 'parmi', attendu: SAISONS, combien: 4,
    aide: 'Il y a celle où il neige, celle où il fait chaud...',
  },
  {
    id: 'saison_neige', theme: 'Le temps', niveau: 1,
    dire: 'Dans quelle saison est-ce qu\'il neige?',
    verif: 'exact', attendu: ['hiver', "l'hiver"],
    aide: 'Quand tu mets ton habit de neige et tes mitaines.',
  },
  {
    id: 'mois_noel', theme: 'Le temps', niveau: 3,
    dire: 'Dans quel mois c\'est Noël?',
    verif: 'exact', attendu: ['décembre'],
    aide: 'C\'est le dernier mois de l\'année.',
  },
];

// ===== Moi =====
const moi = [
  {
    id: 'mon_nom', theme: 'Moi', niveau: 1,
    dire: 'Comment tu t\'appelles?',
    verif: 'exact', attendu: ['nyla'],
    aide: 'Dis-moi ton prénom!',
  },
  {
    id: 'mon_age', theme: 'Moi', niveau: 1,
    dire: 'Quel âge as-tu?',
    verif: 'exact', attendu: ['5', 'cinq'],
    aide: 'Montre-moi sur tes doigts, puis dis-le.',
  },
  {
    id: 'ma_famille', theme: 'Moi', niveau: 2,
    dire: 'Nomme-moi les gens de ta famille.',
    verif: 'libre',
    aide: 'Il y a papa, maman... et qui d\'autre?',
  },
  {
    id: 'mon_ecole', theme: 'Moi', niveau: 2,
    dire: 'Qu\'est-ce que tu aimes faire à l\'école?',
    verif: 'libre',
    aide: 'Est-ce que tu aimes dessiner? Jouer dehors?',
  },
];

// ===== Nommer le monde =====
const nommer = [
  {
    id: 'couleurs_3', theme: 'Nommer', niveau: 1,
    dire: 'Nomme-moi trois couleurs.',
    verif: 'parmi', combien: 3,
    attendu: ['rouge', 'bleu', 'jaune', 'vert', 'orange', 'violet', 'rose', 'brun', 'noir', 'blanc', 'gris'],
    aide: 'Regarde autour de toi: de quelle couleur sont les choses?',
  },
  {
    id: 'animaux_3', theme: 'Nommer', niveau: 1,
    dire: 'Nomme-moi trois animaux.',
    verif: 'parmi', combien: 3,
    attendu: ['chat', 'chien', 'lapin', 'cheval', 'vache', 'cochon', 'mouton', 'lion', 'girafe',
      'éléphant', 'souris', 'oiseau', 'poisson', 'tortue', 'ours', 'loup', 'singe', 'zèbre', 'poule', 'canard'],
    aide: 'Pense aux animaux de la ferme, ou du zoo.',
  },
  {
    id: 'fruits_3', theme: 'Nommer', niveau: 2,
    dire: 'Nomme-moi trois fruits.',
    verif: 'parmi', combien: 3,
    attendu: ['pomme', 'banane', 'orange', 'fraise', 'raisin', 'poire', 'melon', 'cerise',
      'kiwi', 'ananas', 'pêche', 'bleuet', 'framboise', 'citron', 'mangue'],
    aide: 'Ce qu\'on mange pour le dessert, ou dans la boîte à lunch.',
  },
  {
    id: 'parties_corps', theme: 'Nommer', niveau: 2,
    dire: 'Nomme-moi trois parties de ton corps.',
    verif: 'parmi', combien: 3,
    attendu: ['tête', 'bras', 'jambe', 'main', 'pied', 'doigt', 'nez', 'bouche', 'oeil', 'yeux',
      'oreille', 'cheveux', 'dos', 'ventre', 'genou', 'épaule', 'cou', 'dent', 'dents'],
    aide: 'Touche ton nez... comment ça s\'appelle?',
  },
  {
    id: 'vetements_hiver', theme: 'Nommer', niveau: 3,
    dire: 'Qu\'est-ce qu\'on met pour aller dehors quand il fait froid?',
    verif: 'parmi', combien: 2,
    attendu: ['manteau', 'tuque', 'mitaine', 'mitaines', 'foulard', 'botte', 'bottes', 'habit de neige', 'gant', 'gants'],
    aide: 'Pense à ce que tu mets avant de sortir en hiver.',
  },
];

// ===== Les sons et les mots (oral) =====
const langage = [
  {
    id: 'mot_avec_a', theme: 'Les sons', niveau: 2,
    dire: 'Dis-moi un mot qui commence par le son « a ».',
    verif: 'libre', commencePar: 'a',
    aide: 'Comme « avion », ou « ami ».',
  },
  {
    id: 'mot_avec_m', theme: 'Les sons', niveau: 2,
    dire: 'Dis-moi un mot qui commence par le son « mmm ».',
    verif: 'libre', commencePar: 'm',
    aide: 'Comme « maman », ou « maison ».',
  },
  {
    id: 'rime_chat', theme: 'Les sons', niveau: 3,
    dire: 'Trouve un mot qui rime avec « chat ».',
    verif: 'libre',
    aide: 'Ça doit finir par le même son: chat... rat... ça rime!',
  },
  {
    id: 'alphabet', theme: 'Les sons', niveau: 3,
    dire: 'Dis-moi l\'alphabet, du début jusqu\'où tu peux.',
    verif: 'libre',
    aide: 'A, B, C, D... continue!',
  },
];

export const QUESTIONS_ORALES = [...compter, ...calendrier, ...moi, ...nommer, ...langage];

export const THEMES_ORAUX = [
  { id: 'Compter', label: '🔢 Compter', icon: '🔢' },
  { id: 'Les jours', label: '📅 Les jours', icon: '📅' },
  { id: 'Le temps', label: '🌦️ Les saisons', icon: '🌦️' },
  { id: 'Moi', label: '🌟 Moi', icon: '🌟' },
  { id: 'Nommer', label: '🗣️ Nommer', icon: '🗣️' },
  { id: 'Les sons', label: '🔊 Les sons', icon: '🔊' },
];

// Une petite série équilibrée: on ne pose pas six questions de comptage
// d'affilée, et on commence toujours par quelque chose qu'elle sait déjà.
export function serieOrale(n = 5) {
  const parTheme = new Map();
  for (const q of QUESTIONS_ORALES) {
    if (!parTheme.has(q.theme)) parTheme.set(q.theme, []);
    parTheme.get(q.theme).push(q);
  }
  const themes = [...parTheme.keys()].sort(() => Math.random() - 0.5);
  const serie = [];
  let tour = 0;
  while (serie.length < n && tour < 10) {
    for (const t of themes) {
      if (serie.length >= n) break;
      const pool = parTheme.get(t).filter((q) => !serie.includes(q));
      if (!pool.length) continue;
      serie.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    tour++;
  }
  // La première question est la plus facile de la série: on entre en confiance.
  serie.sort((a, b) => (a === serie[0] ? 0 : 0) || a.niveau - b.niveau);
  return serie.slice(0, n);
}
