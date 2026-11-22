// « Le monstre du lac » — Jazz 3e année, p. 56-57 (module t2m3).
// Feuille du 23 au 27 nov. 2026, devoir de lecture: relire le texte, puis
// 1. QUI (les personnages) 2. QUOI (ce qui se passe) 3. OÙ (l'endroit)
// 4. encercler les MARQUEURS DE RELATION.
// + les deux encadrés « Lire entre les lignes » de la page (Léo est-il fier?
// Quelle émotion Magalie ressent-elle?).
//
// Le texte n'est pas recopié ici: Ryan l'a sous les yeux (cahier ou i+).
// Chaque question cite seulement la ligne dont elle parle, avec son numéro,
// pour qu'il retourne la trouver dans le texte — c'est ça, l'habileté.
// (Photos des p. 56-57 envoyées le 22 nov., lignes 1 à 55 — le texte complet.)
import { withFresh } from '../utils/antiRepeat';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const Q = [
  // --- 1. QUI ---
  { m: 1, type: 'qui', q: 'Qui raconte l\'histoire du monstre aux enfants?', correct: 'Léo', options: ['Léo', 'Magalie', 'Alexandra', 'le vieil homme autochtone'],
    why: 'Ligne 22: « — Je me souviens qu\'à cette époque, reprend Léo… » C\'est Léo qui raconte.' },
  { m: 1, type: 'qui', q: '« Mes parents, c\'est-à-dire vos arrière-grands-parents » (lignes 6-7).\nAlors Léo est… des enfants?', correct: 'le grand-père', options: ['le grand-père', 'le père', 'le frère', 'l\'oncle'],
    why: 'Les parents de Léo sont les ARRIÈRE-grands-parents des enfants. Donc Léo est leur grand-père.' },
  { m: 1, type: 'qui', q: 'Qui demande: « Mais il est où, ce camp? » (ligne 18)', correct: 'Alexandra', options: ['Alexandra', 'Magalie', 'Yolande', 'Léo'],
    why: '« — Mais il est où, ce camp? demande Alexandra, intriguée. »' },
  { m: 1, type: 'qui', q: 'Qui répond que le camp n\'existe plus (ligne 19)?', correct: 'Yolande', options: ['Yolande', 'Léo', 'Magalie', 'Alexandra'],
    why: '« — Il n\'existe plus, répond Yolande. » Elle dit « NOUS l\'avons fait démolir »: elle vit au chalet avec Léo.' },
  { m: 2, type: 'qui', q: 'Quel personnage a peur et s\'agrippe à sa couverture (lignes 33-35)?', correct: 'Magalie', options: ['Magalie', 'Alexandra', 'Léo', 'Yolande'],
    why: '« Magalie se met à frissonner. Craintive, elle s\'agrippe à sa couverture… »' },
  { m: 3, type: 'qui', q: 'Qui a raconté la légende du monstre aux parents de Léo (lignes 36-40)?', correct: 'un vieil homme d\'origine autochtone', options: ['un vieil homme d\'origine autochtone', 'les frères de Léo', 'un bûcheron', 'Yolande'],
    why: '« j\'ai surpris mes parents en pleine discussion avec un vieil homme d\'origine autochtone qui habitait tout près d\'ici. »' },
  { m: 2, type: 'qui', q: 'Qui dormait encore quand Léo s\'est levé (lignes 27-28)?', correct: 'ses frères et ses sœurs', options: ['ses frères et ses sœurs', 'ses parents', 'Magalie', 'le vieil homme'],
    why: '« Mes frères et mes sœurs étaient toujours endormis. » Les parents, eux, couraient vers le lac.' },

  // --- 2. QUOI ---
  { m: 3, type: 'quoi', q: 'De quoi parle surtout le texte?', correct: 'Léo raconte la nuit où il a vu un monstre dans le lac quand il était petit.',
    options: ['Léo raconte la nuit où il a vu un monstre dans le lac quand il était petit.', 'Des enfants construisent un chalet près du lac.', 'Magalie se perd dans la forêt la nuit.', 'Des bûcherons pêchent un gros poisson.'],
    why: 'C\'est un souvenir: Léo, enfant (« une dizaine d\'années »), a vu une créature parcourir le lac.' },
  { m: 2, type: 'quoi', q: 'Qu\'est-ce qui a réveillé Léo, vers 23 h (lignes 25-26)?', correct: 'un bruit', options: ['un bruit', 'son frère', 'la lumière', 'un téléphone'],
    why: '« Un certain soir, aux environs de 23 h, un bruit m\'a réveillé. » (Et pas un téléphone: à cette époque, il n\'y en avait pas!)' },
  { m: 2, type: 'quoi', q: 'Qu\'est-ce que Léo a vu par la fenêtre (lignes 28-32)?', correct: 'une étrange créature qui parcourait le lac', options: ['une étrange créature qui parcourait le lac', 'un bateau', 'un ours sur la plage', 'un feu de forêt'],
    why: '« je l\'ai vue moi aussi, cette étrange créature aquatique, parcourir le lac d\'est en ouest »' },
  { m: 1, type: 'quoi', q: 'Pourquoi le vieux camp de bûcherons n\'existe plus (lignes 19-21)?', correct: 'Il était trop vieux et risquait de s\'écrouler.', options: ['Il était trop vieux et risquait de s\'écrouler.', 'Le monstre l\'a détruit.', 'Il a brûlé.', 'Il a été emporté par le lac.'],
    why: '« Nous l\'avons fait démolir il y a quelques années. Il était trop vieux et risquait de s\'écrouler. »' },
  { m: 2, type: 'quoi', q: 'Que voulaient construire les parents et les oncles de Léo (lignes 22-25)?', correct: 'un nouveau chalet pour toute la famille', options: ['un nouveau chalet pour toute la famille', 'un camp de bûcherons', 'un bateau', 'un pont sur le lac'],
    why: '« Ils voulaient construire un nouveau chalet qui pourrait nous accueillir tous et nous offrir beaucoup plus de confort. »' },
  { m: 3, type: 'quoi', q: 'Selon la légende, qu\'est-ce que le monstre n\'aime pas (lignes 40-44)?', correct: 'la présence des humains', options: ['la présence des humains', 'le froid', 'les poissons', 'la lumière du jour'],
    why: '« Cette créature n\'apprécierait pas la présence des humains. »' },
  { m: 1, type: 'quoi', q: '« Ce que je vais vous raconter remonte à très longtemps, à une époque où les téléphones cellulaires… n\'existaient même pas. »\nCette histoire se passe…', correct: 'il y a très longtemps', options: ['il y a très longtemps', 'aujourd\'hui', 'hier soir', 'dans le futur'],
    why: '« remonte à très longtemps » + pas de cellulaires ni de tablettes → c\'est le passé, quand Léo était enfant.' },

  // --- 3. OÙ ---
  { m: 1, type: 'ou', q: 'Où Léo et sa famille dormaient-ils, à cette époque (lignes 12-15)?', correct: 'dans un ancien camp de bûcherons', options: ['dans un ancien camp de bûcherons', 'dans le chalet', 'sous une tente', 'dans un hôtel'],
    why: '« …dormions dans un ancien camp de bûcherons qui se trouvait un peu plus loin, là-bas. » Le chalet n\'existait pas encore.' },
  { m: 1, type: 'ou', q: '« Cette année-là, à l\'endroit où est le chalet, il n\'y avait que des… » (lignes 10-12)', correct: 'arbres', options: ['arbres', 'maisons', 'rochers', 'bateaux'],
    why: '« il n\'y avait que des arbres. » C\'était la forêt — il fallait la défricher.' },
  { m: 3, type: 'ou', q: 'Comment s\'appelle le lac du monstre (ligne 40)?', correct: 'le lac des Îles', options: ['le lac des Îles', 'le lac Saint-Jean', 'le lac Bleu', 'le lac des Monstres'],
    why: '« Ils parlaient de la légende du monstre du lac des Îles. »' },
  { m: 1, type: 'ou', q: 'Où sont Léo et les enfants pendant qu\'il raconte (regarde l\'image et le texte)?', correct: 'dehors, près d\'un feu, le soir, au chalet', options: ['dehors, près d\'un feu, le soir, au chalet', 'à l\'école', 'dans une voiture', 'au bord de la mer, le matin'],
    why: 'L\'image montre un feu, la nuit et la lune; ils sont sur le terrain du chalet (« la parcelle de terrain sur laquelle nous nous trouvons »).' },
  { m: 1, type: 'ou', q: 'Les trois amis regardent dans la direction que Léo indique. Qu\'est-ce qu\'ils voient (lignes 16-17)?', correct: 'une toute petite clairière', options: ['une toute petite clairière', 'le vieux camp', 'le monstre', 'une maison'],
    why: '« Ils n\'y voient qu\'une toute petite clairière. » Le camp a été démoli. (Une clairière = un endroit sans arbres dans la forêt.)' },

  // --- 4. MARQUEURS DE RELATION ---
  { m: 2, type: 'marqueur', q: '« Puis, je l\'ai vue moi aussi, cette étrange créature. » (ligne 30)\nQuel mot est le marqueur de relation?', correct: 'Puis', options: ['Puis', 'vue', 'étrange', 'créature'],
    why: 'PUIS lie cette phrase à la précédente: il dit ce qui arrive ENSUITE. C\'est un marqueur de relation.' },
  { m: 1, type: 'marqueur', q: '« Il était trop vieux et risquait de s\'écrouler. » (ligne 20)\nQuel mot est le marqueur de relation?', correct: 'et', options: ['et', 'trop', 'vieux', 'risquait'],
    why: 'ET relie deux idées: « il était trop vieux » ET « il risquait de s\'écrouler ».' },
  { m: 2, type: 'marqueur', q: '« Et là, j\'ai vu mes parents courir vers le lac. » (ligne 28)\nQuel mot est le marqueur de relation?', correct: 'Et', options: ['Et', 'parents', 'courir', 'lac'],
    why: 'ET relie ce moment à ce qui vient d\'être dit. Les marqueurs sont de petits mots qui font des liens.' },
  { m: 1, type: 'marqueur', q: '« Je devais alors avoir une dizaine d\'années. » (ligne 5)\nQuel mot est le marqueur de relation?', correct: 'alors', options: ['alors', 'devais', 'dizaine', 'années'],
    why: 'ALORS veut dire ici « à ce moment-là »: il fait le lien avec l\'époque dont Léo parle.' },
  { m: 2, type: 'marqueur', q: '« Ils fixaient la surface de l\'eau et semblaient stupéfaits. » (lignes 29-30)\nQuel mot est le marqueur de relation?', correct: 'et', options: ['et', 'fixaient', 'surface', 'stupéfaits'],
    why: 'ET relie deux actions des parents: ils fixaient l\'eau ET ils semblaient stupéfaits.' },
  { m: 3, type: 'marqueur', q: 'Quel groupe de mots montre que c\'est le JOUR D\'APRÈS (ligne 36)?', correct: 'Le lendemain matin', options: ['Le lendemain matin', 'reprend Léo', 'mes parents', 'en pleine discussion'],
    why: '« Le lendemain matin » = le matin du jour suivant. C\'est un marqueur de TEMPS: il dit quand ça se passe.' },
  { m: 1, type: 'marqueur', q: 'Lequel de ces mots N\'EST PAS un marqueur de relation?', correct: 'lac', options: ['lac', 'et', 'puis', 'mais'],
    why: 'LAC est un nom. ET, PUIS, MAIS sont des marqueurs: ils lient des mots ou des phrases.' },
  { m: 2, type: 'marqueur', q: '« Mes parents et mes oncles travaillaient très fort. » (lignes 22-23)\nQue fait le mot « et » dans cette phrase?', correct: 'Il relie deux groupes de personnes.', options: ['Il relie deux groupes de personnes.', 'Il dit quand ça se passe.', 'Il remplace un nom.', 'C\'est le verbe.'],
    why: '« mes parents » ET « mes oncles »: le marqueur ET les relie.' },

  // La fin du texte (lignes 45-55, photo du 22 nov.)
  { m: 3, type: 'marqueur', q: '« Il boit quelques gorgées de chocolat chaud, puis reprend son histoire. » (lignes 46-47)\nQuel mot est le marqueur de relation?', correct: 'puis', options: ['puis', 'boit', 'chocolat', 'histoire'],
    why: 'PUIS relie deux actions de Léo dans l\'ordre: il boit, PUIS il reprend son histoire.' },
  { m: 3, type: 'marqueur', q: '« De plus, ils ont tout nié à propos de la légende. » (lignes 53-54)\nQuel groupe de mots est le marqueur de relation?', correct: 'De plus', options: ['De plus', 'ils ont', 'tout nié', 'la légende'],
    why: 'DE PLUS ajoute une autre idée à la phrase d\'avant (« j\'avais probablement rêvé »).' },
  { m: 3, type: 'marqueur', q: '« Nous n\'en avons jamais reparlé, et je n\'ai jamais revu ce monstre. » (ligne 55)\nQuel mot est le marqueur de relation?', correct: 'et', options: ['et', 'jamais', 'reparlé', 'monstre'],
    why: 'ET relie les deux parties de la phrase.' },
  { m: 3, type: 'marqueur', q: 'Quel groupe de mots dit QUAND Léo a questionné ses parents (ligne 48)?', correct: 'Un peu plus tard dans la journée', options: ['Un peu plus tard dans la journée', 'à propos de cette légende', 'mes parents', 'la veille'],
    why: '« Un peu plus tard dans la journée » est un marqueur de temps: il situe le moment.' },
  { m: 3, type: 'quoi', q: 'Qu\'est-ce que les parents de Léo lui ont répondu (lignes 52-54)?', correct: 'qu\'il avait probablement rêvé', options: ['qu\'il avait probablement rêvé', 'que le monstre était réel', 'qu\'il fallait partir du chalet', 'que le vieil homme avait menti'],
    why: '« Mes parents m\'ont répondu que j\'avais probablement rêvé. De plus, ils ont tout nié à propos de la légende. »' },
  { m: 3, type: 'quoi', q: 'Comment l\'histoire se termine-t-elle (ligne 55)?', correct: 'Léo n\'a jamais revu le monstre.', options: ['Léo n\'a jamais revu le monstre.', 'Léo attrape le monstre.', 'Le monstre détruit le camp.', 'Magalie voit le monstre.'],
    why: '« Nous n\'en avons jamais reparlé, et je n\'ai jamais revu ce monstre. »' },
  { m: 3, type: 'inference', q: 'Les parents de Léo l\'avaient VU, eux aussi (lignes 28-30). Pourquoi disent-ils qu\'il a rêvé?', correct: 'Pour ne pas lui faire peur', options: ['Pour ne pas lui faire peur', 'Parce qu\'ils ont oublié', 'Parce qu\'ils dormaient', 'Parce que Léo ment toujours'],
    why: 'Ils couraient vers le lac et semblaient stupéfaits: ils l\'ont vu! S\'ils nient, c\'est sans doute pour protéger Léo — pour qu\'il n\'ait pas peur.' },
  { m: 3, type: 'quoi', q: 'Qui a écrit « Le monstre du lac »?', correct: 'Stéphanie Gervais', options: ['Stéphanie Gervais', 'Léo', 'Magalie', 'Yolande'],
    why: 'Sous le texte: « Stéphanie Gervais, Le monstre du lac, Dominique et compagnie, 2023. »' },

  // --- LIRE ENTRE LES LIGNES (les encadrés de la page) ---
  { m: 2, type: 'inference', q: 'Quelle émotion Magalie ressent-elle aux lignes 33-35?', correct: 'la peur', options: ['la peur', 'la joie', 'la colère', 'l\'ennui'],
    why: 'Les indices: elle se met à FRISSONNER, elle est CRAINTIVE, elle S\'AGRIPPE à sa couverture et regarde vers le lac. Tout ça montre la peur.' },
  { m: 2, type: 'inference', q: 'Léo est-il fier du travail de sa famille? Quel indice le montre?', correct: 'Oui: « Mes parents et mes oncles travaillaient très fort »',
    options: ['Oui: « Mes parents et mes oncles travaillaient très fort »', 'Non: « Il était trop vieux »', 'Non: « un bruit m\'a réveillé »', 'Oui: « Magalie se met à frissonner »'],
    why: 'Léo insiste: ils travaillaient TRÈS FORT pour défricher la forêt et bâtir un chalet qui accueillerait TOUTE la famille. On sent qu\'il en est fier.' },
  { m: 2, type: 'inference', q: 'Pourquoi Magalie regarde-t-elle en direction du lac (ligne 35)?', correct: 'Elle a peur que le monstre soit encore là.', options: ['Elle a peur que le monstre soit encore là.', 'Elle veut se baigner.', 'Elle cherche ses parents.', 'Elle regarde la lune.'],
    why: 'Le monstre vivrait dans ce lac « depuis la nuit des temps » — et ils sont tout près!' },

  // --- LES MOTS DU TEXTE ---
  { m: 2, type: 'mot', q: '« défricher une plus grande superficie de forêt » (ligne 23)\nDéfricher, c\'est…', correct: 'enlever les arbres pour faire de la place', options: ['enlever les arbres pour faire de la place', 'planter des arbres', 'se promener dans la forêt', 'éteindre un feu'],
    why: 'Pour construire le chalet, il fallait enlever les arbres: on DÉFRICHE le terrain.' },
  { m: 2, type: 'mot', q: '« en laissant derrière elle un énorme sillage » (ligne 32)\nUn sillage, c\'est…', correct: 'la trace que laisse dans l\'eau ce qui avance', options: ['la trace que laisse dans l\'eau ce qui avance', 'un bruit très fort', 'une grosse vague de vent', 'une île'],
    why: 'Comme derrière un bateau: l\'eau garde une trace en V. C\'est le sillage.' },
  { m: 2, type: 'mot', q: '« Ils fixaient la surface de l\'eau et semblaient stupéfaits. » Stupéfaits veut dire…', correct: 'très surpris', options: ['très surpris', 'très fatigués', 'très contents', 'très fâchés'],
    why: 'Stupéfait = tellement surpris qu\'on reste figé.' },
  { m: 1, type: 'mot', q: '« risquait de s\'écrouler » (ligne 20)\nS\'écrouler, c\'est…', correct: 'tomber en morceaux', options: ['tomber en morceaux', 'grandir', 'se cacher', 's\'endormir'],
    why: 'Un vieux bâtiment qui s\'écroule tombe par terre, en morceaux.' },
  { m: 2, type: 'mot', q: '« Craintive, elle s\'agrippe à sa couverture » — craintive veut dire…', correct: 'qui a peur', options: ['qui a peur', 'qui a froid', 'qui a faim', 'qui est fâchée'],
    why: 'Craintif, craintive vient de « crainte » = la peur.' },
];

// Le texte en trois morceaux (un par soir): lignes 1-21, 22-35, 36-55.
// « monstre_du_lac:2 » ne pose que les questions du 2e morceau.
let morceau = 0;
export function setMorceauMonstre(n) { morceau = Number(n) || 0; }
const pool = () => (morceau ? Q.filter((x) => x.m === morceau) : Q);

function construire() {
  const P = pool();
  const x = P[Math.floor(Math.random() * P.length)];
  const titre = { qui: '1. QUI?', quoi: '2. QUOI?', ou: '3. OÙ?', marqueur: '4. Marqueurs de relation', inference: 'Lire entre les lignes', mot: 'Les mots du texte' }[x.type];
  return {
    category: 'monstre_du_lac',
    type: x.type,
    text: `${titre}\n${x.q}`,
    correct: x.correct,
    options: shuffle(x.options),
    hint: { qui: 'QUI? Cherche les noms avec une majuscule, ou qui parle après le tiret (—).', ou: 'OÙ? Cherche les mots de lieu: lac, chalet, camp, forêt, fenêtre…', quoi: 'QUOI? Quelqu’un + voit / fait / veut + quelque chose. Retourne à la ligne indiquée.', marqueur: 'Un marqueur est un petit mot qui RELIE: et, puis, alors, de plus…', inference: 'Cherche les indices: « Je pense que… parce que le texte dit… »', mot: 'Relis la phrase autour du mot: qu’est-ce qui aurait du sens?' }[x.type],
    explanation: x.why,
  };
}

export const NB_QUESTIONS_MONSTRE = Q.length;

export function generateMonstreDuLac() {
  return withFresh(`monstre_du_lac${morceau || ''}`, construire, pool().length - 3, 40, (q) => q.text);
}
