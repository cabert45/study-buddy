// La feuille « Liste 2 » du cahier « L'orthographe au quotidien », à l'écran.
//
// Photo de la feuille de Ryan corrigée, 23 sept. 2026 (remise le 25). Les sept
// questions sont reproduites dans l'ordre et dans les mots du cahier — pas une
// adaptation: la MÊME feuille, pour qu'il reconnaisse ce qu'il a devant lui sur
// papier et qu'il comprenne ce qu'on lui demande.
//
// Ce qu'il avait donné, et qui décide de la façon dont chaque question aide:
//   Q1  3/6 — il a mis gentil (l), rond (d) et renard (d) dans la colonne du
//       « t ». Il repère une lettre muette, il ne trie pas LAQUELLE.
//   Q2  bon (rate / renard)
//   Q3  bon (droit / droite)
//   Q4  « ronde » — la réponse est gentille, et les deux l n'existent qu'au
//       féminin. C'est aussi le bug que l'app lui enseignait à l'envers.
//   Q5  « HAUT, gentille, COURT » — gentille est un féminin, et l'ordre
//       alphabétique n'y est pas.
//   Q6  VIDE
//   Q7  VIDE
//
// Les corrections ne disent jamais seulement « non »: elles rappellent le geste
// (mets le mot au féminin) parce qu'il pleure quand il se trompe.

export const MOTS_L2 = [
  { m: 'court', f: 'courte', muette: 't', adj: true },
  { m: 'gentil', f: 'gentille', muette: 'l', adj: true, jumelles: true },
  { m: 'méchant', f: 'méchante', muette: 't', adj: true },
  { m: 'ouvert', f: 'ouverte', muette: 't', adj: true },
  { m: 'renard', f: 'renarde', muette: 'd', nom: true },
  { m: 'droit', f: 'droite', muette: 't', adj: true, sonOi: true },
  { m: 'haut', f: 'haute', muette: 't', adj: true },
  { m: 'mort', f: 'morte', muette: 't', adj: true },
  { m: 'rat', f: 'rate', muette: 't', nom: true },
  { m: 'rond', f: 'ronde', muette: 'd', adj: true },
];

// Les mots au masculin ET au féminin, comme dans l'encadré du cahier.
export const TOUS_LES_MOTS = MOTS_L2.flatMap((x) => [x.m, x.f]);

const motsAvecMuette = (lettre) => MOTS_L2.filter((x) => x.muette === lettre).map((x) => x.m);

export const FEUILLE_L2 = {
  numero: 2,
  titre: 'Mots se terminant par une lettre muette',
  verbes: "Verbes être, avoir, aimer, aller et finir à l'infinitif",
  questions: [
    {
      id: 'q1',
      numero: 1,
      type: 'choix_multiple',        // il en coche plusieurs
      consigne: 'Quels mots ont un « t » comme lettre muette?',
      aide: 'Mets chaque mot au féminin. Si tu entends un « t », c\'est un bon.',
      choix: MOTS_L2.map((x) => x.m),
      bonnes: motsAvecMuette('t'),
      // Le piège exact de sa feuille: il avait coché ces trois-là.
      pourquoiFaux: Object.fromEntries(
        MOTS_L2.filter((x) => x.muette !== 't')
          .map((x) => [x.m, `${x.m} → ${x.f}. Tu entends un « ${x.muette} », pas un « t ».`]),
      ),
      pourquoiVrai: Object.fromEntries(
        MOTS_L2.filter((x) => x.muette === 't')
          .map((x) => [x.m, `${x.m} → ${x.f}. Le « t » se met à parler.`]),
      ),
    },
    {
      id: 'q2a',
      numero: 2,
      sousTitre: 'a.',
      type: 'un_choix',
      consigne: 'Le rat est le mâle de la ___',
      choix: ['rate', 'rat', 'ratte', 'renarde'],
      bonne: 'rate',
      explication: 'Le rat (mâle) · la rate (femelle).\nLe féminin ajoute un « e », et le « t » muet s\'entend enfin.',
    },
    {
      id: 'q2b',
      numero: 2,
      sousTitre: 'b.',
      type: 'un_choix',
      consigne: 'La renarde est la femelle du ___',
      choix: ['renard', 'renarde', 'renart', 'rat'],
      bonne: 'renard',
      image: '/visuels/jazz/voc-renard.jpg',
      imageAlt: 'Un renard',
      explication: 'Le renard (mâle) · la renarde (femelle).\nAu masculin, le « d » est muet: on l\'écrit, on ne l\'entend pas.',
    },
    {
      id: 'q3',
      numero: 3,
      type: 'choix_multiple',
      consigne: 'Dans quels mots entends-tu le son « oi »?',
      aide: 'Dis les mots tout haut. Cherche celui qui fait « wa ».',
      choix: ['droit', 'droite', 'mort', 'rond', 'haut', 'court'],
      bonnes: ['droit', 'droite'],
      pourquoiVrai: {
        droit: 'droit — on entend « wa », comme dans moi et toi.',
        droite: 'droite — le même son « oi », au féminin.',
      },
      pourquoiFaux: {
        mort: 'mort fait « or », pas « oi ».',
        rond: 'rond fait « on », pas « oi ».',
        haut: 'haut fait « o », pas « oi ».',
        court: 'court fait « our », pas « oi ».',
      },
    },
    {
      id: 'q4',
      numero: 4,
      type: 'un_choix',
      consigne: 'Quel mot a des consonnes jumelles?',
      aide: 'Des jumelles, c\'est deux fois la même lettre, collées: ll, ss, tt, rr…',
      choix: ['gentille', 'ronde', 'courte', 'méchante'],
      bonne: 'gentille',
      explication: 'gentille — deux « l » collés.\nAttention: au masculin « gentil », on ne les voit pas. C\'est le FÉMININ qui les fait apparaître.',
    },
    {
      id: 'q5a',
      numero: 5,
      sousTitre: 'D\'abord:',
      type: 'un_choix',
      consigne: 'Lequel de ces adjectifs est au MASCULIN?',
      aide: 'Le féminin a presque toujours un « e » de plus à la fin.',
      choix: ['court', 'gentille', 'haute', 'méchante'],
      bonne: 'court',
      explication: 'court (masculin) → courte (féminin).\nLes trois autres finissent déjà par un « e »: ce sont les féminins.',
    },
    {
      id: 'q5b',
      numero: 5,
      sousTitre: 'Ensuite:',
      type: 'ordre',
      consigne: 'Place ces 3 adjectifs masculins en ORDRE ALPHABÉTIQUE:',
      aide: 'Récite l\'alphabet dans ta tête. Quelle première lettre vient avant?',
      choix: ['haut', 'gentil', 'court'],
      bonne: ['court', 'gentil', 'haut'],
      explication: 'court, gentil, haut → c, g, h.\nOn compare la 1re lettre. Si elle est pareille, on passe à la 2e.',
    },
    {
      id: 'q6a',
      numero: 6,
      sousTitre: 'a.',
      type: 'un_choix',
      consigne: '___ un gentil renard, j\'aurais bien peur de ce méchant rat.',
      aide: 'Lis la phrase en entier avec chaque verbe. Un seul a du sens.',
      choix: ['Être', 'Avoir', 'Aimer', 'Aller', 'Finir'],
      bonne: 'Être',
      explication: '« Être un gentil renard » veut dire « si j\'étais un gentil renard ».\nC\'est ce qu\'on EST.',
    },
    {
      id: 'q6b',
      numero: 6,
      sousTitre: 'b.',
      type: 'un_choix',
      consigne: 'Vous devez ___ votre travail avant d\'aller jouer dehors.',
      choix: ['finir', 'être', 'avoir', 'aimer'],
      bonne: 'finir',
      explication: 'Après « vous devez », le verbe reste à l\'infinitif.\nTerminer son travail, c\'est le FINIR.',
    },
    {
      id: 'q6c',
      numero: 6,
      sousTitre: 'b. (suite)',
      type: 'un_choix',
      consigne: 'Vous devez finir votre travail avant d\'___ jouer dehors.',
      choix: ['aller', 'avoir', 'être', 'finir'],
      bonne: 'aller',
      explication: 'Après « avant de », le verbe reste à l\'infinitif.\nOn se rend quelque part: ALLER.',
    },
    {
      id: 'q6d',
      numero: 6,
      sousTitre: 'c.',
      type: 'un_choix',
      consigne: '___ une grande maison veut aussi dire faire beaucoup de ménage.',
      choix: ['Avoir', 'Être', 'Aller', 'Aimer'],
      bonne: 'Avoir',
      explication: 'Posséder une maison, c\'est l\'AVOIR.',
    },
    {
      id: 'q7',
      numero: 7,
      type: 'phrase',
      consigne: 'Compose une phrase avec les mots renarde et méchante.',
      aide: 'Une phrase commence par une MAJUSCULE et finit par un POINT. Elle doit dire quelque chose de complet.',
      motsObligatoires: ['renarde', 'méchante'],
      // Aucune phrase modèle ici: c'est SA phrase qu'il doit écrire, et une
      // phrase toute faite à recopier n'apprend rien. L'app vérifie, elle ne
      // rédige pas.
      verifications: [
        { id: 'mots', label: 'Les deux mots y sont' },
        { id: 'majuscule', label: 'Ça commence par une majuscule' },
        { id: 'point', label: 'Ça finit par un point' },
        { id: 'longueur', label: 'C\'est une vraie phrase, pas deux mots' },
      ],
    },
  ],
};
