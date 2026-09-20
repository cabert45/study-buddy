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
const L2 = [
  { mot: 'court', muette: 't', fem: 'courte' },
  { mot: 'gentil', muette: 'l', fem: 'gentille', jum: 1 },
  { mot: 'méchant', muette: 't', fem: 'méchante' },
  { mot: 'ouvert', muette: 't', fem: 'ouverte' },
  { mot: 'renard', muette: 'd', fem: 'renarde', nom: 1, male: 1 },
  { mot: 'droit', muette: 't', fem: 'droite', son_oi: 1 },
  { mot: 'haut', muette: 't', fem: 'haute' },
  { mot: 'mort', muette: 't', fem: 'morte' },
  { mot: 'rat', muette: 't', fem: 'rate', nom: 1, male: 1 },
  { mot: 'rond', muette: 'd', fem: 'ronde' },
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

function semaineIndex(date) {
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
