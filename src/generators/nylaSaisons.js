// Nyla — Les saisons, la météo, s'habiller (maternelle 5 ans)
//
// C'est le « calendrier du matin » de la maternelle: quel temps fait-il, en
// quelle saison on est, et qu'est-ce qu'on met pour sortir. Rien à lire: la
// consigne est parlée et les réponses sont des images.
import { pickAdaptive } from '../utils/skillStats';
import { saisons, meteo } from '../data/nylaMaternelle5';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// 1. Quelle image va avec cette saison?
function buildIndiceSaison() {
  const s = pick(saisons);
  const bon = pick(s.indices);
  const autres = shuffle([...new Set(saisons.filter((x) => x.nom !== s.nom).flatMap((x) => x.indices))])
    .filter((i) => !s.indices.includes(i))
    .slice(0, 3);
  if (autres.length < 3) return null;
  return {
    category: 'nyla_saisons',
    type: 'indice_saison',
    text: `Qu'est-ce qu'on voit en ${s.nom}? ${s.icon}`,
    correct: bon,
    options: shuffle([bon, ...autres]),
    explanation: `${bon} → c'est ${s.nom}. ${s.phrase}`,
    hint: s.phrase,
  };
}

// 2. De quelle saison on parle? (indice → saison)
function buildQuelleSaison() {
  const s = pick(saisons);
  const indice = pick(s.indices);
  const autres = saisons.filter((x) => x.nom !== s.nom).map((x) => x.icon);
  return {
    category: 'nyla_saisons',
    type: 'quelle_saison',
    text: `On est en quelle saison?\n\n${indice}`,
    correct: s.icon,
    options: shuffle([s.icon, ...autres]),
    explanation: `${indice} → ${s.nom} ${s.icon}. ${s.phrase}`,
    hint: 'Pense au temps qu\'il fait dehors quand tu vois ça.',
  };
}

// 3. Qu'est-ce qu'on met pour sortir?
function buildVetement() {
  const s = pick(saisons);
  const bon = pick(s.vetements);
  // Plusieurs saisons partagent le manteau et les souliers: sans le Set, la
  // meme image pouvait apparaitre deux fois dans les quatre choix.
  const autres = shuffle([...new Set(saisons.filter((x) => x.nom !== s.nom).flatMap((x) => x.vetements))])
    .filter((v) => !s.vetements.includes(v))
    .slice(0, 3);
  if (autres.length < 3) return null;
  return {
    category: 'nyla_saisons',
    type: 'vetement',
    text: `${s.phrase} Qu'est-ce que tu mets pour sortir?`,
    correct: bon,
    options: shuffle([bon, ...autres]),
    explanation: `${bon} — c'est ce qu'on porte en ${s.nom}. ${s.icon}`,
    hint: 'Est-ce qu\'il fait chaud ou froid dans cette saison?',
  };
}

// 4. Quel temps fait-il?
function buildMeteo() {
  const m = pick(meteo);
  const autres = shuffle(meteo.filter((x) => x.nom !== m.nom)).slice(0, 3);
  return {
    category: 'nyla_saisons',
    type: 'meteo',
    text: `${m.phrase} Quel temps fait-il?`,
    correct: m.icon,
    options: shuffle([m.icon, ...autres.map((x) => x.icon)]),
    explanation: `${m.icon} Il y a ${m.nom}.`,
    hint: 'Écoute bien la phrase et imagine le ciel.',
  };
}

export function generateNylaSaisons() {
  return pickAdaptive('nyla_saisons', [
    { type: 'quelle_saison', w: 3, build: buildQuelleSaison },
    { type: 'indice_saison', w: 2.5, build: buildIndiceSaison },
    { type: 'vetement', w: 2.5, build: buildVetement },
    { type: 'meteo', w: 3, build: buildMeteo },
  ], (q) => `${q.type}|${q.text}|${q.correct}`);
}
