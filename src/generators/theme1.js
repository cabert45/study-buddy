// Cahier de français 3e année — Thème 1 « Pleins feux sur les personnages »
// Une notion par module, pratiquée avec les TRUCS des pages « Reconnaître… »:
//   nom         → on peut mettre « un / une » devant
//   déterminant → placé devant le nom, remplaçable par un autre déterminant
//   adjectif    → on peut mettre « très » devant; il décrit un nom
//   verbe       → on peut l'encadrer par « ne… pas »
//   pronom      → je, tu, il, elle, on, nous, vous, ils, elles — devant le verbe
// Les phrases sont écrites pour l'app (pas copiées du cahier).
import { withFresh } from '../utils/antiRepeat';
import { getStudyRounds } from '../utils/studyRounds';
import { pickAdaptive, categoryPriority } from '../utils/skillStats';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// La règle reste affichée pendant les 3 premières séances de chaque notion.
const ruleFor = (mode, rule) => (getStudyRounds(mode) < 3 ? rule : undefined);

// Règles: les manipulations sont celles du cahier Jazz (p. 9, 11, 16, 17).
const NOM_RULE = `LE NOM nomme une personne, un animal, un objet, un lieu, une activité…
Il a un GENRE (masculin / féminin) ET un NOMBRE (singulier / pluriel).
Nom PROPRE = majuscule: Gaston, Montréal, Inde (les lieux aussi!)
POUR LE RECONNAÎTRE:
➕ ajouter un déterminant avant → un animal
➕ ajouter un adjectif avant ou après → un animal gourmand
🔄 le remplacer par un autre nom → un chat`;

const DET_RULE = `LE DÉTERMINANT accompagne le nom. Il REÇOIT le genre et le nombre du nom.
le · la · l' · les · un · une · des · mon · ma · mes · ce · cette · ces · plusieurs…
Un mot peut se glisser entre les deux: un BEAU chapeau.
POUR LE RECONNAÎTRE:
➕ ajouter un nom après → plusieurs joueurs
🔄 le remplacer par un autre déterminant → ma cousine → une cousine`;

const ADJ_RULE = `L'ADJECTIF décrit un nom (comment il est).
TRUC: on peut mettre « très » devant → très gourmand ✓ · très chien ✗
On peut l'enlever: la phrase a encore du sens.`;

const VERBE_RULE = `LE VERBE conjugué dit ce que fait le sujet (ou ce qu'il est).
TRUC: on peut l'encadrer par « ne… pas » → Gaston NE mange PAS.
Devant une voyelle: « n'… pas » → Il N'aime PAS.`;

const PRONOM_RULE = `LES PRONOMS DE CONJUGAISON:
je · tu · il · elle · on · nous · vous · ils · elles
Ils sont devant le verbe et disent QUI fait l'action.
Ils remplacent un nom → Gaston mange → IL mange.`;

const DIALOGUE_RULE = `LES PERSONNAGES: on décrit leur ASPECT PHYSIQUE (ce qu'on voit)
et leurs TRAITS DE CARACTÈRE (comment ils sont, comment ils agissent).
LE DIALOGUE: un TIRET (—) devant les paroles = un personnage parle.
Nouvelle ligne + nouveau tiret = un AUTRE personnage parle.`;

const VOC_RULE = `LES COMPARAISONS décrivent un personnage avec « comme »:
longue et mince comme une asperge · têtu comme une mule
On compare le personnage à quelque chose qui a la même qualité, en plus fort.`;

// ===== Banque de phrases étiquetées =====
// d = déterminant · n = nom commun · np = nom propre · a = adjectif
// v = verbe conjugué · p = pronom de conjugaison · (rien) = autre, jamais demandé
const PHRASES = [
  'Gaston/np est/v un/d cochon/n gourmand/a .',
  'Le/d petit/a hamster/n court/v dans/x sa/d roue/n .',
  'Mon/d amie/n Léa/np porte/v une/d robe/n rouge/a .',
  'Nous/p regardons/v les/d étoiles/n brillantes/a .',
  'La/d grande/a entraîneuse/n siffle/v très/x fort/x .',
  'Tu/p lances/v le/d ballon/n bleu/a .',
  'Les/d joueurs/n courent/v vite/x .',
  'Ma/d sœur/n Nyla/np dessine/v un/d chat/n noir/a .',
  'Il/p mange/v une/d pomme/n juteuse/a .',
  'Le/d capitaine/n cherche/v son/d trésor/n .',
  'Vous/p chantez/v une/d jolie/a chanson/n .',
  'Cette/d souris/n grise/a grignote/v un/d biscuit/n .',
  'Elles/p préparent/v un/d gâteau/n chaud/a .',
  'Le/d vieux/a pirate/n raconte/v des/d histoires/n .',
  'Ryan/np lit/v un/d livre/n drôle/a .',
  'On/p joue/v dans/x le/d parc/n .',
  'Deux/d chiots/n dorment/v sur/x le/d tapis/n .',
  'Je/p trouve/v un/d coquillage/n rose/a .',
  'Le/d gardien/n est/v fatigué/a .',
  'Le/d dragon/n vert/a crache/v une/d flamme/n .',
  'Mes/d parents/n aiment/v les/d longues/a promenades/n .',
  'Elle/p porte/v des/d lunettes/n rondes/a .',
  'Ils/p construisent/v une/d cabane/n solide/a .',
  'Le/d chevalier/n courageux/a protège/v le/d château/n .',
  'Léo/np et/x Maya/np préparent/v une/d surprise/n .',
  'Tu/p as/v un/d chien/n gentil/a .',
  'La/d sorcière/n méchante/a prépare/v une/d potion/n .',
  'Nous/p visitons/v notre/d nouvelle/a école/n .',
  "L'/d oiseau/n jaune/a chante/v le/d matin/n .",
  'Mon/d grand-père/n raconte/v une/d blague/n .',
  'Il/p regarde/v la/d mer/n calme/a .',
  'Cette/d petite/a fille/n adore/v les/d chats/n .',
  'Montréal/np est/v une/d grande/a ville/n .',
  'Vous/p visitez/v un/d musée/n ancien/a .',
  'Le/d robot/n rapide/a range/v la/d chambre/n .',
  'Je/p mange/v des/d fraises/n sucrées/a .',
  'Le/d lapin/n timide/a se/x cache/v .',
  'Mes/d cousines/n écoutent/v la/d radio/n .',
  // Noms propres de LIEUX — Ryan a oublié « Inde » (p. 9)
  'Gaston/np voyage/v en/x Inde/np .',
  'Mon/d oncle/n habite/v à/x Québec/np .',
  'Léa/np visite/v la/d France/np .',
  'Nos/d amis/n arrivent/v de/x Laval/np .',
];

const SENTENCES = PHRASES.map((src) => src.split(' ').map((t) => {
  const i = t.lastIndexOf('/');
  return i > 0 ? { w: t.slice(0, i), tag: t.slice(i + 1) } : { w: t, tag: 'x' };
}));

// « un / une » + le nom au singulier, pour le truc du nom dans les explications
const UN_NOM = {
  cochon: 'un cochon', hamster: 'un hamster', roue: 'une roue', amie: 'une amie', robe: 'une robe',
  étoiles: 'une étoile', entraîneuse: 'une entraîneuse', ballon: 'un ballon', joueurs: 'un joueur',
  sœur: 'une sœur', chat: 'un chat', pomme: 'une pomme', capitaine: 'un capitaine', trésor: 'un trésor',
  chanson: 'une chanson', souris: 'une souris', biscuit: 'un biscuit', gâteau: 'un gâteau',
  pirate: 'un pirate', histoires: 'une histoire', livre: 'un livre', parc: 'un parc', chiots: 'un chiot',
  tapis: 'un tapis', coquillage: 'un coquillage', gardien: 'un gardien', dragon: 'un dragon',
  flamme: 'une flamme', parents: 'un parent', promenades: 'une promenade', lunettes: 'des lunettes',
  cabane: 'une cabane', chevalier: 'un chevalier', château: 'un château', surprise: 'une surprise',
  chien: 'un chien', sorcière: 'une sorcière', potion: 'une potion', école: 'une école', oiseau: 'un oiseau',
  matin: 'un matin', 'grand-père': 'un grand-père', blague: 'une blague', mer: 'une mer', fille: 'une fille',
  chats: 'un chat', ville: 'une ville', musée: 'un musée', robot: 'un robot', chambre: 'une chambre',
  fraises: 'une fraise', lapin: 'un lapin', cousines: 'une cousine', radio: 'une radio',
  oncle: 'un oncle', amis: 'un ami',
};

const cls = (tag) => (tag === 'np' ? 'n' : tag);
const LABEL = { n: 'nom', d: 'déterminant', a: 'adjectif', v: 'verbe', p: 'pronom' };
const LABEL_PLURIEL = { n: 'noms', d: 'déterminants', a: 'adjectifs', v: 'verbes', p: 'pronoms' };
// Pas de « h »: la banque contient « hamster » (h aspiré) et aucun verbe en h.
const startsWithVowel = (w) => /^[aeiouyàâéèêëîïôû]/i.test(w);

function render(tokens) {
  let out = '';
  tokens.forEach((t, i) => {
    let w = t.w;
    // « ne » s'élide devant une voyelle: ne aime → n'aime
    if (w === 'ne' && tokens[i + 1] && startsWithVowel(tokens[i + 1].w)) w = "n'";
    if (i > 0 && !/^[.,!?]$/.test(w) && !out.endsWith("'")) out += ' ';
    out += w;
  });
  return out;
}

// Le nom qu'un mot accompagne: déterminant → le prochain nom; adjectif → le nom voisin,
// sinon le nom avant le verbe (« Notre enseignante est gentille »).
function nounFor(tokens, i) {
  const t = tokens[i];
  if (cls(t.tag) === 'd') {
    for (let j = i + 1; j < tokens.length; j++) if (cls(tokens[j].tag) === 'n') return tokens[j].w;
    return null;
  }
  if (tokens[i + 1] && cls(tokens[i + 1].tag) === 'n') return tokens[i + 1].w;
  if (tokens[i - 1] && cls(tokens[i - 1].tag) === 'n') return tokens[i - 1].w;
  for (let j = i - 1; j >= 0; j--) if (cls(tokens[j].tag) === 'n') return tokens[j].w;
  return null;
}

function negate(w) {
  return startsWithVowel(w) ? `n'${w} pas` : `ne ${w} pas`;
}

function whyClass(tokens, i) {
  const t = tokens[i];
  const w = t.w;
  switch (cls(t.tag)) {
    case 'n':
      return t.tag === 'np'
        ? `« ${w} » est un nom PROPRE: il commence par une majuscule.`
        : `« ${w} » est un nom: on peut dire « ${UN_NOM[w] || `un ${w}`} ».`;
    case 'd': {
      const n = nounFor(tokens, i);
      return `« ${w} » est un déterminant: il est placé devant le nom${n ? ` « ${n} »` : ''}.`;
    }
    case 'a': {
      const n = nounFor(tokens, i);
      return `« ${w} » est un adjectif: il décrit${n ? ` « ${n} »` : ' un nom'}. On peut dire « très ${w} ».`;
    }
    case 'v':
      return `« ${w} » est un verbe: on peut dire « ${negate(w)} ».`;
    case 'p': {
      const v = tokens.slice(i + 1).find((x) => x.tag === 'v');
      return `« ${w} » est un pronom de conjugaison: il est devant le verbe${v ? ` « ${v.w} »` : ''} et dit QUI fait l'action.`;
    }
    default:
      return '';
  }
}

// ===== Types construits sur la banque =====

// « Quel mot est un déterminant dans cette phrase? »
function trouve(c, category, rule) {
  for (let tries = 0; tries < 60; tries++) {
    const tokens = pick(SENTENCES);
    const idxs = tokens.map((t, i) => i).filter((i) => cls(tokens[i].tag) === c);
    if (!idxs.length) continue;
    const i = pick(idxs);
    const seen = new Set(idxs.map((k) => tokens[k].w.toLowerCase()));
    const distract = [];
    for (const t of shuffle(tokens)) {
      if (t.tag === 'x' || cls(t.tag) === c) continue;
      const k = t.w.toLowerCase();
      if (seen.has(k)) continue;
      seen.add(k);
      distract.push(t.w);
      if (distract.length === 3) break;
    }
    if (distract.length < 3) continue;
    return {
      category,
      rule,
      type: `trouve_${c}`,
      text: `Quel mot est un ${LABEL[c].toUpperCase()} dans cette phrase?\n\n« ${render(tokens)} »`,
      correct: tokens[i].w,
      options: shuffle([tokens[i].w, ...distract]),
      explanation: whyClass(tokens, i),
    };
  }
  return null;
}

// « Combien de noms dans cette phrase? »
function combien(c, category, rule) {
  for (let tries = 0; tries < 60; tries++) {
    const tokens = pick(SENTENCES);
    const found = tokens.filter((t) => cls(t.tag) === c);
    if (found.length < 1 || found.length > 4) continue;
    return {
      category,
      rule,
      type: `combien_${c}`,
      text: `Combien ${c === 'a' ? "d'" : 'de '}${LABEL_PLURIEL[c].toUpperCase()} y a-t-il dans cette phrase?\n\n« ${render(tokens)} »`,
      correct: found.length,
      options: [1, 2, 3, 4],
      explanation: `${found.length} ${found.length > 1 ? LABEL_PLURIEL[c] : LABEL[c]}: ${found.map((t) => `« ${t.w} »`).join(', ')}.`,
    };
  }
  return null;
}

// « Dans cette phrase, « petit » est un… » — optionnellement limité à une classe
function classe(category, rule, only) {
  for (let tries = 0; tries < 60; tries++) {
    const tokens = pick(SENTENCES);
    const idxs = tokens.map((t, i) => i).filter((i) => tokens[i].tag !== 'x' && (!only || cls(tokens[i].tag) === only));
    if (!idxs.length) continue;
    const i = pick(idxs);
    const correct = LABEL[cls(tokens[i].tag)];
    const autres = shuffle(Object.values(LABEL).filter((l) => l !== correct)).slice(0, 3);
    return {
      category,
      rule,
      type: 'classe',
      text: `Dans cette phrase, « ${tokens[i].w} » est un…\n\n« ${render(tokens)} »`,
      correct,
      options: shuffle([correct, ...autres]),
      explanation: whyClass(tokens, i),
    };
  }
  return null;
}

// ===== NOM =====
const PAS_NOMS = ['courir', 'joli', 'vite', 'elle', 'manger', 'petit', 'doucement', 'nous', 'gentil', 'sauter', 'rouge', 'ils'];
const UN_OU_UNE = { girafe: 'une', pupitre: 'un', bicyclette: 'une', soleil: 'un', crayon: 'un', montagne: 'une', bateau: 'un', tuque: 'une', sapin: 'un', fenêtre: 'une', gardien: 'un', araignée: 'une' };
const VRAIS_NOMS = Object.keys(UN_OU_UNE);

function nomTest() {
  const estNom = Math.random() < 0.5;
  const w = estNom ? pick(VRAIS_NOMS) : pick(PAS_NOMS);
  const det = UN_OU_UNE[w];
  return {
    category: 't1_nom',
    rule: ruleFor('t1_nom', NOM_RULE),
    type: 'nom_test',
    text: `Est-ce un NOM?\nTruc: essaie de mettre « un » ou « une » devant.\n\n« ${w} »`,
    correct: estNom ? 'Oui, c\'est un nom' : 'Non',
    options: ['Oui, c\'est un nom', 'Non'],
    explanation: estNom
      ? `On peut dire « ${det} ${w} » → c'est un nom.`
      :`On ne peut pas dire « un ${w} » ni « une ${w} » → ce n'est pas un nom.`,
  };
}

const SORTES = [
  ['pompier', 'une personne'], ['infirmière', 'une personne'], ['boulanger', 'une personne'], ['entraîneuse', 'une personne'],
  ['girafe', 'un animal'], ['papillon', 'un animal'], ['hamster', 'un animal'], ['tigre', 'un animal'],
  ['crayon', 'un objet'], ['ballon', 'un objet'], ['bicyclette', 'un objet'], ['foulard', 'un objet'],
  ['école', 'un lieu'], ['cuisine', 'un lieu'], ['plage', 'un lieu'], ['animalerie', 'un lieu'],
  ['soccer', 'une activité'], ['natation', 'une activité'], ['danse', 'une activité'], ['hockey', 'une activité'],
];

function nomSorte() {
  const [w, sorte] = pick(SORTES);
  const toutes = ['une personne', 'un animal', 'un objet', 'un lieu', 'une activité'];
  return {
    category: 't1_nom',
    rule: ruleFor('t1_nom', NOM_RULE),
    type: 'nom_sorte',
    text: `Le nom « ${w} » nomme…`,
    correct: sorte,
    options: [sorte, ...shuffle(toutes.filter((s) => s !== sorte)).slice(0, 3)].sort((a, b) => toutes.indexOf(a) - toutes.indexOf(b)),
    explanation: `« ${w} » nomme ${sorte}. Un nom nomme une personne, un animal, un objet, un lieu, une activité…`,
  };
}

// Genre ET nombre — au cahier (p. 10), Ryan n'écrivait qu'une des deux étiquettes.
const GENRE_NOMBRE = ['masculin singulier', 'féminin singulier', 'masculin pluriel', 'féminin pluriel'];
const NOMS_GN = [
  ['animalerie', 'f', 's'], ['monsieur', 'm', 's'], ['manières', 'f', 'p'], ['cornet', 'm', 's'],
  ['habitats', 'm', 'p'], ['fleurs', 'f', 'p'], ['tranche', 'f', 's'], ['morceaux', 'm', 'p'],
  ['quartier', 'm', 's'], ['feuilles', 'f', 'p'], ['bol', 'm', 's'], ['chapeaux', 'm', 'p'],
  ['sorcière', 'f', 's'], ['joueurs', 'm', 'p'], ['équipe', 'f', 's'], ['lunettes', 'f', 'p'],
  ['pelage', 'm', 's'], ['élèves', 'm', 'p'], ['cage', 'f', 's'], ['oreilles', 'f', 'p'],
];
const UN_UNE = { m: 'un', f: 'une' };

function nomGenreNombre() {
  const [w, g, n] = pick(NOMS_GN);
  const correct = `${g === 'f' ? 'féminin' : 'masculin'} ${n === 'p' ? 'pluriel' : 'singulier'}`;
  const sing = { manières: 'manière', habitats: 'habitat', fleurs: 'fleur', morceaux: 'morceau', feuilles: 'feuille', chapeaux: 'chapeau', joueurs: 'joueur', lunettes: 'lunette', élèves: 'élève', oreilles: 'oreille' }[w] || w;
  return {
    category: 't1_nom',
    rule: ruleFor('t1_nom', NOM_RULE),
    type: 'nom_genre_nombre',
    text: `Quel est le GENRE ET le NOMBRE du nom « ${w} »?\n(Les deux! 🦁)`,
    correct,
    options: GENRE_NOMBRE,
    explanation: `Genre: on dit « ${UN_UNE[g]} ${sing} » → ${g === 'f' ? 'féminin' : 'masculin'}.\nNombre: ${n === 'p' ? `il y en a plusieurs (« des ${w} ») → pluriel` : `il y en a un seul → singulier`}.\n→ ${correct}`,
  };
}

// « Quel mot peut remplacer … » — la manipulation de remplacement du nom (p. 11-12)
const REMPLACE_NOM = [
  ['Madame Evelyne aime les animaux.', 'animaux', 'oiseaux'],
  ['Gaston a peur des chats.', 'chats', 'chiens'],
  ['Les enfants adorent Gaston.', 'enfants', 'élèves'],
  ['Gaston porte un petit foulard.', 'foulard', 'chapeau'],
  ['Gaston a grignoté le crayon de Léa.', 'crayon', 'cahier'],
  ['Maya lance le ballon.', 'ballon', 'frisbee'],
  ["L'entraîneuse porte un grand chapeau.", 'chapeau', 'manteau'],
  ['Le hamster dort dans sa cage.', 'cage', 'maison'],
];

function nomRemplace() {
  const [phrase, mot, nom] = pick(REMPLACE_NOM);
  const autres = [pick(['joli', 'rapide', 'grand']), pick(['mange', 'court', 'dort']), pick(['il', 'elle', 'nous'])];
  return {
    category: 't1_nom',
    rule: ruleFor('t1_nom', NOM_RULE),
    type: 'nom_remplace',
    text: `Pour prouver que « ${mot} » est un NOM, par quel mot peux-tu le REMPLACER?\n\n« ${phrase} »`,
    correct: nom,
    options: shuffle([nom, ...autres]),
    explanation: `« ${phrase.replace(mot, nom)} » ✓ — on remplace un nom par un AUTRE NOM. « ${autres[0]} » est un adjectif, « ${autres[1]} » un verbe, « ${autres[2]} » un pronom.`,
  };
}

// Quelles manipulations servent à reconnaître un nom / un déterminant? (p. 18, ex. 6)
const MANIP = {
  n: ['Ajouter un déterminant avant le mot', 'Ajouter un adjectif avant ou après le mot', 'Remplacer par un autre nom'],
  d: ['Ajouter un nom après le mot', 'Remplacer par un autre déterminant'],
  v: ['Encadrer le mot par « ne… pas »'],
};

function manipulation(c, category, rule) {
  const correct = pick(MANIP[c]);
  const faux = shuffle(Object.entries(MANIP).filter(([k]) => k !== c).flatMap(([, l]) => l)).slice(0, 3);
  return {
    category,
    rule,
    type: `manip_${c}`,
    text: `Quelle manipulation permet de reconnaître un ${LABEL[c].toUpperCase()}?`,
    correct,
    options: shuffle([correct, ...faux]),
    explanation: `Pour le ${LABEL[c]}: ${MANIP[c].join(' · ')}.`,
  };
}

// Noms propres: des personnes, des animaux… et des LIEUX (Ryan a oublié « Inde »)
const PROPRES = ['Montréal', 'Gaston', 'Canada', 'Léa', 'Laval', 'Inde', 'Québec', 'Maya', 'France', 'Evelyne'];
const COMMUNS = { ville: 'une', garçon: 'un', pays: 'un', fille: 'une', rivière: 'une', chien: 'un', cousin: 'un', forêt: 'une' };

function nomPropre() {
  const propre = Math.random() < 0.5;
  const w = propre ? pick(PROPRES) : pick(Object.keys(COMMUNS));
  return {
    category: 't1_nom',
    rule: ruleFor('t1_nom', NOM_RULE),
    type: 'nom_propre',
    text: `« ${w} » est un nom propre ou un nom commun?`,
    correct: propre ? 'nom propre' : 'nom commun',
    options: ['nom propre', 'nom commun'],
    explanation: propre
      ? `« ${w} » commence par une MAJUSCULE → nom propre. Les noms propres nomment des personnes, des animaux ET des lieux (pays, villes).`
      : `« ${w} » commence par une minuscule et on peut dire « ${COMMUNS[w]} ${w} » → nom commun.`,
  };
}

// « Quel mot est un NOM PROPRE? » — dans des phrases qui ont aussi des noms communs
function trouvePropre(category, rule) {
  for (let tries = 0; tries < 60; tries++) {
    const tokens = pick(SENTENCES);
    const props = tokens.filter((t) => t.tag === 'np');
    if (!props.length) continue;
    const target = pick(props);
    const seen = new Set(props.map((t) => t.w));
    const distract = shuffle(tokens.filter((t) => t.tag !== 'x' && t.tag !== 'np' && !seen.has(t.w))).slice(0, 3).map((t) => t.w);
    if (distract.length < 3) continue;
    return {
      category,
      rule,
      type: 'trouve_np',
      text: `Quel mot est un NOM PROPRE dans cette phrase?\n\n« ${render(tokens)} »`,
      correct: target.w,
      options: shuffle([target.w, ...distract]),
      explanation: `« ${target.w} » commence par une majuscule et nomme ${/Inde|Québec|France|Laval|Montréal/.test(target.w) ? 'un LIEU' : 'une personne ou un animal'} → nom propre.`,
    };
  }
  return null;
}

// Poids de base = le programme; pickAdaptive les multiplie selon ce que Ryan rate.
function buildNom() {
  const rule = ruleFor('t1_nom', NOM_RULE);
  return pickAdaptive('t1_nom', [
    { type: 'trouve_n', w: 22, build: () => trouve('n', 't1_nom', rule) },
    { type: 'nom_genre_nombre', w: 18, build: nomGenreNombre },
    { type: 'nom_remplace', w: 12, build: nomRemplace },
    { type: 'nom_test', w: 10, build: nomTest },
    { type: 'nom_sorte', w: 8, build: nomSorte },
    { type: 'nom_propre', w: 8, build: nomPropre },
    { type: 'trouve_np', w: 8, build: () => trouvePropre('t1_nom', rule) },
    { type: 'manip_n', w: 7, build: () => manipulation('n', 't1_nom', rule) },
    { type: 'combien_n', w: 7, build: () => combien('n', 't1_nom', rule) },
  ]);
}

// ===== DÉTERMINANT =====
const GN_DET = [
  { det: 'le', nom: 'chat', gn: 'ms' }, { det: 'la', nom: 'maison', gn: 'fs' }, { det: 'les', nom: 'crayons', gn: 'p' },
  { det: 'un', nom: 'vélo', gn: 'ms' }, { det: 'une', nom: 'tuque', gn: 'fs' }, { det: 'des', nom: 'billes', gn: 'p' },
  { det: 'mon', nom: 'sac', gn: 'ms' }, { det: 'ma', nom: 'jupe', gn: 'fs' }, { det: 'ces', nom: 'bottes', gn: 'p' },
  { det: 'ce', nom: 'jardin', gn: 'ms' }, { det: 'cette', nom: 'fleur', gn: 'fs' }, { det: 'mes', nom: 'livres', gn: 'p' },
];
const AUTRES_DETS = { ms: ['un', 'le', 'ce', 'mon', 'ton', 'son'], fs: ['une', 'la', 'cette', 'ma', 'ta', 'sa'], p: ['des', 'les', 'ces', 'mes', 'tes', 'ses'] };
const ADJ_ACCORDE = { ms: ['petit', 'beau', 'gros'], fs: ['petite', 'belle', 'grosse'], p: ['petits', 'beaux', 'grands'] };

function detRemplace() {
  const g = pick(GN_DET);
  const correct = pick(AUTRES_DETS[g.gn].filter((d) => d !== g.det));
  const adj = pick(ADJ_ACCORDE[g.gn]);
  const pron = pick(g.gn === 'p' ? ['ils', 'nous'] : ['il', 'elle']);
  const verbe = pick(['mange', 'court', 'joue', 'dort']);
  return {
    category: 't1_determinant',
    rule: ruleFor('t1_determinant', DET_RULE),
    type: 'det_remplace',
    text: `Dans « ${g.det} ${g.nom} », quel mot peut REMPLACER le déterminant « ${g.det} »?`,
    correct,
    options: shuffle([correct, adj, pron, verbe]),
    explanation: `« ${correct} ${g.nom} » ✓ — on remplace un déterminant par un AUTRE déterminant. « ${adj} » est un adjectif, « ${pron} » un pronom et « ${verbe} » un verbe.`,
  };
}

function detNombre() {
  const g = pick(GN_DET);
  const pluriel = g.gn === 'p';
  return {
    category: 't1_determinant',
    rule: ruleFor('t1_determinant', DET_RULE),
    type: 'det_nombre',
    text: `Dans « ${g.det} ${g.nom} », le déterminant « ${g.det} » est…`,
    correct: pluriel ? 'au pluriel (plusieurs)' : 'au singulier (un seul)',
    options: ['au singulier (un seul)', 'au pluriel (plusieurs)'],
    explanation: pluriel
      ? `« ${g.det} » veut dire plusieurs → pluriel. Le nom aussi prend un -s: ${g.nom}.`
      : `« ${g.det} » veut dire un seul → singulier.`,
  };
}

// Manipulation d'ajout (p. 17): « Ajoute un nom après le mot »
const DET_AJOUT = [
  ['ma', 'cousine'], ['plusieurs', 'joueurs'], ['un', 'ballon'], ['des', 'filles'], ['ton', 'chapeau'],
  ['cette', 'équipe'], ['votre', 'entraîneuse'], ['le', 'terrain'], ['nos', 'ballons'], ['ses', 'lunettes'],
  ['chaque', 'match'], ['leur', 'sifflet'],
];

function detAjoutNom() {
  const [det, nom] = pick(DET_AJOUT);
  const autres = [pick(['courent', 'mange', 'siffle']), pick(['il', 'elles', 'nous']), pick(['vite', 'très', 'hier'])];
  return {
    category: 't1_determinant',
    rule: ruleFor('t1_determinant', DET_RULE),
    type: 'det_ajout',
    text: `Pour prouver que « ${det} » est un DÉTERMINANT, quel mot peux-tu AJOUTER après?`,
    correct: nom,
    options: shuffle([nom, ...autres]),
    explanation: `« ${det} ${nom} » ✓ — on peut ajouter un NOM après un déterminant.`,
  };
}

// Receveur d'accord (p. 16): le déterminant prend le genre et le nombre du nom
const DET_ACCORD = [
  ['des', 'idées', 'f', 'p'], ['la', 'tête', 'f', 's'], ['ma', 'cousine', 'f', 's'], ['le', 'problème', 'm', 's'],
  ['tes', 'cousines', 'f', 'p'], ['un', 'bal', 'm', 's'], ['les', 'joueurs', 'm', 'p'], ['son', 'chapeau', 'm', 's'],
  ['ces', 'bottes', 'f', 'p'], ['plusieurs', 'garçons', 'm', 'p'], ['cette', 'mission', 'f', 's'], ['nos', 'ballons', 'm', 'p'],
];

function detAccord() {
  const [det, nom, g, n] = pick(DET_ACCORD);
  const correct = `${g === 'f' ? 'féminin' : 'masculin'} ${n === 'p' ? 'pluriel' : 'singulier'}`;
  return {
    category: 't1_determinant',
    rule: ruleFor('t1_determinant', DET_RULE),
    type: 'det_accord',
    text: `« ${det} ${nom} »\nLe déterminant « ${det} » REÇOIT le genre et le nombre du nom. Quel est son genre ET son nombre?`,
    correct,
    options: GENRE_NOMBRE,
    explanation: `« ${nom} » est ${correct} → « ${det} » reçoit le même genre et le même nombre: ${correct}.`,
  };
}

function buildDeterminant() {
  const rule = ruleFor('t1_determinant', DET_RULE);
  return pickAdaptive('t1_determinant', [
    { type: 'trouve_d', w: 28, build: () => trouve('d', 't1_determinant', rule) },
    { type: 'det_ajout', w: 15, build: detAjoutNom },
    { type: 'det_remplace', w: 15, build: detRemplace },
    { type: 'det_accord', w: 14, build: detAccord },
    { type: 'manip_d', w: 8, build: () => manipulation('d', 't1_determinant', rule) },
    { type: 'det_nombre', w: 8, build: detNombre },
    { type: 'combien_d', w: 7, build: () => combien('d', 't1_determinant', rule) },
    { type: 'classe', w: 5, build: () => classe('t1_determinant', rule, 'd') },
  ]);
}

// ===== ADJECTIF =====
const VRAIS_ADJ = ['gourmand', 'rapide', 'doux', 'fier', 'drôle', 'timide', 'grand', 'sage', 'curieux', 'mouillé'];
const PAS_ADJ = ['table', 'courir', 'nous', 'ton', 'chaise', 'dormir', 'le', 'lapin', 'ils', 'cette'];

function adjTres() {
  const estAdj = Math.random() < 0.5;
  const w = estAdj ? pick(VRAIS_ADJ) : pick(PAS_ADJ);
  return {
    category: 't1_adjectif',
    rule: ruleFor('t1_adjectif', ADJ_RULE),
    type: 'adj_tres',
    text: `Est-ce un ADJECTIF?\nTruc: essaie de mettre « très » devant.\n\n« ${w} »`,
    correct: estAdj ? 'Oui, c\'est un adjectif' : 'Non',
    options: ['Oui, c\'est un adjectif', 'Non'],
    explanation: estAdj
      ? `« très ${w} » ✓ → c'est un adjectif.`
      : `« très ${w} » ✗ — ça ne se dit pas → ce n'est pas un adjectif.`,
  };
}

function adjQuelNom() {
  for (let tries = 0; tries < 60; tries++) {
    const tokens = pick(SENTENCES);
    const idxs = tokens.map((t, i) => i).filter((i) => tokens[i].tag === 'a');
    if (!idxs.length) continue;
    const i = pick(idxs);
    const correct = nounFor(tokens, i);
    if (!correct) continue;
    const pool = new Set([correct]);
    tokens.forEach((t) => { if (cls(t.tag) === 'n') pool.add(t.w); });
    for (const other of shuffle(SENTENCES)) {
      if (pool.size >= 3) break;
      const n = other.find((t) => t.tag === 'n' && !pool.has(t.w));
      if (n) pool.add(n.w);
    }
    return {
      category: 't1_adjectif',
      rule: ruleFor('t1_adjectif', ADJ_RULE),
      type: 'adj_quel_nom',
      text: `Dans cette phrase, l'adjectif « ${tokens[i].w} » décrit quel nom?\n\n« ${render(tokens)} »`,
      correct,
      options: shuffle([...pool].slice(0, 3)),
      explanation: `« ${tokens[i].w} » dit comment est « ${correct} ».`,
    };
  }
  return null;
}

function buildAdjectif() {
  const rule = ruleFor('t1_adjectif', ADJ_RULE);
  return pickAdaptive('t1_adjectif', [
    { type: 'trouve_a', w: 35, build: () => trouve('a', 't1_adjectif', rule) },
    { type: 'adj_tres', w: 20, build: adjTres },
    { type: 'adj_quel_nom', w: 20, build: adjQuelNom },
    { type: 'combien_a', w: 15, build: () => combien('a', 't1_adjectif', rule) },
    { type: 'classe', w: 10, build: () => classe('t1_adjectif', rule, 'a') },
  ]);
}

// ===== VERBE =====
// « ne… pas » autour du verbe. On évite les phrases où un/une/des suit le verbe
// (à la négation on dirait « pas de », ce qui n'est pas la notion travaillée).
function verbeNePas() {
  for (let tries = 0; tries < 60; tries++) {
    const tokens = pick(SENTENCES);
    const vi = tokens.findIndex((t) => t.tag === 'v');
    if (vi < 1) continue;
    const after = tokens[vi + 1];
    if (after && ['un', 'une', 'des'].includes(after.w)) continue;
    if (tokens[vi - 1].w === 'se') continue;
    const ne = { w: 'ne', tag: 'x' };
    const pas = { w: 'pas', tag: 'x' };
    const T = tokens;
    const last = T.length - 1; // le point
    const correct = render([...T.slice(0, vi), ne, T[vi], pas, ...T.slice(vi + 1)]);
    const wrongs = new Set([
      render([...T.slice(0, vi), ne, T[vi], ...T.slice(vi + 1, last), pas, T[last]]),
      render([...T.slice(0, vi), ne, pas, T[vi], ...T.slice(vi + 1)]),
      vi - 1 >= 1
        ? render([...T.slice(0, vi - 1), ne, T[vi - 1], pas, ...T.slice(vi)])
        : render([...T.slice(0, vi + 1), ne, pas, ...T.slice(vi + 1)]),
    ]);
    wrongs.delete(correct);
    if (wrongs.size < 2) continue;
    return {
      category: 't1_verbe',
      rule: ruleFor('t1_verbe', VERBE_RULE),
      type: 'verbe_ne_pas',
      text: `Quelle phrase encadre bien le VERBE avec « ne… pas »?\n\n« ${render(T)} »`,
      correct,
      options: shuffle([correct, ...wrongs]),
      explanation: `Le verbe est « ${T[vi].w} »: « ${negate(T[vi].w)} » l'entoure.\n${correct}`,
    };
  }
  return null;
}

function buildVerbe() {
  const rule = ruleFor('t1_verbe', VERBE_RULE);
  return pickAdaptive('t1_verbe', [
    { type: 'trouve_v', w: 45, build: () => trouve('v', 't1_verbe', rule) },
    { type: 'verbe_ne_pas', w: 35, build: verbeNePas },
    { type: 'classe', w: 20, build: () => classe('t1_verbe', rule, 'v') },
  ]);
}

// ===== PRONOM DE CONJUGAISON =====
const PRONOMS = ['je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles'];
const REMPLACE = [
  ['Gaston', 'il'], ['Ma sœur', 'elle'], ['Les joueurs', 'ils'], ['Les filles', 'elles'],
  ['Léo et moi', 'nous'], ['Maya et toi', 'vous'], ['Papa et maman', 'ils'], ['Maman et ma tante', 'elles'],
  ['Le hamster', 'il'], ['La sorcière', 'elle'], ['Mes amies', 'elles'], ['Ryan et Nyla', 'ils'],
  ['Ma cousine et moi', 'nous'], ['Toi et ton frère', 'vous'], ['Les chevaliers', 'ils'],
];

function pronomRemplace() {
  const [gn, p] = pick(REMPLACE);
  let note = '';
  if (/\bmoi\b/.test(gn)) note = ' Avec « moi », c\'est NOUS.';
  else if (/\btoi\b/i.test(gn)) note = ' Avec « toi », c\'est VOUS.';
  else if (gn === 'Ryan et Nyla' || gn === 'Papa et maman') note = ' Un garçon + une fille = ILS.';
  const exclus = p === 'ils' ? ['on'] : p === 'nous' ? ['on'] : [];
  return {
    category: 't1_pronom',
    rule: ruleFor('t1_pronom', PRONOM_RULE),
    type: 'pronom_remplace',
    text: `Quel pronom peut remplacer « ${gn} »?`,
    correct: p,
    options: shuffle([p, ...shuffle(PRONOMS.filter((x) => x !== p && !exclus.includes(x))).slice(0, 3)]),
    explanation: `« ${gn} » → ${p.toUpperCase()}.${note}`,
  };
}

const FORMES = [
  ['chantons', 'nous'], ['dansez', 'vous'], ['mangent', 'ils'], ['joues', 'tu'], ['suis', 'je'],
  ['sommes', 'nous'], ['êtes', 'vous'], ['vais', 'je'], ['vas', 'tu'], ['avons', 'nous'],
  ['avez', 'vous'], ['regardent', 'elles'], ['finissons', 'nous'], ['cours', 'tu'],
];

function pronomForme() {
  const [forme, p] = pick(FORMES);
  // « tu cours » mais aussi « je cours »: on retire les pronoms qui marchent aussi
  const aussiBons = { cours: ['je'], mangent: ['elles'], regardent: ['ils'] }[forme] || [];
  const choix = PRONOMS.filter((x) => x !== p && !aussiBons.includes(x));
  return {
    category: 't1_pronom',
    rule: ruleFor('t1_pronom', PRONOM_RULE),
    type: 'pronom_forme',
    text: `Quel pronom va devant ce verbe?\n\n« ___ ${forme} »`,
    correct: p,
    options: shuffle([p, ...shuffle(choix).slice(0, 3)]),
    explanation: `« ${p} ${forme} » — la terminaison du verbe dit quel pronom va devant.`,
  };
}

function buildPronom() {
  const rule = ruleFor('t1_pronom', PRONOM_RULE);
  return pickAdaptive('t1_pronom', [
    { type: 'trouve_p', w: 35, build: () => trouve('p', 't1_pronom', rule) },
    { type: 'pronom_remplace', w: 25, build: pronomRemplace },
    { type: 'pronom_forme', w: 25, build: pronomForme },
    { type: 'classe', w: 15, build: () => classe('t1_pronom', rule, 'p') },
  ]);
}

// ===== DES CLÉS: LES PERSONNAGES & LE DIALOGUE =====
const DIALOGUES = [
  {
    lignes: ['— Gaston, as-tu vu mes lunettes? demande Grand-maman.', "— Non, je dormais dans ma cage! répond le cochon d'Inde."],
    questions: [
      { q: 'Qui parle en PREMIER?', correct: 'Grand-maman', options: ['Grand-maman', 'Gaston', 'Personne'], why: '« demande Grand-maman »: le verbe de parole dit que c\'est elle qui parle.' },
      { q: 'Dans la 2e ligne, quel mot est le VERBE DE PAROLE?', correct: 'répond', options: ['répond', 'dormais', 'cage'], why: '« répond » dit comment Gaston parle: c\'est le verbe de parole.' },
      { q: 'Qui cherche ses lunettes?', correct: 'Grand-maman', options: ['Grand-maman', 'Gaston', 'On ne le sait pas'], why: 'Grand-maman demande « as-tu vu MES lunettes? »' },
    ],
  },
  {
    lignes: ["— Attention, le ballon arrive! crie l'entraîneuse.", "— Je l'attrape! s'exclame Maya."],
    questions: [
      { q: 'Qui dit « Attention »?', correct: "l'entraîneuse", options: ["l'entraîneuse", 'Maya', 'le ballon'], why: '« crie l\'entraîneuse »: c\'est elle qui parle.' },
      { q: 'Dans la 2e ligne, quel mot est le VERBE DE PAROLE?', correct: "s'exclame", options: ["s'exclame", 'attrape', 'Maya'], why: '« s\'exclame » dit comment Maya parle. « attrape » est ce qu\'elle fait.' },
    ],
  },
  {
    lignes: ['— Où est le trésor? chuchote le petit pirate.', '— Sous le vieux chêne, murmure le capitaine.'],
    questions: [
      { q: 'Qui sait où est le trésor?', correct: 'le capitaine', options: ['le capitaine', 'le petit pirate', 'le chêne'], why: 'Le capitaine répond: « Sous le vieux chêne ».' },
      { q: 'Comment parle le petit pirate?', correct: 'tout bas', options: ['tout bas', 'très fort', 'en chantant'], why: '« chuchoter » = parler tout bas.' },
      { q: 'Dans la 1re ligne, quel mot est le VERBE DE PAROLE?', correct: 'chuchote', options: ['chuchote', 'est', 'trésor'], why: '« chuchote » dit comment le pirate parle.' },
    ],
  },
  {
    lignes: ["— J'ai fait un rêve bizarre, raconte Léo.", '— Dis-moi tout! dit sa sœur.'],
    questions: [
      { q: 'Qui a fait un rêve?', correct: 'Léo', options: ['Léo', 'sa sœur', 'On ne le sait pas'], why: '« raconte Léo »: c\'est Léo qui parle de son rêve.' },
      { q: 'Combien de personnages parlent?', correct: 2, options: [1, 2, 3], why: 'Deux tirets, deux personnages: Léo et sa sœur.' },
    ],
  },
];

const TRAITS = [
  ['Gaston est gourmand.', 'caractère'], ['Maya est courageuse.', 'caractère'], ['Léo est timide.', 'caractère'],
  ['Le pirate est jaloux.', 'caractère'], ['La sorcière est méchante.', 'caractère'], ['Nyla est curieuse.', 'caractère'],
  ['Gaston mange toujours proprement.', 'caractère'], ['Mademoiselle Rose est très calme.', 'caractère'],
  ['Gaston a le poil roux.', 'physique'], ['Le géant est très grand.', 'physique'], ['Maya a les cheveux frisés.', 'physique'],
  ['Le capitaine porte une barbe.', 'physique'], ['Léo a les yeux bleus.', 'physique'], ["L'entraîneuse est longue et mince.", 'physique'],
  ['Gaston a un pelage tout doux.', 'physique'],
];

// Portraits: retrouver LA phrase qui parle du physique ou du caractère.
// Au cahier (p. 8, Q6 et Q8), Ryan a mêlé les deux et n'a pas trouvé la bonne phrase.
const PORTRAITS = [
  {
    nom: 'Gaston',
    physique: ['Gaston a de petites oreilles roses.', 'Son pelage est tout doux.'],
    caractere: ['Gaston est très poli.', 'Il range toujours sa cage.'],
    autre: ['Gaston habite dans la classe.'],
  },
  {
    nom: 'Mademoiselle Rose',
    physique: ['Mademoiselle Rose est grande comme une girafe.', 'Elle porte un chapeau à plumes.'],
    caractere: ['Elle ne se fâche jamais.', 'Mademoiselle Rose est drôle et patiente.'],
    autre: ["Elle entraîne l'équipe de hockey."],
  },
  {
    nom: 'Capitaine Barbe-Grise',
    physique: ['Le capitaine a une longue barbe grise.', 'Il a une jambe de bois.'],
    caractere: ['Il est très courageux.', 'Il partage toujours son trésor.'],
    autre: ['Son bateau s\'appelle La Mouette.'],
  },
];

function portraitQ() {
  const p = pick(PORTRAITS);
  const texte = shuffle([...p.physique, ...p.caractere, ...p.autre]).join(' ');
  const cherchePhysique = Math.random() < 0.5;
  const correct = pick(cherchePhysique ? p.physique : p.caractere);
  const faux = [pick(cherchePhysique ? p.caractere : p.physique), ...p.autre];
  return {
    category: 't1_dialogue',
    rule: ruleFor('t1_dialogue', DIALOGUE_RULE),
    type: 'portrait',
    text: `Lis le texte:\n\n« ${texte} »\n\nQuelle phrase parle ${cherchePhysique ? "de l'ASPECT PHYSIQUE" : "d'un TRAIT DE CARACTÈRE"} de ${p.nom}?`,
    correct,
    options: shuffle([correct, ...faux]),
    explanation: cherchePhysique
      ? `« ${correct} » — on peut le VOIR: c'est l'aspect physique.`
      : `« ${correct} » — ça dit COMMENT ${p.nom} est ou agit: c'est un trait de caractère.`,
  };
}

// Voc en vrac (p. 19): les expressions avec « comme »
const COMPARAISONS = [
  { debut: 'Être grand comme une', mot: 'échalote', sens: 'très grand et mince' },
  { debut: 'Être haut comme trois', mot: 'pommes', sens: 'très petit' },
  { debut: 'Être fort comme un', mot: 'bœuf', sens: 'très fort' },
  { debut: 'Être têtu comme une', mot: 'mule', sens: 'très têtu (qui ne change pas d\'idée)' },
  { debut: 'Avoir le visage rouge comme une', mot: 'tomate', sens: 'avoir le visage très rouge' },
  { debut: 'Nager comme un', mot: 'poisson', sens: 'nager très bien' },
  { debut: 'Être rusé comme un', mot: 'renard', sens: 'très rusé (malin)' },
  { debut: 'Être long et mince comme une', mot: 'asperge', sens: 'très grand et mince' },
];

function comparaisonQ(kind) {
  const c = pick(COMPARAISONS);
  // échalote et asperge ont le même sens: jamais les deux dans les mêmes choix
  const autres = [];
  for (const x of shuffle(COMPARAISONS)) {
    if (x.sens !== c.sens && !autres.some((a) => a.sens === x.sens)) autres.push(x);
  }
  if (kind === 'mot') {
    // Même petit mot devant (un / une) d'abord, pour que l'article ne donne pas la réponse
    const article = c.debut.split(' ').pop();
    const memeArticle = autres.filter((x) => x.debut.split(' ').pop() === article);
    const choix = [...memeArticle, ...autres.filter((x) => !memeArticle.includes(x))].slice(0, 3);
    return {
      category: 't1_voc',
      rule: ruleFor('t1_voc', VOC_RULE),
      type: 'comparaison_mot',
      text: `Complète l'expression:\n\n« ${c.debut} ___ »`,
      correct: c.mot,
      options: shuffle([c.mot, ...choix.map((x) => x.mot)]),
      explanation: `« ${c.debut} ${c.mot} » = ${c.sens}.`,
    };
  }
  return {
    category: 't1_voc',
    rule: ruleFor('t1_voc', VOC_RULE),
    type: 'comparaison_sens',
    text: `Que veut dire l'expression « ${c.debut.charAt(0).toLowerCase() + c.debut.slice(1)} ${c.mot} »?`,
    correct: c.sens,
    options: shuffle([c.sens, ...autres.slice(0, 2).map((x) => x.sens)]),
    explanation: `« ${c.debut} ${c.mot} » = ${c.sens}.`,
  };
}

function dialogueQ() {
  const d = pick(DIALOGUES);
  const q = pick(d.questions);
  return {
    category: 't1_dialogue',
    rule: ruleFor('t1_dialogue', DIALOGUE_RULE),
    type: 'dialogue',
    text: `Lis le dialogue:\n\n${d.lignes.join('\n')}\n\n${q.q}`,
    correct: q.correct,
    options: shuffle(q.options),
    explanation: q.why,
  };
}

function dialogueSignes(kind) {
  if (kind === 'tiret') {
    return {
      category: 't1_dialogue',
      rule: ruleFor('t1_dialogue', DIALOGUE_RULE),
      type: 'dialogue_tiret',
      text: 'Dans un dialogue, quel signe montre qu\'un NOUVEAU personnage parle?',
      correct: 'le tiret (—)',
      options: shuffle(['le tiret (—)', 'le point (.)', 'la virgule (,)']),
      explanation: 'Chaque fois qu\'un personnage prend la parole, la ligne commence par un tiret (—).',
    };
  }
  const parole = pick(['demande', 'répond', 'crie', 'chuchote', 'murmure', 'dit']);
  const autres = shuffle(['mange', 'dort', 'saute', 'court', 'nage', 'dessine']).slice(0, 3);
  return {
    category: 't1_dialogue',
    rule: ruleFor('t1_dialogue', DIALOGUE_RULE),
    type: 'dialogue_verbe_parole',
    text: 'Lequel est un VERBE DE PAROLE (il dit comment un personnage parle)?',
    correct: parole,
    options: shuffle([parole, ...autres]),
    explanation: `« ${parole} » sert à dire comment un personnage parle. Les autres sont des actions.`,
  };
}

function traitQ() {
  const [phrase, sorte] = pick(TRAITS);
  return {
    category: 't1_dialogue',
    rule: ruleFor('t1_dialogue', DIALOGUE_RULE),
    type: 'trait',
    text: `« ${phrase} »\n\nCette phrase décrit…`,
    correct: sorte === 'physique' ? "l'ASPECT PHYSIQUE (ce qu'on voit)" : 'un TRAIT DE CARACTÈRE (comment il est)',
    options: ["l'ASPECT PHYSIQUE (ce qu'on voit)", 'un TRAIT DE CARACTÈRE (comment il est)'],
    explanation: sorte === 'physique'
      ? 'On peut le VOIR en regardant le personnage → c\'est l\'aspect physique.'
      : 'On le découvre par ce que le personnage fait ou dit → c\'est un trait de caractère.',
  };
}

function buildDialogue() {
  return pickAdaptive('t1_dialogue', [
    { type: 'dialogue', w: 35, build: dialogueQ },
    { type: 'dialogue_tiret', w: 8, build: () => dialogueSignes('tiret') },
    { type: 'dialogue_verbe_parole', w: 7, build: () => dialogueSignes('parole') },
    { type: 'portrait', w: 25, build: portraitQ },
    { type: 'trait', w: 25, build: traitQ },
  ]);
}

// ===== Exports =====
// Clé anti-répétition: le portrait mélange ses phrases à chaque fois, donc son texte
// serait toujours « nouveau » et il prendrait toute la place — on le repère par sa réponse.
const freshKey = (q) => (q.type === 'portrait' ? `portrait|${q.correct}` : `${q.type}|${q.text}`);
// pickAdaptive évite déjà les répétitions dans le type choisi (voir utils/skillStats)
const fresh = (category, build) => build() || withFresh(category, () => classe(category), 100, 25, freshKey);

export const generateT1Nom = () => fresh('t1_nom', buildNom);
export const generateT1Determinant = () => fresh('t1_determinant', buildDeterminant);
export const generateT1Adjectif = () => fresh('t1_adjectif', buildAdjectif);
export const generateT1Verbe = () => fresh('t1_verbe', buildVerbe);
export const generateT1Pronom = () => fresh('t1_pronom', buildPronom);
export const generateT1Dialogue = () => fresh('t1_dialogue', buildDialogue);
export const generateT1Voc = () => pickAdaptive('t1_voc', [
  { type: 'comparaison_mot', w: 60, build: () => comparaisonQ('mot') },
  { type: 'comparaison_sens', w: 40, build: () => comparaisonQ('sens') },
]);

// Révision du thème: les 5 classes de mots + « Dans cette phrase, X est un… »
// La révision penche vers les NOTIONS que Ryan rate le plus.
export function generateT1Revision() {
  const w = (cat, base) => ({ type: cat, w: base * categoryPriority(cat), build: null });
  const cats = [
    { ...w('t1_revision', 25), build: () => fresh('t1_revision', () => classe('t1_revision')) },
    { ...w('t1_nom', 15), build: generateT1Nom },
    { ...w('t1_determinant', 15), build: generateT1Determinant },
    { ...w('t1_adjectif', 15), build: generateT1Adjectif },
    { ...w('t1_verbe', 12), build: generateT1Verbe },
    { ...w('t1_pronom', 10), build: generateT1Pronom },
    { ...w('t1_dialogue', 4), build: generateT1Dialogue },
    { ...w('t1_voc', 4), build: generateT1Voc },
  ];
  const total = cats.reduce((t, c) => t + c.w, 0);
  let r = Math.random() * total;
  return (cats.find((c) => (r -= c.w) <= 0) || cats[0]).build();
}

// Pour les tests: toutes les phrases de la banque, rendues
export const _phrases = () => SENTENCES.map(render);
