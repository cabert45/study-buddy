// Sciences — Éclair de génie, 3e année, Étape 1 (p. 3 à 12)
// « Pourquoi certains animaux ont-ils une queue? »
// Mini-test en classe le JEUDI 15 OCTOBRE 2026.
//
// Tout ce qui est ici vient des pages photographiées par le parent le 11 oct.
// (DOC 1 « Les animaux à queue » p. 8-9, DOC 2 « L'utilité de la queue »
// p. 10-11, et le Bilan des connaissances p. 12). Rien n'est inventé: un
// mini-test se révise sur SON cahier, pas sur une encyclopédie.
//
// LES TROIS ERREURS DE RYAN, vues sur ses pages déjà remplies — ce sont elles
// que le générateur attaque en priorité:
//
//   1. **Il a oublié les AMPHIBIENS.** Page 4, question 2, il a coché
//      reptiles, oiseaux, poissons et mammifères. Il connaît donc 4 classes
//      sur 5, et c'est exactement la case qu'un test coche.
//   2. **« Qu'ont en commun les animaux à queue? »** Il a répondu autre chose.
//      La réponse est: ce sont tous des VERTÉBRÉS — la queue est un
//      prolongement de la colonne vertébrale. C'est l'idée centrale de
//      l'étape, et c'est celle qui lui manque.
//   3. **Il confond « se déplacer » et « à quoi sert la queue ».** Page 12,
//      question 3 (quatre moyens de déplacement), il a écrit « la queue du
//      chien exprime son humeur ». Ce n'est pas un déplacement. Les deux
//      listes sont voisines dans le cahier et il les a fusionnées.

// ===== Les 5 classes de vertébrés (p. 9) =====
// `traits` = ce que le cahier écrit, mot pour mot (c'est ce qu'on révise).
// `distinctifs` = ceux qui ne vont QU'À cette classe-là.
//
// La distinction n'est pas cosmétique: « Ils pondent des œufs » est vrai pour
// QUATRE classes sur cinq. Posée en question à choix unique, elle n'a pas de
// bonne réponse — et l'app en a posé une avant qu'on la joue.
export const CLASSES = [
  {
    id: 'mammiferes', nom: 'les mammifères',
    traits: ['Ils ont des poils.', "Ils ne pondent pas d'œufs.", 'Les femelles allaitent leurs petits.'],
    distinctifs: ['Ils ont des poils.', "Ils ne pondent pas d'œufs.", 'Les femelles allaitent leurs petits.'],
    signe: 'des poils, et la maman allaite ses bébés',
    animaux: ['la souris', 'le chien', 'le chat', 'la vache', 'le cheval', 'le mouton',
      'le porcelet', 'la girafe', 'le lion', 'le kangourou', 'le renard arctique',
      'le singe', 'le paresseux'],
  },
  {
    id: 'reptiles', nom: 'les reptiles',
    traits: ['Ils ont la peau sèche.', 'Ils ont des écailles.', 'Ils pondent des œufs.'],
    distinctifs: ['Ils ont la peau sèche.'],
    signe: 'la peau sèche et des écailles',
    animaux: ['la tortue', 'le serpent', "l'iguane", 'le crocodile', 'le lézard'],
  },
  {
    id: 'oiseaux', nom: 'les oiseaux',
    traits: ['Ils volent.', 'Ils ont des plumes.', 'Ils pondent des œufs et les couvent.'],
    distinctifs: ['Ils ont des plumes.', 'Ils pondent des œufs et les couvent.', 'Ils volent.'],
    signe: 'des plumes, et ils couvent leurs œufs',
    animaux: ['le paon', 'le perroquet', 'la poule', "l'aigle"],
  },
  {
    id: 'poissons', nom: 'les poissons',
    traits: ["Ils vivent dans l'eau et respirent à l'aide de branchies.",
      'Ils possèdent des nageoires.', 'Ils ont des écailles.', 'Ils pondent des œufs.'],
    distinctifs: ["Ils vivent dans l'eau et respirent à l'aide de branchies.",
      'Ils possèdent des nageoires.'],
    signe: 'des branchies et des nageoires',
    animaux: ['le poisson-clown', 'le requin', 'la truite'],
  },
  {
    id: 'amphibiens', nom: 'les amphibiens',
    // La classe qu'il a oubliée page 4. Elle revient plus souvent que les autres.
    traits: ['Ils ont la peau lisse et humide.',
      "Les bébés, qu'on appelle les « têtards », naissent dans l'eau. À mesure qu'ils grandissent, leurs pattes se développent.",
      'Ils pondent des œufs.'],
    distinctifs: ['Ils ont la peau lisse et humide.',
      "Les bébés, qu'on appelle les « têtards », naissent dans l'eau. À mesure qu'ils grandissent, leurs pattes se développent."],
    signe: 'la peau lisse et humide, et des bébés têtards',
    animaux: ['la grenouille', 'le crapaud', 'la salamandre'],
  },
];

// Ce que PLUSIEURS classes partagent — ça ne sert pas à identifier une classe,
// ça sert à se faire piquer au test. D'où des questions faites exprès pour.
export const PARTAGES = [
  { trait: 'pondre des œufs', qui: ['les reptiles', 'les oiseaux', 'les poissons', 'les amphibiens'],
    sauf: 'les mammifères' },
  { trait: 'avoir des écailles', qui: ['les reptiles', 'les poissons'], sauf: null },
];

// Les invertébrés du cahier (p. 3 et p. 9): pas de colonne vertébrale,
// donc pas de queue au sens du DOC 1.
export const INVERTEBRES = ["l'escargot", "l'araignée", 'la coccinelle', 'la pieuvre',
  'la méduse', "l'étoile de mer", 'la limace', 'le ver de terre'];

// ===== Les 7 actions de la queue (p. 5 question 3, p. 10-11) =====
// Deux étaient déjà imprimées dans le cahier, cinq étaient à trouver.
// `deplacement: true` = le cahier range cette utilite-la du cote des
// DEPLACEMENTS (DOC 2, p. 10: le singe s'agrippe, l'oiseau garde l'equilibre
// en vol, le poisson nage). Les autres viennent de la page 11, qui commence
// par « Les animaux utilisent leur queue pour bien d'autres raisons que pour
// les deplacements » — ce sont celles-la, et seulement celles-la, qu'on peut
// opposer a « se deplacer » sans pieger l'enfant.
export const UTILITES = [
  { action: 'se déplacer', qui: 'le poisson', deplacement: true,
    phrase: "La queue du poisson lui permet d'avancer dans l'eau." },
  { action: 'exprimer son humeur', qui: 'le chien',
    phrase: 'La queue du chien exprime son humeur.' },
  { action: 'chasser les moustiques', qui: 'la vache',
    phrase: 'La vache chasse les moustiques avec sa queue.' },
  { action: "garder l'équilibre lorsqu'il saute", qui: 'le kangourou',
    phrase: "Le kangourou se sert de sa queue pour garder l'équilibre lorsqu'il saute." },
  { action: 'se protéger du froid', qui: 'le renard arctique',
    phrase: "Le renard arctique s'enroule dans sa queue pour se protéger du froid." },
  { action: 'séduire les femelles', qui: 'le paon',
    phrase: 'Le paon se sert de sa queue pour séduire les femelles.' },
  { action: 'fouetter ses ennemis', qui: "l'iguane",
    phrase: "L'iguane utilise sa queue pour fouetter ses ennemis." },
  { action: "s'agripper aux arbres", qui: 'le singe', deplacement: true,
    phrase: "Les singes utilisent leur queue pour s'agripper aux arbres et sauter de branche en branche." },
  { action: "garder l'équilibre en vol", qui: "l'oiseau", deplacement: true,
    phrase: "La queue de l'oiseau lui permet de garder l'équilibre en plein vol et de ralentir avant l'atterrissage." },
];

// ===== Les moyens de DÉPLACEMENT (p. 12 question 3) =====
// À ne pas confondre avec la liste ci-dessus: c'est son erreur n° 3.
export const DEPLACEMENTS = [
  { verbe: 'marcher', qui: "l'être humain" },
  { verbe: 'courir', qui: 'le cheval' },
  { verbe: 'sauter', qui: 'le kangourou' },
  { verbe: 'nager', qui: 'le poisson' },
  { verbe: 'voler', qui: "l'oiseau" },
  { verbe: 'ramper', qui: 'le serpent' },
  { verbe: 'grimper', qui: 'le singe' },
];

// ===== La démarche scientifique (p. 4-5) =====
export const DEMARCHE = [
  'Se poser une question',
  'Émettre une hypothèse',
  'Réaliser une expérience',
  'Se documenter',
  'Tirer une conclusion',
];

export const classeDe = (animal) => CLASSES.find((c) => c.animaux.includes(animal)) || null;
