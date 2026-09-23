// Leçon « Verbes » de la semaine du 21 au 25 septembre 2026:
//   « Les verbes être, avoir, aimer, aller et finir à l'infinitif »
// (feuille de l'enseignant(e), + Aide-mémoire Jazz)
//
// L'infinitif, c'est le nom du verbe: la forme qui ne change JAMAIS, celle du
// dictionnaire. Cinq verbes cette semaine, un par famille:
//   aimer  → 1er groupe (-er)
//   finir  → 2e groupe (-ir, « nous finissons »)
//   être · avoir · aller → les trois irréguliers que tout le reste utilise
//
// Pourquoi ça compte pour Ryan: à l'examen de passé composé il a eu 0/3 en
// « conjuguant l'infinitif » (note de l'enseignante: « Reste concentré!! »), et
// sa dictée confond encore -é et -er. Les deux se règlent ici: savoir reconnaître
// l'infinitif, c'est savoir quand le verbe NE se conjugue PAS.
import { getStudyRounds } from '../utils/studyRounds';
import { pickAdaptive } from '../utils/skillStats';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const CATEGORY = 'infinitif';
const RULE = `L'infinitif, c'est le NOM du verbe — la forme du dictionnaire, celle qui ne change jamais.
Les 5 verbes de la semaine: être · avoir · aimer · aller · finir
Truc: si on peut dire « il faut ___ », le verbe est à l'infinitif.
Après un 2e verbe (je vais, je dois, il faut, pour, sans) → INFINITIF, jamais -é.`;
const ruleFor = () => (getStudyRounds(CATEGORY) < 3 ? RULE : undefined);

// Les 5 verbes de la semaine + leurs formes conjuguées les plus courantes.
const VERBES = [
  {
    inf: 'être', groupe: 'irrégulier',
    formes: [
      { p: 'Je', f: 'suis' }, { p: 'Tu', f: 'es' }, { p: 'Il', f: 'est' },
      { p: 'Nous', f: 'sommes' }, { p: 'Vous', f: 'êtes' }, { p: 'Elles', f: 'sont' },
    ],
  },
  {
    inf: 'avoir', groupe: 'irrégulier',
    formes: [
      { p: "J'", f: 'ai', colle: true }, { p: 'Tu', f: 'as' }, { p: 'Elle', f: 'a' },
      { p: 'Nous', f: 'avons' }, { p: 'Vous', f: 'avez' }, { p: 'Ils', f: 'ont' },
    ],
  },
  {
    inf: 'aimer', groupe: '1er groupe (-er)',
    formes: [
      { p: "J'", f: 'aime', colle: true }, { p: 'Tu', f: 'aimes' }, { p: 'Il', f: 'aime' },
      { p: 'Nous', f: 'aimons' }, { p: 'Vous', f: 'aimez' }, { p: 'Elles', f: 'aiment' },
    ],
  },
  {
    inf: 'aller', groupe: 'irrégulier',
    formes: [
      { p: 'Je', f: 'vais' }, { p: 'Tu', f: 'vas' }, { p: 'Il', f: 'va' },
      { p: 'Nous', f: 'allons' }, { p: 'Vous', f: 'allez' }, { p: 'Ils', f: 'vont' },
    ],
  },
  {
    inf: 'finir', groupe: '2e groupe (-ir)',
    formes: [
      { p: 'Je', f: 'finis' }, { p: 'Tu', f: 'finis' }, { p: 'Elle', f: 'finit' },
      { p: 'Nous', f: 'finissons' }, { p: 'Vous', f: 'finissez' }, { p: 'Ils', f: 'finissent' },
    ],
  },
];

const infinitifs = VERBES.map((v) => v.inf);
const verbeDe = (inf) => VERBES.find((v) => v.inf === inf);

// « J' » + « ai » se colle, « Je » + « suis » prend une espace.
const phraseAvec = (p, f, suite = '') => {
  const debut = p.endsWith("'") ? `${p}${f}` : `${p} ${f}`;
  return suite ? `${debut} ${suite}` : debut;
};

// Compléments courts pour que la phrase sonne vraie
const SUITES = {
  être: ['content', 'en retard', 'à l\'école', 'le plus rapide', 'prêts'],
  avoir: ['un chien', 'huit ans', 'faim', 'une bonne idée', 'des billes'],
  aimer: ['le hockey', 'les fraises', 'lire des BD', 'la neige', 'mon école'],
  aller: ['à la piscine', 'au parc', 'chez grand-maman', 'dehors', 'à Laval'],
  finir: ['mon devoir', 'le casse-tête', 'la course', 'son dessin', 'le ménage'],
};

// ===== 1. Une forme conjuguée → son infinitif =====
function trouverInfinitif() {
  const v = pick(VERBES);
  const forme = pick(v.formes);
  const suite = pick(SUITES[v.inf]);
  const phrase = phraseAvec(forme.p, forme.f, suite);
  return {
    category: CATEGORY,
    rule: ruleFor(),
    type: 'trouver_infinitif',
    text: `${phrase}.\n\nLe verbe est « ${forme.f} ». Quel est son INFINITIF?`,
    correct: v.inf,
    options: shuffle(infinitifs),
    explanation: `${forme.f} → ${v.inf} (${v.groupe}).\nOn le trouve en disant « il faut ${v.inf} ».`,
    hint: 'Dis « il faut ___ » avec chaque réponse. La bonne sonne juste.',
  };
}

// ===== 2. Parmi 4 mots, lequel est à l'infinitif? =====
function lequelEstInfinitif() {
  const v = pick(VERBES);
  // Un même verbe a des formes identiques à deux personnes (je finis / tu finis,
  // j'aime / il aime): on déduplique, sinon le même bouton apparaît deux fois.
  const autres = [...new Set(shuffle(v.formes).map((f) => f.f))].slice(0, 3);
  return {
    category: CATEGORY,
    rule: ruleFor(),
    type: 'reconnaitre',
    text: `Ces 4 mots sont le MÊME verbe.\nLequel est à l'infinitif?`,
    correct: v.inf,
    options: shuffle([v.inf, ...autres]),
    explanation: `${v.inf} est l'infinitif: c'est la forme du dictionnaire, elle ne change jamais.\nLes autres (${autres.join(', ')}) sont conjuguées — elles changent selon qui fait l'action.`,
    hint: "L'infinitif n'a pas de « je / tu / il » devant lui.",
  };
}

// ===== 3. Le piège -é / -er (après un 2e verbe, on garde l'infinitif) =====
// Seul « aimer » est en -er parmi les 5, donc on élargit à des verbes -er
// courants pour que le piège revienne souvent — c'est la faute de dictée.
const PIEGE_ER = [
  { inf: 'aimer', pp: 'aimé' },
  { inf: 'manger', pp: 'mangé' },
  { inf: 'jouer', pp: 'joué' },
  { inf: 'regarder', pp: 'regardé' },
  { inf: 'danser', pp: 'dansé' },
  { inf: 'ranger', pp: 'rangé' },
];
const DECLENCHEURS = [
  { texte: 'Je vais', pourquoi: 'après « aller », on met l\'infinitif (futur proche)' },
  { texte: 'Tu dois', pourquoi: 'après « devoir », on met l\'infinitif' },
  { texte: 'Il faut', pourquoi: 'après « il faut », on met l\'infinitif' },
  { texte: 'Nous allons', pourquoi: 'après « aller », on met l\'infinitif (futur proche)' },
  { texte: 'Elle veut', pourquoi: 'après « vouloir », on met l\'infinitif' },
];

function piegeEr() {
  const v = pick(PIEGE_ER);
  const d = pick(DECLENCHEURS);
  const suite = v.inf === 'aimer' ? 'ce film' : pick(['ma chambre', 'dehors', 'le match', 'avec Nyla']);
  return {
    category: CATEGORY,
    rule: ruleFor(),
    type: 'piege_er',
    text: `${d.texte} ___ ${suite}.\n\nOn écrit « ${v.inf} » ou « ${v.pp} »?`,
    correct: v.inf,
    options: shuffle([v.inf, v.pp]),
    explanation: `${d.texte} ${v.inf} ${suite}.\nPourquoi: ${d.pourquoi}.\nLe truc: remplace par « finir ». On dit « ${d.texte} finir » — jamais « ${d.texte} fini ». Donc c'est -ER.`,
    hint: 'Remplace le verbe par « finir ». Si « finir » sonne bien, écris -ER.',
  };
}

// ===== 4. Le contraire: ici c'est bien -é, pas l'infinitif =====
function piegeErInverse() {
  const v = pick(PIEGE_ER);
  const aux = pick([
    { texte: "J'ai", suite: '' },
    { texte: 'Tu as', suite: '' },
    { texte: 'Elle a', suite: '' },
    { texte: 'Nous avons', suite: '' },
  ]);
  const suite = v.inf === 'aimer' ? 'ce film' : pick(['ma chambre', 'le match', 'toute la journée']);
  return {
    category: CATEGORY,
    rule: ruleFor(),
    type: 'piege_er_inverse',
    text: `${aux.texte} ___ ${suite}.\n\nOn écrit « ${v.inf} » ou « ${v.pp} »?`,
    correct: v.pp,
    options: shuffle([v.inf, v.pp]),
    explanation: `${aux.texte} ${v.pp} ${suite}.\nAprès l'auxiliaire AVOIR, c'est le passé composé: on écrit -É.\nLe truc « finir »: on dit « ${aux.texte} fini » — pas « ${aux.texte} finir ». Donc -É.`,
    hint: 'Remplace par « finir ». Si c\'est « fini » qui sonne bien, écris -É.',
  };
}

// ===== 5. Le groupe du verbe =====
function groupeDuVerbe() {
  const v = pick(VERBES);
  return {
    category: CATEGORY,
    rule: ruleFor(),
    type: 'groupe',
    text: `Le verbe « ${v.inf} »\n\nÀ quel groupe appartient-il?`,
    correct: v.groupe,
    options: shuffle(['1er groupe (-er)', '2e groupe (-ir)', 'irrégulier']),
    explanation: v.groupe === 'irrégulier'
      ? `${v.inf} est un verbe IRRÉGULIER: il ne suit aucune règle, il faut le savoir par cœur.\nêtre, avoir et aller sont les trois irréguliers de la semaine.`
      : v.groupe === '1er groupe (-er)'
        ? `${v.inf} se termine par -ER → 1er groupe. C'est le plus grand groupe du français.`
        : `${v.inf} se termine par -IR et fait « nous finissons » → 2e groupe.`,
    hint: 'Regarde la fin du mot: -er, -ir… ou rien de régulier du tout.',
  };
}

// ===== 6. Quel verbe manque? (sens + bonne forme) =====
function quelVerbe() {
  const v = pick(VERBES);
  const forme = pick(v.formes);
  const suite = pick(SUITES[v.inf]);
  // Même personne si possible, et jamais deux fois la même forme ni la bonne réponse.
  const autresFormes = [];
  for (const x of shuffle(VERBES.filter((y) => y.inf !== v.inf))) {
    if (autresFormes.length >= 3) break;
    const f = (x.formes.find((ff) => ff.p === forme.p) || x.formes[0]).f;
    if (f !== forme.f && !autresFormes.includes(f)) autresFormes.push(f);
  }
  const trou = forme.p.endsWith("'") ? `${forme.p}___` : `${forme.p} ___`;
  return {
    category: CATEGORY,
    rule: ruleFor(),
    type: 'quel_verbe',
    text: `${trou} ${suite}.\n\nQuel mot complète la phrase?`,
    correct: forme.f,
    options: shuffle([forme.f, ...autresFormes]),
    explanation: `${phraseAvec(forme.p, forme.f, suite)}.\nC'est le verbe « ${v.inf} » conjugué avec « ${forme.p.replace("'", '')} ».`,
    hint: 'Lis la phrase en entier dans ta tête avec chaque réponse.',
  };
}

// ===== 7. La question 6 de la feuille: le bon verbe dans la phrase =====
// Ryan a laissé cette question VIDE sur sa feuille du 23 sept. C'est la plus
// dure de la page: il ne s'agit plus de reconnaître un infinitif déjà écrit,
// mais de CHOISIR lequel des cinq a du sens dans la phrase. Les trois
// premières phrases sont mot pour mot celles du cahier; les autres ont la
// même forme, pour qu'il s'entraîne sans apprendre les réponses par cœur.
const PHRASES_FEUILLE = [
  { avant: '___', apres: "un gentil renard, j'aurais bien peur de ce méchant rat.", rep: 'Être',
    pourquoi: "« Être un gentil renard » = « si j'étais un gentil renard ». C'est ce qu'on EST." },
  { avant: 'Vous devez', apres: 'votre travail avant d’aller jouer dehors.', rep: 'finir',
    pourquoi: "Après « vous devez », le verbe reste à l'infinitif. Ce qu'on termine, on le FINIT." },
  { avant: 'Vous devez finir votre travail avant d’', apres: 'jouer dehors.', rep: 'aller', colle: true,
    pourquoi: "Après « avant de », infinitif. Et on va quelque part: ALLER." },
  { avant: '___', apres: 'une grande maison veut aussi dire faire beaucoup de ménage.', rep: 'Avoir',
    pourquoi: "Posséder une maison, c'est l'AVOIR." },
  { avant: 'Tu vas', apres: 'ton assiette avant le dessert.', rep: 'finir',
    pourquoi: "Après « tu vas », infinitif. Terminer son assiette = la FINIR." },
  { avant: 'Il faut', apres: 'poli avec tout le monde.', rep: 'être',
    pourquoi: "« Poli » décrit ce qu'on EST, pas ce qu'on a." },
  { avant: 'Je voudrais', apres: 'un chien, mais maman dit non.', rep: 'avoir',
    pourquoi: "Posséder un chien, c'est l'AVOIR." },
  { avant: 'On va', apres: 'au parc après l’école.', rep: 'aller',
    pourquoi: "Se rendre quelque part, c'est y ALLER." },
  { avant: 'Ryan adore', apres: 'les fraises et le hockey.', rep: 'aimer',
    pourquoi: "« Adorer » et « AIMER » disent la même chose." },
  { avant: 'Il faut', apres: 'ses amis comme ils sont.', rep: 'aimer',
    pourquoi: "Bien vouloir à quelqu'un, c'est l'AIMER." },
];

function verbeDansLaPhrase() {
  const p = pick(PHRASES_FEUILLE);
  // Les choix sont toujours les 5 verbes de la semaine, dans la casse de la
  // réponse: une seule majuscule au milieu de quatre minuscules, et l'enfant
  // trouve sans lire la phrase.
  const majuscule = p.rep[0] === p.rep[0].toUpperCase();
  const options = infinitifs.map((v) => (majuscule ? v[0].toUpperCase() + v.slice(1) : v));
  const trou = p.colle ? `${p.avant}___ ${p.apres}` : `${p.avant} ___ ${p.apres}`;
  const complete = p.colle ? `${p.avant}${p.rep} ${p.apres}` : `${p.avant} ${p.rep} ${p.apres}`;
  return {
    category: CATEGORY,
    rule: ruleFor(),
    type: 'verbe_phrase',
    text: `Complète avec le bon verbe à l'infinitif:

${trou}`,
    correct: p.rep,
    options: shuffle(options),
    explanation: `${complete}
${p.pourquoi}
Les cinq verbes de la semaine: être · avoir · aimer · aller · finir.`,
    hint: 'Lis la phrase en entier avec chaque verbe. Un seul a du sens.',
  };
}

function buildOne() {
  return pickAdaptive(CATEGORY, [
    { type: 'trouver_infinitif', w: 24, build: trouverInfinitif },
    { type: 'reconnaitre', w: 16, build: lequelEstInfinitif },
    { type: 'piege_er', w: 20, build: piegeEr },
    { type: 'piege_er_inverse', w: 14, build: piegeErInverse },
    { type: 'groupe', w: 10, build: groupeDuVerbe },
    { type: 'quel_verbe', w: 16, build: quelVerbe },
    { type: 'verbe_phrase', w: 22, build: verbeDansLaPhrase },
  ]);
}

export function generateInfinitif() {
  return buildOne();
}

export { VERBES as VERBES_SEMAINE, verbeDe };
