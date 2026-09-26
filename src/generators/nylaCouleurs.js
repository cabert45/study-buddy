// Nyla — Les couleurs (maternelle 5 ans)
//
// Consigne parlée, réponses en images: elle ne lit pas encore.
// Trois formats pour que ce ne soit pas six fois la même question.
import { pickAdaptive } from '../utils/skillStats';
import { couleurs } from '../data/nylaMaternelle5';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// 1. Trouve la couleur (carré de couleur).
function buildTrouve() {
  const c = pick(couleurs);
  const autres = shuffle(couleurs.filter((x) => x.nom !== c.nom)).slice(0, 3);
  return {
    category: 'nyla_couleurs',
    type: 'trouve',
    text: `Trouve le ${c.nom}.`,
    correct: c.carre,
    options: shuffle([c.carre, ...autres.map((x) => x.carre)]),
    explanation: `${c.carre} c'est le ${c.nom}.`,
    hint: 'Écoute bien la couleur, puis touche le carré.',
  };
}

// 2. De quelle couleur est cet objet? (objet → carré de couleur)
function buildObjetVersCouleur() {
  const c = pick(couleurs.filter((x) => x.objets.length));
  const o = pick(c.objets);
  const autres = shuffle(couleurs.filter((x) => x.nom !== c.nom)).slice(0, 3);
  return {
    category: 'nyla_couleurs',
    type: 'objet_couleur',
    text: `De quelle couleur est ${o.mot}?\n\n${o.icon}`,
    correct: c.carre,
    options: shuffle([c.carre, ...autres.map((x) => x.carre)]),
    explanation: `${o.icon} ${o.mot} → ${c.carre} ${c.nom}.`,
    hint: 'Imagine l\'objet dans ta tête. Il est de quelle couleur?',
  };
}

// 3. Quel objet est de cette couleur? (couleur → objet)
function buildCouleurVersObjet() {
  const c = pick(couleurs.filter((x) => x.objets.length));
  const bon = pick(c.objets);
  const vus = new Set([bon.icon]);
  const autres = shuffle(couleurs.filter((x) => x.nom !== c.nom).flatMap((x) => x.objets))
    .filter((o) => !vus.has(o.icon) && vus.add(o.icon))
    .slice(0, 3);
  if (autres.length < 3) return null;
  return {
    category: 'nyla_couleurs',
    type: 'couleur_objet',
    text: `Quel objet est ${c.nom}? ${c.carre}`,
    correct: bon.icon,
    options: shuffle([bon.icon, ...autres.map((o) => o.icon)]),
    explanation: `${bon.icon} ${bon.mot} est ${c.nom}. ${c.carre}`,
    hint: `Cherche l'objet de cette couleur: ${c.carre}`,
  };
}

export function generateNylaCouleurs() {
  return pickAdaptive('nyla_couleurs', [
    { type: 'trouve', w: 2, build: buildTrouve },
    { type: 'objet_couleur', w: 3, build: buildObjetVersCouleur },
    { type: 'couleur_objet', w: 3, build: buildCouleurVersObjet },
  ], (q) => `${q.type}|${q.text}|${q.correct}`);
}
