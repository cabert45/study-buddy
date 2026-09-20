// « Tables +/- Stratégies » — la pratique des stratégies de calcul de la classe.
//
// Semaine du 21 au 25 sept. 2026: « Tables +/- Stratégies CD » = les doubles
// (jumeaux) et les doubles dans la soustraction.
//
// Deux choses à travailler, pas une:
//   1. le FAIT lui-même (7 + 7 = 14), vite, sans compter
//   2. la STRATÉGIE qui va avec (pourquoi c'est rapide)
// Le cahier insiste sur la 2e: c'est ce qui transforme 20 faits en un seul
// raisonnement. Ryan est tombé à 12/30 en calcul rapide en mai justement parce
// qu'il recompte au lieu de reconnaître.
import { getStudyRounds } from '../utils/studyRounds';
import { pickAdaptive } from '../utils/skillStats';
import {
  STRATEGIES, strategiesCetteSemaine, strategiesVues, ecrireFait, ecrireQuestion,
} from '../data/tablesStrategies';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const CATEGORY = 'strategies';
const BR = String.fromCharCode(10);

// La règle du cahier est écrite pour l'enseignante (« élément neutre »,
// « inévitablement un jumeau »). Ryan a 8 ans: on garde l'idée, pas la phrase.
const EN_CLAIR = {
  A: `Ajouter 0, ça ne change rien.
5 + 0 = 5`,
  B: `Enlever 0, ça ne change rien.
5 − 0 = 5`,
  C: `Des jumeaux: le même nombre deux fois.
4 + 4 = 8`,
  D: `Si tu enlèves un jumeau, il reste l'autre jumeau.
12 − 6 = 6`,
  E: `Ajouter 1, c'est le nombre juste après.
9 + 1 = 10`,
  F: `Enlever 1, c'est le nombre juste avant.
8 − 1 = 7`,
  G: `Ce qu'il manque pour faire 5.
2 + 3 = 5`,
  H: `Une soustraction, c'est une addition à l'envers.
5 − 2 = 3, parce que 2 + 3 = 5`,
  I: `Un nombre moins lui-même, ça fait toujours 0.
7 − 7 = 0`,
  J: `Enlever le nombre juste avant, ça fait toujours 1.
7 − 6 = 1`,
  K: `Ajouter 2, c'est deux pas plus loin.
7 + 2 = 9`,
  L: `Enlever 2, c'est deux pas en arrière.
9 − 2 = 7`,
  M: `Ce qu'il manque pour faire 10.
6 + 4 = 10`,
  N: `10 moins un nombre: cherche son complément.
10 − 4 = 6`,
  O: `Ajouter 10: le chiffre des unités ne bouge pas.
3 + 10 = 13`,
  P: `Enlever 10: le chiffre des unités ne bouge pas.
19 − 10 = 9`,
  Q: `Trois pas en avant, ou trois pas en arrière.
Pars toujours du plus GRAND nombre.`,
  R: `Presque des jumeaux: fais le double, puis ajoute 1.
4 + 5 → 4 + 4 = 8, puis 8 + 1 = 9`,
  S: `Presque des jumeaux: fais le double, puis enlève 1.
11 − 6 → 12 − 6 = 6, puis 6 − 1 = 5`,
  T: `Passe par 10.
9 + 6 → 9 + 1 = 10, puis 10 + 5 = 15`,
};

function ruleFor(strats) {
  if (getStudyRounds(CATEGORY) >= 3) return undefined;
  return strats
    .map((s) => s.court.toUpperCase() + BR + (EN_CLAIR[s.id] || s.regle))
    .join(BR + BR);
}

// Les stratégies de la semaine 70 % du temps, les anciennes 30 % (le répertoire
// s'empile: une stratégie apprise ne doit pas se perdre).
function strategiesActives() {
  const semaine = strategiesCetteSemaine();
  const vues = strategiesVues().filter((s) => !semaine.some((x) => x.id === s.id));
  if (vues.length && Math.random() < 0.3) return { pool: [pick(vues)], semaine };
  return { pool: semaine, semaine };
}

// Distracteurs numériques serrés: les erreurs réelles sont à ±1, ±2
function optionsNum(correct) {
  const set = new Set([correct]);
  for (const d of shuffle([1, -1, 2, -2, 3, -3, 10])) {
    if (set.size >= 4) break;
    const v = correct + d;
    if (v >= 0) set.add(v);
  }
  let k = 4;
  while (set.size < 4) { set.add(correct + k); k++; }
  return shuffle([...set]);
}

// ===== 1. Le fait, tout simplement =====
function leFait(pool) {
  const s = pick(pool);
  const f = pick(s.faits);
  return {
    category: CATEGORY, rule: ruleFor(pool), type: `fait_${s.id}`,
    text: `${ecrireQuestion(f)} = ?`,
    correct: f.r,
    options: optionsNum(f.r),
    explanation: `${ecrireFait(f)}\n\nStratégie ${s.id} — ${s.titre}: ${s.regle}`,
    hint: `${s.court} — ${s.exemple}`,
  };
}

// Le type « Quelle strategie t'aide ici? » a ete retire le 20 sept. 2026:
// on demandait a un enfant de 8 ans de choisir entre « L - 2 de moins » et
// « S - Les presque doubles ». Les lettres sont un classement pour
// l'enseignante, pas une notion a apprendre. Ce qui compte, c'est qu'il
// RECONNAISSE la forme: c'est ce que font les autres types.

// ===== 3. Le double qui aide (stratégies C, D, R, S) =====
function leDoubleQuiAide(pool, semaine) {
  const s = pool.find((x) => ['C', 'D', 'R', 'S'].includes(x.id));
  if (!s) return null;
  const f = pick(s.faits);
  let aide, texte;
  if (s.id === 'C') {
    if (f.a === 0) return null;
    aide = `${f.a} + ${f.a}`;
    texte = `${ecrireQuestion(f)}\n\nCe sont des JUMEAUX. Combien ça fait?`;
    return {
      category: CATEGORY, rule: ruleFor(semaine), type: 'double_C',
      text: texte, correct: f.r, options: optionsNum(f.r),
      explanation: `${ecrireFait(f)}\nLes deux termes sont jumeaux (pareils) — c'est un double, on l'apprend par cœur.`,
      hint: 'Un double: le même nombre deux fois.',
    };
  }
  if (s.id === 'D') {
    // 12 − 6: quel double est caché là-dedans?
    aide = `${f.b} + ${f.b} = ${f.a}`;
    const faux = [`${f.a} + ${f.a} = ${f.a * 2}`, `${f.r} + ${f.b} = ${f.a}`, `${f.b} + ${f.r + 1} = ${f.a + 1}`];
    const opts = [...new Set([aide, ...faux])].slice(0, 4);
    if (opts.length < 3) return null;
    return {
      category: CATEGORY, rule: ruleFor(semaine), type: 'double_D',
      text: `${ecrireQuestion(f)}\n\nQuel DOUBLE (jumeaux) se cache dans cette soustraction?`,
      correct: aide, options: shuffle(opts),
      explanation: `${f.b} + ${f.b} = ${f.a}, donc ${ecrireFait(f)}.\nUne réponse à deux termes jumeaux, à laquelle on enlève un jumeau, égale inévitablement un jumeau.`,
      hint: 'Le nombre qu\'on enlève est un jumeau. Qui est l\'autre jumeau?',
    };
  }
  // R et S — les presque doubles
  const base = Math.min(f.a, f.b);
  aide = s.op === '+' ? `${base} + ${base}` : `${f.b} + ${f.b}`;
  const faux = [`${f.a} + ${f.a}`, `${f.b} + ${f.b}`, `${base + 1} + ${base + 1}`]
    .filter((x) => x !== aide);
  const opts = [...new Set([aide, ...faux])].slice(0, 4);
  if (opts.length < 3) return null;
  return {
    category: CATEGORY, rule: ruleFor(semaine), type: `presque_${s.id}`,
    text: `${ecrireQuestion(f)}\n\nC'est un PRESQUE double. Quel double t'aide?`,
    correct: aide, options: shuffle(opts),
    explanation: `${ecrireFait(f)}\n${s.regle}\nExemple du cahier: ${s.exemple}`,
    hint: 'Trouve les jumeaux les plus proches, puis ajuste de 1.',
  };
}

// ===== 4. Le complément: faire 5, faire 10 (G, M) =====
function complement(pool, semaine) {
  const s = pool.find((x) => ['G', 'M'].includes(x.id));
  if (!s) return null;
  const cible = s.id === 'G' ? 5 : 10;
  const f = pick(s.faits);
  return {
    category: CATEGORY, rule: ruleFor(semaine), type: `complement_${cible}`,
    text: `${f.a} + ___ = ${cible}\n\nCombien manque-t-il pour faire ${cible}?`,
    correct: f.b,
    options: optionsNum(f.b).filter((o) => o <= cible + 2).length >= 3
      ? optionsNum(f.b).filter((o) => o <= cible + 2)
      : optionsNum(f.b),
    explanation: `${ecrireFait(f)}\n${s.regle}`,
    hint: `Compte à partir de ${f.a} jusqu'à ${cible}.`,
  };
}

// ===== 5. L'opération inverse (H, N) =====
function operationInverse(pool, semaine) {
  const s = pool.find((x) => ['H', 'N'].includes(x.id));
  if (!s) return null;
  const cible = s.id === 'H' ? 5 : 10;
  const f = pick(s.faits);
  const bonne = `${f.b} + ${f.r} = ${cible}`;
  const faux = [`${f.b} + ${f.b} = ${cible}`, `${f.r} + ${f.r} = ${cible}`, `${f.b} + ${cible} = ${f.r}`]
    .filter((x) => x !== bonne);
  const opts = [...new Set([bonne, ...faux])].slice(0, 4);
  if (opts.length < 3) return null;
  return {
    category: CATEGORY, rule: ruleFor(semaine), type: `inverse_${cible}`,
    text: `${ecrireQuestion(f)}\n\nQuelle ADDITION t'aide à trouver la réponse?`,
    correct: bonne, options: shuffle(opts),
    explanation: `${bonne}, donc ${ecrireFait(f)}.\n${s.regle}`,
    hint: 'Une soustraction, c\'est une addition à l\'envers.',
  };
}

// ===== 6. Former une dizaine (T) =====
function formerDizaine(pool, semaine) {
  const s = pool.find((x) => x.id === 'T');
  if (!s) return null;
  const f = pick(s.faits.filter((x) => x.r > 10));
  if (!f) return null;
  const manque = 10 - f.a;           // ce qu'il faut au 1er terme pour faire 10
  const reste = f.b - manque;        // ce qui reste du 2e terme
  const bonne = `(${f.a} + ${manque}) + ${reste}`;
  const faux = [
    `(${f.a} + ${reste}) + ${manque}`,
    `(${f.a} + ${manque}) + ${reste + 1}`,
    `(${f.a} + ${manque + 1}) + ${reste}`,
  ].filter((x) => x !== bonne);
  const opts = [...new Set([bonne, ...faux])].slice(0, 4);
  if (opts.length < 3) return null;
  return {
    category: CATEGORY, rule: ruleFor(semaine), type: 'former_dizaine',
    text: `${ecrireQuestion(f)}\n\nOn passe par 10. Quelle décomposition est la bonne?`,
    correct: bonne, options: shuffle(opts),
    explanation: `${f.a} a besoin de ${manque} pour faire 10.\nOn prend ces ${manque} dans le ${f.b}: il reste ${reste}.\n10 + ${reste} = ${f.r}, donc ${ecrireFait(f)}.`,
    hint: `Combien manque-t-il à ${f.a} pour arriver à 10?`,
  };
}

// ===== 7. Vrai ou faux — repérer l'erreur =====
function vraiOuFaux(pool, semaine) {
  const s = pick(pool);
  const f = pick(s.faits);
  const faux = Math.random() < 0.5;
  const affiche = faux ? { ...f, r: f.r + pick([1, -1, 2, -2]).valueOf() } : f;
  if (affiche.r < 0) return null;
  return {
    category: CATEGORY, rule: ruleFor(semaine), type: 'vrai_faux',
    text: `${ecrireFait(affiche)}\n\nVrai ou faux?`,
    correct: faux ? 'Faux' : 'Vrai',
    options: ['Vrai', 'Faux'],
    explanation: faux
      ? `Faux — la bonne réponse est ${ecrireFait(f)}.\nStratégie ${s.id}: ${s.regle}`
      : `Vrai! ${ecrireFait(f)}\nStratégie ${s.id}: ${s.regle}`,
    hint: `Vérifie avec la stratégie ${s.id} (${s.court}).`,
  };
}

const TYPES = [
  { type: 'fait', w: 30, build: (p, s) => leFait(p, s) },
  { type: 'double', w: 18, build: leDoubleQuiAide },
  { type: 'complement', w: 14, build: complement },
  { type: 'inverse', w: 12, build: operationInverse },
  { type: 'former_dizaine', w: 12, build: formerDizaine },
  { type: 'vrai_faux', w: 12, build: vraiOuFaux },
];

export function generateStrategies() {
  const { pool, semaine } = strategiesActives();
  const applicables = [];
  for (const t of TYPES) {
    let essai = null;
    try { essai = t.build(pool, semaine); } catch { essai = null; }
    if (essai) {
      applicables.push({
        ...t,
        build: () => {
          for (let k = 0; k < 12; k++) {
            const q = t.build(pool, semaine);
            if (q) return q;
          }
          return null;
        },
      });
    }
  }
  if (!applicables.length) return null;
  let q = pickAdaptive(CATEGORY, applicables);
  for (let i = 0; !q && i < 12; i++) {
    const t = applicables[Math.floor(Math.random() * applicables.length)];
    try { q = t.build(); } catch { q = null; }
  }
  if (!q) return null;
  q.strategies = semaine.map((s) => s.id).join(' + ');
  return q;
}
