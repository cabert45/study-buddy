// Compréhension de lecture — Ryan 2e année (Pomélo p.26-27)
// Final exam: Vendredi 5 juin 2026
// Format: short passage (50-100 words) + a question about it.
// Tests literal recall, detail, inference, and vocab-in-context.
import { withFresh } from '../utils/antiRepeat';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const passages = [
  {
    title: 'Le chat de Léa',
    text: `Léa a un petit chat noir qui s'appelle Minou. Chaque matin, Minou saute sur le lit de Léa pour la réveiller. Léa lui donne du lait et des croquettes. Ensuite, ils jouent ensemble avec une balle rouge. Léa adore son chat plus que tout.`,
    questions: [
      { q: 'Comment s\'appelle le chat de Léa?', correct: 'Minou', options: ['Minou', 'Mimi', 'Léa', 'Moustache'], why: 'Le texte dit: "un petit chat noir qui s\'appelle Minou".' },
      { q: 'De quelle couleur est le chat?', correct: 'noir', options: ['noir', 'blanc', 'roux', 'gris'], why: 'Le texte dit: "un petit chat noir".' },
      { q: 'Quand est-ce que Minou réveille Léa?', correct: 'le matin', options: ['le matin', 'le soir', 'la nuit', 'à midi'], why: 'Le texte dit: "Chaque matin, Minou saute sur le lit".' },
      { q: 'Avec quoi jouent-ils ensemble?', correct: 'une balle rouge', options: ['une balle rouge', 'une corde', 'une souris en peluche', 'un bâton'], why: 'Le texte dit: "ils jouent ensemble avec une balle rouge".' },
      { q: 'Que ressent Léa pour son chat?', correct: 'Elle l\'adore', options: ['Elle l\'adore', 'Elle en a peur', 'Elle ne l\'aime pas', 'Elle est jalouse'], why: 'Le texte dit: "Léa adore son chat plus que tout".' },
    ],
  },
  {
    title: 'La promenade au parc',
    text: `Samedi, Tom et son grand-père sont allés au parc. Il faisait beau et chaud. Ils ont mangé une crème glacée au chocolat. Après, Tom a fait du vélo pendant que grand-père lisait son journal sur un banc. Le soir, Tom était fatigué mais content.`,
    questions: [
      { q: 'Quel jour Tom est-il allé au parc?', correct: 'samedi', options: ['samedi', 'dimanche', 'lundi', 'vendredi'], why: 'Le texte commence par: "Samedi, Tom et son grand-père sont allés au parc".' },
      { q: 'Avec qui Tom est-il allé au parc?', correct: 'son grand-père', options: ['son grand-père', 'sa mère', 'son ami', 'son chien'], why: 'Le texte dit: "Tom et son grand-père sont allés au parc".' },
      { q: 'Quel goût avait la crème glacée?', correct: 'chocolat', options: ['chocolat', 'vanille', 'fraise', 'citron'], why: 'Le texte dit: "une crème glacée au chocolat".' },
      { q: 'Quel temps faisait-il?', correct: 'beau et chaud', options: ['beau et chaud', 'froid et pluvieux', 'neigeux', 'venteux'], why: 'Le texte dit: "Il faisait beau et chaud".' },
      { q: 'Pourquoi Tom était-il fatigué le soir?', correct: 'Il avait fait du vélo', options: ['Il avait fait du vélo', 'Il avait beaucoup mangé', 'Il avait lu un journal', 'Il avait dormi'], why: 'Tom a fait du vélo au parc — c\'est ça qui l\'a fatigué.' },
    ],
  },
  {
    title: 'La graine magique',
    text: `Lili a planté une petite graine dans un pot. Tous les jours, elle l'arrose avec soin. Après deux semaines, une jolie fleur jaune est apparue. Lili est très fière. Elle montre sa fleur à sa maman qui sourit. Maintenant, Lili veut planter d'autres graines partout dans le jardin.`,
    questions: [
      { q: 'Qu\'est-ce que Lili a planté?', correct: 'une graine', options: ['une graine', 'un arbre', 'un légume', 'une racine'], why: 'Le texte dit: "Lili a planté une petite graine".' },
      { q: 'Combien de temps a-t-il fallu pour voir la fleur?', correct: 'deux semaines', options: ['deux semaines', 'deux jours', 'deux mois', 'deux ans'], why: 'Le texte dit: "Après deux semaines, une jolie fleur jaune est apparue".' },
      { q: 'De quelle couleur est la fleur?', correct: 'jaune', options: ['jaune', 'rouge', 'bleue', 'blanche'], why: 'Le texte dit: "une jolie fleur jaune".' },
      { q: 'Pourquoi la fleur a-t-elle poussé?', correct: 'Parce que Lili l\'a arrosée', options: ['Parce que Lili l\'a arrosée', 'Parce qu\'il a plu', 'Parce qu\'il faisait soleil', 'Toute seule, par magie'], why: 'Le texte dit: "Tous les jours, elle l\'arrose avec soin" — c\'est ça qui fait pousser la fleur.' },
      { q: 'Que veut faire Lili maintenant?', correct: 'Planter d\'autres graines', options: ['Planter d\'autres graines', 'Couper la fleur', 'Vendre la fleur', 'Manger la fleur'], why: 'Le texte dit: "Maintenant, Lili veut planter d\'autres graines partout dans le jardin".' },
    ],
  },
  {
    title: 'Le hibou de la nuit',
    text: `Le hibou est un oiseau qui dort le jour et chasse la nuit. Il a de grands yeux pour bien voir dans le noir. Quand il vole, on ne l'entend presque pas. Le hibou mange des petites souris et des insectes. C'est un animal très utile pour les fermiers.`,
    questions: [
      { q: 'Quand est-ce que le hibou dort?', correct: 'le jour', options: ['le jour', 'la nuit', 'le matin seulement', 'jamais'], why: 'Le texte dit: "Le hibou est un oiseau qui dort le jour".' },
      { q: 'Pourquoi le hibou a de grands yeux?', correct: 'Pour bien voir dans le noir', options: ['Pour bien voir dans le noir', 'Pour faire peur', 'Pour pleurer', 'Pour mieux dormir'], why: 'Le texte dit: "Il a de grands yeux pour bien voir dans le noir".' },
      { q: 'Que mange le hibou?', correct: 'Des souris et des insectes', options: ['Des souris et des insectes', 'Des fruits et des légumes', 'Des poissons', 'Du pain'], why: 'Le texte dit: "Le hibou mange des petites souris et des insectes".' },
      { q: 'Pourquoi le hibou est-il utile pour les fermiers?', correct: 'Il mange les souris (nuisibles)', options: ['Il mange les souris (nuisibles)', 'Il donne du lait', 'Il garde les moutons', 'Il fait peur aux voleurs'], why: 'Les fermiers n\'aiment pas les souris — le hibou les mange, donc il les aide.' },
      { q: 'Que veut dire "on ne l\'entend presque pas"?', correct: 'Il fait très peu de bruit', options: ['Il fait très peu de bruit', 'Il crie très fort', 'Il chante toujours', 'Il parle français'], why: 'Le hibou vole en silence — c\'est pourquoi on ne l\'entend pas.' },
    ],
  },
  {
    title: 'L\'anniversaire de Sara',
    text: `Aujourd'hui, c'est l'anniversaire de Sara. Elle a sept ans. Sa maman a préparé un gros gâteau au chocolat avec des bougies. Tous ses amis sont venus chez elle. Ils ont chanté, joué et mangé du gâteau. Sara a reçu un beau cadeau: un vélo rose tout neuf!`,
    questions: [
      { q: 'Quel âge a Sara?', correct: 'sept ans', options: ['sept ans', 'six ans', 'huit ans', 'cinq ans'], why: 'Le texte dit: "Elle a sept ans".' },
      { q: 'Qui a préparé le gâteau?', correct: 'Sa maman', options: ['Sa maman', 'Son papa', 'Sara elle-même', 'Sa grand-mère'], why: 'Le texte dit: "Sa maman a préparé un gros gâteau".' },
      { q: 'Quel goût avait le gâteau?', correct: 'chocolat', options: ['chocolat', 'vanille', 'fraise', 'citron'], why: 'Le texte dit: "un gros gâteau au chocolat".' },
      { q: 'Qu\'a reçu Sara comme cadeau?', correct: 'Un vélo rose', options: ['Un vélo rose', 'Une poupée', 'Un livre', 'Un chat'], why: 'Le texte dit: "un beau cadeau: un vélo rose tout neuf!".' },
      { q: 'Pourquoi tous les amis sont-ils venus?', correct: 'Pour fêter l\'anniversaire', options: ['Pour fêter l\'anniversaire', 'Pour faire les devoirs', 'Pour jouer dehors', 'Pour regarder la télé'], why: 'C\'est l\'anniversaire de Sara — les amis sont là pour la fête.' },
    ],
  },
  {
    title: 'Une journée à la ferme',
    text: `Pendant les vacances, Mathis a visité la ferme de son oncle. Il a vu des vaches, des moutons et des poules. L'oncle lui a appris à traire une vache. C'était difficile au début! Mathis a aussi ramassé des œufs frais dans le poulailler. Le soir, il a goûté au lait tout chaud. Quel beau souvenir!`,
    questions: [
      { q: 'Où est allé Mathis pendant les vacances?', correct: 'À la ferme de son oncle', options: ['À la ferme de son oncle', 'À la plage', 'Au zoo', 'Chez sa grand-mère'], why: 'Le texte dit: "Mathis a visité la ferme de son oncle".' },
      { q: 'Quels animaux a-t-il vus?', correct: 'Vaches, moutons, poules', options: ['Vaches, moutons, poules', 'Lions et tigres', 'Chiens et chats', 'Poissons et oiseaux'], why: 'Le texte dit: "Il a vu des vaches, des moutons et des poules".' },
      { q: 'Qu\'est-ce que son oncle lui a appris?', correct: 'À traire une vache', options: ['À traire une vache', 'À monter à cheval', 'À conduire un tracteur', 'À faire du pain'], why: 'Le texte dit: "L\'oncle lui a appris à traire une vache".' },
      { q: 'Où Mathis a-t-il ramassé les œufs?', correct: 'Dans le poulailler', options: ['Dans le poulailler', 'Dans la cuisine', 'Dans le champ', 'Dans le jardin'], why: 'Le texte dit: "ramassé des œufs frais dans le poulailler".' },
      { q: 'Comment Mathis a-t-il trouvé son expérience?', correct: 'C\'était un beau souvenir', options: ['C\'était un beau souvenir', 'Il s\'est ennuyé', 'Il a eu peur', 'Il était déçu'], why: 'Le texte se termine par: "Quel beau souvenir!".' },
    ],
  },
  {
    title: 'La tempête de neige',
    text: `Hier soir, une grosse tempête de neige est tombée sur le village. Ce matin, tout est blanc. Les voitures sont presque enterrées sous la neige. L'école est fermée à cause de la tempête. Les enfants sont contents: ils peuvent faire un bonhomme de neige et glisser en traîneau. Quelle belle journée!`,
    questions: [
      { q: 'Quand est tombée la tempête?', correct: 'Hier soir', options: ['Hier soir', 'Ce matin', 'La semaine dernière', 'Demain'], why: 'Le texte commence par: "Hier soir, une grosse tempête de neige est tombée".' },
      { q: 'Pourquoi l\'école est-elle fermée?', correct: 'À cause de la tempête', options: ['À cause de la tempête', 'C\'est un jour de congé', 'Les profs sont malades', 'C\'est l\'été'], why: 'Le texte dit: "L\'école est fermée à cause de la tempête".' },
      { q: 'Pourquoi les enfants sont-ils contents?', correct: 'Ils peuvent jouer dans la neige', options: ['Ils peuvent jouer dans la neige', 'Il fait chaud', 'C\'est leur anniversaire', 'Ils vont à la plage'], why: 'L\'école est fermée et il y a de la neige — ils peuvent jouer dehors.' },
      { q: 'Que veulent faire les enfants?', correct: 'Un bonhomme de neige et du traîneau', options: ['Un bonhomme de neige et du traîneau', 'Du vélo', 'De la natation', 'Un pique-nique'], why: 'Le texte dit: "ils peuvent faire un bonhomme de neige et glisser en traîneau".' },
      { q: 'Que veut dire "presque enterrées sous la neige"?', correct: 'Couvertes par beaucoup de neige', options: ['Couvertes par beaucoup de neige', 'Cassées en morceaux', 'Très propres', 'Toutes neuves'], why: 'La neige a recouvert les voitures — on les voit à peine.' },
    ],
  },
  {
    title: 'Le grand voyage',
    text: `La famille Tremblay part en voyage demain. Ils vont à la mer pendant une semaine. Papa a préparé la voiture. Maman a fait les valises. Les enfants, Marie et Léo, ont apporté leurs maillots de bain et leurs jouets de plage. Tout le monde est très excité. Marie a même dessiné une carte du voyage!`,
    questions: [
      { q: 'Quand la famille part-elle?', correct: 'Demain', options: ['Demain', 'Aujourd\'hui', 'La semaine prochaine', 'Hier'], why: 'Le texte dit: "La famille Tremblay part en voyage demain".' },
      { q: 'Où vont-ils?', correct: 'À la mer', options: ['À la mer', 'À la montagne', 'En ville', 'À la campagne'], why: 'Le texte dit: "Ils vont à la mer".' },
      { q: 'Combien de temps va durer le voyage?', correct: 'Une semaine', options: ['Une semaine', 'Un jour', 'Un mois', 'Une année'], why: 'Le texte dit: "Ils vont à la mer pendant une semaine".' },
      { q: 'Qu\'ont apporté les enfants?', correct: 'Maillots et jouets de plage', options: ['Maillots et jouets de plage', 'Des livres d\'école', 'Des bottes de neige', 'Des skis'], why: 'Le texte dit: "leurs maillots de bain et leurs jouets de plage".' },
      { q: 'Qui a fait les valises?', correct: 'Maman', options: ['Maman', 'Papa', 'Marie', 'Léo'], why: 'Le texte dit: "Maman a fait les valises".' },
    ],
  },
];

function buildOne() {
  const passage = pick(passages);
  const question = pick(passage.questions);
  return {
    category: 'comprehension',
    type: 'reading',
    text: `📖 ${passage.title}\n\n${passage.text}\n\n❓ ${question.q}`,
    correct: question.correct,
    options: shuffle(question.options),
    explanation: question.why,
    hint: 'Relis le texte attentivement et cherche la réponse dans les phrases.',
  };
}

export function generateComprehension() {
  return withFresh('comprehension', buildOne, 60, 20, (q) => q.text);
}
