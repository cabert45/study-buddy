// Nyla — Mon prénom et ceux de la famille (maternelle 5 ans)
//
// Reconnaître son prénom écrit est une des compétences de la maternelle 5 ans
// — souvent la toute première chose qu'un enfant sait « lire ». C'est le seul
// exercice où les réponses sont des mots plutôt que des images, et c'est
// voulu: l'exercice EST la reconnaissance visuelle du mot.
//
// Les mauvaises réponses ressemblent beaucoup au bon prénom (Nyla / Nyra /
// Lyna). Sinon elle reconnaîtrait juste « le mot qui commence par N ».
import { pickAdaptive } from '../utils/skillStats';
import { prenomsFamille } from '../data/nylaMaternelle5';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// 1. Trouve le prénom parmi des mots qui lui ressemblent.
function buildTrouvePrenom() {
  const p = pick(prenomsFamille);
  const pieges = shuffle([...p.pieges]).slice(0, 3);
  return {
    category: 'nyla_prenom',
    type: 'trouve_prenom',
    text: p.qui === 'toi'
      ? `Trouve TON prénom. ${p.icon}`
      : `Trouve le prénom de ${p.qui}. ${p.icon}`,
    correct: p.prenom,
    options: shuffle([p.prenom, ...pieges]),
    explanation: `${p.icon} ${p.prenom} — regarde bien chaque lettre, dans l'ordre.`,
    hint: 'Lis les lettres une par une, de gauche à droite.',
    spokenWord: p.prenom,
  };
}

// 2. Par quelle lettre commence ce prénom?
function buildPremiereLettre() {
  const p = pick(prenomsFamille);
  const lettre = p.prenom[0].toUpperCase();
  const autres = shuffle(prenomsFamille.filter((x) => x.prenom[0].toUpperCase() !== lettre)
    .map((x) => x.prenom[0].toUpperCase()));
  const pool = [...new Set(autres)].slice(0, 3);
  while (pool.length < 3) {
    const l = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    if (l !== lettre && !pool.includes(l)) pool.push(l);
  }
  return {
    category: 'nyla_prenom',
    type: 'premiere_lettre',
    text: `Par quelle lettre commence « ${p.prenom} »?\n\n${p.icon}`,
    correct: lettre,
    options: shuffle([lettre, ...pool]),
    explanation: `« ${p.prenom} » commence par ${lettre}.`,
    hint: 'Regarde la toute première lettre du prénom.',
    spokenWord: p.prenom,
  };
}

// 3. Combien de lettres dans ce prénom?
function buildCombienLettres() {
  const p = pick(prenomsFamille);
  const n = p.prenom.length;
  const pool = [...new Set([n, n + 1, n - 1, n + 2])].filter((x) => x > 0).slice(0, 4);
  return {
    category: 'nyla_prenom',
    type: 'combien_lettres',
    text: `Combien de lettres dans « ${p.prenom} »?\n\n${p.prenom.split('').join(' ')}`,
    correct: String(n),
    options: shuffle(pool).map(String),
    explanation: `${p.prenom} = ${p.prenom.split('').join(' - ')} → ${n} lettres.`,
    hint: 'Pointe chaque lettre avec ton doigt et compte.',
    spokenWord: p.prenom,
  };
}

export function generateNylaPrenom() {
  return pickAdaptive('nyla_prenom', [
    { type: 'trouve_prenom', w: 3, build: buildTrouvePrenom },
    { type: 'premiere_lettre', w: 2, build: buildPremiereLettre },
    { type: 'combien_lettres', w: 2, build: buildCombienLettres },
  ], (q) => `${q.type}|${q.text}|${q.correct}`);
}
