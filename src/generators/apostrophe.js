// L'apostrophe generator — Friday May 8 test
// EXACT preparation worksheet shared by another mom (Pomélo A.M. p.25)
// Rule: le/la → l' devant voyelle (a, e, i, o, u) ou h muet
// Plus: je/me/te/se/ne/que → j'/m'/t'/s'/n'/qu'

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const recentlyUsed = new Set();
const MAX_RECENT = 30;
function keyOf(item) {
  return item.word || item.from || item.sentence || item.wrong || item.verb || JSON.stringify(item);
}
function pickFresh(arr) {
  let avail = arr.filter(it => !recentlyUsed.has(keyOf(it)));
  if (avail.length === 0) { recentlyUsed.clear(); avail = arr; }
  const picked = avail[Math.floor(Math.random() * avail.length)];
  recentlyUsed.add(keyOf(picked));
  if (recentlyUsed.size > MAX_RECENT) recentlyUsed.delete(recentlyUsed.values().next().value);
  return picked;
}

// === EXERCICE 1: Choisis entre « le » ou « l' » ===
const ex1Words = [
  { word: 'abricot', correct: "l'", why: "abricot commence par 'a' (voyelle) → l'abricot" },
  { word: 'chien', correct: 'le', why: "chien commence par 'c' (consonne) → le chien" },
  { word: 'école', correct: "l'", why: "école commence par 'é' (voyelle) → l'école" },
  { word: 'arbre', correct: "l'", why: "arbre commence par 'a' (voyelle) → l'arbre" },
  { word: 'ballon', correct: 'le', why: "ballon commence par 'b' (consonne) → le ballon" },
  { word: 'éléphant', correct: "l'", why: "éléphant commence par 'é' (voyelle) → l'éléphant" },
  { word: 'oiseau', correct: "l'", why: "oiseau commence par 'o' (voyelle) → l'oiseau" },
  { word: 'livre', correct: 'le', why: "livre commence par 'l' (consonne) → le livre" },
  { word: 'igloo', correct: "l'", why: "igloo commence par 'i' (voyelle) → l'igloo" },
  { word: 'soleil', correct: 'le', why: "soleil commence par 's' (consonne) → le soleil" },
  { word: 'avion', correct: "l'", why: "avion commence par 'a' (voyelle) → l'avion" },
  { word: 'jardin', correct: 'le', why: "jardin commence par 'j' (consonne) → le jardin" },
  // NEW
  { word: 'éclair', correct: "l'", why: "éclair commence par 'é' (voyelle) → l'éclair" },
  { word: 'tigre', correct: 'le', why: "tigre commence par 't' (consonne) → le tigre" },
  { word: 'ours', correct: "l'", why: "ours commence par 'o' (voyelle) → l'ours" },
  { word: 'pingouin', correct: 'le', why: "pingouin commence par 'p' (consonne) → le pingouin" },
  { word: 'autobus', correct: "l'", why: "autobus commence par 'a' (voyelle) → l'autobus" },
  { word: 'singe', correct: 'le', why: "singe commence par 's' (consonne) → le singe" },
  { word: 'hôtel', correct: "l'", why: "hôtel commence par 'h' muet → l'hôtel" },
  { word: 'monstre', correct: 'le', why: "monstre commence par 'm' (consonne) → le monstre" },
  { word: 'écureuil', correct: "l'", why: "écureuil commence par 'é' (voyelle) → l'écureuil" },
  { word: 'requin', correct: 'le', why: "requin commence par 'r' (consonne) → le requin" },
  { word: 'œuf', correct: "l'", why: "œuf commence par 'œ' (voyelle) → l'œuf" },
  { word: 'magicien', correct: 'le', why: "magicien commence par 'm' (consonne) → le magicien" },
];

// === EXERCICE 2: Choisis entre « la » ou « l' » ===
const ex2Words = [
  { word: 'histoire', correct: "l'", why: "histoire commence par 'h' muet → l'histoire" },
  { word: 'table', correct: 'la', why: "table commence par 't' (consonne) → la table" },
  { word: 'orange', correct: "l'", why: "orange commence par 'o' (voyelle) → l'orange" },
  { word: 'petite fille', correct: 'la', why: "petite commence par 'p' (consonne) → la petite fille" },
  { word: 'amie', correct: "l'", why: "amie commence par 'a' (voyelle) → l'amie" },
  { word: 'maison', correct: 'la', why: "maison commence par 'm' (consonne) → la maison" },
  { word: 'école', correct: "l'", why: "école commence par 'é' (voyelle) → l'école" },
  { word: 'pomme', correct: 'la', why: "pomme commence par 'p' (consonne) → la pomme" },
  { word: 'idée', correct: "l'", why: "idée commence par 'i' (voyelle) → l'idée" },
  { word: 'fleur', correct: 'la', why: "fleur commence par 'f' (consonne) → la fleur" },
  { word: 'image', correct: "l'", why: "image commence par 'i' (voyelle) → l'image" },
  { word: 'voiture', correct: 'la', why: "voiture commence par 'v' (consonne) → la voiture" },
  // NEW
  { word: 'araignée', correct: "l'", why: "araignée commence par 'a' (voyelle) → l'araignée" },
  { word: 'lampe', correct: 'la', why: "lampe commence par 'l' (consonne) → la lampe" },
  { word: 'éponge', correct: "l'", why: "éponge commence par 'é' (voyelle) → l'éponge" },
  { word: 'banane', correct: 'la', why: "banane commence par 'b' (consonne) → la banane" },
  { word: 'oreille', correct: "l'", why: "oreille commence par 'o' (voyelle) → l'oreille" },
  { word: 'chambre', correct: 'la', why: "chambre commence par 'c' (consonne) → la chambre" },
  { word: 'eau', correct: "l'", why: "eau commence par 'e' (voyelle) → l'eau" },
  { word: 'porte', correct: 'la', why: "porte commence par 'p' (consonne) → la porte" },
  { word: 'enveloppe', correct: "l'", why: "enveloppe commence par 'e' (voyelle) → l'enveloppe" },
  { word: 'reine', correct: 'la', why: "reine commence par 'r' (consonne) → la reine" },
  { word: 'odeur', correct: "l'", why: "odeur commence par 'o' (voyelle) → l'odeur" },
  { word: 'sœur', correct: 'la', why: "sœur commence par 's' (consonne) → la sœur" },
];

// === EXERCICE 3: Transforme avec une apostrophe ===
const ex3Transformations = [
  { from: 'Je aime', correct: "J'aime", wrongs: ['Je aime', 'Jaime', "J' aime"] },
  { from: 'De or', correct: "D'or", wrongs: ['De or', 'Dor', "D' or"] },
  { from: 'La orange', correct: "L'orange", wrongs: ['La orange', 'Lorange', "La' orange"] },
  { from: 'Le ordinateur', correct: "L'ordinateur", wrongs: ['Le ordinateur', 'Lordinateur', "Le' ordinateur"] },
  { from: 'Me amuse', correct: "M'amuse", wrongs: ['Me amuse', 'Mamuse', "M' amuse"] },
  { from: 'Je arrive', correct: "J'arrive", wrongs: ['Je arrive', 'Jarrive', "J' arrive"] },
  { from: 'La école', correct: "L'école", wrongs: ['La école', "L'ecole", 'Lecole'] },
  { from: 'Le avion', correct: "L'avion", wrongs: ['Le avion', 'Lavion', "Le' avion"] },
  { from: 'Te invite', correct: "T'invite", wrongs: ['Te invite', 'Tinvite', "T' invite"] },
  { from: 'Ne aime pas', correct: "N'aime pas", wrongs: ['Ne aime pas', 'Naime pas', "N' aime pas"] },
];

// === EXERCICE 4: Complète les phrases (élision) ===
const ex4Sentences = [
  { sentence: '___ chante dans ___ école', baseWords: ['le + oiseau', 'la + école'], correct: "L'oiseau chante dans l'école", short: "L'oiseau / l'école" },
  { sentence: '___ mangé une pomme', baseWords: ['Je + ai'], correct: "J'ai mangé une pomme", short: "J'ai" },
  { sentence: "C'est ___ de mon frère", baseWords: ['le + habit'], correct: "C'est l'habit de mon frère", short: "l'habit" },
  { sentence: '___ est noire', baseWords: ['La + ombre'], correct: "L'ombre est noire", short: "L'ombre" },
  { sentence: "___ est mon ami", baseWords: ["Le + enfant"], correct: "L'enfant est mon ami", short: "L'enfant" },
];

// === EXERCICE 5: Cherche l'erreur ===
const ex5Errors = [
  { wrong: 'Le avion vole haut.', correct: "L'avion vole haut.", error: 'Le → L' },
  { wrong: 'La amie de Léa est gentille.', correct: "L'amie de Léa est gentille.", error: 'La → L' },
  { wrong: 'Je ai faim.', correct: "J'ai faim.", error: 'Je → J' },
  { wrong: 'La école est fermée.', correct: "L'école est fermée.", error: 'La → L' },
  { wrong: 'Le orange est sucrée.', correct: "L'orange est sucrée.", error: 'Le → L' },
  { wrong: 'Je adore les pommes.', correct: "J'adore les pommes.", error: 'Je → J' },
  { wrong: 'La heure du dîner.', correct: "L'heure du dîner.", error: 'La → L (h muet)' },
];

// Word for general pronoun questions
const startsWithVowelOrSilentH = (word) => /^[aeiouéèêëâàäîïôöûüh]/.test(word.toLowerCase());

const pronounSentences = [
  { sentence: 'Je ___ un chat.', verb: 'ai', correct: "J'", wrong: 'Je' },
  { sentence: 'Tu ___ aimes le chocolat.', verb: 'aime', correct: "t'", wrong: 'te' },
  { sentence: 'Il ne ___ pas content.', verb: 'est', correct: "n'est", wrong: 'ne est' },
  { sentence: 'Je ___ écoute.', verb: 'écoute', correct: "j'", wrong: 'je' },
];

function ex1() {
  const q = pickFresh(ex1Words);
  return {
    category: 'apostrophe',
    type: 'le_la',
    text: `Choisis: ___ ${q.word}`,
    correct: q.correct,
    options: shuffle(["le", "l'"]),
    explanation: q.why,
  };
}

function ex2() {
  const q = pickFresh(ex2Words);
  return {
    category: 'apostrophe',
    type: 'le_la',
    text: `Choisis: ___ ${q.word}`,
    correct: q.correct,
    options: shuffle(["la", "l'"]),
    explanation: q.why,
  };
}

function ex3() {
  const q = pickFresh(ex3Transformations);
  return {
    category: 'apostrophe',
    type: 'transform',
    text: `Transforme avec une apostrophe: "${q.from}"`,
    correct: q.correct,
    options: shuffle([q.correct, ...q.wrongs.slice(0, 3)]),
    explanation: `${q.from} → ${q.correct} (l'apostrophe remplace la voyelle)`,
  };
}

function ex4() {
  const q = pickFresh(ex4Sentences);
  // Pick what to ask
  const baseHint = q.baseWords.join(', ');
  const wrong1 = q.short.replace(/'/g, ' ');
  const wrong2 = q.short.replace(/'/g, '');
  return {
    category: 'apostrophe',
    type: 'elision',
    text: `Complète avec l'élision: ${q.sentence} (${baseHint})`,
    correct: q.short,
    options: shuffle([q.short, wrong1, wrong2, q.short.replace("L'", "Le ").replace("l'", "le ")]).slice(0, 4),
    explanation: q.correct,
  };
}

function ex5() {
  const q = pickFresh(ex5Errors);
  return {
    category: 'apostrophe',
    type: 'find_error',
    text: `Trouve la bonne phrase. Erreur: "${q.wrong}"`,
    correct: q.correct,
    options: shuffle([q.correct, q.wrong, q.wrong.replace(' ', ''), q.correct.replace("'", ' ')]).slice(0, 4),
    explanation: `Erreur: ${q.error}. La phrase correcte: ${q.correct}`,
  };
}

function pronoun() {
  const q = pickFresh(pronounSentences);
  return {
    category: 'apostrophe',
    type: 'pronoun',
    text: q.sentence,
    correct: q.correct,
    options: shuffle([q.correct, q.wrong, q.correct.replace("'", ''), q.wrong + "'"]).slice(0, 4),
    explanation: `La bonne réponse est: ${q.correct}`,
  };
}

export function generateApostrophe() {
  const r = Math.random();
  if (r < 0.20) return ex1();
  if (r < 0.40) return ex2();
  if (r < 0.60) return ex3();
  if (r < 0.75) return ex4();
  if (r < 0.90) return ex5();
  return pronoun();
}
