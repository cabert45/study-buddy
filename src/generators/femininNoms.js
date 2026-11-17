// Le féminin des noms — la RÈGLE GÉNÉRALE (Aide-mémoire Jazz p. 9, feuille
// « Plan de travail, semaine du 16 au 20 novembre 2026 »; module t3m1 du cahier).
//
// Le générateur « pluriels_ryan » avait déjà un féminin, mais d'ADJECTIFS
// (grand → grande, menteur → menteuse, beau → belle). La leçon de la semaine
// est celle des NOMS de personnes et d'animaux, et seulement la règle
// générale:
//   • on ajoute un e:            un ami → une amie, un marchand → une marchande
//   • le déterminant change:     un → une, le → la
//   • déjà un e à la fin? Le nom ne bouge pas, seul le déterminant change:
//                                un élève → une élève
// Bonus qui lui parle: au féminin, la lettre muette SE FAIT ENTENDRE
// (marchand → marchande: on entend le d). Il a eu 13/14 aux lettres muettes.
//
// Les exceptions (chat → chatte, chanteur → chanteuse) ne sont PAS ici: la
// feuille dit « règle générale ». Les mélanger maintenant brouillerait la règle.
import { withFresh } from '../utils/antiRepeat';

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Règle générale: + e. `muette` = la lettre qu'on n'entendait pas au masculin.
const PLUS_E = [
  { m: 'ami' }, { m: 'cousin' }, { m: 'voisin' }, { m: 'lapin' },
  { m: 'marchand', muette: 'd' }, { m: 'client', muette: 't' },
  { m: 'étudiant', muette: 't' }, { m: 'gagnant', muette: 't' },
  { m: 'candidat', muette: 't' }, { m: 'avocat', muette: 't' },
  { m: 'président', muette: 't' }, { m: 'commerçant', muette: 't' },
  { m: 'invité' }, { m: 'employé' }, { m: 'ennemi' }, { m: 'apprenti' },
  { m: 'rival' },
].map((x) => ({ ...x, f: x.m + 'e' }));

// Déjà un e à la fin: seul le déterminant change.
const DEJA_E = ['élève', 'artiste', 'camarade', 'dentiste', 'pianiste',
  'journaliste', 'secrétaire', 'bibliothécaire', 'concierge', 'locataire'];

const PRENOMS_F = ['Léa', 'Chloé', 'Nyla', 'Cayla', 'Florence', 'Rosalie'];
const PRENOMS_M = ['Ryan', 'Félix', 'Thomas', 'Samuel', 'Liam', 'Nathan'];

function base(type, extra) {
  return { category: 'feminin_noms', type, ...extra };
}

const REGLE = 'Règle générale: au féminin, on ajoute un e au nom. Le déterminant change aussi: un → une, le → la.';

// 1. Il ÉCRIT le féminin (comme dans le cahier).
function ecrireFeminin() {
  const x = pick(PLUS_E);
  // Devant une voyelle, « le/la » devient « l' » et ne montre plus le genre:
  // on garde alors « un/une ».
  const voyelle = /^[aeéiou]/i.test(x.m);
  const det = !voyelle && Math.random() < 0.5 ? ['le', 'la'] : ['un', 'une'];
  return base('ecrire_feminin', {
    text: `${det[0]} ${x.m} → ${det[1]} ___\nÉcris le nom au féminin.`,
    correct: x.f,
    tape: 'mot',
    presque: { [x.m]: `C'est encore le masculin. Au féminin, on ajoute un e: ${x.f}.` },
    hint: 'Règle générale: on ajoute une seule lettre à la fin.',
    explanation: `${det[0]} ${x.m} → ${det[1]} ${x.f}\n${REGLE}${x.muette ? `\nÉcoute: au féminin, on ENTEND le ${x.muette} qui était muet.` : ''}`,
  });
}

// 2. À l'envers: du féminin au masculin.
function ecrireMasculin() {
  const x = pick(PLUS_E);
  return base('ecrire_masculin', {
    text: `une ${x.f} → un ___\nÉcris le nom au masculin.`,
    correct: x.m,
    tape: 'mot',
    presque: { [x.f]: `C'est encore le féminin. Au masculin, on enlève le e: ${x.m}.` },
    hint: 'Le féminin, c\'est le masculin + e. Alors enlève le e.',
    explanation: `une ${x.f} → un ${x.m}. Le masculin, c'est le féminin sans son e.`,
  });
}

// 3. Le nom qui finit déjà par e (choix: c'est là que « +e » ferait « élèvee »).
function dejaE() {
  const n = pick(DEJA_E);
  return base('deja_e', {
    text: `un ${n} → une ___`,
    correct: n,
    options: shuffle([n, `${n}e`, `${n}s`, `${n.replace(/e$/, '')}esse`]),
    hint: 'Regarde la dernière lettre du nom. Y a-t-il déjà un e?',
    explanation: `Le nom « ${n} » finit déjà par e: il ne change PAS. Seul le déterminant change: un ${n} → une ${n}.`,
  });
}

// 4. La lettre muette qu'on entend au féminin.
function lettreMuette() {
  const x = pick(PLUS_E.filter((y) => y.muette));
  const autres = ['d', 't', 'n', 's', 'e'].filter((l) => l !== x.muette);
  return base('lettre_muette', {
    text: `un ${x.m} → une ${x.f}\nQuelle lettre muette est-ce qu'on ENTEND maintenant au féminin?`,
    correct: x.muette,
    options: shuffle([x.muette, ...shuffle(autres).slice(0, 3)]),
    hint: 'Dis les deux mots à voix haute. Quelle lettre se réveille?',
    explanation: `« un ${x.m} »: le ${x.muette} est muet. « une ${x.f} »: grâce au e, on entend le ${x.muette}.\nC'est un truc pour trouver une lettre muette: pense au féminin!`,
  });
}

// 5. Dans une phrase: le prénom dit le genre.
function phrase() {
  // Seulement des phrases qui sonnent juste (« Mon amie Léa » est correct
  // mais brouillerait tout: mon devant une voyelle, même au féminin).
  const fille = Math.random() < 0.5;
  const prenom = pick(fille ? PRENOMS_F : PRENOMS_M);
  const gabarits = [
    { mot: 'cousin', t: (d) => `${d ? 'Ma' : 'Mon'} ___ ${prenom} vient jouer chez moi.`, det: (d) => (d ? 'Ma' : 'Mon') },
    { mot: 'voisin', t: (d) => `${d ? 'Ma' : 'Mon'} ___ ${prenom} promène son chien.`, det: (d) => (d ? 'Ma' : 'Mon') },
    { mot: 'gagnant', t: (d) => `${d ? 'La' : 'Le'} ___ de la course, c'est ${prenom}!`, det: (d) => (d ? 'La' : 'Le') },
    { mot: 'marchand', t: (d) => `${prenom} est ${d ? 'la' : 'le'} ___ de fruits du marché.`, det: (d) => (d ? 'la' : 'le') },
  ];
  const g = pick(gabarits);
  const x = PLUS_E.find((y) => y.m === g.mot);
  const det = g.det(fille);
  const bonne = fille ? x.f : x.m;
  return base('phrase', {
    text: g.t(fille),
    correct: bonne,
    options: shuffle([x.m, x.f, `${x.m}s`, `${x.f}s`]),
    hint: `${prenom}: c'est un garçon ou une fille? Et « ${det} », c'est masculin ou féminin?`,
    explanation: `${prenom} est ${fille ? 'une fille' : 'un garçon'}, et « ${det} » est ${fille ? 'féminin' : 'masculin'}: ${det.toLowerCase()} ${bonne}. Une seule personne → pas de s.${fille ? `\n${REGLE}` : ''}`,
  });
}

// 6. Masculin ou féminin? (le déterminant ET la fin du mot)
function genre() {
  const x = pick(PLUS_E);
  const fem = Math.random() < 0.5;
  const mot = fem ? x.f : x.m;
  return base('genre', {
    text: `Quel déterminant va avec « ${mot} »?`,
    correct: fem ? 'une' : 'un',
    options: ['un', 'une'],
    hint: 'Regarde la fin du mot: le e de la règle générale.',
    explanation: fem ? `« ${mot} » a le e du féminin: une ${mot}.` : `« ${mot} » n'a pas le e du féminin: un ${mot}. (Au féminin: une ${x.f}.)`,
  });
}

function construire() {
  const r = Math.random();
  if (r < 0.30) return ecrireFeminin();
  if (r < 0.42) return ecrireMasculin();
  if (r < 0.58) return dejaE();
  if (r < 0.70) return lettreMuette();
  if (r < 0.88) return phrase();
  return genre();
}

export function generateFemininNoms() {
  return withFresh('feminin_noms', construire, 50, 20, (q) => `${q.type}|${q.text}`);
}
