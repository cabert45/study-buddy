// Cahier de français de Ryan — JAZZ 3e année (TC Média)
// Photos des pages: Documents/Ryan - Tandem/Jazz - 3e
// Table des matières photographiée le 13 sept 2026. Chaque module = une lecture
// + une notion de grammaire (la page de notion, puis la page « Reconnaître… »).
//
// `mode` = l'exercice Study Buddy qui prépare la notion (null = pas encore dans l'app).
// `extra` = un 2e exercice du même module (ex. Voc en vrac, le pronom).
//
// CAHIER_SEMAINES = rythme de la classe (~1 module / semaine). Vérifié le 13 sept
// sur les photos du cahier: module 1 terminé jusqu'à la p. 12, p. 13 et suivantes
// vierges. À mettre à jour quand de nouvelles photos arrivent — c'est ce tableau
// qui décide ce que le Coach présente comme « cette semaine » et « en avance ».

export const CAHIER_THEMES = [
  {
    id: 't1', numero: 1, titre: 'Pleins feux sur les personnages', page: 2,
    modules: [
      { id: 't1_cles1', label: 'Des clés — Les personnages', pages: '4', notions: ['Les personnages'], mode: 't1_dialogue' },
      { id: 't1m1', numero: 1, lecture: "C'est moi, Anatole!", pages: '6-11', notions: ['Le nom', 'Reconnaître un nom'], mode: 't1_nom' },
      { id: 't1m2', numero: 2, lecture: 'La fabuleuse entraîneuse', pages: '13-19', notions: ['Le déterminant', 'Reconnaître un déterminant', 'Voc en vrac'], mode: 't1_determinant', extra: { mode: 't1_voc', label: 'Voc en vrac' } },
      { id: 't1_cles2', label: 'Des clés — Le dialogue', pages: '20', notions: ['Le dialogue'], mode: 't1_dialogue' },
      { id: 't1m3', numero: 3, lecture: 'Le rêve de Klovis', pages: '22-27', notions: ["L'adjectif", 'Reconnaître un adjectif'], mode: 't1_adjectif' },
      { id: 't1m4', numero: 4, lecture: "Le destin d'une mousse", pages: '29-33', notions: ['Le verbe', 'Reconnaître un verbe', 'Le pronom de conjugaison'], mode: 't1_verbe', extra: { mode: 't1_pronom', label: 'Pronom' } },
      { id: 't1rev', label: 'Révision du thème 1', pages: '34', notions: ['Nom · déterminant · adjectif · verbe · pronom'], mode: 't1_revision' },
    ],
  },
  {
    id: 't2', numero: 2, titre: 'Des mots et des images', page: 36,
    modules: [
      { id: 't2_cles1', label: "Des clés — Le temps et le lieu d'un récit", pages: '38', notions: ['Temps et lieu'], mode: null },
      { id: 't2m1', numero: 1, lecture: "Les aventures d'un biscuit", pages: '40-47', notions: ['Le groupe du nom', "L'expansion dans le GN", 'Voc en vrac'], mode: 'groupe_nom' },
      { id: 't2m2', numero: 2, lecture: 'Flic et le fantôme', pages: '48-52', notions: ["Les constructions d'un GN"], mode: 'groupe_nom' },
      { id: 't2_cles2', label: 'Des clés — Les marqueurs de relation', pages: '54', notions: ['Marqueurs de relation'], mode: null },
      { id: 't2m3', numero: 3, lecture: 'Le monstre du lac', pages: '56-60', notions: ["Constructions d'un GN (suite)"], mode: 'groupe_nom' },
      { id: 't2m4', numero: 4, lecture: 'Une grande frousse pour Noémie', pages: '62-69', notions: ['Accord des mots dans un GN', 'Voc en vrac'], mode: 'adjectif' },
      { id: 't2m5', numero: 5, lecture: 'Les lunettes magiques', pages: '70-72', notions: ['La phrase'], mode: null },
      { id: 't2rev', label: 'Révision du thème 2', pages: '74', notions: [], mode: null },
    ],
  },
  {
    id: 't3', numero: 3, titre: 'Rétro, info, vieillot!', page: 76,
    modules: [
      { id: 't3_cles1', label: "Des clés — L'ordre des idées", pages: '78', notions: ["L'ordre des idées"], mode: null },
      { id: 't3m1', numero: 1, lecture: "L'automobile · La Ford T", pages: '80-87', notions: ['Le féminin des noms', 'Voc en vrac'], mode: 'pluriels_ryan' },
      { id: 't3m2', numero: 2, lecture: 'La télévision de grand-papa', pages: '88-95', notions: ['Le pluriel des noms', 'Voc en vrac'], mode: 'pluriels_ryan' },
      { id: 't3_cles2', label: 'Des clés — Les mots de substitution', pages: '96', notions: ['Mots de substitution'], mode: null },
      { id: 't3m3', numero: 3, lecture: "D'hier à aujourd'hui · Les pets-de-sœurs", pages: '98-103', notions: ["Le verbe à l'infinitif"], mode: null },
      { id: 't3m4', numero: 4, lecture: 'Le vieux tourne-disque', pages: '104-106', notions: ['Phrase à plus d\'un verbe conjugué', 'Phrase sans verbe conjugué'], mode: null },
      { id: 't3rev', label: 'Révision du thème 3', pages: '108', notions: [], mode: null },
    ],
  },
  {
    id: 'conj', numero: null, titre: 'Conjugaison', page: 110,
    modules: [
      { id: 'conj1', label: 'Radical et terminaison · Temps simples', pages: '110-112', notions: ['Radical et terminaison', "Temps simples de l'indicatif"], mode: null },
      { id: 'conj2', label: 'Le présent', pages: '113', notions: ['Le présent'], mode: 'present_indicatif' },
      { id: 'conj3', label: "L'imparfait", pages: '116', notions: ["L'imparfait"], mode: null },
      { id: 'conj4', label: 'Révision de la conjugaison', pages: '119', notions: [], mode: null },
    ],
  },
];

// Semaine de classe (lundi) → module travaillé. ESTIMATION — voir l'en-tête.
export const CAHIER_SEMAINES = [
  { debut: [2026, 9, 7], module: 't1m1' },   // fait — p. 6-12 remplies et corrigées (photos du 13 sept)
  { debut: [2026, 9, 14], module: 't1m2' },
  { debut: [2026, 9, 21], module: 't1m3' },  // + Des clés: le dialogue (p. 20)
  { debut: [2026, 9, 28], module: 't1m4' },
  { debut: [2026, 10, 5], module: 't1rev' },
  { debut: [2026, 10, 13], module: 't2m1' }, // mardi — lundi 12 = Action de grâce
];

const moduleIndex = {};
CAHIER_THEMES.forEach((t) => t.modules.forEach((m) => { moduleIndex[m.id] = { ...m, theme: t }; }));

export const moduleById = (id) => moduleIndex[id] || null;

const dateOf = ([y, m, d]) => new Date(y, m - 1, d);

function weekIndex(date) {
  let idx = -1;
  CAHIER_SEMAINES.forEach((w, i) => { if (dateOf(w.debut) <= date) idx = i; });
  return idx;
}

// Module de la semaine en classe (ou null avant le début du calendrier)
export function moduleCetteSemaine(date = new Date()) {
  const i = weekIndex(date);
  return i >= 0 ? moduleById(CAHIER_SEMAINES[i].module) : null;
}

// Module de la semaine suivante — pour prendre de l'avance
export function moduleSemaineProchaine(date = new Date()) {
  const i = weekIndex(date);
  const next = CAHIER_SEMAINES[i + 1];
  return next ? moduleById(next.module) : null;
}

// Titre court d'un module: « Module 2 — Le déterminant »
export function titreModule(m) {
  if (!m) return '';
  if (m.label) return m.label;
  return `Thème ${m.theme.numero} · Module ${m.numero} — ${m.notions[0]}`;
}
