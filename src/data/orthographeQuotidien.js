// « L'orthographe au quotidien, moi j'y tiens! » — 3e année du primaire
// Estelle Dumont, Christine Gilbert et les collaboratrices.
// Le cahier d'orthographe de Ryan (cartable d'étude). Photos du 20 sept. 2026,
// listes 1 à 10.
//
// La feuille de l'enseignant(e) du 21 au 25 sept. 2026 dit:
//   « Vocabulaire: Orthographe au quotidien (cartable d'étude) — Liste 2 »
//   « Feuille liste 2 dans l'orthographe au quotidien » · remise le 25 septembre.
//
// Chaque liste = des mots à l'étude + UN verbe à l'étude. La progression des
// verbes est le vrai fil de l'année:
//   L1-L2 infinitif · L3 avoir prés. · L4 être prés. · L5 aimer prés.
//   L6 finir prés. · L7 aller prés. · L8 révision prés. · L9 avoir imparfait
//   L10 être imparfait
//
// Annotations (toutes tirées des exercices du cahier lui-même, pour que l'app
// demande exactement ce que la feuille demande):
//   muette  lettre finale muette      fem     forme féminine (révèle la muette)
//   c/g/s   son de la lettre          v       c'est un verbe à l'infinitif
//   nom     nom commun                genre   f = nom féminin
//   dev     devinette « Qui suis-je? »  fam   mot de la même famille
//   syn     synonyme                   homo   homophone + son sens
//   chari   charivari (lettres mêlées du cahier)
//   circ    accent circonflexe         jum    consonnes jumelles
//   inv     mot invariable             rime   clé de rime

// ===== LISTE 1 — Mots sans grandes difficultés =====
const L1 = [
  { mot: 'abri', nom: 1 },
  { mot: 'amour', nom: 1, rime: 'our' },
  { mot: 'avion', nom: 1, fam: 'aviation' },
  { mot: 'barbe', nom: 1, genre: 'f' },
  { mot: 'bonjour', rime: 'our', dev: 'Je suis un mot de salutation.' },
  { mot: 'date', nom: 1, genre: 'f' },
  { mot: 'groupe', nom: 1, fam: 'regroupement', dev: "Je désigne la même chose qu'un ensemble." },
  { mot: 'ligne', nom: 1, genre: 'f' },
  { mot: 'maladie', nom: 1, genre: 'f' },
  { mot: 'mine', nom: 1, genre: 'f' },
  { mot: 'minute', nom: 1, genre: 'f', dev: 'Je contiens 60 secondes.' },
  { mot: 'or', nom: 1 },
  { mot: 'pile', nom: 1, genre: 'f' },
  { mot: 'poudre', nom: 1, genre: 'f' },
  { mot: 'retenir', v: 1 },
  { mot: 'rire', v: 1, dev: "Je suis souvent présent lors d'un spectacle d'humour." },
  { mot: 'son', nom: 1 },
  { mot: 'sorte', nom: 1, genre: 'f' },
  { mot: 'sucre', nom: 1 },
  { mot: 'tour', nom: 1, rime: 'our' },
  { mot: 'vivre', v: 1 },
  { mot: 'vue', nom: 1, genre: 'f' },
];

// ===== LISTE 2 — Mots se terminant par une lettre muette =====
// Le féminin révèle la lettre muette: court → courte, donc le « t » est muet.
// `adj` = adjectif au masculin. La question 5 de la feuille demande
// « 3 adjectifs MASCULINS en ordre alphabétique » — Ryan a répondu
// « gentille » (féminin) et hors ordre. Il faut donc pouvoir distinguer
// l'adjectif du nom (renard, rat) ET le masculin du féminin.
const L2 = [
  { mot: 'court', muette: 't', fem: 'courte', adj: 1 },
  { mot: 'gentil', muette: 'l', fem: 'gentille', jum: 1, adj: 1 },
  { mot: 'méchant', muette: 't', fem: 'méchante', adj: 1 },
  { mot: 'ouvert', muette: 't', fem: 'ouverte', adj: 1 },
  { mot: 'renard', muette: 'd', fem: 'renarde', nom: 1, male: 1 },
  { mot: 'droit', muette: 't', fem: 'droite', son_oi: 1, adj: 1 },
  { mot: 'haut', muette: 't', fem: 'haute', adj: 1 },
  { mot: 'mort', muette: 't', fem: 'morte', adj: 1 },
  { mot: 'rat', muette: 't', fem: 'rate', nom: 1, male: 1 },
  { mot: 'rond', muette: 'd', fem: 'ronde', adj: 1 },
];

// ===== LISTE 3 — Lettre muette (bloc 2) =====
const L3 = [
  { mot: 'août', muette: 't', circ: 1, nom: 1 },
  { mot: 'bord', muette: 'd', nom: 1 },
  { mot: 'but', muette: 't', nom: 1 },
  { mot: 'doigt', muette: 't', nom: 1, chari: 'goidt' },
  { mot: 'fond', muette: 'd', nom: 1, rime: 'on' },
  { mot: 'long', muette: 'g', rime: 'on' },
  { mot: 'nid', muette: 'd', nom: 1 },
  { mot: 'part', muette: 't', nom: 1, genre: 'f' },
  { mot: 'point', muette: 't', nom: 1 },
  { mot: 'pot', muette: 't', nom: 1 },
  { mot: 'retard', muette: 'd', nom: 1, chari: 'teardr' },
  { mot: 'sabot', muette: 't', nom: 1, chari: 'tbsoa' },
  { mot: 'salut', muette: 't', nom: 1, fam: 'salutation', intrus: ['salutation', 'salutaire', 'salon'] },
  { mot: 'soie', muette: 'e', nom: 1, genre: 'f', dev: 'Je suis un type de tissu.' },
  { mot: 'sourcil', muette: 'l', nom: 1, chari: 'losuric' },
];

// ===== LISTE 4 — Le « c » se prononce [s] ou [k] =====
const L4 = [
  { mot: 'cause', c: 'k', nom: 1, genre: 'f' },
  { mot: 'cinéma', c: 's', nom: 1 },
  { mot: 'commencer', c: 'deux', v: 1, jum: 1 },
  { mot: 'congé', c: 'k', nom: 1 },
  { mot: 'conte', c: 'k', nom: 1 },
  { mot: 'continuer', c: 'k', v: 1 },
  { mot: 'cuisine', c: 'k', nom: 1, genre: 'f', fam: 'cuisinette' },
  { mot: 'écouter', c: 'k', v: 1 },
  { mot: 'glace', c: 's', nom: 1, genre: 'f', fam: 'glacier' },
  { mot: 'lancer', c: 's', v: 1 },
  { mot: 'naissance', c: 's', nom: 1, genre: 'f', jum: 1 },
  { mot: 'occuper', c: 'k', v: 1, jum: 1 },
  { mot: 'pièce', c: 's', nom: 1, genre: 'f' },
  { mot: 'précipiter', c: 's', v: 1 },
  { mot: 'raconter', c: 'k', v: 1 },
  { mot: 'secouer', c: 'k', v: 1 },
  { mot: 'surface', c: 's', nom: 1, genre: 'f' },
];

// ===== LISTE 5 — Le « g » se prononce [g] ou [j] =====
const L5 = [
  { mot: 'âge', g: 'j', nom: 1, circ: 1 },
  { mot: 'argent', g: 'j', nom: 1, syn: 'monnaie' },
  { mot: 'danger', g: 'j', nom: 1, syn: 'risque' },
  { mot: 'gagner', g: 'g', v: 1 },
  { mot: 'garder', g: 'g', v: 1 },
  { mot: 'genre', g: 'j', nom: 1 },
  { mot: 'gorge', g: 'deux', nom: 1, genre: 'f' },
  { mot: 'goutte', g: 'g', nom: 1, genre: 'f', jum: 1 },
  { mot: 'guerre', g: 'g', nom: 1, genre: 'f', jum: 1 },
  { mot: 'langue', g: 'g', nom: 1, genre: 'f' },
  { mot: 'magasin', g: 'g', nom: 1, syn: 'boutique' },
  { mot: 'ménage', g: 'j', nom: 1 },
  { mot: 'nuage', g: 'j', nom: 1 },
  { mot: 'protéger', g: 'j', v: 1, syn: 'garder' },
  { mot: 'village', g: 'j', nom: 1 },
  { mot: 'voyage', g: 'j', nom: 1 },
];

// ===== LISTE 6 — Le « s » se prononce [s] ou [z] =====
// Règle: un seul s entre deux voyelles = [z] (église, poser). Deux s = [s].
const L6 = [
  { mot: 'choisir', s: 'z', v: 1 },
  { mot: 'consoler', s: 's', v: 1 },
  { mot: 'course', s: 's', nom: 1, genre: 'f' },
  { mot: 'danse', s: 's', nom: 1, genre: 'f' },
  { mot: 'danser', s: 's', v: 1 },
  { mot: 'descendre', s: 's', v: 1 },
  { mot: 'église', s: 'z', nom: 1, genre: 'f', dev: 'Je suis un lieu de prière.' },
  { mot: 'glisser', s: 's', v: 1, jum: 1 },
  { mot: 'laisser', s: 's', v: 1, jum: 1 },
  { mot: 'passage', s: 's', nom: 1, jum: 1 },
  { mot: 'poser', s: 'z', v: 1 },
  { mot: 'posséder', s: 's', v: 1, jum: 1 },
  { mot: 'pousser', s: 's', v: 1, jum: 1 },
  { mot: 'présenter', s: 'z', v: 1 },
  { mot: 'réussir', s: 's', v: 1, jum: 1 },
  { mot: 'trésor', s: 'z', nom: 1, dev: 'On me trouve souvent dans un coffre et je suis précieux.' },
  { mot: 'usine', s: 'z', nom: 1, genre: 'f' },
  { mot: 'visite', s: 'z', nom: 1, genre: 'f' },
  { mot: 'vitesse', s: 's', nom: 1, genre: 'f', jum: 1 },
];

// ===== LISTE 7 — Les mots contenant le son [o] =====
const L7 = [
  { mot: 'aussitôt', circ: 1, inv: 1 },
  { mot: 'déposer', v: 1 },
  { mot: 'faute', nom: 1, genre: 'f' },
  { mot: 'hauteur', nom: 1, genre: 'f', fam: 'haut', chari: 'utehrau' },
  { mot: 'nouveau', masculinDe: 'nouvelle' },
  { mot: 'octobre', nom: 1, dev: "Je suis le dixième mois de l'année.", chari: 'tobroce' },
  { mot: 'offrir', v: 1, jum: 1 },
  { mot: 'oiseau', nom: 1 },
  { mot: 'poche', nom: 1, genre: 'f', chari: 'ocpeh' },
  { mot: 'promener', v: 1 },
  { mot: 'promettre', v: 1, jum: 1, chari: 'toprtreme' },
  { mot: 'radio', nom: 1, genre: 'f' },
  { mot: 'restaurant', nom: 1 },
  { mot: 'sauver', v: 1 },
];

// ===== LISTE 8 — Les mots contenant le son [an] =====
const L8 = [
  { mot: 'appartement', nom: 1, jum: 1 },
  { mot: 'apprendre', v: 1, jum: 1 },
  { mot: 'attention', nom: 1, genre: 'f', jum: 1, fam: 'attentif' },
  { mot: 'avancer', v: 1 },
  { mot: 'bande', nom: 1, genre: 'f' },
  { mot: 'changer', v: 1, syn: 'modifier' },
  { mot: 'courant', nom: 1 },
  { mot: 'demande', nom: 1, genre: 'f' },
  { mot: 'entrer', v: 1 },
  { mot: 'environ', inv: 1 },
  { mot: 'janvier', nom: 1, dev: "Je suis un mois de l'année." },
  { mot: 'lentement', inv: 1 },
  { mot: 'pantalon', nom: 1 },
  { mot: 'pencher', v: 1 },
  { mot: 'plan', nom: 1 },
  { mot: 'rencontrer', v: 1 },
  { mot: 'rendre', v: 1 },
  { mot: 'reprendre', v: 1 },
  { mot: 'santé', nom: 1, genre: 'f' },
  { mot: 'sentier', nom: 1 },
  { mot: 'ventre', nom: 1, dev: 'Je suis une partie du corps.' },
  { mot: 'viande', nom: 1, genre: 'f', dev: 'Je peux être mangée.' },
];

// ===== LISTE 9 — Les mots contenant les sons [in] ou [oin] =====
const L9 = [
  { mot: 'bain', nom: 1, syl1: 1 },
  { mot: 'bien', inv: 1, syl1: 1 },
  { mot: 'certain', syl1: 1 },
  { mot: 'chagrin', nom: 1 },
  { mot: 'faim', nom: 1, genre: 'f', syl1: 1, homo: { mot: 'fin', sens: "qui indique que c'est terminé" } },
  { mot: 'invitation', nom: 1, genre: 'f' },
  { mot: 'lendemain', nom: 1 },
  { mot: 'patin', nom: 1 },
  { mot: 'pin', nom: 1, syl1: 1, homo: { mot: 'pain', sens: 'qui se mange' } },
  { mot: 'poussin', nom: 1, jum: 1 },
  { mot: 'prochain' },
  { mot: 'rejoindre', v: 1 },
  { mot: 'rien', inv: 1, syl1: 1 },
  { mot: 'sapin', nom: 1 },
  { mot: 'soin', nom: 1, syl1: 1 },
  { mot: 'terrain', nom: 1, jum: 1 },
];

// ===== LISTE 10 — Devant b et p, le n devient m =====
const L10 = [
  { mot: 'ampoule', nom: 1, genre: 'f', lien: 'lampe' },
  { mot: 'champ', nom: 1, muette: 'p', lien: 'cultiver' },
  { mot: 'comprendre', v: 1 },
  { mot: 'compter', v: 1 },
  { mot: 'décembre', nom: 1 },
  { mot: 'embrasser', v: 1, jum: 1, syn: 'bécoter', lien: 'amour' },
  { mot: 'ensemble', nom: 1 },
  { mot: 'exemple', nom: 1 },
  { mot: 'important', muette: 't' },
  { mot: 'importante' },
  { mot: 'jambe', nom: 1, genre: 'f', lien: 'pied' },
  { mot: 'longtemps', inv: 1, muette: 's' },
  { mot: 'nombre', nom: 1 },
  { mot: 'novembre', nom: 1 },
  { mot: 'ombre', nom: 1, genre: 'f' },
  { mot: 'remplir', v: 1 },
  { mot: 'sembler', v: 1 },
  { mot: 'septembre', nom: 1 },
];

const VERBES_INF = "être, avoir, aimer, aller et finir à l'infinitif";

export const LISTES = [
  { id: 'l1', numero: 1, titre: 'Mots sans grandes difficultés', kind: 'general', mots: L1, verbe: VERBES_INF, verbeMode: 'infinitif' },
  { id: 'l2', numero: 2, titre: 'Mots se terminant par une lettre muette', kind: 'muette', mots: L2, verbe: VERBES_INF, verbeMode: 'infinitif' },
  { id: 'l3', numero: 3, titre: 'Mots se terminant par une lettre muette (bloc 2)', kind: 'muette', mots: L3, verbe: 'avoir au présent', verbeMode: 'verbes_avoir_etre' },
  { id: 'l4', numero: 4, titre: 'Le « c » se prononce [s] ou [k]', kind: 'son_c', mots: L4, verbe: 'être au présent', verbeMode: 'verbes_avoir_etre' },
  { id: 'l5', numero: 5, titre: 'Le « g » se prononce [g] ou [j]', kind: 'son_g', mots: L5, verbe: 'aimer au présent', verbeMode: 'present_indicatif' },
  { id: 'l6', numero: 6, titre: 'Le « s » se prononce [s] ou [z]', kind: 'son_s', mots: L6, verbe: 'finir au présent', verbeMode: 'present_indicatif' },
  { id: 'l7', numero: 7, titre: 'Les mots contenant le son [o]', kind: 'general', mots: L7, verbe: 'aller au présent', verbeMode: 'present_indicatif' },
  { id: 'l8', numero: 8, titre: 'Les mots contenant le son [an]', kind: 'general', mots: L8, verbe: 'révision des verbes au présent', verbeMode: 'present_indicatif' },
  { id: 'l9', numero: 9, titre: 'Les mots contenant les sons [in] ou [oin]', kind: 'general', mots: L9, verbe: "avoir à l'imparfait", verbeMode: null },
  { id: 'l10', numero: 10, titre: 'Devant b et p, le n devient m', kind: 'mbp', mots: L10, verbe: "être à l'imparfait", verbeMode: null },
];

// Semaine de classe (lundi) → liste à l'étude.
// CONFIRMÉ: semaine du 21 sept. 2026 = Liste 2 (feuille de l'enseignant(e),
// travail à remettre le vendredi 25 septembre). Le reste suppose une liste par
// semaine — à corriger dès qu'une nouvelle feuille arrive.
export const LISTE_SEMAINES = [
  { debut: [2026, 9, 14], liste: 'l1' },
  { debut: [2026, 9, 21], liste: 'l2', remise: [2026, 9, 25] }, // confirmé
  { debut: [2026, 9, 28], liste: 'l3' },
  { debut: [2026, 10, 5], liste: 'l4' },
  { debut: [2026, 10, 13], liste: 'l5' }, // mardi — lundi 12 = Action de grâce
  { debut: [2026, 10, 19], liste: 'l6' },
  { debut: [2026, 10, 26], liste: 'l7' },
  { debut: [2026, 11, 2], liste: 'l8' },
  { debut: [2026, 11, 9], liste: 'l9' },
  { debut: [2026, 11, 16], liste: 'l10' },
];

export const listeById = (id) => LISTES.find((l) => l.id === id) || null;

const dateOf = ([y, m, d]) => new Date(y, m - 1, d);

// Le dimanche soir appartient à la semaine qui COMMENCE, pas à celle qui finit.
// C'est le soir où on prépare lundi: si on ne décale pas, Ryan révise la liste
// terminée la veille du jour où la nouvelle sort. Le décalage vit ici pour que
// le Coach, le menu ET l'exercice disent tous la même chose.
function refScolaire(date) {
  return date.getDay() === 0
    ? new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    : date;
}

function semaineIndex(rawDate) {
  const date = refScolaire(rawDate);
  let idx = -1;
  LISTE_SEMAINES.forEach((w, i) => { if (dateOf(w.debut) <= date) idx = i; });
  return idx;
}

export function listeCetteSemaine(date = new Date()) {
  const i = semaineIndex(date);
  return i >= 0 ? listeById(LISTE_SEMAINES[i].liste) : LISTES[0];
}

export function semaineCourante(date = new Date()) {
  const i = semaineIndex(date);
  return i >= 0 ? LISTE_SEMAINES[i] : null;
}

// Toutes les listes déjà vues — pour réviser en cumulatif
export function listesVues(date = new Date()) {
  const i = semaineIndex(date);
  if (i < 0) return [LISTES[0]];
  return LISTE_SEMAINES.slice(0, i + 1).map((w) => listeById(w.liste));
}

// ============================================================================
// LA DICTÉE — une phrase par mot
//
// En 2e année, la préparation qui marchait n'était PAS le choix multiple:
// c'était la flashcard tapée (`DicteeFlashcard`) — l'app dit le mot dans une
// phrase, Ryan l'écrit, et les lettres fautives s'allument une par une. La
// dictée en choix multiple, elle, était restée à 3/10.
//
// La phrase n'est pas décorative, elle est obligatoire ici: la liste 2 est
// pleine de mots qui, dits tout seuls, ne s'écrivent pas de façon sûre —
// court/cour/cours, haut/eau, rond/ront, droit/droite. Sans contexte, l'enfant
// ne peut pas choisir, et il pleure quand il se trompe. Avec la phrase, la
// lettre muette devient une décision, pas une loterie.
//
// Le trou s'écrit _____ (cinq tirets), comme dans DicteeFlashcard.
const PHRASES = {
  // ===== Liste 1 =====
  abri: "Pendant l'orage, on cherche un _____.",
  amour: "Une maman donne beaucoup d'_____.",
  avion: "L'_____ décolle de l'aéroport.",
  barbe: 'Mon grand-père a une longue _____.',
  bonjour: 'Je dis _____ à mon enseignante.',
  date: 'Écris la _____ en haut de ta page.',
  groupe: 'Nous travaillons en _____ de quatre.',
  ligne: 'Trace une _____ droite avec ta règle.',
  maladie: "Il est resté à la maison à cause d'une _____.",
  mine: 'La _____ de mon crayon est cassée.',
  minute: "Attends une _____, j'arrive!",
  or: 'La bague de ma mère est en _____.',
  pile: 'Il y a une _____ de livres sur la table.',
  poudre: 'Le chocolat en _____ se mêle au lait.',
  retenir: 'Je dois _____ mes mots de vocabulaire.',
  rire: 'Ce film me fait beaucoup _____.',
  son: 'On entend un drôle de _____ dehors.',
  sorte: 'Quelle _____ de fruit préfères-tu?',
  sucre: 'Je mets du _____ dans mes céréales.',
  tour: "C'est à mon _____ de jouer.",
  vivre: "Les poissons ne peuvent pas _____ hors de l'eau.",
  vue: 'De la fenêtre, la _____ est magnifique.',

  // ===== Liste 2 — lettre muette =====
  court: "Ce chemin est plus _____ que l'autre.",
  gentil: 'Ryan est très _____ avec sa petite sœur.',
  méchant: "Le loup de l'histoire est _____.",
  ouvert: "Le magasin est _____ jusqu'à neuf heures.",
  renard: 'Le _____ roux traverse le champ.',
  droit: 'Lève ton bras _____.',
  haut: 'Le mur est trop _____ pour sauter.',
  mort: "L'arbre est _____ depuis l'hiver.",
  rat: 'Un _____ gris court dans le garage.',
  rond: 'Le ballon est _____ comme une boule.',

  // ===== Liste 3 — lettre muette (bloc 2) =====
  août: 'En _____, on va à la plage.',
  bord: 'On marche au _____ de la rivière.',
  but: 'Il a compté un _____ au soccer.',
  doigt: 'Je me suis coupé le _____.',
  fond: 'La pièce est au _____ du couloir.',
  long: 'Le serpent est très _____.',
  nid: "Les oiseaux ont fait leur _____ dans l'arbre.",
  part: 'Je veux ma _____ de gâteau.',
  point: "N'oublie pas le _____ à la fin de ta phrase.",
  pot: 'Les fleurs sont dans un _____.',
  retard: "Je suis arrivé en _____ à l'école.",
  sabot: 'Le cheval a perdu un _____.',
  salut: "Il m'a fait un _____ de la main.",
  soie: 'Cette robe est en _____.',
  sourcil: 'Il a levé un _____ de surprise.',

  // ===== Liste 4 — le son du c =====
  cause: 'Le match est annulé à _____ de la pluie.',
  cinéma: 'On va au _____ voir un film.',
  commencer: 'Le spectacle va _____ dans cinq minutes.',
  congé: "Vendredi, c'est _____!",
  conte: 'Maman me lit un _____ avant de dormir.',
  continuer: 'Tu peux _____ ton dessin.',
  cuisine: 'Papa prépare le souper dans la _____.',
  écouter: "Il faut _____ l'enseignante.",
  glace: 'La _____ du lac est épaisse.',
  lancer: 'Veux-tu _____ le ballon?',
  naissance: 'La _____ du bébé est en mai.',
  occuper: "Je vais m'_____ du chien.",
  pièce: 'Il manque une _____ au casse-tête.',
  précipiter: 'Ne te _____ pas, prends ton temps.',
  raconter: 'Peux-tu me _____ ton histoire?',
  secouer: 'Il faut _____ la bouteille avant.',
  surface: 'La _____ de la table est lisse.',

  // ===== Liste 5 — le son du g =====
  âge: 'Quel _____ as-tu?',
  argent: "J'ai mis mon _____ dans ma tirelire.",
  danger: 'Attention, _____!',
  gagner: 'Notre équipe veut _____ la partie.',
  garder: 'Peux-tu _____ mon secret?',
  genre: 'Quel _____ de musique aimes-tu?',
  gorge: "J'ai mal à la _____.",
  goutte: 'Une _____ de pluie est tombée sur mon nez.',
  guerre: 'Ce livre parle de la _____.',
  langue: 'Le chien sort sa _____.',
  magasin: 'On va au _____ acheter du pain.',
  ménage: 'Le samedi, on fait le _____.',
  nuage: 'Un gros _____ cache le soleil.',
  protéger: 'Le casque sert à _____ ta tête.',
  village: 'Mes cousins habitent un petit _____.',
  voyage: 'Nous partons en _____ cet été.',

  // ===== Liste 6 — le son du s =====
  choisir: 'Tu dois _____ une seule réponse.',
  consoler: 'Maman vient _____ le bébé.',
  course: "J'ai gagné la _____ à pied.",
  danse: 'La _____ des abeilles est étonnante.',
  danser: 'Elle adore _____ sur cette chanson.',
  descendre: "Il faut _____ l'escalier doucement.",
  église: "La cloche de l'_____ sonne.",
  glisser: 'Attention de ne pas _____ sur la glace.',
  laisser: 'Tu peux _____ ton sac ici.',
  passage: 'Traverse au _____ pour piétons.',
  poser: 'Je vais _____ une question.',
  posséder: 'Il aimerait _____ un grand chien.',
  pousser: 'Aide-moi à _____ la porte.',
  présenter: 'Je vais te _____ mon ami.',
  réussir: 'Je veux _____ mon examen.',
  trésor: 'Les pirates cherchent un _____.',
  usine: "Mon oncle travaille à l'_____.",
  visite: 'Nous avons de la _____ ce soir.',
  vitesse: "L'auto roule à grande _____.",

  // ===== Liste 7 — le son [o] =====
  aussitôt: '_____ arrivé, il enlève ses bottes.',
  déposer: 'Tu peux _____ ton manteau ici.',
  faute: "J'ai fait une seule _____ dans ma dictée.",
  hauteur: 'Quelle est la _____ de cet arbre?',
  nouveau: "J'ai un _____ manteau d'hiver.",
  octobre: 'En _____, les feuilles tombent.',
  offrir: 'Je veux lui _____ un cadeau.',
  oiseau: 'Un _____ chante dans le sapin.',
  poche: 'Mes clés sont dans ma _____.',
  promener: "On va _____ le chien après l'école.",
  promettre: "Tu dois me _____ d'être prudent.",
  radio: "Papa écoute la _____ dans l'auto.",
  restaurant: 'On soupe au _____ ce soir.',
  sauver: 'Le pompier vient de _____ un chat.',

  // ===== Liste 8 — le son [an] =====
  appartement: 'Ils habitent un _____ au troisième étage.',
  apprendre: 'Je veux _____ à nager.',
  attention: 'Fais _____ en traversant la rue.',
  avancer: 'Le train commence à _____.',
  bande: "Une _____ d'amis joue au parc.",
  changer: 'Je dois _____ de chandail.',
  courant: 'Le _____ de la rivière est fort.',
  demande: 'Ma _____ est simple.',
  entrer: 'Tu peux _____, la porte est ouverte.',
  environ: 'Il y a _____ vingt élèves dans la classe.',
  janvier: 'En _____, il fait très froid.',
  lentement: 'Marche _____, ça glisse.',
  pantalon: 'Mon _____ est trop court.',
  pencher: 'Ne te _____ pas par la fenêtre.',
  plan: "Voici le _____ de l'école.",
  rencontrer: 'Je vais _____ mon ami au parc.',
  rendre: 'Je dois _____ mon livre à la bibliothèque.',
  reprendre: 'Tu peux _____ ton souffle.',
  santé: 'Les légumes sont bons pour la _____.',
  sentier: "Le _____ mène jusqu'au lac.",
  ventre: "J'ai mal au _____.",
  viande: 'La _____ cuit dans le four.',

  // ===== Liste 9 — les sons [in] et [oin] =====
  bain: 'Je prends mon _____ avant de dormir.',
  bien: "Tout va _____ aujourd'hui.",
  certain: "Je suis _____ d'avoir raison.",
  chagrin: 'Elle a beaucoup de _____.',
  faim: "J'ai très _____ ce matin.",
  invitation: "J'ai reçu une _____ à sa fête.",
  lendemain: 'Le _____, il neigeait encore.',
  patin: 'Mon _____ est trop petit.',
  pin: "Le _____ garde ses aiguilles l'hiver.",
  poussin: 'Le _____ sort de son œuf.',
  prochain: 'Le _____ arrêt est près de chez moi.',
  rejoindre: "Je vais te _____ après l'école.",
  rien: "Il n'y a _____ dans la boîte.",
  sapin: 'On décore le _____ en décembre.',
  soin: 'Prends _____ de ton petit frère.',
  terrain: 'Le _____ de soccer est mouillé.',

  // ===== Liste 10 — devant b et p, le n devient m =====
  ampoule: "L'_____ de la lampe est brûlée.",
  champ: 'Les vaches sont dans le _____.',
  comprendre: 'Je veux _____ la question.',
  compter: "Nyla sait _____ jusqu'à cent.",
  décembre: "En _____, c'est Noël.",
  embrasser: 'Je vais _____ ma mère avant de partir.',
  ensemble: 'On travaille _____.',
  exemple: 'Donne-moi un _____.',
  important: "C'est très _____ d'étudier.",
  importante: 'La dictée est _____ cette semaine.',
  jambe: 'Je me suis fait mal à la _____.',
  longtemps: 'On a attendu _____.',
  nombre: 'Quel _____ vient après quatre-vingt-dix-neuf?',
  novembre: 'En _____, il pleut souvent.',
  ombre: "On s'assoit à l'_____ de l'arbre.",
  remplir: "Il faut _____ le verre d'eau.",
  sembler: 'Ce livre peut _____ difficile.',
  septembre: "En _____, l'école recommence.",
};

export const phrasePour = (mot) => PHRASES[mot] || null;

// La clé de mémorisation par mot (`utils/wordMastery`) suit la même forme que
// les dictées de 2e année: un préfixe + l'identifiant de la liste.
export const cleDictee = (listeId) => `ortho_${listeId}`;

// Rend une liste au format attendu par DicteeFlashcard: { name, rule, words },
// chaque mot avec sa phrase à trou. Tout le reste du composant (la voix, le
// diff lettre par lettre, les tours jusqu'à 100 %, la barre de maîtrise)
// fonctionne tel quel — c'est la préparation de dictée de la 2e année,
// rebranchée sur le cahier « L'orthographe au quotidien ».
// Le rappel affiché PENDANT la dictée. Ce n'est pas la règle d'étude
// (celle-là vit dans generators/orthographe.js et s'affiche avant les
// exercices): c'est le geste à faire, en une ligne, au moment où le crayon
// hésite.
const TRUCS = {
  muette: 'Mets le mot au FÉMININ avant de l’écrire: court → courte. La lettre muette se met à parler.',
  son_c: 'Le c devant e, i, y se dit [s]. Devant a, o, u il se dit [k].',
  son_g: 'Le g devant e, i, y se dit [j]. Devant a, o, u il se dit [g].',
  son_s: 'Un seul s entre deux voyelles se dit [z]. Deux ss se disent [s].',
  mbp: 'Devant un b ou un p, le n devient m.',
};

export function dicteeDeLaListe(cleOuId) {
  const id = String(cleOuId || '').replace(/^ortho_/, '');
  const liste = listeById(id);
  if (!liste) return null;
  return {
    name: `Dictée — Liste ${liste.numero}`,
    rule: TRUCS[liste.kind] || liste.titre,
    listeNumero: liste.numero,
    words: liste.mots.map((m) => ({
      correct: m.mot,
      phrase: PHRASES[m.mot] || null,
      fem: m.fem || null,
      muette: m.muette || null,
    })),
  };
}

// La dictée de la semaine en cours — utilisée par le menu et le Coach.
export function dicteeCetteSemaine(date = new Date()) {
  return dicteeDeLaListe(listeCetteSemaine(date).id);
}
