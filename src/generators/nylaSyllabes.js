// Nyla · maternelle 5 ans — Les syllabes (conscience phonologique)
//
// Taper les syllabes dans ses mains, c'est LE travail de la maternelle 5 ans:
// entendre que « banane » se découpe en trois morceaux, bien avant de savoir
// l'écrire. Deux générateurs sortent d'ici:
//   • generateNylaSyllabes  — maternelle: combien de syllabes, première syllabe
//   • generateNylaFusion    — le pont vers la 1re année: m + a = « ma »
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

const CONSONNES = ['m', 'l', 'r', 's', 'p', 't', 'f', 'v', 'n', 'd', 'b', 'ch'];
const VOYELLES = ['a', 'i', 'o', 'u', 'é', 'ou'];

// Mots découpés en syllabes — c'est le découpage qu'on tape dans ses mains
// en classe (ba-na-ne), pas le découpage typographique du dictionnaire.
const MOTS_SYLLABES = [
  { mot: 'chat', syl: ['chat'], icon: '🐱' },
  { mot: 'loup', syl: ['loup'], icon: '🐺' },
  { mot: 'nid', syl: ['nid'], icon: '🪹' },
  { mot: 'pain', syl: ['pain'], icon: '🍞' },
  { mot: 'main', syl: ['main'], icon: '✋' },
  { mot: 'papa', syl: ['pa', 'pa'], icon: '👨' },
  { mot: 'maman', syl: ['ma', 'man'], icon: '👩' },
  { mot: 'bébé', syl: ['bé', 'bé'], icon: '👶' },
  { mot: 'lapin', syl: ['la', 'pin'], icon: '🐰' },
  { mot: 'vélo', syl: ['vé', 'lo'], icon: '🚲' },
  { mot: 'moto', syl: ['mo', 'to'], icon: '🏍️' },
  { mot: 'sapin', syl: ['sa', 'pin'], icon: '🌲' },
  { mot: 'mouton', syl: ['mou', 'ton'], icon: '🐑' },
  { mot: 'cochon', syl: ['co', 'chon'], icon: '🐷' },
  { mot: 'souris', syl: ['sou', 'ris'], icon: '🐭' },
  { mot: 'maison', syl: ['mai', 'son'], icon: '🏠' },
  { mot: 'tortue', syl: ['tor', 'tue'], icon: '🐢' },
  { mot: 'pomme', syl: ['pom', 'me'], icon: '🍎' },
  { mot: 'banane', syl: ['ba', 'na', 'ne'], icon: '🍌' },
  { mot: 'girafe', syl: ['gi', 'ra', 'fe'], icon: '🦒' },
  { mot: 'carotte', syl: ['ca', 'rot', 'te'], icon: '🥕' },
  { mot: 'éléphant', syl: ['é', 'lé', 'phant'], icon: '🐘' },
  { mot: 'chocolat', syl: ['cho', 'co', 'lat'], icon: '🍫' },
  { mot: 'domino', syl: ['do', 'mi', 'no'], icon: '🀱' },
  { mot: 'kangourou', syl: ['kan', 'gou', 'rou'], icon: '🦘' },
  { mot: 'dinosaure', syl: ['di', 'no', 'sau', 're'], icon: '🦕' },
  { mot: 'ordinateur', syl: ['or', 'di', 'na', 'teur'], icon: '💻' },
];

// 1. Fusion — deux lettres, une syllabe
function buildFusion() {
  const c = pick(CONSONNES);
  const v = pick(VOYELLES);
  const bonne = c + v;
  const faux = new Set();
  faux.add(v + c);                                  // l'inversion: l'erreur classique
  while (faux.size < 3) {
    const c2 = pick(CONSONNES);
    const v2 = pick(VOYELLES);
    const cand = c2 + v2;
    if (cand !== bonne) faux.add(cand);
  }
  return {
    category: 'nyla_fusion',
    type: 'fusion',
    text: `« ${c} » et « ${v} », ça fait quelle syllabe?`,
    correct: bonne,
    options: shuffle([bonne, ...[...faux].slice(0, 3)]),
    explanation: `${c} + ${v} = « ${bonne} ». On dit la première lettre, puis on glisse vers la deuxième.`,
    hint: `Étire le son: ${c}...${v}... ${bonne}!`,
    spokenWord: bonne,
  };
}

// 2. Combien de syllabes?
function buildCombien() {
  const m = pick(MOTS_SYLLABES);
  const n = m.syl.length;
  const options = shuffle([...new Set([n, 1, 2, 3, 4])].slice(0, 4)).map(String);
  return {
    category: 'nyla_syllabes',
    type: 'combien',
    text: `Combien de syllabes dans ce mot?\n\n${m.icon} ${m.mot}`,
    correct: String(n),
    options,
    explanation: `${m.syl.join(' - ')} → ${n} syllabe${n > 1 ? 's' : ''}.`,
    hint: 'Tape dans tes mains une fois par syllabe en disant le mot.',
    spokenWord: m.mot,
  };
}

// 3. La première syllabe
function buildPremiere() {
  const m = pick(MOTS_SYLLABES.filter((x) => x.syl.length > 1));
  const bonne = m.syl[0];
  const faux = new Set();
  for (const autre of shuffle(MOTS_SYLLABES)) {
    if (faux.size >= 3) break;
    const s = autre.syl[0];
    if (s !== bonne) faux.add(s);
  }
  if (faux.size < 3) return null;
  return {
    category: 'nyla_syllabes',
    type: 'premiere',
    text: `Quelle est la PREMIÈRE syllabe de ce mot?\n\n${m.icon} ${m.mot}`,
    correct: bonne,
    options: shuffle([bonne, ...[...faux].slice(0, 3)]),
    explanation: `${m.mot} = ${m.syl.join(' - ')}. La première syllabe, c'est « ${bonne} ».`,
    hint: 'Dis le mot lentement et arrête-toi après le premier morceau.',
    spokenWord: m.mot,
  };
}

// Maternelle 5 ans: on ÉCOUTE les syllabes, on ne les fusionne pas encore.
function buildOne() {
  const r = Math.random();
  if (r < 0.6) return buildCombien();
  return buildPremiere() || buildCombien();
}

export function generateNylaSyllabes() {
  return withFresh('nyla_syllabes', buildOne, 60, 25, (q) => `${q.type}|${q.text}`);
}

// Le pont vers la 1re année: fusionner deux lettres en une syllabe.
export function generateNylaFusion() {
  return withFresh('nyla_fusion', () => buildFusion(), 60, 25, (q) => q.text);
}
