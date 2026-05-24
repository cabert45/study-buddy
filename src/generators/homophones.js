// Homophones — Ryan 2e année
// Final exam item + cahier bleu homework
// Pairs: a/à, et/est, son/sont, ont/on
// Tests: substitute trick (a→avait, est→était, sont→étaient, ont→avaient, on→il)
import { withFresh } from '../utils/antiRepeat';
import { getStudyRounds } from '../utils/studyRounds';

const ruleFor = (mode, rule) => (getStudyRounds(mode) < 1 ? rule : undefined);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ===== a / à =====
// "a" = verbe avoir (3e pers. sing. présent) → remplaçable par "avait"
// "à" = préposition (indique lieu, temps, possession) → ne se remplace PAS par "avait"
const aA = [
  { sentence: 'Maman ___ une nouvelle voiture.', correct: 'a', trick: 'On peut dire "Maman AVAIT une nouvelle voiture" → c\'est le verbe AVOIR → a' },
  { sentence: 'Je vais ___ la piscine.', correct: 'à', trick: '"Je vais avait la piscine" — ça n\'a pas de sens! → préposition → à' },
  { sentence: 'Mon frère ___ huit ans.', correct: 'a', trick: '"Mon frère AVAIT huit ans" → verbe avoir → a' },
  { sentence: 'Il habite ___ Montréal.', correct: 'à', trick: '"Il habite avait Montréal" — non. C\'est un lieu → à' },
  { sentence: 'Ryan ___ un chien noir.', correct: 'a', trick: '"Ryan AVAIT un chien" → verbe avoir → a' },
  { sentence: 'Le ballon est ___ Léo.', correct: 'à', trick: '"Le ballon est avait Léo" — non. C\'est la possession → à' },
  { sentence: 'Elle ___ trouvé son livre.', correct: 'a', trick: '"Elle AVAIT trouvé" → verbe avoir → a' },
  { sentence: 'On part ___ trois heures.', correct: 'à', trick: 'Indique un temps → préposition → à' },
  { sentence: 'Ma sœur ___ fini ses devoirs.', correct: 'a', trick: '"Ma sœur AVAIT fini" → verbe avoir → a' },
  { sentence: 'Je joue ___ la balle.', correct: 'à', trick: '"Je joue avait la balle" — non → préposition → à' },
  { sentence: 'Papa ___ acheté du pain.', correct: 'a', trick: '"Papa AVAIT acheté" → verbe avoir → a' },
  { sentence: 'Nous allons ___ l\'école.', correct: 'à', trick: 'Lieu → préposition → à' },
];

// ===== et / est =====
// "et" = conjonction (= "et puis") → remplaçable par "et puis" / "aussi"
// "est" = verbe être (3e pers. sing.) → remplaçable par "était"
const etEst = [
  { sentence: 'Léo ___ très grand.', correct: 'est', trick: '"Léo ÉTAIT très grand" → verbe être → est' },
  { sentence: 'Maman ___ papa sont au parc.', correct: 'et', trick: '"Maman ET PUIS papa" → conjonction → et' },
  { sentence: 'Le ciel ___ bleu aujourd\'hui.', correct: 'est', trick: '"Le ciel ÉTAIT bleu" → verbe être → est' },
  { sentence: 'J\'ai un chien ___ un chat.', correct: 'et', trick: '"un chien ET PUIS un chat" → conjonction → et' },
  { sentence: 'Mon livre ___ sur la table.', correct: 'est', trick: '"Mon livre ÉTAIT sur la table" → verbe être → est' },
  { sentence: 'Elle court vite ___ saute haut.', correct: 'et', trick: '"vite ET PUIS saute" → conjonction → et' },
  { sentence: 'La porte ___ ouverte.', correct: 'est', trick: '"La porte ÉTAIT ouverte" → verbe être → est' },
  { sentence: 'Pain ___ beurre, c\'est bon!', correct: 'et', trick: '"Pain ET PUIS beurre" → conjonction → et' },
  { sentence: 'Mon ami ___ malade.', correct: 'est', trick: '"Mon ami ÉTAIT malade" → verbe être → est' },
  { sentence: 'Je veux du lait ___ du jus.', correct: 'et', trick: '"du lait ET PUIS du jus" → conjonction → et' },
  { sentence: 'Le chat ___ noir.', correct: 'est', trick: '"Le chat ÉTAIT noir" → verbe être → est' },
];

// ===== son / sont =====
// "son" = déterminant possessif (≈ "le sien") → suivi d'un nom
// "sont" = verbe être (3e pers. plur.) → remplaçable par "étaient"
const sonSont = [
  { sentence: 'Ryan adore ___ chien.', correct: 'son', trick: '"___ chien" = à qui? À lui → déterminant possessif → son' },
  { sentence: 'Les enfants ___ joyeux.', correct: 'sont', trick: '"Les enfants ÉTAIENT joyeux" → verbe être (pluriel) → sont' },
  { sentence: 'Voici ___ nouveau jeu.', correct: 'son', trick: '"___ nouveau jeu" = le sien → déterminant possessif → son' },
  { sentence: 'Mes amis ___ au parc.', correct: 'sont', trick: '"Mes amis ÉTAIENT au parc" → verbe être (pluriel) → sont' },
  { sentence: 'Cayla a perdu ___ crayon.', correct: 'son', trick: '"___ crayon" = à elle → déterminant possessif → son' },
  { sentence: 'Les chats ___ noirs.', correct: 'sont', trick: '"Les chats ÉTAIENT noirs" → verbe être → sont' },
  { sentence: 'Papa cherche ___ téléphone.', correct: 'son', trick: '"___ téléphone" = à lui → déterminant → son' },
  { sentence: 'Mes parents ___ gentils.', correct: 'sont', trick: '"Mes parents ÉTAIENT gentils" → verbe être → sont' },
  { sentence: 'Léo a fini ___ devoir.', correct: 'son', trick: '"___ devoir" = à lui → déterminant → son' },
  { sentence: 'Les fleurs ___ belles.', correct: 'sont', trick: '"Les fleurs ÉTAIENT belles" → verbe être → sont' },
  { sentence: 'Elle aime ___ école.', correct: 'son', trick: '"___ école" = la sienne → déterminant → son' },
];

// ===== ont / on =====
// "ont" = verbe avoir (3e pers. plur.) → remplaçable par "avaient"
// "on" = pronom (≈ "il" ou "nous") → remplaçable par "il"
const ontOn = [
  { sentence: 'Les élèves ___ fini leur travail.', correct: 'ont', trick: '"Les élèves AVAIENT fini" → verbe avoir (pluriel) → ont' },
  { sentence: '___ va au cinéma ce soir.', correct: 'on', trick: '"IL va au cinéma" → pronom → on' },
  { sentence: 'Mes amis ___ un nouveau jeu.', correct: 'ont', trick: '"Mes amis AVAIENT un jeu" → verbe avoir → ont' },
  { sentence: '___ mange à la cafétéria.', correct: 'on', trick: '"IL mange" → pronom → on' },
  { sentence: 'Les enfants ___ peur du noir.', correct: 'ont', trick: '"Les enfants AVAIENT peur" → verbe avoir → ont' },
  { sentence: 'À l\'école, ___ apprend beaucoup.', correct: 'on', trick: '"IL apprend" → pronom → on' },
  { sentence: 'Papa et maman ___ acheté un cadeau.', correct: 'ont', trick: '"Papa et maman AVAIENT acheté" → verbe avoir → ont' },
  { sentence: '___ joue dehors quand il fait beau.', correct: 'on', trick: '"IL joue dehors" → pronom → on' },
  { sentence: 'Les chats ___ des yeux verts.', correct: 'ont', trick: '"Les chats AVAIENT des yeux verts" → verbe avoir → ont' },
  { sentence: '___ a gagné le match!', correct: 'on', trick: '"IL a gagné" → pronom → on' },
  { sentence: 'Mes cousins ___ visité Paris.', correct: 'ont', trick: '"Mes cousins AVAIENT visité" → verbe avoir → ont' },
];

const allPairs = [
  { items: aA, pair: ['a', 'à'], rule: '"a" = verbe AVOIR (remplaçable par AVAIT) · "à" = préposition' },
  { items: etEst, pair: ['et', 'est'], rule: '"et" = ET PUIS (conjonction) · "est" = verbe ÊTRE (remplaçable par ÉTAIT)' },
  { items: sonSont, pair: ['son', 'sont'], rule: '"son" = LE SIEN (déterminant) · "sont" = verbe ÊTRE pluriel (remplaçable par ÉTAIENT)' },
  { items: ontOn, pair: ['ont', 'on'], rule: '"ont" = verbe AVOIR pluriel (remplaçable par AVAIENT) · "on" = IL (pronom)' },
];

const HOMOPHONES_RULE = `Le truc: remplace par un autre mot pour deviner.

a (verbe avoir) → AVAIT · à (préposition) = lieu/temps
et (= ET PUIS) · est (verbe être) → ÉTAIT
son (= LE SIEN, déterminant) · sont (verbe être pluriel) → ÉTAIENT
ont (verbe avoir pluriel) → AVAIENT · on (= IL, pronom)`;

function buildOne() {
  const group = pick(allPairs);
  const item = pick(group.items);
  // Show sentence with ___, ask to choose
  const options = shuffle([group.pair[0], group.pair[1]]);
  return {
    category: 'homophones',
    rule: ruleFor('homophones', HOMOPHONES_RULE),
    type: 'homophone_fill',
    text: `Quel mot va dans la phrase?\n\n« ${item.sentence} »`,
    correct: item.correct,
    options,
    explanation: `« ${item.sentence.replace('___', item.correct.toUpperCase())} »\n\n💡 ${item.trick}\n\nRègle: ${group.rule}`,
    hint: `Essaie de remplacer par "avait" / "était" / "et puis" / "il" pour voir lequel marche.`,
  };
}

export function generateHomophones() {
  return withFresh('homophones', buildOne, 80, 25, (q) => q.text);
}
