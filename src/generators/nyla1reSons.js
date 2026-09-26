// Nyla · 1re année — Le son de la semaine
//
// Le cœur de la 1re année: un son, ses graphies, et des mots où on l'entend.
// Trois formats, du plus facile au plus exigeant:
//   1. Dans quel mot entends-tu le son? (discrimination auditive)
//   2. Quel son entends-tu dans ce mot? (nommer le son)
//   3. Comment s'écrit le son ici? (la graphie: o / au / eau)
//
// Le son courant est choisi dans le menu (« Mes sons »), exactement comme la
// dictée de la semaine de Ryan: le menu appelle setCurrentSon() avant de
// lancer la pratique.
import { withFresh } from '../utils/antiRepeat';
import { sonsProgression, sonById } from '../data/nyla1reAnnee';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const STORAGE_KEY = 'sb_nyla_son';

export function setCurrentSon(id) {
  try { localStorage.setItem(STORAGE_KEY, id); } catch {}
}
export function currentSon() {
  let id = null;
  try { id = localStorage.getItem(STORAGE_KEY); } catch {}
  return sonById(id) || sonsProgression[0];
}

// Quelle graphie du son apparaît dans ce mot? (« bateau » → eau)
function graphemeDansLeMot(son, mot) {
  const found = son.graphemes
    .filter((g) => mot.toLowerCase().includes(g))
    .sort((a, b) => b.length - a.length); // « eau » avant « a »
  return found[0] || null;
}

// Tous les mots de la progression, pour piocher des distracteurs.
// Les quatre `pieges` écrits à la main dans les données ne donnaient que
// quelques combinaisons possibles: la même question revenait sans arrêt. On
// pioche maintenant dans TOUS les mots qui ne contiennent pas le son.
const TOUS_LES_MOTS = [...new Set(sonsProgression.flatMap((s) => s.mots.map((m) => m.mot)))];

function motsSansLeSon(son) {
  return TOUS_LES_MOTS.filter((mot) => !son.graphemes.some((g) => mot.toLowerCase().includes(g)));
}

// 1. Dans quel mot entends-tu le son?
function buildTrouveLeMot(son) {
  const bon = pick(son.mots);
  const distracteurs = shuffle([...new Set([...son.pieges, ...motsSansLeSon(son)])])
    .filter((m) => m !== bon.mot)
    .slice(0, 3);
  if (distracteurs.length < 3) return null;
  return {
    category: 'nyla_1re_sons',
    type: 'trouve_mot',
    son: son.son,
    text: `Dans quel mot entends-tu le son [${son.son}]?`,
    correct: bon.mot,
    options: shuffle([bon.mot, ...distracteurs]),
    explanation: `${bon.icon} « ${bon.mot} » — on entend [${son.son}].`,
    hint: `Dis chaque mot tout haut, lentement. Écoute si le son [${son.son}] est caché dedans.`,
    spokenWord: `Dans quel mot entends-tu le son ${son.son}?`,
  };
}

// 2. Quel son entends-tu dans ce mot?
function buildQuelSon(son) {
  const bon = pick(son.mots);
  const autres = shuffle(sonsProgression.filter((s) => s.id !== son.id))
    .filter((s) => !bon.mot.toLowerCase().includes(s.son))
    .slice(0, 3)
    .map((s) => s.son);
  if (autres.length < 3) return null;
  return {
    category: 'nyla_1re_sons',
    type: 'quel_son',
    son: son.son,
    text: `Quel son entends-tu dans ce mot?\n\n${bon.icon} ${bon.mot}`,
    correct: son.son,
    options: shuffle([son.son, ...autres]),
    explanation: `« ${bon.mot} » → on entend [${son.son}].`,
    hint: 'Dis le mot lentement, syllabe par syllabe.',
    spokenWord: bon.mot,
  };
}

// 3. Comment s'écrit le son dans ce mot? (seulement si le son a plusieurs graphies)
function buildGraphie(son) {
  if (son.graphemes.length < 2) return null;
  const candidats = son.mots
    .map((m) => ({ ...m, g: graphemeDansLeMot(son, m.mot) }))
    .filter((m) => m.g);
  if (!candidats.length) return null;
  const bon = pick(candidats);
  const autres = son.graphemes.filter((g) => g !== bon.g).slice(0, 3);
  if (!autres.length) return null;
  return {
    category: 'nyla_1re_sons',
    type: 'graphie',
    son: son.son,
    text: `Le son [${son.son}] s'écrit de plusieurs façons.\nDans « ${bon.mot} », comment l'écrit-on?`,
    correct: bon.g,
    options: shuffle([bon.g, ...autres]),
    explanation: `${bon.icon} « ${bon.mot} » s'écrit avec « ${bon.g} ».`,
    rule: `Le son [${son.son}] peut s'écrire: ${son.graphemes.join(' , ')}`,
    hint: 'Regarde bien les lettres du mot, pas seulement le son.',
    spokenWord: bon.mot,
  };
}

function buildOne() {
  const son = currentSon();
  const r = Math.random();
  const ordre = r < 0.45 ? [buildTrouveLeMot, buildQuelSon, buildGraphie]
    : r < 0.8 ? [buildQuelSon, buildTrouveLeMot, buildGraphie]
    : [buildGraphie, buildTrouveLeMot, buildQuelSon];
  for (const build of ordre) {
    const q = build(son);
    if (q) return q;
  }
  return null;
}

export function generateNyla1reSons() {
  return withFresh('nyla_1re_sons', buildOne, 60, 25, (q) => `${q.type}|${q.text}`);
}
