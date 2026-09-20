// « L'orthographe au quotidien, moi j'y tiens! » — les exercices du cahier,
// rejoués par l'app avec la liste de la semaine.
//
// Chaque type de question ci-dessous existe vraiment dans le cahier de Ryan:
//   lettre muette · son du c/g/s · Qui suis-je? · même famille · synonyme
//   charivari · lettres manquantes · ordre alphabétique · noms/verbes
//   consonnes jumelles · homophones · intrus · n ou m devant b/p
//
// La semaine du 21 au 25 sept. 2026 = Liste 2 (lettre muette), à remettre le
// 25. Le générateur suit `LISTE_SEMAINES`: quand la semaine tourne, la liste
// tourne aussi, et les listes déjà vues reviennent en révision (~30 %).
import { getStudyRounds } from '../utils/studyRounds';
import { pickAdaptive } from '../utils/skillStats';
import { listeCetteSemaine, listesVues } from '../data/orthographeQuotidien';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const CATEGORY = 'orthographe';

// Une seule règle à la fois: celle que la liste travaille vraiment. Avant, le
// cadre affichait les cinq règles (c, g, s, lettre muette…) même pour la
// liste 1 qui n'en utilise aucune — un mur de texte que l'enfant saute.
const REGLES = {
  general: `Les mots de la semaine s'apprennent en les REGARDANT, pas juste en les écoutant.
Regarde le mot, ferme les yeux, revois-le, puis écris-le.`,
  muette: `Une lettre muette, c'est une lettre qu'on écrit mais qu'on n'entend pas.
Le truc: mets le mot au FÉMININ et elle se met à parler.
court → courte, donc il y a un « t ».`,
  son_c: `Le « c » devant e, i, y se dit [s] — glace, cinéma.
Le « c » devant a, o, u se dit [k] — cause, écouter.
Regarde la lettre juste APRÈS le c.`,
  son_g: `Le « g » devant e, i, y se dit [j] — nuage, genre.
Le « g » devant a, o, u se dit [g] — gagner, goutte.
Regarde la lettre juste APRÈS le g.`,
  son_s: `Un seul « s » entre deux voyelles se dit [z] — église, poser.
Deux « ss » se disent [s] — pousser, vitesse.`,
  mbp: `Devant un « b » ou un « p », le « n » devient « m ».
ombre, jambe, important, septembre.`,
};
const ruleFor = (liste) => (getStudyRounds(CATEGORY) < 3 ? (REGLES[liste.kind] || REGLES.general) : undefined);

// La liste de la semaine 70 % du temps, une liste déjà vue 30 % (rétention).
function listeActive() {
  const courante = listeCetteSemaine();
  const vues = listesVues().filter((l) => l && l.id !== courante.id);
  if (vues.length && Math.random() < 0.3) return pick(vues);
  return courante;
}

// Choisit `n` mots distincts de la liste qui ont tous la propriété demandée
function motsAvec(liste, test, n) {
  const ok = shuffle(liste.mots.filter(test));
  return ok.slice(0, n);
}

// Distracteurs: d'autres mots de la même liste (donc plausibles)
function autresMots(liste, motCorrect, n = 3) {
  return shuffle(liste.mots.filter((m) => m.mot !== motCorrect)).slice(0, n).map((m) => m.mot);
}

const LETTRES_MUETTES = ['t', 'd', 's', 'x', 'p', 'g', 'l', 'e'];

// ===== Lettre muette (listes 2, 3, 10) =====
function lettreMuette(liste) {
  const cands = liste.mots.filter((m) => m.muette);
  if (!cands.length) return null;
  const m = pick(cands);
  const faux = shuffle(LETTRES_MUETTES.filter((l) => l !== m.muette)).slice(0, 3);
  const indice = m.fem
    ? `Au féminin, on écrit « ${m.fem} » — et là, on l'entend!`
    : 'Cherche la dernière lettre qu\'on écrit mais qu\'on n\'entend pas.';
  return {
    category: CATEGORY, rule: ruleFor(liste), type: 'muette',
    text: `« ${m.mot} »\n\nQuelle est la lettre muette à la fin de ce mot?`,
    correct: m.muette,
    options: shuffle([m.muette, ...faux]),
    explanation: `${m.mot} → la lettre muette est « ${m.muette} ».\n${indice}`,
    hint: m.fem ? 'Mets le mot au FÉMININ: la lettre muette se met à parler.' : 'Prononce le mot: quelle lettre écrit-on sans l\'entendre?',
  };
}

// ===== Le féminin révèle la muette =====
function feminin(liste) {
  const cands = liste.mots.filter((m) => m.fem);
  if (!cands.length) return null;
  const m = pick(cands);
  const faux = shuffle(cands.filter((x) => x.mot !== m.mot)).slice(0, 3).map((x) => x.fem);
  if (faux.length < 2) return null;
  return {
    category: CATEGORY, rule: ruleFor(liste), type: 'feminin',
    text: `Quel est le FÉMININ de « ${m.mot} »?`,
    correct: m.fem,
    options: shuffle([m.fem, ...faux]),
    explanation: `${m.mot} → ${m.fem}.\nOn ajoute un « e », et la lettre muette « ${m.muette} » s'entend enfin.`,
    hint: 'Au féminin, on ajoute un e à la fin — et la lettre muette se réveille.',
  };
}

// ===== Le mâle et la femelle (liste 2) =====
function maleFemelle(liste) {
  const cands = liste.mots.filter((m) => m.male && m.fem);
  if (!cands.length) return null;
  const m = pick(cands);
  const versFemelle = Math.random() < 0.5;
  const autres = liste.mots.filter((x) => x.male && x.mot !== m.mot);
  if (!autres.length) return null;
  const faux = versFemelle
    ? [autres[0].fem, `${m.mot}e`.replace(`${m.muette}e`, 'e'), m.mot]
    : [autres[0].mot, m.fem, `${m.mot}s`];
  const correct = versFemelle ? m.fem : m.mot;
  const opts = [...new Set([correct, ...faux])].slice(0, 4);
  if (opts.length < 3) return null;
  return {
    category: CATEGORY, rule: ruleFor(liste), type: 'male_femelle',
    text: versFemelle
      ? `Le ${m.mot} est le mâle de la ___`
      : `La ${m.fem} est la femelle du ___`,
    correct,
    options: shuffle(opts),
    explanation: `Le ${m.mot} (mâle) · la ${m.fem} (femelle).\nLe féminin ajoute un « e » et fait entendre le « ${m.muette} » muet.`,
    hint: 'Le féminin de ces noms d\'animaux prend un « e ».',
  };
}

// ===== Le son d'une lettre: c, g ou s =====
const SONS = {
  son_c: {
    lettre: 'c', choix: ['[s]', '[k]'], champ: 'c',
    regle: 'Le « c » devant e, i, y se prononce [s] (cinéma, glace). Devant a, o, u il se prononce [k] (cause, écouter).',
  },
  son_g: {
    lettre: 'g', choix: ['[g]', '[j]'], champ: 'g',
    regle: 'Le « g » devant e, i, y se prononce [j] (nuage, genre). Devant a, o, u il se prononce [g] (gagner, goutte).',
  },
  son_s: {
    lettre: 's', choix: ['[s]', '[z]'], champ: 's',
    regle: 'Un seul « s » entre deux voyelles se prononce [z] (église, poser). Deux « ss » se prononcent [s] (pousser, vitesse).',
  },
};

function sonDeLaLettre(liste) {
  const conf = SONS[liste.kind];
  if (!conf) return null;
  // On écarte les mots où la lettre fait les DEUX sons (gorge, commencer):
  // ils servent de question à part.
  const cands = liste.mots.filter((m) => m[conf.champ] && m[conf.champ] !== 'deux');
  if (!cands.length) return null;
  const m = pick(cands);
  const correct = `[${m[conf.champ]}]`;
  return {
    category: CATEGORY, rule: ruleFor(liste), type: liste.kind,
    text: `« ${m.mot} »\n\nComment se prononce le « ${conf.lettre} » dans ce mot?`,
    correct,
    options: [...conf.choix],
    explanation: `Dans « ${m.mot} », le « ${conf.lettre} » se prononce ${correct}.\n${conf.regle}`,
    hint: `Regarde la lettre juste APRÈS le « ${conf.lettre} ».`,
  };
}

// Les mots où la lettre fait les deux sons
function deuxSons(liste) {
  const conf = SONS[liste.kind];
  if (!conf) return null;
  const cands = liste.mots.filter((m) => m[conf.champ] === 'deux');
  if (!cands.length) return null;
  const m = pick(cands);
  const autres = autresMots(liste, m.mot, 3);
  if (autres.length < 3) return null;
  return {
    category: CATEGORY, rule: ruleFor(liste), type: 'deux_sons',
    text: `Dans quel mot le « ${conf.lettre} » se prononce-t-il des DEUX façons (${conf.choix.join(' et ')})?`,
    correct: m.mot,
    options: shuffle([m.mot, ...autres]),
    explanation: `« ${m.mot} » contient deux fois la lettre « ${conf.lettre} », et elle ne se dit pas pareil les deux fois.\n${conf.regle}`,
    hint: `Cherche le mot qui a DEUX « ${conf.lettre} », suivis de lettres différentes.`,
  };
}

// ===== Qui suis-je? =====
function devinette(liste) {
  const cands = liste.mots.filter((m) => m.dev);
  if (!cands.length) return null;
  const m = pick(cands);
  const autres = autresMots(liste, m.mot, 3);
  if (autres.length < 3) return null;
  return {
    category: CATEGORY, rule: ruleFor(liste), type: 'devinette',
    text: `Qui suis-je?\n\n« ${m.dev} »`,
    correct: m.mot,
    options: shuffle([m.mot, ...autres]),
    explanation: `${m.dev} → ${m.mot}.`,
    hint: 'Relis les mots de la liste et essaie-les un par un dans la phrase.',
  };
}

// ===== Mot de la même famille =====
function famille(liste) {
  const cands = liste.mots.filter((m) => m.fam);
  if (!cands.length) return null;
  const m = pick(cands);
  const autres = autresMots(liste, m.mot, 3);
  if (autres.length < 3) return null;
  return {
    category: CATEGORY, rule: ruleFor(liste), type: 'famille',
    text: `Quel mot de la liste est de la MÊME FAMILLE que « ${m.fam} »?`,
    correct: m.mot,
    options: shuffle([m.mot, ...autres]),
    explanation: `${m.fam} et ${m.mot} sont de la même famille: ils partagent le même morceau de mot et la même idée.`,
    hint: 'Cherche le petit morceau de mot qui se répète dans les deux.',
  };
}

// ===== Synonyme =====
function synonyme(liste) {
  const cands = liste.mots.filter((m) => m.syn);
  if (!cands.length) return null;
  const m = pick(cands);
  const autres = autresMots(liste, m.mot, 3);
  if (autres.length < 3) return null;
  return {
    category: CATEGORY, rule: ruleFor(liste), type: 'synonyme',
    text: `Quel mot de la liste veut dire la même chose que « ${m.syn} »?`,
    correct: m.mot,
    options: shuffle([m.mot, ...autres]),
    explanation: `${m.syn} = ${m.mot}. Deux mots différents, le même sens: des synonymes.`,
    hint: 'Un synonyme, c\'est un mot qui dit la même chose autrement.',
  };
}

// ===== Un mot qui a un lien (liste 10) =====
function lienMot(liste) {
  const cands = liste.mots.filter((m) => m.lien);
  if (!cands.length) return null;
  const m = pick(cands);
  const autres = autresMots(liste, m.mot, 3);
  if (autres.length < 3) return null;
  return {
    category: CATEGORY, rule: ruleFor(liste), type: 'lien',
    text: `Quel mot de la liste a un LIEN avec « ${m.lien} »?`,
    correct: m.mot,
    options: shuffle([m.mot, ...autres]),
    explanation: `${m.lien} → ${m.mot}. Les deux vont ensemble dans la vraie vie.`,
    hint: 'Imagine les deux mots dans la même image.',
  };
}

// ===== Charivari (lettres mêlées) =====
function charivari(liste) {
  const cands = liste.mots.filter((m) => m.chari);
  if (!cands.length) return null;
  const m = pick(cands);
  const autres = autresMots(liste, m.mot, 3);
  if (autres.length < 3) return null;
  return {
    category: CATEGORY, rule: ruleFor(liste), type: 'charivari',
    text: `Charivari! Remets les lettres en ordre:\n\n${m.chari.split('').join(' ')}`,
    correct: m.mot,
    options: shuffle([m.mot, ...autres]),
    explanation: `${m.chari.split('').join(' ')} → ${m.mot} (${m.mot.length} lettres).`,
    hint: 'Compte les lettres, puis cherche le mot de la liste qui a exactement les mêmes.',
  };
}

// ===== Lettres manquantes =====
function lettresManquantes(liste) {
  const cands = liste.mots.filter((m) => m.mot.length >= 5);
  if (!cands.length) return null;
  const m = pick(cands);
  const lettres = m.mot.split('');
  // On cache 2 lettres, jamais la première
  const positions = shuffle(lettres.map((_, i) => i).filter((i) => i > 0)).slice(0, 2).sort((a, b) => a - b);
  const cachees = positions.map((i) => lettres[i]);
  const affiche = lettres.map((l, i) => (positions.includes(i) ? '__' : l)).join(' ');
  const correct = cachees.join(' · ');

  // Distracteurs: les mêmes positions prises dans d'autres mots de la liste
  const faux = new Set();
  for (const autre of shuffle(liste.mots)) {
    if (faux.size >= 3) break;
    const l2 = autre.mot.split('');
    const cand = positions.map((i) => l2[i] || pick(['a', 'e', 'i', 'o', 'u'])).join(' · ');
    if (cand !== correct) faux.add(cand);
  }
  if (faux.size < 2) return null;
  return {
    category: CATEGORY, rule: ruleFor(liste), type: 'lettres_manquantes',
    text: `Trouve les lettres manquantes:\n\n${affiche}`,
    correct,
    options: shuffle([correct, ...[...faux].slice(0, 3)]),
    explanation: `Le mot est « ${m.mot} ».\nLes lettres qui manquaient: ${correct}.`,
    hint: 'Compte les cases, puis cherche dans la liste le mot qui a la bonne longueur.',
  };
}

// ===== Ordre alphabétique =====
function alphabetique(liste) {
  const choisis = motsAvec(liste, () => true, 4).map((m) => m.mot);
  if (choisis.length < 4) return null;
  const bon = [...choisis].sort((a, b) => a.localeCompare(b, 'fr'));
  const label = (arr) => arr.join(' , ');
  const mauvais = [
    [...bon].reverse(),
    // trié sur la DEUXIÈME lettre: l'erreur classique
    [...choisis].sort((a, b) => (a[1] || '').localeCompare(b[1] || '', 'fr')),
    // trié par longueur
    [...choisis].sort((a, b) => a.length - b.length),
  ];
  const vus = new Set([label(bon)]);
  const opts = [label(bon)];
  for (const m of mauvais) {
    const l = label(m);
    if (!vus.has(l)) { vus.add(l); opts.push(l); }
  }
  if (opts.length < 3) return null;
  return {
    category: CATEGORY, rule: ruleFor(liste), type: 'alphabetique',
    text: `Place ces mots en ORDRE ALPHABÉTIQUE:\n\n${choisis.join('   ·   ')}`,
    correct: label(bon),
    options: shuffle(opts),
    explanation: `${label(bon)}\nOn compare la 1re lettre. Si elle est pareille, on passe à la 2e, puis à la 3e.`,
    hint: 'Première lettre d\'abord. En cas d\'égalité, regarde la lettre suivante.',
  };
}

// ===== Verbe ou nom commun? =====
function classeDuMot(liste) {
  const chercheVerbe = Math.random() < 0.5;
  const bons = liste.mots.filter((m) => (chercheVerbe ? m.v : m.nom && !m.v));
  const mauvais = liste.mots.filter((m) => (chercheVerbe ? !m.v : !m.nom || m.v));
  if (!bons.length || mauvais.length < 3) return null;
  const m = pick(bons);
  const faux = shuffle(mauvais).slice(0, 3).map((x) => x.mot);
  return {
    category: CATEGORY, rule: ruleFor(liste), type: 'classe',
    text: `Parmi ces mots de la liste, lequel est ${chercheVerbe ? "un VERBE (à l'infinitif)" : 'un NOM COMMUN'}?`,
    correct: m.mot,
    options: shuffle([m.mot, ...faux]),
    explanation: chercheVerbe
      ? `« ${m.mot} » est un verbe à l'infinitif: on peut dire « il faut ${m.mot} ».`
      : `« ${m.mot} » est un nom commun: on peut mettre un déterminant devant — ${m.genre === 'f' ? 'la' : 'le'} ${m.mot}, ${m.genre === 'f' ? 'une' : 'un'} ${m.mot}.`,
    hint: chercheVerbe ? 'Essaie « il faut ___ » devant chaque mot.' : 'Essaie « un / une / le / la ___ » devant chaque mot.',
  };
}

// ===== Consonnes jumelles =====
function jumelles(liste) {
  const bons = liste.mots.filter((m) => m.jum);
  const mauvais = liste.mots.filter((m) => !m.jum);
  if (!bons.length || mauvais.length < 3) return null;
  const m = pick(bons);
  const faux = shuffle(mauvais).slice(0, 3).map((x) => x.mot);
  return {
    category: CATEGORY, rule: ruleFor(liste), type: 'jumelles',
    text: 'Quel mot contient des CONSONNES JUMELLES (deux fois la même lettre collée)?',
    correct: m.mot,
    options: shuffle([m.mot, ...faux]),
    explanation: `« ${m.mot} » a deux consonnes pareilles côte à côte. C'est un piège d'orthographe classique: il faut le voir avec les yeux.`,
    hint: 'Cherche deux lettres identiques collées: ll, ss, mm, tt, rr, pp…',
  };
}

// ===== Homophones (liste 9) =====
function homophone(liste) {
  const cands = liste.mots.filter((m) => m.homo);
  if (!cands.length) return null;
  const m = pick(cands);
  const autres = cands.filter((x) => x.mot !== m.mot).map((x) => x.homo.mot);
  const faux = [...new Set([m.mot, ...autres, `${m.mot}e`])].filter((x) => x !== m.homo.mot).slice(0, 3);
  if (faux.length < 2) return null;
  return {
    category: CATEGORY, rule: ruleFor(liste), type: 'homophone',
    text: `« ${m.mot} » a un homophone: un mot qui se dit PAREIL mais s'écrit autrement.\n\nLequel veut dire « ${m.homo.sens} »?`,
    correct: m.homo.mot,
    options: shuffle([m.homo.mot, ...faux]),
    explanation: `${m.mot} et ${m.homo.mot} se prononcent pareil.\n« ${m.homo.mot} » = ${m.homo.sens}.\nC'est le SENS de la phrase qui dit lequel écrire.`,
    hint: 'Les deux se disent pareil — c\'est le sens qui décide de l\'orthographe.',
  };
}

// ===== L'intrus dans une famille de mots =====
function intrus(liste) {
  const cands = liste.mots.filter((m) => m.intrus && m.intrus.length >= 3);
  if (!cands.length) return null;
  const m = pick(cands);
  const faux = m.intrus[m.intrus.length - 1]; // le dernier est l'intrus
  return {
    category: CATEGORY, rule: ruleFor(liste), type: 'intrus',
    text: `Un seul de ces mots n'est PAS de la même famille que « ${m.mot} ».\n\nLequel est l'intrus?`,
    correct: faux,
    options: shuffle(m.intrus),
    explanation: `L'intrus est « ${faux} »: il commence pareil, mais il n'a rien à voir avec « ${m.mot} ».\nLes autres partagent le sens de ${m.mot}.`,
    hint: 'Une famille de mots partage le SENS, pas seulement le début du mot.',
  };
}

// ===== n ou m devant b et p (liste 10) =====
function nOuM(liste) {
  if (liste.kind !== 'mbp') return null;
  const cands = liste.mots.filter((m) => /m[bp]/.test(m.mot));
  if (!cands.length) return null;
  const m = pick(cands);
  const i = m.mot.search(/m[bp]/);
  const suivante = m.mot[i + 1];
  const trou = `${m.mot.slice(0, i)}__${m.mot.slice(i + 1)}`;
  return {
    category: CATEGORY, rule: ruleFor(liste), type: 'n_ou_m',
    text: `${trou}\n\nOn écrit « n » ou « m »?`,
    correct: 'm',
    options: ['m', 'n'],
    explanation: `${m.mot} — devant un « ${suivante} », le « n » devient « m ».\nLa règle: devant b et p, on écrit toujours m. (Sauf bonbon, embonpoint et néanmoins.)`,
    hint: 'Regarde la lettre juste après le trou. Si c\'est b ou p, c\'est un m.',
  };
}

// Tous les constructeurs; ceux qui ne s'appliquent pas à la liste rendent null
// et pickAdaptive passe simplement au suivant.
const TYPES = [
  { type: 'muette', w: 20, build: lettreMuette },
  { type: 'feminin', w: 12, build: feminin },
  { type: 'male_femelle', w: 6, build: maleFemelle },
  { type: 'son_c', w: 18, build: sonDeLaLettre },
  { type: 'son_g', w: 18, build: sonDeLaLettre },
  { type: 'son_s', w: 18, build: sonDeLaLettre },
  { type: 'deux_sons', w: 6, build: deuxSons },
  { type: 'devinette', w: 12, build: devinette },
  { type: 'famille', w: 9, build: famille },
  { type: 'synonyme', w: 8, build: synonyme },
  { type: 'lien', w: 7, build: lienMot },
  { type: 'charivari', w: 10, build: charivari },
  { type: 'lettres_manquantes', w: 12, build: lettresManquantes },
  { type: 'alphabetique', w: 10, build: alphabetique },
  { type: 'classe', w: 10, build: classeDuMot },
  { type: 'jumelles', w: 8, build: jumelles },
  { type: 'homophone', w: 8, build: homophone },
  { type: 'intrus', w: 5, build: intrus },
  { type: 'n_ou_m', w: 14, build: nOuM },
];

export function generateOrthographe() {
  // Une liste n'alimente pas tous les types (la liste 9 n'a pas de lettre
  // muette, la liste 1 pas de son à trier...). On garde ceux qui ont de la
  // matière, puis pickAdaptive choisit selon ce que Ryan rate.
  const liste = listeActive();
  const applicables = [];
  for (const t of TYPES) {
    let essai = null;
    try { essai = t.build(liste); } catch { essai = null; }
    // Un constructeur peut échouer sur un mauvais tirage (pas assez de
    // distracteurs distincts): on lui laisse plusieurs essais avant d'abandonner.
    if (essai) {
      applicables.push({
        ...t,
        build: () => {
          for (let k = 0; k < 12; k++) {
            const q = t.build(liste);
            if (q) return q;
          }
          return null;
        },
      });
    }
  }
  if (!applicables.length) return null;

  // pickAdaptive peut rendre null quand l'anti-répétition a épuisé le pool
  // (les listes sont courtes: 10 à 22 mots). On retombe alors sur un tirage
  // direct plutôt que de rendre une question vide.
  let q = pickAdaptive(CATEGORY, applicables);
  for (let i = 0; !q && i < 12; i++) {
    const t = applicables[Math.floor(Math.random() * applicables.length)];
    try { q = t.build(); } catch { q = null; }
  }
  if (!q) return null;
  q.listeNumero = liste.numero;
  q.listeTitre = liste.titre;
  return q;
}
