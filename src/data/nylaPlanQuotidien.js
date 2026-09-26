// Nyla — ce qu'elle fait chaque jour (maternelle 5 ans).
//
// La règle « 1 h par jour, 2 h la fin de semaine » est celle de Ryan, 8 ans,
// qui prépare une admission. À 5 ans, ce serait une punition: l'attention
// d'un enfant de maternelle tient une dizaine de minutes, et au-delà on
// n'apprend plus, on endure. Ici: **3 choses par jour, une douzaine de
// minutes**, et une de plus la fin de semaine.
//
// Chaque jour a le même squelette — une chose en français, une chose en
// maths, un livre avec un adulte — mais jamais le même contenu deux jours de
// suite. Sur une semaine, les sept jours couvrent tout le programme:
// les lettres, les sons, les syllabes, les nombres, les formes, les couleurs,
// le tri, les suites et son prénom.
//
// Le livre n'est pas un exercice de l'app: c'est un vrai livre, sur les
// genoux de quelqu'un. C'est ce qui fait les lecteurs, et ça ne se remplace
// pas par un écran.

// `deck:` ouvre les cartes (Coach le passe à l'app telles quelles),
// `mode:` ouvre une série de questions.
export const NYLA_ROTATION = [
  {
    jour: 'Dimanche', theme: 'les lettres et les nombres',
    francais: { deck: 'letters_upper', label: '🔤 Mes lettres MAJUSCULES', icon: '🔤' },
    maths: { mode: 'nyla_count', label: '🍎 Je compte', icon: '🍎' },
  },
  {
    jour: 'Lundi', theme: 'les syllabes et les formes',
    francais: { mode: 'nyla_syllabes', label: '👏 Mes syllabes', icon: '👏' },
    maths: { mode: 'nyla_shapes', label: '⬜ Les formes', icon: '⬜' },
  },
  {
    jour: 'Mardi', theme: 'les sons et les suites',
    francais: { mode: 'nyla_rhymes', label: '🎵 Rimes et sons', icon: '🎵' },
    maths: { mode: 'nyla_patterns', label: '🔄 Suites logiques', icon: '🔄' },
  },
  {
    jour: 'Mercredi', theme: 'mon prénom et les couleurs',
    francais: { mode: 'nyla_prenom', label: '✍️ Mon prénom', icon: '✍️' },
    maths: { mode: 'nyla_couleurs', label: '🎨 Les couleurs', icon: '🎨' },
  },
  {
    jour: 'Jeudi', theme: 'les mots et les nombres',
    francais: { mode: 'nyla_sight_words', label: '⭐ Mots-étoiles', icon: '⭐' },
    maths: { mode: 'nyla_add', label: '➖ Ajouter et enlever', icon: '➖' },
  },
  {
    jour: 'Vendredi', theme: 'le premier son et trier',
    francais: { mode: 'nyla_letters', label: '🔍 Le premier son', icon: '🔍' },
    maths: { mode: 'nyla_tri', label: '🧺 Trier et comparer', icon: '🧺' },
  },
  {
    jour: 'Samedi', theme: 'les petites lettres et la météo',
    francais: { deck: 'letters_lower', label: '🔡 Mes lettres minuscules', icon: '🔡' },
    maths: { mode: 'nyla_saisons', label: '🌦️ Saisons et météo', icon: '🌦️' },
  },
];

// Les chiffres reviennent DEUX fois par semaine en plus de la rotation: c'est
// la chose qu'elle doit savoir par cœur en sortant de la maternelle, et les
// cartes montent de niveau toutes seules.
const CARTES_CHIFFRES = { deck: 'numbers', label: '🔢 Mes chiffres (cartes)', icon: '🔢' };

/**
 * Le plan d'un jour donné, pour Nyla.
 * Rend des étapes au format que le Coach comprend déjà.
 */
export function buildNylaPlan(today = new Date()) {
  const jour = today.getDay();
  const r = NYLA_ROTATION[jour];
  const finDeSemaine = jour === 0 || jour === 6;

  const etape = (x, mins) => ({
    type: 'app',
    mode: x.deck ? `nyladeck:${x.deck}` : x.mode,
    label: x.label,
    icon: x.icon,
    mins,
  });

  const plan = [etape(r.francais, 5), etape(r.maths, 5)];

  // Parler, tous les jours. C'est la seule case ou elle produit une reponse au
  // lieu d'en choisir une, et a cinq ans c'est ce qui compte le plus.
  plan.push({ type: 'app', mode: 'nyla_oral', label: '🗣️ On parle ensemble', icon: '🗣️', mins: 5 });

  // Mardi et samedi: les cartes de chiffres en plus.
  if (jour === 2 || jour === 6) plan.push(etape(CARTES_CHIFFRES, 4));

  // Le livre — toujours en dernier, et toujours avec quelqu'un.
  plan.push({
    type: 'chore',
    mins: finDeSemaine ? 10 : 7,
    icon: '📖',
    label: finDeSemaine
      ? 'Un livre avec papa ou maman'
      : 'Un livre avec papa ou maman',
  });

  plan.push({
    type: 'message',
    label: 'Bravo Nyla! Tu as tout fait. 🌟',
    mins: 1,
    icon: '🌟',
  });

  return plan;
}

export function themeDuJour(today = new Date()) {
  return NYLA_ROTATION[today.getDay()];
}
