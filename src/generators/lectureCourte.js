// Lectures courtes — 5 minutes par jour (le parent, 22 nov. 2026: « It's such
// a long text, and Ryan is not good at this… how can we help him? »).
//
// Le même geste que le devoir de lecture, sur des textes COURTS (5 à 8 phrases)
// qu'il n'a jamais vus: QUI, OÙ, QUOI, un MARQUEUR DE RELATION, et une question
// « entre les lignes » qui se répond avec un indice du texte. C'est la
// répétition sur du neuf qui construit l'habileté, pas un seul long texte par
// semaine.
//
// Une séance garde le MÊME texte pour ses cinq questions (il le relit, il ne
// change pas d'histoire à chaque question), puis passe au suivant.
// Textes écrits pour l'app, niveau 3e année.

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TEXTES = [
  {
    titre: 'La tempête de neige',
    texte: "Samedi matin, Félix ouvre les rideaux de sa chambre. Toute la cour est blanche! Il enfile vite son habit de neige et ses mitaines. Puis, il court chez sa voisine Rosalie. Les deux amis construisent un énorme fort derrière la maison. Quand maman les appelle pour le dîner, Félix a les joues rouges et un grand sourire.",
    q: [
      { t: 'qui', q: 'Qui construit le fort avec Félix?', c: 'Rosalie, sa voisine', o: ['Rosalie, sa voisine', 'sa maman', 'son frère', 'son chien'], w: '« il court chez sa voisine Rosalie. Les deux amis construisent… »' },
      { t: 'ou', q: 'Où construisent-ils le fort?', c: 'derrière la maison', o: ['derrière la maison', 'à l’école', 'au parc', 'dans la chambre'], w: '« un énorme fort derrière la maison »' },
      { t: 'quoi', q: 'Que se passe-t-il dans ce texte?', c: 'Félix et Rosalie jouent dans la neige et construisent un fort.', o: ['Félix et Rosalie jouent dans la neige et construisent un fort.', 'Félix est malade et reste au lit.', 'Félix va à l’école en autobus.', 'Rosalie déménage dans une autre ville.'], w: 'Quelqu’un (Félix et Rosalie) + fait (construisent) + quelque chose (un fort dans la neige).' },
      { t: 'marqueur', q: '« Puis, il court chez sa voisine Rosalie. »\nQuel mot est le marqueur de relation?', c: 'Puis', o: ['Puis', 'court', 'voisine', 'Rosalie'], w: 'PUIS dit ce qui vient ensuite: il s’habille, PUIS il court chez Rosalie.' },
      { t: 'inference', q: 'Comment se sent Félix à la fin?', c: 'content', o: ['content', 'triste', 'fâché', 'malade'], w: 'L’indice: « un grand sourire ». Les joues rouges, c’est le froid.' },
    ],
  },
  {
    titre: 'Le chiot perdu',
    texte: "Après l’école, Maya entend des petits cris près de la clôture du parc. Elle s’approche doucement et découvre un chiot tout mouillé. Il tremble et il n’a pas de collier. Maya l’enveloppe dans son foulard et l’apporte à la maison. Papa appelle la clinique vétérinaire du quartier, mais personne n’a perdu de chien. Alors, Maya demande: « Est-ce qu’on peut le garder? »",
    q: [
      { t: 'qui', q: 'Qui trouve le chiot?', c: 'Maya', o: ['Maya', 'Papa', 'le vétérinaire', 'son professeur'], w: '« Maya entend des petits cris… et découvre un chiot »' },
      { t: 'ou', q: 'Où Maya trouve-t-elle le chiot?', c: 'près de la clôture du parc', o: ['près de la clôture du parc', 'dans sa classe', 'à la clinique', 'sous son lit'], w: '« près de la clôture du parc »' },
      { t: 'quoi', q: 'Que fait Maya avec le chiot?', c: 'Elle l’enveloppe dans son foulard et l’apporte à la maison.', o: ['Elle l’enveloppe dans son foulard et l’apporte à la maison.', 'Elle le laisse au parc.', 'Elle le donne à une amie.', 'Elle le lave dans le lac.'], w: '« Maya l’enveloppe dans son foulard et l’apporte à la maison. »' },
      { t: 'marqueur', q: '« Papa appelle la clinique, mais personne n’a perdu de chien. »\nQuel mot est le marqueur de relation?', c: 'mais', o: ['mais', 'appelle', 'clinique', 'chien'], w: 'MAIS montre une idée contraire: on cherche le propriétaire, MAIS il n’y en a pas.' },
      { t: 'inference', q: 'Pourquoi le chiot tremble-t-il?', c: 'Il a froid parce qu’il est mouillé.', o: ['Il a froid parce qu’il est mouillé.', 'Il est content.', 'Il veut jouer.', 'Il a trop mangé.'], w: 'L’indice: « un chiot tout mouillé ». Quand on est mouillé, on a froid.' },
    ],
  },
  {
    titre: 'La cabane à sucre',
    texte: "Au printemps, la classe de Mme Lavoie visite une cabane à sucre. D’abord, monsieur Gagnon montre comment on récolte l’eau d’érable. Ensuite, il fait bouillir l’eau longtemps pour la transformer en sirop. Les élèves goûtent la tire sur la neige. Léa en prend trois bâtons! Dans l’autobus du retour, presque tous les enfants dorment.",
    q: [
      { t: 'qui', q: 'Qui explique comment on fait le sirop?', c: 'monsieur Gagnon', o: ['monsieur Gagnon', 'Mme Lavoie', 'Léa', 'le chauffeur'], w: '« monsieur Gagnon montre comment on récolte l’eau d’érable »' },
      { t: 'ou', q: 'Où va la classe?', c: 'à une cabane à sucre', o: ['à une cabane à sucre', 'au zoo', 'à la plage', 'au musée'], w: '« la classe de Mme Lavoie visite une cabane à sucre »' },
      { t: 'quoi', q: 'Que fait-on avec l’eau d’érable?', c: 'On la fait bouillir pour faire du sirop.', o: ['On la fait bouillir pour faire du sirop.', 'On la boit froide.', 'On arrose les arbres.', 'On la met au congélateur.'], w: '« il fait bouillir l’eau longtemps pour la transformer en sirop »' },
      { t: 'marqueur', q: 'Quel marqueur dit ce qui arrive en PREMIER?', c: 'D’abord', o: ['D’abord', 'Ensuite', 'longtemps', 'presque'], w: 'D’ABORD = en premier. ENSUITE = après. Ils mettent les étapes en ordre.' },
      { t: 'inference', q: 'Pourquoi les enfants dorment-ils dans l’autobus?', c: 'Ils sont fatigués de leur journée.', o: ['Ils sont fatigués de leur journée.', 'Il fait nuit noire.', 'Le chauffeur l’a demandé.', 'Ils sont malades.'], w: 'Une grosse journée de visite et de jeux dans la neige: ils sont fatigués.' },
    ],
  },
  {
    titre: 'Le match de hockey',
    texte: "Ce soir, les Castors jouent la finale à l’aréna. Noah est le gardien de but de l’équipe. Ses mains sont moites et son cœur bat très fort. Au troisième tiers, un joueur adverse lance la rondelle de toutes ses forces. Noah plonge et l’attrape avec sa mitaine! La foule crie et ses coéquipiers sautent sur la glace.",
    q: [
      { t: 'qui', q: 'Qui est le gardien de but?', c: 'Noah', o: ['Noah', 'un joueur adverse', 'l’entraîneur', 'la foule'], w: '« Noah est le gardien de but de l’équipe »' },
      { t: 'ou', q: 'Où se passe l’histoire?', c: 'à l’aréna', o: ['à l’aréna', 'au gymnase de l’école', 'sur un lac', 'dans la cour'], w: '« les Castors jouent la finale à l’aréna »' },
      { t: 'quoi', q: 'Que fait Noah au troisième tiers?', c: 'Il attrape la rondelle avec sa mitaine.', o: ['Il attrape la rondelle avec sa mitaine.', 'Il compte un but.', 'Il tombe et se blesse.', 'Il quitte la glace.'], w: '« Noah plonge et l’attrape avec sa mitaine! »' },
      { t: 'marqueur', q: '« Noah plonge et l’attrape avec sa mitaine. »\nQuel mot est le marqueur de relation?', c: 'et', o: ['et', 'plonge', 'attrape', 'mitaine'], w: 'ET relie deux actions: il plonge ET il attrape.' },
      { t: 'inference', q: 'Comment se sent Noah au début du match?', c: 'nerveux', o: ['nerveux', 'endormi', 'fâché', 'ennuyé'], w: 'Les indices: « mains moites », « cœur bat très fort ». C’est le stress, la nervosité.' },
    ],
  },
  {
    titre: 'Le gâteau raté',
    texte: "Pour la fête de sa mère, Samuel veut préparer un gâteau au chocolat. Il mélange la farine, les œufs et le sucre dans un grand bol. Pendant que le gâteau cuit, il joue à un jeu vidéo dans le salon. Tout à coup, une odeur de brûlé remplit la cuisine! Samuel court ouvrir le four. Le gâteau est tout noir. Il baisse la tête, les yeux pleins d’eau.",
    q: [
      { t: 'qui', q: 'Pour qui Samuel prépare-t-il le gâteau?', c: 'pour sa mère', o: ['pour sa mère', 'pour son ami', 'pour lui-même', 'pour son professeur'], w: '« Pour la fête de sa mère… »' },
      { t: 'ou', q: 'Où Samuel joue-t-il pendant que le gâteau cuit?', c: 'dans le salon', o: ['dans le salon', 'dans la cuisine', 'dehors', 'dans sa chambre'], w: '« il joue à un jeu vidéo dans le salon »' },
      { t: 'quoi', q: 'Qu’est-ce qui arrive au gâteau?', c: 'Il brûle.', o: ['Il brûle.', 'Il tombe par terre.', 'Le chien le mange.', 'Il est parfait.'], w: '« une odeur de brûlé… Le gâteau est tout noir. »' },
      { t: 'marqueur', q: 'Quel groupe de mots montre que ça arrive en MÊME TEMPS?', c: 'Pendant que', o: ['Pendant que', 'Tout à coup', 'Pour la fête', 'les yeux'], w: 'PENDANT QUE: le gâteau cuit ET, au même moment, il joue.' },
      { t: 'inference', q: 'Pourquoi le gâteau a-t-il brûlé?', c: 'Samuel jouait et l’a oublié dans le four.', o: ['Samuel jouait et l’a oublié dans le four.', 'Il a mis trop de sucre.', 'Sa mère l’a fait cuire.', 'Le four était éteint.'], w: 'L’indice: « pendant que le gâteau cuit, il joue à un jeu vidéo ». Il n’a pas surveillé.' },
    ],
  },
  {
    titre: 'La sortie au musée',
    texte: "Jeudi, la classe de Ryan visite le musée des dinosaures, à Montréal. Dans la grande salle, un squelette de tyrannosaure touche presque le plafond. Zoé recule de deux pas. « Il est mort depuis des millions d’années », lui dit le guide en souriant. Ensuite, les élèves fouillent dans un bac de sable, comme de vrais paléontologues. Ryan trouve une dent en plastique!",
    q: [
      { t: 'qui', q: 'Qui parle à Zoé en souriant?', c: 'le guide', o: ['le guide', 'Ryan', 'un dinosaure', 'son professeur'], w: '« lui dit le guide en souriant »' },
      { t: 'ou', q: 'Où va la classe?', c: 'au musée des dinosaures', o: ['au musée des dinosaures', 'au zoo', 'à la bibliothèque', 'à la plage'], w: '« visite le musée des dinosaures, à Montréal »' },
      { t: 'quoi', q: 'Que font les élèves après avoir vu le squelette?', c: 'Ils fouillent dans un bac de sable.', o: ['Ils fouillent dans un bac de sable.', 'Ils mangent leur dîner.', 'Ils rentrent à l’école.', 'Ils dessinent un dinosaure.'], w: '« Ensuite, les élèves fouillent dans un bac de sable »' },
      { t: 'marqueur', q: '« Ensuite, les élèves fouillent dans un bac de sable. »\nQuel mot est le marqueur de relation?', c: 'Ensuite', o: ['Ensuite', 'élèves', 'fouillent', 'sable'], w: 'ENSUITE dit ce qui vient après.' },
      { t: 'inference', q: 'Pourquoi Zoé recule-t-elle?', c: 'Elle a un peu peur du grand squelette.', o: ['Elle a un peu peur du grand squelette.', 'Elle a froid.', 'Elle veut partir.', 'Elle cherche Ryan.'], w: 'Le squelette est énorme (il touche presque le plafond) et le guide la rassure: elle a eu peur.' },
    ],
  },
  {
    titre: 'Le nouveau voisin',
    texte: "Un camion de déménagement s’arrête devant la maison d’à côté. Un garçon de l’âge d’Arthur descend avec un ballon de soccer sous le bras. Arthur le regarde par la fenêtre, mais il n’ose pas sortir. Le lendemain, le garçon frappe à sa porte. « Salut! Je m’appelle Karim. Veux-tu jouer au soccer? » Arthur sourit et attrape ses espadrilles.",
    q: [
      { t: 'qui', q: 'Comment s’appelle le nouveau voisin?', c: 'Karim', o: ['Karim', 'Arthur', 'Noah', 'Félix'], w: '« Je m’appelle Karim. »' },
      { t: 'ou', q: 'Où Arthur regarde-t-il le garçon la première fois?', c: 'par la fenêtre', o: ['par la fenêtre', 'à l’école', 'au parc', 'dans le camion'], w: '« Arthur le regarde par la fenêtre »' },
      { t: 'quoi', q: 'Que se passe-t-il dans ce texte?', c: 'Un nouveau voisin arrive et invite Arthur à jouer.', o: ['Un nouveau voisin arrive et invite Arthur à jouer.', 'Arthur déménage.', 'Arthur perd son ballon.', 'Karim se fâche contre Arthur.'], w: 'Karim (quelqu’un) + invite (fait) + Arthur à jouer au soccer.' },
      { t: 'marqueur', q: 'Quel groupe de mots dit que c’est le JOUR SUIVANT?', c: 'Le lendemain', o: ['Le lendemain', 'par la fenêtre', 'sous le bras', 'de l’âge'], w: 'LE LENDEMAIN = le jour d’après. C’est un marqueur de temps.' },
      { t: 'inference', q: 'Pourquoi Arthur n’ose-t-il pas sortir au début?', c: 'Il est gêné.', o: ['Il est gêné.', 'Il est malade.', 'Il pleut.', 'Il n’aime pas le soccer.'], w: '« il n’ose pas »: il est timide, gêné. À la fin, il accepte avec un sourire.' },
    ],
  },
  {
    titre: 'La panne d’électricité',
    texte: "Pendant le souper, toutes les lumières de la maison s’éteignent d’un coup. Il fait noir comme dans un four! Nina se serre contre son grand-père. Celui-ci allume une lampe de poche, puis il sort des bougies du tiroir. Toute la famille s’installe dans le salon pour jouer aux cartes. Finalement, Nina trouve que c’est la meilleure soirée de la semaine.",
    q: [
      { t: 'qui', q: 'Qui allume la lampe de poche?', c: 'le grand-père de Nina', o: ['le grand-père de Nina', 'Nina', 'sa mère', 'un électricien'], w: '« Nina se serre contre son grand-père. Celui-ci allume une lampe de poche » — CELUI-CI, c’est le grand-père.' },
      { t: 'ou', q: 'Où la famille joue-t-elle aux cartes?', c: 'dans le salon', o: ['dans le salon', 'dans la cuisine', 'dehors', 'chez la voisine'], w: '« Toute la famille s’installe dans le salon »' },
      { t: 'quoi', q: 'Qu’est-ce qui arrive pendant le souper?', c: 'Il y a une panne d’électricité.', o: ['Il y a une panne d’électricité.', 'Le souper brûle.', 'Un ami arrive.', 'Il neige dans la maison.'], w: '« toutes les lumières de la maison s’éteignent d’un coup »' },
      { t: 'marqueur', q: 'Quel mot montre que c’est la FIN de l’histoire?', c: 'Finalement', o: ['Finalement', 'Pendant', 'puis', 'Toute'], w: 'FINALEMENT = à la fin.' },
      { t: 'inference', q: 'Comment se sent Nina quand les lumières s’éteignent?', c: 'Elle a peur.', o: ['Elle a peur.', 'Elle est contente.', 'Elle est fâchée.', 'Elle a faim.'], w: 'L’indice: « Nina se serre contre son grand-père ». On fait ça quand on a peur.' },
    ],
  },
  {
    titre: 'Le concours de dessin',
    texte: "La bibliothèque du quartier organise un concours de dessin sur le thème de l’hiver. Élise dessine un bonhomme de neige avec un foulard rouge. Son frère Thomas, lui, dessine une bataille de boules de neige. Ils remettent leurs dessins vendredi. Une semaine plus tard, la bibliothécaire téléphone: Thomas a gagné le premier prix! Élise le félicite, même si elle aurait aimé gagner, elle aussi.",
    q: [
      { t: 'qui', q: 'Qui gagne le premier prix?', c: 'Thomas', o: ['Thomas', 'Élise', 'la bibliothécaire', 'personne'], w: '« Thomas a gagné le premier prix! »' },
      { t: 'ou', q: 'Où a lieu le concours?', c: 'à la bibliothèque du quartier', o: ['à la bibliothèque du quartier', 'à l’école', 'au musée', 'à l’aréna'], w: '« La bibliothèque du quartier organise un concours »' },
      { t: 'quoi', q: 'Que dessine Élise?', c: 'un bonhomme de neige avec un foulard rouge', o: ['un bonhomme de neige avec un foulard rouge', 'une bataille de boules de neige', 'un sapin de Noël', 'un traîneau'], w: '« Élise dessine un bonhomme de neige avec un foulard rouge »' },
      { t: 'marqueur', q: 'Quel groupe de mots dit QUAND la bibliothécaire téléphone?', c: 'Une semaine plus tard', o: ['Une semaine plus tard', 'sur le thème', 'le premier prix', 'elle aussi'], w: 'UNE SEMAINE PLUS TARD situe le moment: c’est un marqueur de temps.' },
      { t: 'inference', q: 'Comment se sent Élise quand Thomas gagne?', c: 'contente pour lui, mais un peu déçue', o: ['contente pour lui, mais un peu déçue', 'très fâchée', 'elle s’en moque', 'elle a peur'], w: 'Elle le FÉLICITE (contente pour lui), « même si elle aurait aimé gagner » (un peu déçue). Les deux en même temps!' },
    ],
  },
  {
    titre: 'Le camp de jour',
    texte: "Cet été, Léon va au camp de jour pour la première fois. Le premier matin, il ne connaît personne et il reste près de la porte. Une animatrice s’approche et lui demande son nom. Elle le présente à un groupe qui joue au ballon-chasseur. À midi, Léon mange avec ses nouveaux amis. Le soir, il raconte tout à sa mère, sans même reprendre son souffle!",
    q: [
      { t: 'qui', q: 'Qui aide Léon le premier matin?', c: 'une animatrice', o: ['une animatrice', 'sa mère', 'son frère', 'le directeur'], w: '« Une animatrice s’approche et lui demande son nom »' },
      { t: 'ou', q: 'Où va Léon cet été?', c: 'au camp de jour', o: ['au camp de jour', 'à l’école', 'chez sa grand-mère', 'au chalet'], w: '« Léon va au camp de jour pour la première fois »' },
      { t: 'quoi', q: 'Que se passe-t-il pour Léon pendant la journée?', c: 'Il se fait de nouveaux amis.', o: ['Il se fait de nouveaux amis.', 'Il se blesse.', 'Il retourne à la maison.', 'Il perd son lunch.'], w: '« À midi, Léon mange avec ses nouveaux amis. »' },
      { t: 'marqueur', q: '« Une animatrice s’approche et lui demande son nom. »\nQuel mot est le marqueur de relation?', c: 'et', o: ['et', 'animatrice', 'approche', 'nom'], w: 'ET relie deux actions de l’animatrice.' },
      { t: 'inference', q: 'Comment Léon trouve-t-il sa journée, le soir?', c: 'Il l’a adorée.', o: ['Il l’a adorée.', 'Il l’a détestée.', 'Il ne s’en souvient pas.', 'Il était malade.'], w: 'L’indice: il raconte TOUT « sans même reprendre son souffle »: il est tellement content qu’il parle vite.' },
    ],
  },
];

const TITRE = { qui: 'QUI?', ou: 'OÙ?', quoi: 'QUOI?', marqueur: 'Marqueur de relation', inference: 'Entre les lignes' };
const INDICE = {
  qui: 'Cherche les noms avec une majuscule.',
  ou: 'Cherche les mots de lieu.',
  quoi: 'Quelqu’un + fait / voit / veut + quelque chose.',
  marqueur: 'Un petit mot qui relie: et, puis, mais, ensuite, d’abord…',
  inference: 'Cherche l’indice: « Je pense que… parce que le texte dit… »',
};

// Le texte courant et ses questions restantes; on garde l'ordre des textes
// mélangé une fois pour que chaque séance en apporte un nouveau.
let ordre = shuffle(TEXTES.map((_, i) => i));
let pos = 0;
let reste = [];
function prochaineQuestion() {
  if (!reste.length) {
    const T = TEXTES[ordre[pos % ordre.length]];
    pos++;
    if (pos % ordre.length === 0) ordre = shuffle(ordre);
    // L'ordre de la méthode: qui, où, quoi, marqueur, entre les lignes.
    reste = T.q.map((x) => ({ ...x, T }));
  }
  return reste.shift();
}

export const NB_TEXTES_COURTS = TEXTES.length;

export function generateLectureCourte() {
  const x = prochaineQuestion();
  return {
    category: 'lecture_courte',
    type: x.t,
    text: `📖 ${x.T.titre}\n\n${x.T.texte}\n\n${TITRE[x.t]} ${x.q}`,
    correct: x.c,
    options: shuffle(x.o),
    hint: INDICE[x.t],
    explanation: x.w,
  };
}

export default generateLectureCourte;
