// Sciences — secondaire 1 (Collège Laval) — Labo d'introduction: instruments de laboratoire
// Source: « Le matériel de laboratoire - Intro_doc élève » (5 pages, photos + utilités du prof).
// Test le 14 sept. 2026. Photos: public/sciences/*.jpg (extraites de sa feuille).
//
// `nom`     = le nom exact de la banque de mots (orthographe à savoir)
// `accept`  = autres écritures acceptées en mode Écrire (sans accents / pluriel / variantes)
// `utilite` = l'utilité telle qu'écrite sur la feuille
// `cle`     = l'utilité en 5-8 mots (pour les choix et la voix)
// `piege`   = ce que Cayla a écrit de faux sur sa feuille (devient un distracteur)

export const INSTRUMENTS = [
  { id: 'balance_fleaux', nom: 'Balance à fléaux', img: '/sciences/balance-fleaux.jpg',
    accept: ['balance a fleaux', 'balance à fléau', 'balance a fleau'],
    utilite: 'Mesurer une quantité de matière (masse).', cle: 'Mesurer la masse (avec des curseurs)' },
  { id: 'flacon_laveur', nom: 'Flacon laveur', img: '/sciences/flacon-laveur.jpg',
    accept: [],
    utilite: "Verser des petites quantités d'eau dans des ouvertures étroites.", cle: "Verser un peu d'eau dans une ouverture étroite" },
  { id: 'balance_electronique', nom: 'Balance électronique', img: '/sciences/balance-electronique.jpg',
    accept: ['balance electronique'], piege: 'Balance électrique',
    utilite: "Mesurer la masse d'un objet rapidement et précisément.", cle: 'Mesurer la masse vite et précisément' },
  { id: 'support_universel', nom: 'Support universel', img: '/sciences/support-universel.jpg',
    accept: [],
    utilite: 'Faire des montages et supporter les instruments de laboratoire de façon prolongée.', cle: 'Tenir un montage debout longtemps' },
  { id: 'pince_universelle', nom: 'Pince universelle', img: '/sciences/pince-universelle.jpg',
    accept: [], piege: 'Pince à thermo',
    utilite: 'Maintenir des instruments au support universel.', cle: 'Fixer un instrument au support universel' },
  { id: 'plaque_chauffante', nom: 'Plaque chauffante', img: '/sciences/plaque-chauffante.jpg',
    accept: [],
    utilite: 'Chauffer des substances.', cle: 'Chauffer des substances' },
  { id: 'nacelle', nom: 'Nacelle', img: '/sciences/nacelle.jpg',
    accept: ['la nacelle'], piege: 'Naselle',
    utilite: 'Contenir des substances granuleuses (grains de sable ou de sel) ou des poudres pour les peser sur une balance ensuite.', cle: 'Contenir une poudre pour la peser' },
  { id: 'becher', nom: 'Bécher', img: '/sciences/becher.jpg',
    accept: ['becher', 'le bécher'],
    utilite: 'Contenir et chauffer des substances.', cle: 'Contenir et chauffer des substances' },
  { id: 'papier_ph', nom: 'Papier pH', img: '/sciences/papier-ph.jpg',
    accept: ['papier ph'], piege: 'Papier pb',
    utilite: "Mesurer le pH d'un liquide: la puissance d'un acide, d'une base, ou si c'est une substance neutre.", cle: "Mesurer le pH (acide, base ou neutre)" },
  { id: 'cylindres_gradues', nom: 'Cylindres gradués', img: '/sciences/cylindres-gradues.jpg',
    accept: ['cylindre gradué', 'cylindre gradue', 'cylindres gradues'],
    utilite: 'Mesurer de façon précise le volume des liquides.', cle: 'Mesurer précisément le volume d\'un liquide' },
  { id: 'brucelles', nom: 'Pince / brucelles', img: '/sciences/brucelles.jpg',
    accept: ['brucelles', 'brucelle', 'pince brucelles', 'pince a brucelles', 'pince à brucelles', 'pince à brucelle', 'pince a brucelle', 'pince/brucelles', 'pince'],
    utilite: 'Saisir des petits objets. Éviter de toucher à des substances avec nos doigts.', cle: 'Saisir de petits objets sans les doigts' },
  { id: 'pipette', nom: 'Pipette', img: '/sciences/pipette.jpg',
    accept: [],
    utilite: 'Ajouter ou retirer des petites quantités de liquide (goutte-à-goutte).', cle: 'Ajouter ou retirer du liquide goutte à goutte' },
  { id: 'pince_becher', nom: 'Pince à bécher', img: '/sciences/pince-becher.jpg',
    accept: ['pince a becher', 'pince à becher', 'pince a bécher'],
    utilite: 'Manipuler le bécher quand il est chaud.', cle: 'Prendre le bécher chaud' },
  { id: 'spatule', nom: 'Spatule', img: '/sciences/spatule.jpg',
    accept: [],
    utilite: 'Manipuler des solides en poudre ou en granules (sable, sel) et en prélever de petites quantités sans contact avec les doigts.', cle: 'Prélever un peu de poudre sans les doigts' },
];

// Partie 2 — montages (la flèche numérotée sur la photo → l'instrument)
export const MONTAGES = [
  { id: 'm15_1', img: '/sciences/montage-15.jpg', fleche: 'Flèche 1 (rouge)', nom: 'Nacelle', ref: 'nacelle' },
  { id: 'm15_2', img: '/sciences/montage-15.jpg', fleche: 'Flèche 2 (bleue)', nom: 'Balance électronique', ref: 'balance_electronique' },
  { id: 'm16_1', img: '/sciences/montage-16.jpg', fleche: 'Flèche 1', nom: 'Support universel', ref: 'support_universel' },
  { id: 'm16_2', img: '/sciences/montage-16.jpg', fleche: 'Flèche 2', nom: 'Pince universelle', ref: 'pince_universelle' },
  { id: 'm16_4', img: '/sciences/montage-16.jpg', fleche: 'Flèche 4 (bleue)', nom: 'Pince universelle', ref: 'pince_universelle' },
  { id: 'm16_5', img: '/sciences/montage-16.jpg', fleche: 'Flèche 5 (la tige jaune)', nom: 'Thermomètre', ref: 'thermometre' },
  { id: 'm17_1', img: '/sciences/montage-17.jpg', fleche: 'Flèche 1', nom: 'Bécher', ref: 'becher' },
  { id: 'm17_2', img: '/sciences/montage-17.jpg', fleche: 'Flèche 2', nom: 'Plaque chauffante', ref: 'plaque_chauffante' },
  { id: 'm18_1', img: '/sciences/montage-18.jpg', fleche: 'Flèche rouge (1)', nom: 'Éprouvette', ref: 'eprouvette' },
  { id: 'm18_2', img: '/sciences/montage-18.jpg', fleche: 'Flèche bleue (2)', nom: 'Support à éprouvettes', ref: 'support_eprouvettes' },
];

// Instruments des montages qui ne sont pas dans la partie 1 (elle avait laissé le n° 18 vide)
export const EXTRA = [
  { id: 'thermometre', nom: 'Thermomètre', accept: ['thermometre', 'thermo'], cle: 'Mesurer la température', utilite: "Mesurer la température d'une substance." },
  { id: 'eprouvette', nom: 'Éprouvette', accept: ['eprouvette', 'tube à essai', 'tube a essai', 'tube à essais'], cle: 'Petit tube pour contenir ou chauffer un peu de liquide', utilite: "Contenir de petites quantités de liquide pour les observer, les mélanger ou les chauffer." },
  { id: 'support_eprouvettes', nom: 'Support à éprouvettes', accept: ['support a eprouvettes', 'support à éprouvette', 'support a eprouvette', 'porte-éprouvettes', 'porte eprouvettes', 'support d\'éprouvettes'], cle: 'Tenir les éprouvettes debout', utilite: 'Tenir les éprouvettes debout et en ordre.' },
];

export const ALL_NAMES = [...INSTRUMENTS, ...EXTRA].map((i) => i.nom);
export const byId = Object.fromEntries([...INSTRUMENTS, ...EXTRA].map((i) => [i.id, i]));

// Comparaison tolérante pour le mode Écrire: minuscules, sans accents, espaces/tirets/slash normalisés
export function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[’'`´]/g, "'")
    .replace(/[-/]/g, ' ')
    .replace(/^(le|la|les|un|une|des)\s+/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isNameCorrect(typed, item) {
  const t = normalize(typed);
  if (!t) return false;
  const ok = [item.nom, ...(item.accept || [])].map(normalize);
  return ok.includes(t);
}

// Pour wordMastery
export const masteryItems = [...INSTRUMENTS, ...EXTRA].map((i) => ({ ...i, correct: i.nom }));
