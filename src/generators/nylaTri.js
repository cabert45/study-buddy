// Nyla — Trier, classer, comparer (maternelle 5 ans)
//
// Deux compétences que l'app ne touchait pas du tout:
//   • trier: qu'est-ce qui va ensemble, et qu'est-ce qui n'y va pas
//   • comparer des grandeurs: plus gros, plus petit, plus long
//
// Consigne parlée, réponses en images.
import { pickAdaptive } from '../utils/skillStats';
import { categories, parTaille, parLongueur } from '../data/nylaMaternelle5';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// 1. L'intrus: trois de la même famille, un seul à part.
function buildIntrus() {
  const cat = pick(categories);
  const memes = shuffle(cat.membres).slice(0, 3);
  const autre = pick(cat.intrus);
  return {
    category: 'nyla_tri',
    type: 'intrus',
    text: `Trois images vont ensemble: ce sont ${cat.nom}. Laquelle ne va PAS avec les autres?`,
    correct: autre,
    options: shuffle([autre, ...memes]),
    explanation: `${memes.join(' ')} → ${cat.nom}. Mais ${autre}, non.`,
    hint: 'Demande-toi: est-ce que ça fait partie du même groupe?',
  };
}

// 2. Lequel appartient à cette famille?
function buildAppartient() {
  const cat = pick(categories);
  const bon = pick(cat.membres);
  // Une meme image peut vivre dans deux familles (la pomme est un fruit ET
  // quelque chose a manger): sans le Set, elle sortait deux fois.
  const autres = shuffle([...new Set(categories.filter((c) => c.nom !== cat.nom).flatMap((c) => c.membres))])
    .filter((m) => !cat.membres.includes(m))
    .slice(0, 3);
  if (autres.length < 3) return null;
  return {
    category: 'nyla_tri',
    type: 'appartient',
    text: `Lequel fait partie ${cat.nom}?`,
    correct: bon,
    options: shuffle([bon, ...autres]),
    explanation: `${bon} fait partie ${cat.nom}.`,
    hint: 'Pense au groupe qu\'on te demande, puis regarde chaque image.',
  };
}

// 3. Le plus gros / le plus petit — comparer des grandeurs réelles.
function buildTaille() {
  const gros = Math.random() < 0.5;
  const choix = shuffle([...parTaille]).slice(0, 4);
  // Il faut un écart net entre les candidats, sinon la question n'a pas de
  // bonne réponse évidente (un chat et un chien, c'est discutable).
  const indices = choix.map((c) => parTaille.indexOf(c)).sort((a, b) => a - b);
  if (indices[indices.length - 1] - indices[indices.length - 2] < 2) return null;
  if (indices[1] - indices[0] < 2) return null;
  const cible = gros
    ? parTaille[indices[indices.length - 1]]
    : parTaille[indices[0]];
  return {
    category: 'nyla_tri',
    type: 'taille',
    text: `Quel animal est le plus ${gros ? 'GROS' : 'PETIT'}?`,
    correct: cible.icon,
    options: shuffle(choix.map((c) => c.icon)),
    explanation: `${cible.icon} Le ${cible.mot} est le plus ${gros ? 'gros' : 'petit'} des quatre.`,
    hint: 'Imagine-les tous les quatre l\'un à côté de l\'autre.',
  };
}

// 4. Le plus long / le plus court.
function buildLongueur() {
  const long = Math.random() < 0.5;
  const choix = shuffle([...parLongueur]).slice(0, 4);
  const indices = choix.map((c) => parLongueur.indexOf(c)).sort((a, b) => a - b);
  if (indices[indices.length - 1] - indices[indices.length - 2] < 2) return null;
  if (indices[1] - indices[0] < 2) return null;
  const cible = long
    ? parLongueur[indices[indices.length - 1]]
    : parLongueur[indices[0]];
  return {
    category: 'nyla_tri',
    type: 'longueur',
    text: `Lequel est le plus ${long ? 'LONG' : 'COURT'}?`,
    correct: cible.icon,
    options: shuffle(choix.map((c) => c.icon)),
    explanation: `${cible.icon} ${cible.mot} — c'est le plus ${long ? 'long' : 'court'}.`,
    hint: 'Pense à leur vraie grandeur, pas à la taille du dessin.',
  };
}

export function generateNylaTri() {
  return pickAdaptive('nyla_tri', [
    { type: 'intrus', w: 3, build: buildIntrus },
    { type: 'appartient', w: 2.5, build: buildAppartient },
    { type: 'taille', w: 2.5, build: buildTaille },
    { type: 'longueur', w: 2, build: buildLongueur },
  ], (q) => `${q.type}|${q.text}|${q.correct}`);
}
