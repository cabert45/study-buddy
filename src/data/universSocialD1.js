// Univers social — Histoire 1re secondaire (Collège Laval)
// Dossier 1 — LA SÉDENTARISATION — mots de vocabulaire
// Source: « Dossier 1 - Vocabulaire 2026-2027.pdf » (M. Medeiros, Mme Pelletier, M. Sater)
//
// L'examen (dans les prochaines semaines, date inconnue) demande de:
//   1. associer le mot à une définition
//   2. trouver le mot qui résume un texte
//   3. placer un mot dans un texte
//   4. donner une définition dans ses mots
//
// `def`       = définition du prof (à comprendre, pas à réciter)
// `cle`       = l'idée-clé en mots simples (ce qu'elle doit pouvoir dire dans ses mots)
// `note`      = ce que Cayla a écrit à la main sur sa feuille
// `confiance` = la pastille qu'elle a mise à côté du mot: vert / jaune / rouge
// `aspect`    = sa légende de surlignage (social, culturel, politique, économique, territorial, technique)
// `texte`     = court texte que le mot résume (format d'examen #2)
// `trou`      = phrase à compléter (format d'examen #3)

export const DOSSIER = {
  id: 'us_d1',
  titre: 'Dossier 1 — La sédentarisation',
  matiere: 'Univers social — Histoire 1re secondaire',
  profs: 'M. Medeiros, Mme Pelletier, M. Sater',
};

export const ASPECTS = {
  social: { label: 'Social', color: '#f59e0b' },
  culturel: { label: 'Culturel', color: '#a855f7' },
  politique: { label: 'Politique', color: '#3b82f6' },
  economique: { label: 'Économique', color: '#ec4899' },
  territorial: { label: 'Territorial', color: '#22c55e' },
  technique: { label: 'Scientifique / technique', color: '#6b7280' },
};

export const MOTS = [
  {
    id: 'agriculture', mot: 'Agriculture', aspect: 'economique', confiance: 'vert',
    def: "Exploitation et transformation du milieu naturel ayant pour but la production de végétaux et d'animaux utiles à l'homme, notamment pour son alimentation.",
    cle: 'Cultiver la terre et élever des animaux pour se nourrir.',
    texte: "Au lieu de chercher des plantes sauvages, les humains sèment des graines, arrosent, récoltent et gardent des animaux près de leurs maisons pour avoir de la nourriture toute l'année.",
    trou: "Grâce à l'___, les humains n'ont plus besoin de se déplacer pour trouver à manger.",
  },
  {
    id: 'araire', mot: 'Araire', aspect: 'technique', confiance: 'rouge',
    def: 'Charrue primitive utilisée pour creuser la terre en sillons sur de grandes surfaces. Outil agricole qui témoigne d\'importantes avancées technologiques en agriculture.',
    cle: 'Une charrue primitive tirée pour creuser des sillons sur de grandes surfaces.',
    texte: "Cet outil en bois, souvent tiré par des bœufs, trace de longs sillons dans le sol. Il permet de préparer de très grands champs beaucoup plus vite qu'à la main.",
    trou: "Tiré par deux bœufs, l'___ creuse des sillons dans tout le champ.",
    image: 'B',
  },
  {
    id: 'archeologie', mot: 'Archéologie', page: 23, aspect: 'technique', confiance: 'rouge',
    def: "Science qui étudie les sociétés anciennes à l'aide de vestiges trouvés dans le sol.",
    cle: 'La science qui étudie le passé grâce aux objets (artéfacts) trouvés dans le sol.',
    note: 'Artéfactes',
    texte: "Des spécialistes creusent le sol avec précaution. Ils trouvent des os, des outils de pierre et des morceaux de poterie qui leur permettent de comprendre comment vivaient les gens il y a des milliers d'années.",
    trou: "Grâce à l'___, on sait comment vivaient les premiers humains, même s'ils n'ont rien écrit.",
  },
  {
    id: 'baton_fouir', mot: 'Bâton à fouir', aspect: 'technique', confiance: 'jaune',
    def: "Muni à la base d'un bloc de pierre, il est utilisé pour percer des trous dans la terre avant d'y semer les graines. Outil agricole qui témoigne d'importantes avancées technologiques en agriculture.",
    cle: 'Un bâton avec une pierre au bout pour faire des trous où semer les graines.',
    texte: "Avant de semer, le paysan enfonce dans le sol un long bâton alourdi par une pierre. Chaque trou recevra une graine.",
    trou: 'Avec son ___, elle perce des trous dans la terre avant de semer.',
    image: 'B',
  },
  {
    id: 'culte', mot: 'Culte', aspect: 'culturel', confiance: 'jaune',
    def: 'Hommage rendu à une divinité, à un personnage ou à un objet symbolique.',
    cle: 'Honorer un dieu, une personne ou un objet sacré (prières, offrandes, cérémonies).',
    texte: "Chaque printemps, les villageois déposent des offrandes devant une statuette et chantent pour demander de bonnes récoltes.",
    trou: 'Les villageois rendent un ___ à la déesse pour avoir de bonnes récoltes.',
  },
  {
    id: 'deesses_meres', mot: 'Déesses-mères', page: 29, aspect: 'culturel', confiance: 'vert',
    def: "Déesse de la fécondité, invoquée dans les premières sociétés et dans l'Antiquité, pour le pouvoir de procréation qu'on lui attribue. Ce pouvoir est associé à l'abondance des récoltes et à la fertilité des terres.",
    cle: 'Déesse de la fécondité: on la prie pour les bébés, les récoltes et la fertilité des terres.',
    note: 'vie · Nouveau bébé dans le clan',
    texte: "Des statuettes de femmes aux formes généreuses ont été trouvées un peu partout. Les premières sociétés les priaient pour avoir des enfants et des terres fertiles.",
    trou: 'Les statuettes de ___ symbolisent la fécondité et la vie.',
    image: 'E',
  },
  {
    id: 'demographie', mot: 'Démographie', aspect: 'social', confiance: 'jaune',
    def: 'Étude quantitative ou statistique des populations humaines, de leurs déplacements et de leur évolution, notamment leur croissance.',
    cle: "L'étude des populations avec des chiffres: combien de gens, où ils vont, comment ça grandit.",
    texte: "Grâce à l'agriculture, il y a plus de nourriture. Les familles ont plus d'enfants, moins de gens meurent de faim et les villages grossissent. Les chercheurs mesurent cette croissance.",
    trou: "La ___ étudie la croissance de la population après la sédentarisation.",
  },
  {
    id: 'division_travail', mot: 'Division du travail', page: 30, aspect: 'economique', confiance: 'vert',
    def: 'Séparation des tâches selon la spécialité de chaque individu.',
    cle: 'Chacun fait un métier différent selon sa spécialité.',
    note: 'Métier',
    texte: "Dans le village, un homme fabrique les poteries, une femme tisse les vêtements, d'autres cultivent les champs. Personne ne fait tout: chacun a sa spécialité.",
    trou: 'Avec la ___, le potier fait des pots pendant que le paysan cultive.',
  },
  {
    id: 'elevage', mot: 'Élevage', page: 23, aspect: 'economique', confiance: 'vert',
    alias: 'Domestication des animaux',
    def: "Action d'élever des animaux, en vue d'obtenir des résultats économiques. Cette utilisation permet aux hommes de se nourrir, de confectionner des outils et de s'habiller.",
    cle: 'Garder et élever des animaux pour la nourriture, les outils et les vêtements.',
    note: 'Production de nourriture',
    texte: "Plutôt que de chasser, les humains gardent des chèvres et des moutons près du village. Ils obtiennent du lait, de la viande, de la laine et des os pour les outils.",
    trou: "L'___ des chèvres et des moutons fournit du lait, de la viande et de la laine.",
  },
  {
    id: 'esperance_vie', mot: 'Espérance de vie', aspect: 'social', confiance: 'vert',
    def: "Nombre d'années qu'une personne peut s'attendre à vivre. L'espérance de vie d'une société est établie selon le taux de mortalité.",
    cle: "Le nombre d'années qu'une personne peut espérer vivre (35-45 ans au Néolithique).",
    note: '35-45 ans · Qualité de vie',
    texte: "Au Néolithique, une personne vivait en moyenne 35 à 45 ans. Les maladies et les accidents faisaient mourir les gens jeunes.",
    trou: "Au Néolithique, l'___ était d'environ 35 à 45 ans.",
  },
  {
    id: 'faucille', mot: 'Faucille', page: 25, aspect: 'technique', confiance: 'jaune',
    def: "Sert à couper les plantes et les épis. Outil agricole qui témoigne d'importantes avancées technologiques en agriculture.",
    cle: 'Outil à lame courbée pour couper les épis de céréales.',
    texte: "Quand le blé est mûr, la paysanne saisit les tiges d'une main et les coupe d'un coup avec sa lame recourbée.",
    trou: 'À la récolte, on coupe les épis avec une ___.',
    image: 'B',
  },
  {
    id: 'hierarchie_sociale', mot: 'Hiérarchie sociale', page: 34, aspect: 'social', confiance: 'vert',
    def: "Classement des membres d'une société selon leur degré de pouvoir, de richesse ou d'influence.",
    cle: 'Le classement des gens: qui a le plus de pouvoir, de richesse ou d\'influence.',
    texte: "Le chef décide et possède les plus grandes terres. Les prêtres sont respectés. Les paysans obéissent. Chacun a une place selon son pouvoir et sa richesse.",
    trou: "Dans la ___, le chef est au sommet et les paysans en bas.",
  },
  {
    id: 'houe', mot: 'Houe', page: 25, aspect: 'technique', confiance: 'vert',
    def: "Munie d'une large lame fixée à un manche, elle permet de creuser et de remuer la terre. Outil agricole qui témoigne d'importantes avancées technologiques en agriculture.",
    cle: 'Outil avec une large lame au bout d\'un manche pour creuser et remuer la terre.',
    texte: "Avec cet outil à large lame, le paysan retourne la terre et casse les mottes avant de semer.",
    trou: 'Le paysan remue la terre avec sa ___ avant de semer.',
    image: 'B',
  },
  {
    id: 'metallurgie', mot: 'Métallurgie', page: 30, aspect: 'technique', confiance: 'vert',
    def: 'Ensemble des techniques de fabrication des métaux.',
    cle: 'Les techniques pour fabriquer des objets en métal (fin du Néolithique).',
    note: 'Fin du Néolithique',
    texte: "À la fin du Néolithique, des artisans chauffent des pierres spéciales pour en tirer du cuivre. Ils le coulent dans des moules pour fabriquer des outils et des bijoux.",
    trou: "La ___ apparaît à la fin du Néolithique, quand on fabrique les premiers outils en cuivre.",
  },
  {
    id: 'meule', mot: 'Meule', page: 25, aspect: 'technique', confiance: 'vert',
    def: "Pierre creuse dans laquelle les céréales sont broyées à l'aide d'un pilon, une pierre bombée. Outil agricole qui témoigne d'importantes avancées technologiques en agriculture.",
    cle: 'Pierre creuse où on écrase les grains avec un pilon pour faire de la farine.',
    texte: "Pour faire de la farine, on dépose les grains dans une pierre creuse et on les écrase avec une autre pierre arrondie.",
    trou: 'On broie les grains de blé dans la ___ pour obtenir de la farine.',
    image: 'B',
  },
  {
    id: 'moyen_orient', mot: 'Moyen-Orient', page: 13, aspect: 'territorial', confiance: 'vert',
    def: "Région du monde qui comprend aujourd'hui Israël, la Palestine, la Jordanie, le Liban, la Syrie et l'Irak.",
    cle: 'La région du Croissant fertile: Israël, Palestine, Jordanie, Liban, Syrie, Irak.',
    note: 'Croissant fertile',
    texte: "C'est dans cette région, entre la Méditerranée et les fleuves Tigre et Euphrate, que l'agriculture est apparue en premier, il y a environ 10 000 ans.",
    trou: "L'agriculture est née au ___, dans le Croissant fertile.",
  },
  {
    id: 'neolithique', mot: 'Néolithique', page: 22, aspect: 'social', confiance: 'vert',
    def: "Mot d'origine grecque: néos « nouveau » et lithos « pierre ». « Âge nouveau de la pierre polie ». Les êtres humains, devenus sédentaires, développent de nouvelles techniques et de nouveaux outils pour l'agriculture.",
    cle: "L'âge de la pierre polie (-10 000 à -3 500): les humains deviennent sédentaires et cultivent.",
    note: 'Âge de la pierre · -10 000 à -3 500',
    texte: "Il y a environ 10 000 ans, les humains s'installent dans des villages, polissent leurs outils de pierre et commencent à cultiver la terre.",
    trou: "Au ___, les humains polissent la pierre et deviennent sédentaires.",
    image: 'C',
  },
  {
    id: 'nomade', mot: 'Nomade', page: 12, aspect: 'social', confiance: 'vert',
    alias: 'Nomadisme',
    def: "Mode de vie d'une personne qui n'a pas d'habitation fixe. Les nomades pratiquent la chasse et la cueillette, et ils se déplacent constamment pour trouver de la nourriture.",
    cle: 'Quelqu\'un qui n\'a pas de maison fixe et se déplace tout le temps pour chasser et cueillir.',
    texte: "Le groupe suit les troupeaux de rennes. Quand il n'y a plus de gibier ni de baies, tout le monde plie les tentes et repart plus loin.",
    trou: 'Les ___ se déplacent constamment pour suivre le gibier.',
  },
  {
    id: 'paleolithique', mot: 'Paléolithique', page: 17, aspect: 'social', confiance: 'vert',
    def: "Mot d'origine grecque: palaios « ancien » et lithos « pierre ». « Âge ancien de la pierre taillée ». Période caractérisée par des groupes qui se déplacent constamment pour assurer leur subsistance.",
    cle: "L'âge de la pierre taillée: les humains sont nomades, ils chassent et cueillent.",
    note: 'Âge de la pierre taillée · Nomade',
    texte: "Pendant cette très longue période, les humains taillent des pierres pour en faire des pointes et des couteaux, et ils se déplacent sans cesse pour se nourrir.",
    trou: 'Au ___, les humains taillent la pierre et vivent en nomades.',
    image: 'D',
  },
  {
    id: 'peintures_rupestres', mot: 'Peintures rupestres', page: 35, aspect: 'culturel', confiance: 'jaune',
    def: "Peintures faites sur une paroi de caverne ou de rocher. Premières manifestations artistiques des êtres humains. Le mot rupestre vient du latin rupe, « rocher ».",
    cle: 'Peintures sur les murs des cavernes: le premier art humain (souvent des scènes de chasse).',
    note: 'Souvent des scènes de chasse',
    texte: "Au fond d'une grotte, des chevaux et des bisons sont dessinés sur la roche avec des pigments rouges et noirs. Ce sont les premières œuvres d'art de l'humanité.",
    trou: 'Les ___ de la grotte de Lascaux montrent des animaux et des scènes de chasse.',
    image: 'F',
  },
  {
    id: 'poterie', mot: 'Poterie', page: 30, aspect: 'technique', confiance: 'vert',
    def: "Fabrication d'objets (plats, ustensiles divers) et de récipients (vases, cruches) en terre cuite.",
    cle: "Fabriquer des pots et des plats en argile cuite au feu, pour conserver et transporter les aliments.",
    note: 'Argile à faire cuire sur feu · permet de conserver et transporter les aliments',
    texte: "L'artisan façonne l'argile en forme de vase, puis le fait cuire dans le feu. Le récipient servira à garder les grains et l'eau.",
    trou: "Grâce à la ___, on peut conserver les grains dans des vases en terre cuite.",
    image: 'A',
  },
  {
    id: 'propriete', mot: 'Propriété', page: 30, aspect: 'politique', confiance: 'vert',
    def: 'Fait de posséder quelque chose.',
    cle: 'Posséder quelque chose: ce champ, cette maison, ce troupeau est à moi.',
    texte: "Une fois installées, les familles disent: « Ce champ est à nous, ce troupeau est à nous. » Ce qui appartient à quelqu'un ne peut plus être pris par un autre.",
    trou: 'Avec la sédentarisation apparaît la ___: chaque famille possède son champ.',
  },
  {
    id: 'prehistoire', mot: 'Préhistoire', aspect: 'social', confiance: 'vert',
    def: "Période de l'histoire de l'humanité comprenant l'ensemble des événements antérieurs à l'apparition de l'écriture et à l'emploi des métaux.",
    cle: "Tout ce qui s'est passé AVANT l'écriture et les métaux.",
    note: 'Avant · Fin de l\'âge de pierre',
    texte: "Cette immense période commence avec les premiers humains et se termine quand ils inventent l'écriture et commencent à utiliser les métaux.",
    trou: "La ___ se termine avec l'invention de l'écriture.",
  },
  {
    id: 'sedentarisation', mot: 'Sédentarisation', page: 12, aspect: 'social', confiance: 'vert',
    def: "Établissement de personnes sur un territoire de façon durable.",
    cle: "S'installer à un endroit pour de bon, au lieu de se déplacer.",
    texte: "Les familles arrêtent de suivre les troupeaux. Elles construisent des maisons solides, cultivent les champs autour et restent au même endroit pendant des générations.",
    trou: "La ___ est le passage de la vie nomade à la vie dans un village fixe.",
  },
  {
    id: 'sepultures', mot: 'Sépultures', page: 35, aspect: 'culturel', confiance: 'rouge',
    def: "Lieu où l'on dépose le corps d'une personne décédée.",
    cle: 'Une tombe: l\'endroit où on met le corps d\'une personne morte.',
    texte: "Les archéologues ont trouvé des squelettes placés avec soin dans le sol, entourés de bijoux et d'outils. Cela montre que les gens honoraient leurs morts.",
    trou: 'Les ___ découvertes contenaient des bijoux placés près des morts.',
  },
  {
    id: 'societe', mot: 'Société', page: 28, aspect: 'social', confiance: 'vert',
    def: "Groupe d'individus qui s'installe et vit sur un même territoire, organise ses activités pour répondre à ses besoins, développe des réseaux d'échanges durables et a des traits communs, tels que la langue et les croyances.",
    cle: 'Un groupe de gens qui vivent au même endroit, s\'organisent, échangent et partagent une langue et des croyances.',
    texte: "Des milliers de personnes vivent sur le même territoire, parlent la même langue, prient les mêmes dieux, échangent des biens et s'organisent pour répondre à leurs besoins.",
    trou: "Une ___ partage un territoire, une langue et des croyances.",
  },
  {
    id: 'subsistance', mot: 'Subsistance', page: 19, aspect: 'economique', confiance: 'jaune',
    def: "Ensemble des biens qui permettent la satisfaction des besoins alimentaires d'un individu ou d'une collectivité, permettant ainsi la survie individuelle ou collective.",
    cle: 'Ce qu\'il faut pour manger et survivre.',
    note: 'Survie',
    texte: "Chaque jour, le groupe doit trouver assez de gibier, de poissons et de baies pour que personne ne meure de faim. C'est leur priorité absolue.",
    trou: 'Les nomades se déplacent pour assurer leur ___.',
  },
  {
    id: 'tissage', mot: 'Tissage / Filage / Vannerie', page: 30, aspect: 'technique', confiance: 'jaune',
    alias: 'Tissage',
    def: "Processus de production de biens par le travail manuel de différentes fibres animales ou végétales. Les artisans créent des objets tels que des vêtements, des contenants et des matelas.",
    cle: 'Fabriquer à la main, avec des fibres (laine, plantes), des vêtements, des paniers et des matelas.',
    note: 'À la main · laine · productions = échanges',
    texte: "Avec la laine des moutons et des fibres de plantes, les artisans fabriquent à la main des tissus, des paniers et des nattes pour dormir.",
    trou: 'Le ___ permet de fabriquer des vêtements avec la laine des moutons.',
  },
  {
    id: 'troc', mot: 'Troc', page: 31, aspect: 'economique', confiance: 'vert',
    def: "Échange direct de biens ou de services contre un autre, sans faire l'usage d'une forme de monnaie.",
    cle: 'Échanger un objet contre un autre, sans argent.',
    note: 'Sans argent',
    texte: "Le potier donne trois vases au berger et reçoit en échange une chèvre. Aucune pièce de monnaie ne change de mains.",
    trou: 'Par le ___, le potier échange un vase contre un panier de blé.',
  },
];

// Images de la page 5 (A à F) — pour la question « quel mot correspond à cette image? »
export const IMAGES = {
  A: { desc: 'Des vases et des cruches en terre cuite', mot: 'poterie' },
  B: { desc: "Planche « La technologie facilite la production »: bâton à fouir, faucille, araire, houe, meule", mot: null },
  C: { desc: 'Une pierre lisse et polie en forme de hache', mot: 'neolithique' },
  D: { desc: 'Une pointe de pierre taillée à éclats (silex)', mot: 'paleolithique' },
  E: { desc: 'Une statuette de femme aux formes très rondes (Vénus)', mot: 'deesses_meres' },
  F: { desc: 'Un homme qui peint des animaux sur la paroi d\'une caverne', mot: 'peintures_rupestres' },
};

export const motById = Object.fromEntries(MOTS.map((m) => [m.id, m]));

// Pour wordMastery: chaque item a besoin d'un champ `correct` unique
export const masteryItems = MOTS.map((m) => ({ ...m, correct: m.mot }));
