// Nyla — Les formes (maternelle 5 ans)
//
// ⚠️ Pourquoi cette réécriture: l'ancienne version ne posait QUE « Trouve le
// carré » sur 6 formes. Six questions possibles, point final — après six
// exercices, elle revoyait les mêmes en boucle et elle les savait par cœur.
// (Mesuré: 60 tirages → 6 questions distinctes, la même jusqu'à 13 fois.)
//
// Ici, six formats se croisent avec les figures, les solides et des objets du
// quotidien: des centaines de questions différentes, et surtout six façons
// différentes de penser la même forme.
//
// Règle qui ne change pas: elle ne lit pas. La consigne est PARLÉE et les
// réponses sont des IMAGES ou des NOMBRES — jamais un nom de forme à lire.
import { withFresh } from '../utils/antiRepeat';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Figures planes. `cotes` = nombre de côtés (null = pas de côtés droits).
// `objets` = des choses de sa vie qui ont cette forme.
const figures = [
  {
    nom: 'cercle', icon: '⭕', det: 'le', cotes: 0, coins: 0,
    objets: [{ mot: 'une roue', icon: '🛞' }, { mot: 'une horloge', icon: '🕐' }, { mot: 'une pizza', icon: '🍕' }, { mot: 'un ballon', icon: '⚽' }, { mot: 'une lune pleine', icon: '🌕' }],
  },
  {
    nom: 'carré', icon: '🟦', det: 'le', cotes: 4, coins: 4,
    objets: [{ mot: 'une fenêtre', icon: '🪟' }, { mot: 'un cadeau', icon: '🎁' }, { mot: 'un dé', icon: '🎲' }],
  },
  {
    nom: 'triangle', icon: '🔺', det: 'le', cotes: 3, coins: 3,
    objets: [{ mot: 'un sapin', icon: '🌲' }, { mot: 'une pointe de pizza', icon: '🍕' }, { mot: 'une montagne', icon: '⛰️' }],
  },
  {
    nom: 'étoile', icon: '⭐', det: "l'", cotes: 10, coins: 5,
    objets: [{ mot: 'une étoile du ciel', icon: '🌟' }, { mot: 'une étoile de mer', icon: '⭐' }],
  },
  {
    nom: 'cœur', icon: '❤️', det: 'le', cotes: null, coins: 1,
    objets: [{ mot: 'un cœur', icon: '💗' }, { mot: 'une carte de la Saint-Valentin', icon: '💌' }],
  },
  {
    nom: 'losange', icon: '🔶', det: 'le', cotes: 4, coins: 4,
    objets: [{ mot: 'un cerf-volant', icon: '🪁' }],
  },
];

// Les solides — on les touche, on ne les dessine pas. La maternelle 5 ans les
// explore avec des objets réels, alors on les présente comme des objets.
const solides = [
  {
    nom: 'cube', icon: '🧊', det: 'le',
    objets: [{ mot: 'un dé', icon: '🎲' }, { mot: 'un glaçon', icon: '🧊' }, { mot: 'une boîte carrée', icon: '📦' }],
    indice: 'Toutes ses faces sont des carrés.',
  },
  {
    nom: 'boule', icon: '⚽', det: 'la',
    objets: [{ mot: 'un ballon de soccer', icon: '⚽' }, { mot: 'une orange', icon: '🍊' }, { mot: 'la Terre', icon: '🌍' }, { mot: 'une balle', icon: '🎾' }],
    indice: 'Elle roule dans tous les sens.',
  },
  {
    nom: 'cylindre', icon: '🥫', det: 'le',
    objets: [{ mot: 'une canne de soupe', icon: '🥫' }, { mot: 'un rouleau de papier', icon: '🧻' }, { mot: 'une pile', icon: '🔋' }],
    indice: 'Il roule, mais seulement dans un sens.',
  },
  {
    nom: 'cône', icon: '🍦', det: 'le',
    objets: [{ mot: 'un cornet de crème glacée', icon: '🍦' }, { mot: 'un cône orange', icon: '🚧' }, { mot: 'un chapeau de fête', icon: '🥳' }],
    indice: 'Il est pointu en haut et rond en bas.',
  },
];

// ===== Format 1 — Trouve la forme (l'ancien exercice, gardé) =====
function buildTrouveLaForme() {
  const item = pick(figures);
  const distracteurs = shuffle(figures.filter((f) => f.nom !== item.nom)).slice(0, 3).map((f) => f.icon);
  const det = item.det === "l'" ? "l'" : item.det + ' ';
  return {
    category: 'nyla_shapes',
    type: 'trouve_forme',
    text: `Trouve ${det}${item.nom}.`,
    correct: item.icon,
    options: shuffle([item.icon, ...distracteurs]),
    explanation: `${item.icon} c'est ${det}${item.nom}.`,
    hint: 'Regarde bien chaque dessin avant de choisir.',
  };
}

// ===== Format 2 — Combien de côtés? =====
function buildCombienDeCotes() {
  const item = pick(figures.filter((f) => f.cotes !== null && f.cotes <= 4));
  const n = item.cotes;
  const options = shuffle([...new Set([n, 0, 3, 4, 5])].slice(0, 4)).map(String);
  const det = item.det === "l'" ? "l'" : item.det + ' ';
  return {
    category: 'nyla_shapes',
    type: 'cotes',
    text: `Combien de côtés a ${det}${item.nom}?\n\n${item.icon}`,
    correct: String(n),
    options,
    explanation: n === 0
      ? `${det}${item.nom} n'a aucun côté droit: il est tout rond.`
      : `${det}${item.nom} a ${n} côtés. Suis le contour avec ton doigt en comptant.`,
    hint: 'Suis le tour de la forme avec ton doigt et compte les lignes droites.',
  };
}

// ===== Format 3 — Quelle forme a N côtés? =====
function buildFormeAvecNCotes() {
  const item = pick(figures.filter((f) => f.cotes === 3 || f.cotes === 4 || f.cotes === 0));
  const distracteurs = shuffle(figures.filter((f) => f.cotes !== item.cotes)).slice(0, 3).map((f) => f.icon);
  if (distracteurs.length < 3) return null;
  const question = item.cotes === 0
    ? 'Quelle forme est toute ronde, sans aucun côté?'
    : `Quelle forme a ${item.cotes} côtés?`;
  return {
    category: 'nyla_shapes',
    type: 'forme_n_cotes',
    text: question,
    correct: item.icon,
    options: shuffle([item.icon, ...distracteurs]),
    explanation: `${item.icon} — ${item.nom}${item.cotes === 0 ? ', tout rond' : `, ${item.cotes} côtés`}.`,
    hint: 'Compte les côtés de chaque dessin avec ton doigt.',
  };
}

// ===== Format 4 — Quel objet a cette forme? =====
function buildObjetDeCetteForme() {
  const item = pick(figures.filter((f) => f.objets.length));
  const bon = pick(item.objets);
  // La pizza est rangee sous cercle ET sous triangle: on filtre sur l'image,
  // pas sur la forme, sinon elle peut sortir deux fois.
  const vus = new Set([bon.icon]);
  const autres = shuffle(figures.filter((f) => f.nom !== item.nom).flatMap((f) => f.objets))
    .filter((o) => !vus.has(o.icon) && vus.add(o.icon))
    .slice(0, 3);
  if (autres.length < 3) return null;
  const det = item.det === "l'" ? "l'" : item.det + ' ';
  return {
    category: 'nyla_shapes',
    type: 'objet_forme',
    text: `Quel objet a la forme d'un ${item.nom}?`,
    correct: bon.icon,
    options: shuffle([bon.icon, ...autres.map((o) => o.icon)]),
    explanation: `${bon.icon} ${bon.mot} — c'est ${det}${item.nom}. ${item.icon}`,
    hint: `Cherche l'objet qui ressemble à ça: ${item.icon}`,
  };
}

// ===== Format 5 — L'intrus: trois objets de la même forme, un seul à part =====
// Quatre objets DIFFÉRENTS (pas le même dessin répété): trois partagent la
// forme, le quatrième non. C'est ça, trier par forme.
function buildIntrus() {
  const famille = pick(figures.filter((f) => f.objets.length >= 3));
  const memes = shuffle(famille.objets).slice(0, 3);
  const autre = pick(figures.filter((f) => f.nom !== famille.nom && f.objets.length).flatMap((f) =>
    f.objets.map((o) => ({ ...o, forme: f.nom }))));
  // Le cone et la pizza partagent une image: si l'intrus est deja dans les
  // trois, la question n'a plus de bonne reponse unique.
  if (memes.some((m) => m.icon === autre.icon)) return null;
  return {
    category: 'nyla_shapes',
    type: 'intrus',
    text: `Trois objets ont la forme d'un ${famille.nom}. Lequel n'a PAS cette forme?`,
    correct: autre.icon,
    options: shuffle([autre.icon, ...memes.map((m) => m.icon)]),
    explanation: `${memes.map((m) => m.icon).join(' ')} → des ${famille.nom}s. Mais ${autre.icon} ${autre.mot}, c'est un ${autre.forme}.`,
    hint: `Cherche celui qui ne ressemble pas à ça: ${famille.icon}`,
  };
}

// ===== Format 6 — Les solides =====
function buildSolide() {
  const item = pick(solides);
  const bon = pick(item.objets);
  const vus = new Set([bon.icon]);
  const autres = shuffle(solides.filter((s) => s.nom !== item.nom).flatMap((s) => s.objets))
    .filter((o) => !vus.has(o.icon) && vus.add(o.icon))
    .slice(0, 3);
  if (autres.length < 3) return null;
  const det = item.det === 'la' ? 'la ' : 'le ';
  return {
    category: 'nyla_shapes',
    type: 'solide',
    text: `Quel objet a la forme d'${item.det === 'la' ? 'une boule' : 'un ' + item.nom}?`,
    correct: bon.icon,
    options: shuffle([bon.icon, ...autres.map((o) => o.icon)]),
    explanation: `${bon.icon} ${bon.mot} — c'est ${det}${item.nom}. ${item.indice}`,
    hint: item.indice,
  };
}

function buildOne() {
  const r = Math.random();
  if (r < 0.20) return buildTrouveLaForme();
  if (r < 0.36) return buildCombienDeCotes();
  if (r < 0.52) return buildFormeAvecNCotes() || buildTrouveLaForme();
  if (r < 0.74) return buildObjetDeCetteForme() || buildTrouveLaForme();
  if (r < 0.84) return buildIntrus() || buildObjetDeCetteForme() || buildTrouveLaForme();
  return buildSolide() || buildObjetDeCetteForme() || buildTrouveLaForme();
}

export function generateNylaShapes() {
  return withFresh('nyla_shapes', buildOne, 80, 25, (q) => `${q.type}|${q.text}|${q.correct}`);
}
