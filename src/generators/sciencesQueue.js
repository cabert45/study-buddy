// Sciences — « Pourquoi certains animaux ont-ils une queue? »
// Éclair de génie 3e, Étape 1, p. 3 à 12. Mini-test le jeudi 15 oct. 2026.
//
// L'app n'avait AUCUN contenu de sciences. Le parent a apporté les pages le
// 11 oct. au soir: « prepare the exercise for Ryan so he can pass his test
// this week ».
//
// Les poids suivent SES erreurs, pas le plan du cahier (voir
// data/sciencesVertebres.js pour le détail):
//   • les amphibiens, la classe qu'il a oubliée page 4;
//   • « ils sont tous des vertébrés », la réponse centrale qu'il a ratée;
//   • déplacement ≠ utilité de la queue, les deux listes qu'il a fusionnées.
import { pickAdaptive } from '../utils/skillStats';
import { CLASSES, INVERTEBRES, UTILITES, DEPLACEMENTS, DEMARCHE, PARTAGES } from '../data/sciencesVertebres';

const CATEGORY = 'sciences_queue';

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const uniques = (arr) => arr.filter((v, i, a) => a.indexOf(v) === i);
function quatre(bonne, leurres) { return shuffle(uniques([bonne, ...leurres]).slice(0, 4)); }

const NOMS_CLASSES = CLASSES.map((c) => c.nom);

// ===== 1. À quelle classe appartient cet animal? =====
// C'est la question 1 du Bilan (p. 12): associer chaque vertébré à sa classe.
function classeAnimal() {
  // Les amphibiens sortent plus souvent: c'est la classe qu'il a oubliée.
  const c = Math.random() < 0.3
    ? CLASSES.find((x) => x.id === 'amphibiens')
    : pick(CLASSES);
  const animal = pick(c.animaux);
  return {
    category: CATEGORY,
    type: 'classe_animal',
    text: `À quelle classe de vertébrés appartient ${animal}?`,
    correct: c.nom,
    options: shuffle(NOMS_CLASSES),
    explanation: `${animal.charAt(0).toUpperCase() + animal.slice(1)} fait partie ${c.nom.replace(/^les /, 'des ')}.\n\n`
      + `Comment on le reconnaît: ${c.signe}.\n\n`
      + c.traits.map((t) => `• ${t}`).join('\n'),
    hint: 'Pense à sa peau: des poils, des plumes, des écailles, ou lisse et humide?',
  };
}

// ===== 2. Quelle caractéristique va avec quelle classe? =====
function caracteristique() {
  const c = Math.random() < 0.3
    ? CLASSES.find((x) => x.id === 'amphibiens')
    : pick(CLASSES);
  // Seulement un trait DISTINCTIF: « Ils pondent des œufs » irait à quatre
  // classes sur cinq, et la question n'aurait pas de bonne réponse.
  const trait = pick(c.distinctifs);
  return {
    category: CATEGORY,
    type: 'caracteristique',
    text: `« ${trait} » — de quelle classe parle-t-on?`,
    correct: c.nom,
    options: shuffle(NOMS_CLASSES),
    explanation: `${c.nom.charAt(0).toUpperCase() + c.nom.slice(1)}.\n\n`
      + c.traits.map((x) => `• ${x}`).join('\n'),
    hint: 'Relis la caractéristique: elle décrit la peau, les petits, ou la façon de respirer.',
  };
}

// ===== 2b. Ce que PLUSIEURS classes ont en commun =====
// « Ils pondent des œufs » ne désigne personne en particulier — mais c'est
// exactement le genre de piquère qu'un test pose. On la pose à l'endroit.
function partage() {
  const p = pick(PARTAGES);
  if (p.sauf) {
    return {
      category: CATEGORY,
      type: 'partage',
      text: `Quelle est la SEULE classe de vertébrés qui ne pond PAS d'œufs?`,
      correct: p.sauf,
      options: shuffle(NOMS_CLASSES),
      explanation: `${p.sauf.charAt(0).toUpperCase() + p.sauf.slice(1)}.\n\n`
        + `Quatre classes sur cinq pondent des œufs: ${p.qui.join(', ')}.\n`
        + 'Les mammifères, eux, ne pondent pas: leurs bébés naissent du ventre de leur mère, '
        + 'et les femelles les allaitent.',
      hint: 'Pense à la souris et à la vache: est-ce qu’elles pondent?',
    };
  }
  return {
    category: CATEGORY,
    type: 'partage',
    text: 'Deux classes de vertébrés ont des écailles. Lesquelles?',
    correct: 'les reptiles et les poissons',
    options: shuffle(['les reptiles et les poissons', 'les reptiles et les amphibiens',
      'les poissons et les amphibiens', 'les oiseaux et les reptiles']),
    explanation: 'Les reptiles et les poissons.\n\n'
      + 'Le serpent et la tortue (reptiles) ont des écailles, et le poisson aussi.\n'
      + 'Attention: avoir des écailles ne suffit donc pas à reconnaître la classe. '
      + 'Le reptile a la peau SÈCHE, le poisson a des BRANCHIES et des NAGEOIRES.',
    hint: 'Le serpent, la tortue… et quoi d’autre dans l’eau?',
  };
}

// ===== 3. Les amphibiens, la classe oubliée =====
// Page 4 question 2, il a coché 4 classes sur 5. Celle-ci revient le nommer.
function cinqClasses() {
  const genre = pick(['laquelle_pas', 'combien', 'manquante', 'invertebre_pas_classe']);
  if (genre === 'combien') {
    return {
      category: CATEGORY,
      type: 'cinq_classes',
      text: 'Combien y a-t-il de classes de vertébrés?',
      correct: '5',
      options: ['3', '4', '5', '6'],
      explanation: '5 classes.\n\n'
        + NOMS_CLASSES.map((n) => `• ${n}`).join('\n')
        + "\n\nCelle qu'on oublie le plus souvent, ce sont LES AMPHIBIENS (la grenouille).",
      hint: 'Compte-les: mammifères, reptiles, oiseaux, poissons… et?',
    };
  }
  if (genre === 'manquante') {
    const manquante = pick(CLASSES);
    const montrees = NOMS_CLASSES.filter((n) => n !== manquante.nom);
    return {
      category: CATEGORY,
      type: 'cinq_classes',
      text: `Voici quatre classes de vertébrés: ${montrees.join(', ')}. Quelle classe MANQUE?`,
      correct: manquante.nom,
      options: shuffle(NOMS_CLASSES),
      explanation: `Il manque ${manquante.nom}.\n\n`
        + 'Les 5 classes: ' + NOMS_CLASSES.join(', ') + '.',
      hint: 'Relis la liste et compare avec les cinq que tu connais.',
    };
  }
  if (genre === 'invertebre_pas_classe') {
    return {
      category: CATEGORY,
      type: 'cinq_classes',
      text: 'Lequel n’est PAS une classe de vertébrés?',
      correct: 'les invertébrés',
      options: shuffle(['les invertébrés', 'les amphibiens', 'les reptiles', 'les poissons']),
      explanation: 'Les invertébrés.\n\n'
        + "Un invertébré n'a PAS de colonne vertébrale — ce n'est donc pas une classe de "
        + "vertébrés, c'est tout le contraire.\n"
        + 'Les 5 classes de vertébrés: ' + NOMS_CLASSES.join(', ') + '.',
      hint: 'Le mot contient « in- »: ça veut dire « sans ».',
    };
  }
  const intrus = pick(['les insectes', 'les invertébrés', 'les mollusques', 'les arachnides']);
  return {
    category: CATEGORY,
    type: 'cinq_classes',
    text: `« ${intrus} » — est-ce une classe de vertébrés?`,
    correct: 'Non',
    options: ['Oui', 'Non'],
    explanation: `Non.\n\nLes 5 classes de vertébrés sont: ${NOMS_CLASSES.join(', ')}.\n`
      + `« ${intrus} » n'en fait pas partie.`,
    hint: 'Récite les cinq classes dans ta tête avant de répondre.',
  };
}

// ===== 4. Vertébré ou invertébré? =====
function vertebreOuNon() {
  const estVertebre = Math.random() < 0.5;
  const animal = estVertebre ? pick(pick(CLASSES).animaux) : pick(INVERTEBRES);
  return {
    category: CATEGORY,
    type: 'vertebre',
    text: `${animal.charAt(0).toUpperCase() + animal.slice(1)} — est-ce un vertébré ou un invertébré?`,
    correct: estVertebre ? 'un vertébré' : 'un invertébré',
    options: ['un vertébré', 'un invertébré'],
    explanation: `${animal.charAt(0).toUpperCase() + animal.slice(1)} est ${estVertebre ? 'un VERTÉBRÉ' : 'un INVERTÉBRÉ'}.\n\n`
      + 'Un VERTÉBRÉ possède une colonne vertébrale. Un INVERTÉBRÉ n’en possède pas.\n'
      + (estVertebre
        ? 'Un truc: a-t-il un squelette à l’intérieur, avec un dos? Alors il est vertébré.'
        : 'La méduse, la limace, l’étoile de mer, l’escargot, l’araignée, la pieuvre: aucun n’a de colonne vertébrale.'),
    hint: 'A-t-il une colonne vertébrale (un dos avec des os)?',
  };
}

// ===== 5. Qu'ont en commun les animaux à queue? =====
// LA question centrale de l'étape — celle qu'il a ratée page 4.
function enCommun() {
  const genre = pick(['commun', 'prolongement', 'invertebre_queue']);
  if (genre === 'prolongement') {
    return {
      category: CATEGORY,
      type: 'en_commun',
      text: 'La queue d’un animal, c’est le prolongement de quoi?',
      correct: 'de sa colonne vertébrale',
      options: shuffle(['de sa colonne vertébrale', 'de ses pattes arrière',
        'de sa peau', 'de ses poils']),
      explanation: 'De sa COLONNE VERTÉBRALE.\n\n'
        + 'C’est écrit dans le DOC 1: « La queue des animaux est un prolongement de leur '
        + 'colonne vertébrale. »\n'
        + 'Sur le squelette du chien, du cheval ou de la vache, on voit les petits os de la '
        + 'queue qui continuent le dos.',
      hint: 'Regarde le squelette du chien dans ton cahier: la queue continue son dos.',
    };
  }
  if (genre === 'invertebre_queue') {
    return {
      category: CATEGORY,
      type: 'en_commun',
      text: 'Pourquoi une méduse n’a-t-elle pas de queue comme celle d’un chien?',
      correct: 'parce qu’elle n’a pas de colonne vertébrale',
      options: shuffle(['parce qu’elle n’a pas de colonne vertébrale',
        'parce qu’elle vit dans l’eau', 'parce qu’elle est trop petite',
        'parce qu’elle n’a pas de pattes']),
      explanation: 'Parce qu’elle n’a pas de colonne vertébrale.\n\n'
        + 'La queue est le prolongement de la colonne vertébrale. Pas de colonne → pas de queue.\n'
        + 'La méduse est un INVERTÉBRÉ, comme la limace et l’étoile de mer.',
      hint: 'La queue est le prolongement de quelque chose. Si ce quelque chose manque…',
    };
  }
  return {
    category: CATEGORY,
    type: 'en_commun',
    text: 'Qu’ont en COMMUN tous les animaux qui ont une queue?',
    correct: 'ce sont tous des vertébrés',
    options: shuffle(['ce sont tous des vertébrés', 'ils vivent tous dans l’eau',
      'ils ont tous des poils', 'ils pondent tous des œufs']),
    explanation: 'Ce sont tous des VERTÉBRÉS.\n\n'
      + 'La queue est un prolongement de la colonne vertébrale. Donc pour avoir une queue, '
      + 'il faut une colonne vertébrale — et un animal qui en a une est un vertébré.\n\n'
      + 'C’est la réponse à la question 1 de la page 4.',
    hint: 'La queue est le prolongement de la colonne vertébrale. Alors que faut-il avoir?',
  };
}

// ===== 6. À quoi sert la queue de cet animal? =====
function utiliteQueue() {
  const u = pick(UTILITES);
  const autres = UTILITES.filter((x) => x.action !== u.action).map((x) => x.action);
  return {
    category: CATEGORY,
    type: 'utilite',
    text: `À quoi ${u.qui} se sert-${u.qui.startsWith('l’') || u.qui === "l'oiseau" ? 'il' : 'il'} de sa queue?`,
    correct: u.action,
    options: quatre(u.action, shuffle(autres)),
    explanation: `${u.phrase}\n\n`
      + 'La queue ne sert pas qu’à se déplacer. Dans ton cahier, elle sert à SEPT choses:\n'
      + UTILITES.slice(0, 7).map((x) => `• ${x.action} (${x.qui})`).join('\n'),
    hint: 'Revois les photos du DOC 2: le chien, la vache, le kangourou, le renard, le paon, l’iguane.',
  };
}

// ===== 7. Qui fait ça avec sa queue? =====
function quiFaitCa() {
  const u = pick(UTILITES);
  const autres = UTILITES.filter((x) => x.qui !== u.qui).map((x) => x.qui);
  return {
    category: CATEGORY,
    type: 'qui_utilite',
    text: `Quel animal se sert de sa queue pour ${u.action}?`,
    correct: u.qui,
    options: quatre(u.qui, shuffle(uniques(autres))),
    explanation: `${u.phrase}`,
    hint: 'Revois les photos du DOC 2 (pages 10 et 11).',
  };
}

// ===== 8. Déplacement OU utilité de la queue? =====
// Son erreur n° 3, de face: page 12 il a répondu « la queue du chien exprime
// son humeur » à une question qui demandait des moyens de DÉPLACEMENT.
function deplacementOuPas() {
  const estDeplacement = Math.random() < 0.5;
  if (estDeplacement) {
    const d = pick(DEPLACEMENTS);
    return {
      category: CATEGORY,
      type: 'deplacement',
      text: `« ${d.verbe.charAt(0).toUpperCase() + d.verbe.slice(1)} » — est-ce un moyen de SE DÉPLACER, ou une autre utilité de la queue?`,
      correct: 'un moyen de se déplacer',
      options: ['un moyen de se déplacer', 'une autre utilité de la queue'],
      explanation: `Un moyen de SE DÉPLACER. ${d.qui.charAt(0).toUpperCase() + d.qui.slice(1)} ${d.verbe === 'marcher' ? 'marche' : d.verbe.replace(/er$/, 'e').replace(/ir$/, 'it')} pour se déplacer.\n\n`
        + 'SE DÉPLACER, c’est aller d’un endroit à un autre: '
        + DEPLACEMENTS.map((x) => x.verbe).join(', ') + '.\n'
        + 'Exprimer son humeur ou chasser les moustiques, ça ne déplace pas l’animal.',
      hint: 'Est-ce que l’animal CHANGE DE PLACE en faisant ça?',
    };
  }
  // Seulement les utilites que le cahier oppose lui-meme aux deplacements
  // (p. 11). « S'agripper aux arbres » est range du cote des DEPLACEMENTS
  // dans le DOC 2: l'opposer ici enseignerait le contraire du cahier.
  const u = pick(UTILITES.filter((x) => !x.deplacement));
  return {
    category: CATEGORY,
    type: 'deplacement',
    text: `« ${u.action.charAt(0).toUpperCase() + u.action.slice(1)} » — est-ce un moyen de SE DÉPLACER, ou une autre utilité de la queue?`,
    correct: 'une autre utilité de la queue',
    options: ['un moyen de se déplacer', 'une autre utilité de la queue'],
    explanation: `Une autre utilité de la queue. ${u.phrase}\n\n`
      + 'L’animal ne change pas de place en faisant ça — alors ce n’est pas un déplacement.\n'
      + 'Les moyens de se déplacer, ce sont: ' + DEPLACEMENTS.map((x) => x.verbe).join(', ') + '.',
    hint: 'Est-ce que l’animal CHANGE DE PLACE en faisant ça?',
  };
}

// ===== 9. Comment cet animal se déplace-t-il? =====
function commentSeDeplace() {
  const d = pick(DEPLACEMENTS);
  const autres = DEPLACEMENTS.filter((x) => x.verbe !== d.verbe).map((x) => x.verbe);
  return {
    category: CATEGORY,
    type: 'comment_deplace',
    text: `Comment ${d.qui} se déplace-t-il surtout?`,
    correct: d.verbe,
    options: quatre(d.verbe, shuffle(autres)),
    explanation: `${d.qui.charAt(0).toUpperCase() + d.qui.slice(1)}: ${d.verbe}.\n\n`
      + 'Les vertébrés se déplacent de plusieurs façons: '
      + DEPLACEMENTS.map((x) => `${x.verbe} (${x.qui})`).join(', ') + '.',
    hint: 'A-t-il des ailes, des nageoires, des pattes — ou rien de tout ça?',
  };
}

// ===== 10. La démarche scientifique =====
function demarche() {
  const i = Math.floor(Math.random() * (DEMARCHE.length - 1));
  return {
    category: CATEGORY,
    type: 'demarche',
    text: `Dans ta démarche, qu’est-ce qui vient juste APRÈS « ${DEMARCHE[i]} »?`,
    correct: DEMARCHE[i + 1],
    options: shuffle(DEMARCHE),
    explanation: `${DEMARCHE[i + 1]}.\n\nLa démarche, dans l’ordre:\n`
      + DEMARCHE.map((e, k) => `${k + 1}. ${e}`).join('\n'),
    hint: 'On se pose une question, on devine, on essaie, on lit, puis on conclut.',
  };
}

function buildOne() {
  return pickAdaptive(CATEGORY, [
    // Ses trois trous d'abord.
    { type: 'classe_animal', w: 20, build: classeAnimal },
    { type: 'en_commun', w: 16, build: enCommun },
    { type: 'deplacement', w: 14, build: deplacementOuPas },
    { type: 'cinq_classes', w: 12, build: cinqClasses },
    { type: 'caracteristique', w: 12, build: caracteristique },
    { type: 'partage', w: 10, build: partage },
    { type: 'vertebre', w: 10, build: vertebreOuNon },
    { type: 'utilite', w: 10, build: utiliteQueue },
    { type: 'qui_utilite', w: 8, build: quiFaitCa },
    { type: 'comment_deplace', w: 8, build: commentSeDeplace },
    { type: 'demarche', w: 6, build: demarche },
  ], (q) => `${q.type}|${q.text}`);
}

// Le repertoire est volontairement etroit (c'est une revision de mini-test),
// alors la meme question revient — et c'est voulu. Mais deux fois DE SUITE,
// ca a l'air casse: on retire une fois.
let dernierTexte = null;
export function generateSciencesQueue() {
  let q = buildOne();
  // Un seul essai ne suffisait pas: quand il rate un type, pickAdaptive le
  // redonne, et la meme variante ressortait. On retire jusqu'a six fois.
  for (let i = 0; i < 6 && q && q.text === dernierTexte; i++) {
    const autre = buildOne();
    if (autre) q = autre;
  }
  dernierTexte = q ? q.text : null;
  return q;
}

export default generateSciencesQueue;
