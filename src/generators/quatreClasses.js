// Les 4 classes de mots — nom commun · nom propre · adjectif · verbe
//
// Pourquoi ce module existe, et pourquoi il ne ressemble pas à classeDeMots.js:
// ce dernier est écrit pour Cayla (6e année, neuf classes, des définitions
// abstraites: « Je désigne un ensemble de réalités »). Le 26 sept. 2026, son
// père a dit l'essentiel en une phrase: « Ryan ne sait pas ce qu'est un
// adjectif comparé à un verbe et à un nom commun ou un nom propre. »
//
// Ce n'est donc pas un exercice d'accord — il a 54/54 en accord d'adjectifs
// dans l'app, et 1/4 au test de l'adjectif au féminin. C'est un exercice de
// RECONNAISSANCE, et surtout de comparaison: les quatre classes dans la même
// phrase, à distinguer les unes des autres.
//
// La règle de conception: on n'annonce jamais une classe sans redonner LE TEST
// qui permet de décider. « C'est un verbe » ne s'apprend pas; « je peux mettre
// ne … pas autour » s'applique tout seul la prochaine fois.
//
// Le cahier Jazz fait pareil: une page « Le verbe », puis une page
// « Reconnaître un verbe » (module 4, p. 29-33). Feuille de la semaine du
// 28 sept. au 2 oct. 2026: « Grammaire: Le verbe · Aide-mémoire Jazz p.5 ».
import { pickAdaptive } from '../utils/skillStats';

const CATEGORY = 'quatre_classes';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export const CLASSES = ['nom commun', 'nom propre', 'adjectif', 'verbe'];

// Le test qui décide. C'est ça qu'il doit retenir, pas l'étiquette.
export const TESTS = {
  'nom commun': {
    court: 'un / une devant',
    test: 'Je peux mettre « un » ou « une » devant: un ballon, une maison.',
    quoi: 'Ça nomme une chose, un animal ou une personne — mais pas quelqu\'un en particulier.',
    exemple: 'un ballon',
  },
  'nom propre': {
    court: 'majuscule + quelqu\'un de précis',
    test: 'Majuscule au milieu de la phrase, et ça nomme QUELQU\'UN ou UN ENDROIT précis.',
    quoi: 'Pas n\'importe quel garçon: Ryan. Pas n\'importe quelle ville: Laval.',
    exemple: 'Ryan, Laval',
  },
  adjectif: {
    court: 'COMMENT est le nom',
    test: 'Je peux dire « très ___ », et le mot change au féminin: grand → grande.',
    quoi: 'Ça dit COMMENT est le nom: un ballon ROUGE, une maison GRANDE.',
    exemple: 'rouge, grand',
  },
  verbe: {
    court: 'ce qu\'on FAIT',
    test: 'Je peux l\'encadrer: « ne … pas ». Et il change avec « hier »: hier, il lançait.',
    quoi: 'Ça dit ce qu\'on FAIT ou ce qui se passe.',
    exemple: 'lance, mange',
  },
};

// Des phrases courtes, avec ses mots à lui: sa famille, son école, sa ville.
// Chaque phrase porte les QUATRE classes — c'est la comparaison qui manque,
// pas les étiquettes prises une à une.
const PHRASES = [
  { texte: 'Ryan lance un ballon rouge.', mots: { Ryan: 'nom propre', lance: 'verbe', ballon: 'nom commun', rouge: 'adjectif' } },
  { texte: 'Nyla dessine une grande maison.', mots: { Nyla: 'nom propre', dessine: 'verbe', maison: 'nom commun', grande: 'adjectif' } },
  { texte: 'Cayla lit un livre passionnant.', mots: { Cayla: 'nom propre', lit: 'verbe', livre: 'nom commun', passionnant: 'adjectif' } },
  { texte: 'Le petit chat dort sur le divan.', mots: { chat: 'nom commun', petit: 'adjectif', dort: 'verbe', divan: 'nom commun' } },
  { texte: 'Laval est une ville tranquille.', mots: { Laval: 'nom propre', est: 'verbe', ville: 'nom commun', tranquille: 'adjectif' } },
  { texte: 'Mon frère mange une pomme verte.', mots: { frère: 'nom commun', mange: 'verbe', pomme: 'nom commun', verte: 'adjectif' } },
  { texte: 'La neige blanche couvre le trottoir.', mots: { neige: 'nom commun', blanche: 'adjectif', couvre: 'verbe', trottoir: 'nom commun' } },
  { texte: 'Anatole raconte une histoire drôle.', mots: { Anatole: 'nom propre', raconte: 'verbe', histoire: 'nom commun', drôle: 'adjectif' } },
  { texte: 'Le gardien attrape la rondelle noire.', mots: { gardien: 'nom commun', attrape: 'verbe', rondelle: 'nom commun', noire: 'adjectif' } },
  { texte: 'Ma sœur chante une chanson douce.', mots: { sœur: 'nom commun', chante: 'verbe', chanson: 'nom commun', douce: 'adjectif' } },
  { texte: 'Le Québec reçoit beaucoup de neige.', mots: { Québec: 'nom propre', reçoit: 'verbe', neige: 'nom commun' } },
  { texte: 'Un gros camion bloque la rue.', mots: { camion: 'nom commun', gros: 'adjectif', bloque: 'verbe', rue: 'nom commun' } },
  { texte: 'Léa range ses crayons neufs.', mots: { Léa: 'nom propre', range: 'verbe', crayons: 'nom commun', neufs: 'adjectif' } },
  { texte: 'Le vieux vélo roule encore.', mots: { vélo: 'nom commun', vieux: 'adjectif', roule: 'verbe' } },
  { texte: 'Mon chien Filou garde la porte.', mots: { chien: 'nom commun', Filou: 'nom propre', garde: 'verbe', porte: 'nom commun' } },
];

// « Ryan lance un ballon rouge. » → « Ryan lance un [ballon] rouge. »
function marquer(phrase, mot) {
  return phrase.replace(new RegExp(`\\b${mot}\\b`), `[ ${mot} ]`);
}

function commentJeSais(mot, classe) {
  const t = TESTS[classe];
  if (classe === 'nom commun') return `« un ${mot} », « une ${mot} » — ça se dit. ${t.quoi}`;
  if (classe === 'nom propre') return `${mot} prend une majuscule même au milieu de la phrase. ${t.quoi}`;
  if (classe === 'adjectif') return `« très ${mot} » — ça se dit. ${t.quoi}`;
  return `« ne ${mot} pas » — ça s'encadre. ${t.quoi}`;
}

// ===== 1. Ce mot-là, c'est quoi? (les 4 classes en choix) =====
function classeDuMot() {
  const p = pick(PHRASES);
  const mot = pick(Object.keys(p.mots));
  const classe = p.mots[mot];
  const autres = Object.entries(p.mots)
    .filter(([m, c]) => c !== classe)
    .map(([m, c]) => `${m} → ${c}`);
  return {
    category: CATEGORY,
    type: 'classe_du_mot',
    text: `Quelle est la classe du mot entre crochets?\n\n« ${marquer(p.texte, mot)} »`,
    correct: classe,
    options: [...CLASSES],
    explanation: `« ${mot} » est un ${classe}.\n${commentJeSais(mot, classe)}\n\nDans la même phrase: ${autres.join(' · ')}.`,
    hint: `Essaie les tests, un par un: « un ${mot} »? « très ${mot} »? « ne ${mot} pas »? Une majuscule?`,
  };
}

// ===== 2. Trouve le mot de cette classe (le sens inverse) =====
// C'est la page « Reconnaître un verbe » du cahier Jazz: on donne la classe,
// il cherche le mot. Plus dur, parce qu'il faut tester chaque mot.
function trouveLeMot() {
  const p = PHRASES.filter((x) => Object.keys(x.mots).length >= 4)[
    Math.floor(Math.random() * PHRASES.filter((x) => Object.keys(x.mots).length >= 4).length)];
  const classe = pick([...new Set(Object.values(p.mots))]);
  const bons = Object.keys(p.mots).filter((m) => p.mots[m] === classe);
  const correct = pick(bons);
  const autres = Object.keys(p.mots).filter((m) => p.mots[m] !== classe);
  const options = shuffle([correct, ...shuffle(autres).slice(0, 3)]);
  const t = TESTS[classe];
  return {
    category: CATEGORY,
    type: 'trouve_le_mot',
    text: `Dans cette phrase, quel mot est ${classe === 'adjectif' ? 'un ADJECTIF' : classe === 'verbe' ? 'un VERBE' : classe === 'nom propre' ? 'un NOM PROPRE' : 'un NOM COMMUN'}?\n\n« ${p.texte} »`,
    correct,
    options,
    explanation: `${t.test}\n« ${correct} » passe le test → c'est ${classe === 'adjectif' || classe === 'verbe' ? `un ${classe}` : `un ${classe}`}.\n\n`
      + autres.map((m) => `${m} → ${p.mots[m]}`).join(' · '),
    hint: t.test,
  };
}

// ===== 3. Nom propre ou nom commun? (sa confusion la plus coûteuse) =====
// Deux mots qui nomment la même sorte de chose, un précis et un général.
const PAIRES_NOMS = [
  { propre: 'Ryan', commun: 'garçon' },
  { propre: 'Nyla', commun: 'sœur' },
  { propre: 'Laval', commun: 'ville' },
  { propre: 'Québec', commun: 'province' },
  { propre: 'Filou', commun: 'chien' },
  { propre: 'Anatole', commun: 'personnage' },
  { propre: 'Montréal', commun: 'ville' },
  { propre: 'Matcha', commun: 'cahier' },
];

function nomPropreOuCommun() {
  const paire = pick(PAIRES_NOMS);
  const cherchePropre = Math.random() < 0.5;
  const correct = cherchePropre ? paire.propre : paire.commun;
  const autre = cherchePropre ? paire.commun : paire.propre;
  return {
    category: CATEGORY,
    type: 'propre_ou_commun',
    text: `Lequel est un NOM ${cherchePropre ? 'PROPRE' : 'COMMUN'}?`,
    correct,
    options: shuffle([paire.propre, paire.commun, 'grand', 'court']),
    explanation: cherchePropre
      ? `${paire.propre} prend une majuscule: c'est UN SEUL ${paire.commun} en particulier.\n${paire.commun} s'écrit sans majuscule: c'est n'importe quel ${paire.commun}.`
      : `${paire.commun} nomme n'importe quel ${paire.commun} — on peut dire « un ${paire.commun} ».\n${paire.propre} prend une majuscule: c'est celui-là et pas un autre.`,
    hint: 'Le nom propre garde sa majuscule même au milieu d\'une phrase. Le nom commun accepte « un » ou « une » devant.',
  };
}

// ===== 4. Quel test prouve la classe? =====
// Il connaît parfois la réponse sans savoir pourquoi — et il la perd au test
// suivant. Ici on travaille le test lui-même.
function quelTest() {
  const classe = pick(CLASSES);
  const t = TESTS[classe];
  const autres = CLASSES.filter((c) => c !== classe);
  return {
    category: CATEGORY,
    type: 'quel_test',
    text: `Quel mot est ${classe === 'nom commun' || classe === 'nom propre' ? `un ${classe}` : `un ${classe}`}?\n\n${t.test}`,
    correct: classe,
    options: [...CLASSES],
    explanation: `${t.test}\n→ ${classe}.\n\nLes autres: ${autres.map((c) => `${c} = ${TESTS[c].court}`).join(' · ')}.`,
    hint: 'Chaque classe a SON test. C\'est le test qui décide, pas l\'impression.',
  };
}

export function generateQuatreClasses() {
  return pickAdaptive(CATEGORY, [
    { type: 'classe_du_mot', w: 34, build: classeDuMot },
    { type: 'trouve_le_mot', w: 30, build: trouveLeMot },
    { type: 'propre_ou_commun', w: 18, build: nomPropreOuCommun },
    { type: 'quel_test', w: 18, build: quelTest },
  ]);
}
