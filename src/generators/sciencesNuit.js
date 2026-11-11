// Sciences — « Comment les animaux se repèrent-ils la nuit? »
// Éclair de génie 3e, leçon 2 (p. 13 à 20). Évaluation le mercredi 11 nov. 2026.
//
// Le parent a envoyé les pages le 10 nov. au soir, la veille: la question de
// la leçon, les trois hypothèses (A: les oreilles · B: les yeux comme le jour
// · C: tous leurs sens), les questions 2 et 3 sur le DOC 2 (p. 19-21) et la
// conclusion à écrire.
//
// ⚠️ Le DOC 2 lui-même n'a pas été photographié. Les réponses ci-dessous sont
// les faits que le DOC décrit (loup, chouette lapone, chat, souris,
// chauve-souris), écrits de façon à rester vraies quel que soit le mot exact
// du cahier: « des kilomètres », « des petits animaux (souris, campagnols) ».
// Les leurres, eux, sont franchement faux — on ne teste pas un synonyme.
//
// Ce qui pèse le plus: son vieux piège du mot TOUS (« tous les animaux ont une
// colonne vertébrale » = VRAI, au test de la leçon 1) revient ici dans le vrai
// ou faux: CERTAINS animaux sont actifs la nuit, pas tous.
import { pickAdaptive } from '../utils/skillStats';

const CATEGORY = 'sciences_nuit';

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Les cinq animaux du DOC 2 et le sens qui les aide la nuit.
export const ANIMAUX_NUIT = [
  { animal: 'le loup', sens: 'l’odorat', organe: 'son nez', indice: 'le loup sent une proie à des kilomètres de distance', fait: 'Il sent une proie à des kilomètres de distance.' },
  { animal: 'la chouette lapone', sens: 'l’ouïe', organe: 'ses oreilles', indice: 'la chouette lapone repère des proies cachées sous la neige, même à 100 m', fait: 'Elle entend des proies cachées sous la neige, même à 100 m de distance.' },
  { animal: 'le chat', sens: 'la vue', organe: 'ses yeux', indice: 'les pupilles du chat s’ouvrent beaucoup plus que celles de l’être humain', fait: 'Ses pupilles sont adaptées à la vision nocturne: elles s’ouvrent beaucoup plus que celles de l’être humain.' },
  { animal: 'la souris', sens: 'le toucher', organe: 'ses vibrisses (moustaches) et sa queue', indice: 'la souris se déplace dans l’obscurité grâce à ses vibrisses et à sa queue', fait: 'Sa vue est très faible, mais elle a une ouïe et un odorat exceptionnels. Dans le noir, elle se sert de ses vibrisses et de sa queue, des organes du toucher très sensibles.' },
  { animal: 'la chauve-souris', sens: 'l’ouïe', organe: 'ses oreilles', indice: 'la chauve-souris émet des ultrasons qui reviennent à ses oreilles', fait: 'Elle émet des ultrasons qui rebondissent sur un obstacle ou une proie et reviennent à ses oreilles: c’est l’écholocation.' },
  { animal: 'l’aigle', sens: 'la vue', organe: 'ses yeux', indice: 'les yeux de l’aigle ont la capacité d’agrandir les images', fait: 'L’aigle a une excellente vision: ses yeux peuvent agrandir les images.' },
  { animal: 'la mouche', sens: 'la vue', organe: 'ses grands yeux', indice: 'la mouche voit tout autour d’elle sans bouger la tête', fait: 'Ses grands yeux lui permettent de voir tout autour d’elle sans bouger la tête.' },
];

export const CINQ_SENS = [
  { sens: 'la vue', organe: 'les yeux' },
  { sens: 'l’ouïe', organe: 'les oreilles' },
  { sens: 'l’odorat', organe: 'le nez' },
  { sens: 'le toucher', organe: 'la peau (et les vibrisses)' },
  { sens: 'le goût', organe: 'la langue' },
];

// ===== 1. Les phrases à compléter du cahier (question 2, a à d) =====
const TROUS = [
  {
    text: 'L’odorat du loup lui permet de sentir une proie à des ______ de distance.',
    correct: 'kilomètres', options: ['kilomètres', 'centimètres', 'secondes', 'couleurs'],
    // Confirmé par la photo du DOC 2 (L'ODORAT), mot pour mot.
    why: 'Le loup a un odorat très puissant: il sent une proie de TRÈS loin, à des kilomètres. L’odorat, c’est le nez.',
  },
  {
    text: 'La chouette lapone peut entendre des ______ cachées sous la neige.',
    // Le mot du cahier (photo de L'OUÏE): « des proies cachées sous la neige ».
    correct: 'proies', options: ['proies', 'étoiles', 'roches', 'feuilles'],
    why: 'L’ouïe de la chouette lapone est excellente: cet oiseau nocturne entend des proies cachées sous la neige, même à 100 m de distance.',
  },
  {
    text: 'Les ______ du chat peuvent s’ouvrir beaucoup plus que celles de l’être humain.',
    correct: 'pupilles', options: ['pupilles', 'griffes', 'oreilles', 'pattes'],
    why: 'La pupille, c’est le rond noir au milieu de l’œil. Plus elle s’ouvre, plus la lumière entre: le chat voit mieux que nous dans la pénombre.',
  },
  {
    text: 'La souris touche ce qui l’entoure avec ses ______ et sa queue pour se déplacer dans l’obscurité.',
    // Le cahier dit « vibrisses, aussi appelées moustaches »: les deux mots sont bons.
    correct: 'vibrisses (moustaches)', options: ['vibrisses (moustaches)', 'dents', 'yeux', 'oreilles'],
    why: 'Les vibrisses (les « moustaches ») sont des poils très épais et très sensibles: elles détectent les mouvements de l’air et les vibrations. C’est le TOUCHER qui guide la souris dans le noir — sa vue est très faible.',
  },
];
function trou() {
  const t = pick(TROUS);
  return {
    category: CATEGORY,
    type: 'trou',
    text: `Complète (DOC 2):\n« ${t.text} »`,
    correct: t.correct,
    options: shuffle(t.options),
    explanation: `${t.correct}.\n\n${t.why}`,
    hint: 'Pense au sens que cet animal utilise la nuit.',
  };
}

// ===== 2. La chauve-souris (question 3, mot pour mot) =====
function chauveSouris() {
  const correct = 'La chauve-souris émet des sons qui reviennent à ses oreilles.';
  return {
    category: CATEGORY,
    type: 'chauve_souris',
    text: 'La chauve-souris peut « voir » avec ses oreilles. Qu’est-ce que cela veut dire?',
    correct,
    options: shuffle([correct, 'La chauve-souris a des yeux dans les oreilles.', 'La chauve-souris peut voir les sons qu’elle émet.']),
    explanation: `${correct}\n\nElle émet des ULTRASONS qui rebondissent quand ils rencontrent un obstacle ou une proie, et REVIENNENT à ses oreilles. `
      + 'Cette technique s’appelle l’ÉCHOLOCATION: elle s’en sert pour chasser la nuit. Les guillemets autour de « voir » veulent dire: pas vraiment voir.',
    hint: 'Un son qui part… et qui revient. Comme un écho.',
  };
}

// ===== 3. Quel sens aide cet animal la nuit? =====
// La question donne l'INDICE (« sent une proie à des kilomètres »): sans lui,
// « quel sens aide la souris? » avait deux bonnes réponses — le cahier dit
// qu'elle a une ouïe et un odorat exceptionnels, en plus de ses vibrisses.
function quelSens() {
  const a = pick(ANIMAUX_NUIT);
  return {
    category: CATEGORY,
    type: 'quel_sens',
    text: `${a.indice.charAt(0).toUpperCase() + a.indice.slice(1)}. Quel sens est-ce?`,
    correct: a.sens,
    options: shuffle(['la vue', 'l’ouïe', 'l’odorat', 'le toucher']),
    explanation: `${a.sens.charAt(0).toUpperCase() + a.sens.slice(1)}, avec ${a.organe}.\n\n${a.fait}`,
    hint: 'Les yeux = la vue · les oreilles = l’ouïe · le nez = l’odorat · la peau, les moustaches = le toucher.',
  };
}

// ===== 4. Le sens et son organe =====
function organe() {
  const s = pick(CINQ_SENS);
  const versOrgane = Math.random() < 0.5;
  const val = (x) => (versOrgane ? x.organe : x.sens);
  return {
    category: CATEGORY,
    type: 'organe',
    text: versOrgane ? `Avec quelle partie du corps utilise-t-on ${s.sens}?` : `${s.organe.charAt(0).toUpperCase() + s.organe.slice(1)}: c’est pour quel sens?`,
    correct: val(s),
    // La bonne + trois autres: couper les cinq à quatre pouvait l'enlever.
    options: shuffle([val(s), ...shuffle(CINQ_SENS.filter((x) => x !== s).map(val)).slice(0, 3)]),
    explanation: CINQ_SENS.map((x) => `${x.sens} → ${x.organe}`).join('\n'),
    hint: 'Les 5 sens: la vue, l’ouïe, l’odorat, le toucher, le goût.',
  };
}

// ===== 5. Vrai ou faux — avec son piège du mot TOUS =====
const VRAI_FAUX = [
  { p: 'Pour voir, il faut de la lumière.', r: 'vrai', why: 'C’est la première phrase de la leçon: sans lumière, les yeux ne voient rien. C’est pour ça que les animaux de nuit utilisent leurs AUTRES sens.' },
  { p: 'TOUS les animaux sont actifs la nuit.', r: 'faux', why: 'Lis bien le mot TOUS! CERTAINS animaux sont actifs surtout la nuit (le loup, la chouette, la chauve-souris). Les autres dorment la nuit.' },
  { p: 'Un animal nocturne est actif surtout la nuit.', r: 'vrai', why: 'Nocturne = de la nuit. Il chasse et se déplace quand il fait noir.' },
  { p: 'La chauve-souris a des yeux dans les oreilles.', r: 'faux', why: 'Elle « voit » avec ses oreilles parce que ses sons reviennent à ses oreilles (l’écho). Ses yeux sont à la même place que les nôtres.' },
  { p: 'Les animaux de nuit utilisent seulement leurs yeux.', r: 'faux', why: 'Le mot SEULEMENT rend la phrase fausse: ils utilisent tous leurs sens — l’odorat du loup, l’ouïe de la chouette, le toucher de la souris.' },
  { p: 'Les moustaches de la souris l’aident à se déplacer dans le noir.', r: 'vrai', why: 'Elles touchent ce qui l’entoure: c’est le sens du toucher.' },
  { p: 'Le chat voit mieux que l’être humain quand il fait sombre.', r: 'vrai', why: 'Ses pupilles s’ouvrent beaucoup plus que les nôtres: plus de lumière entre dans son œil.' },
  { p: 'Certains animaux sont actifs le jour, d’autres la nuit.', r: 'vrai', why: 'C’est la première phrase du DOC 1: les diurnes le jour, les nocturnes la nuit.' },
  { p: 'TOUS les animaux sauvages choisissent leur nourriture selon le goût.', r: 'faux', why: 'Lis bien le mot TOUS! Pour la plupart des animaux sauvages, c’est la FACILITÉ à trouver la nourriture qui compte: ils mangent ce qui est à leur portée.' },
  { p: 'La langue sert seulement à goûter les aliments.', r: 'faux', why: 'Le mot SEULEMENT rend la phrase fausse: la langue peut avoir d’autres fonctions — le caméléon, par exemple, attrape ses proies avec sa langue.' },
  { p: 'Les chercheurs pensent qu’il y a peut-être plus que cinq sens (l’équilibre, par exemple).', r: 'vrai', why: 'On parle souvent de nos cinq sens, mais les chercheurs disent qu’il y en a davantage — l’équilibre, par exemple.' },
];
function vraiFaux() {
  // Les phrases avec TOUS / SEULEMENT sortent plus souvent: c'est son piège.
  const v = Math.random() < 0.4 ? pick(VRAI_FAUX.filter((x) => /TOUS|seulement/i.test(x.p))) : pick(VRAI_FAUX);
  return {
    category: CATEGORY,
    type: 'vrai_faux',
    text: `Vrai ou faux?\n« ${v.p} »`,
    correct: v.r,
    options: ['vrai', 'faux'],
    explanation: `${v.r.toUpperCase()}.\n\n${v.why}`,
    hint: 'Cherche les petits mots qui changent tout: TOUS, SEULEMENT, CERTAINS.',
  };
}

// ===== 7. DOC 1 — diurne ou nocturne? (p. 18, mot pour mot) =====
export const DIURNES = ['l’aigle', 'le monarque', 'l’écureuil', 'le cerf'];
export const NOCTURNES = ['la chauve-souris', 'la chouette', 'le loup', 'le lièvre', 'le raton laveur'];
export const DEFINITIONS = {
  diurne: 'se déplace, chasse et mange durant le JOUR; la nuit, il se met à l’abri pour se reposer. Il préfère un milieu chaud et ensoleillé.',
  nocturne: 'se déplace, chasse et mange durant la NUIT; le jour, il se met à l’abri pour se reposer. Il préfère un milieu frais et sombre.',
};
function diurneNocturne() {
  const nocturne = Math.random() < 0.55;
  const a = pick(nocturne ? NOCTURNES : DIURNES);
  const r = nocturne ? 'nocturne' : 'diurne';
  return {
    category: CATEGORY,
    type: 'diurne_nocturne',
    text: `D’après le DOC 1, ${a} est un animal…`,
    correct: r,
    options: ['diurne', 'nocturne'],
    explanation: `${r.toUpperCase()}.\n\nUn animal ${r} ${DEFINITIONS[r]}\n\n`
      + `Diurnes du DOC 1: ${DIURNES.join(', ')}.\nNocturnes du DOC 1: ${NOCTURNES.join(', ')}.`,
    hint: 'DIURNE = le jour (comme « journée ») · NOCTURNE = la nuit (comme « nocturne », « nuit »).',
  };
}

const DEFS_QUESTIONS = [
  { q: 'Un animal qui se déplace, chasse et mange durant la NUIT est un animal…', r: 'nocturne', o: ['nocturne', 'diurne'] },
  { q: 'Un animal qui se déplace, chasse et mange durant le JOUR est un animal…', r: 'diurne', o: ['nocturne', 'diurne'] },
  { q: 'Quel milieu préfèrent les animaux NOCTURNES?', r: 'un milieu frais et sombre', o: ['un milieu frais et sombre', 'un milieu chaud et ensoleillé'] },
  { q: 'Quel milieu préfèrent les animaux DIURNES?', r: 'un milieu chaud et ensoleillé', o: ['un milieu frais et sombre', 'un milieu chaud et ensoleillé'] },
  { q: 'Que font les animaux nocturnes le JOUR?', r: 'ils se mettent à l’abri pour se reposer', o: ['ils se mettent à l’abri pour se reposer', 'ils chassent et mangent', 'ils cherchent le soleil'] },
  { q: 'Pourquoi les animaux nocturnes se repèrent-ils bien dans le noir?', r: 'leurs sens sont plus aiguisés: ils détectent mieux les bruits, les mouvements et les odeurs', o: ['leurs sens sont plus aiguisés: ils détectent mieux les bruits, les mouvements et les odeurs', 'ils ont une lampe dans les yeux', 'ils dorment toute la nuit'] },
  { q: 'Les yeux des animaux DIURNES sont-ils adaptés à l’obscurité?', r: 'non: leur vision les avantage le jour seulement', o: ['non: leur vision les avantage le jour seulement', 'oui: ils voient aussi bien la nuit que le jour'] },
  { q: 'Quel sens nous permet de percevoir les saveurs?', r: 'le goût, avec la langue', o: ['le goût, avec la langue', 'l’odorat, avec le nez', 'le toucher, avec la peau'] },
  { q: 'Quel sens nous permet de percevoir les odeurs?', r: 'l’odorat, avec le nez', o: ['le goût, avec la langue', 'l’odorat, avec le nez', 'l’ouïe, avec les oreilles'] },
  { q: 'Quel sens nous permet de percevoir les sons?', r: 'l’ouïe, avec les oreilles', o: ['l’ouïe, avec les oreilles', 'la vue, avec les yeux', 'l’odorat, avec le nez'] },
  { q: 'Comment s’appelle la technique de la chauve-souris: elle émet des ultrasons qui rebondissent sur un obstacle ou une proie?', r: 'l’écholocation', o: ['l’écholocation', 'la respiration', 'la digestion'] },
  { q: 'Quels sons la chauve-souris émet-elle pour se repérer?', r: 'des ultrasons', o: ['des ultrasons', 'des chansons', 'des aboiements'] },
  { q: 'Pour certains animaux, les sons sont un mode de survie. Pourquoi les souris s’enfuient-elles?', r: 'elles entendent arriver un chat', o: ['elles entendent arriver un chat', 'elles voient le soleil se lever', 'elles sentent du fromage'] },
  { q: 'Grâce à la vue, on perçoit…', r: 'les formes, les distances, les mouvements et les couleurs, grâce à la lumière', o: ['les formes, les distances, les mouvements et les couleurs, grâce à la lumière', 'les saveurs et les odeurs', 'les sons et les ultrasons'] },
  { q: 'Les animaux voient-ils tous de la même manière?', r: 'non: la plupart ont la vue, mais ils ne voient pas tous de la même manière', o: ['non: la plupart ont la vue, mais ils ne voient pas tous de la même manière', 'oui: ils voient tous comme l’être humain'] },
  { q: 'Grâce au toucher, on perçoit…', r: 'les frottements, les pressions et les contacts sur le corps', o: ['les frottements, les pressions et les contacts sur le corps', 'les couleurs et les formes', 'les saveurs'] },
  { q: 'Quel est le plus grand organe du corps humain?', r: 'la peau', o: ['la peau', 'le cœur', 'les yeux', 'la langue'] },
  { q: 'Chez les animaux, comment s’appellent les poils très épais et très sensibles du toucher?', r: 'les vibrisses (les « moustaches »)', o: ['les vibrisses (les « moustaches »)', 'les pupilles', 'les ultrasons'] },
  { q: 'Que détectent les vibrisses?', r: 'les mouvements de l’air et les vibrations', o: ['les mouvements de l’air et les vibrations', 'les couleurs', 'les saveurs'] },
  { q: 'La vue de la souris est…', r: 'très faible', o: ['très faible', 'excellente, comme celle de l’aigle'] },
  { q: 'L’ouïe du chien est environ combien de fois plus développée que celle de l’être humain?', r: 'six fois', o: ['six fois', 'deux fois', 'cent fois'] },
  { q: 'La chouette lapone peut entendre des proies cachées sous la neige, même à quelle distance?', r: 'à 100 m', o: ['à 100 m', 'à 1 cm', 'à 100 km'] },
  { q: 'Les sons servent aux animaux à…', r: 'communiquer, et pour certains, à survivre', o: ['communiquer, et pour certains, à survivre', 'seulement dormir', 'goûter leur nourriture'] },
  { q: 'L’odorat est souvent plus développé chez…', r: 'les animaux que chez l’être humain', o: ['les animaux que chez l’être humain', 'l’être humain que chez les animaux'] },
  { q: 'Pour la plupart des animaux sauvages, qu’est-ce qui compte pour choisir leur nourriture?', r: 'la facilité à la trouver: ils mangent ce qui est à leur portée', o: ['la facilité à la trouver: ils mangent ce qui est à leur portée', 'le goût: ils choisissent ce qui est le meilleur', 'la couleur de la nourriture'] },
];
function definition() {
  const d = pick(DEFS_QUESTIONS);
  return {
    category: CATEGORY,
    type: 'definition',
    text: d.q,
    correct: d.r,
    options: shuffle(d.o),
    explanation: `${d.r.charAt(0).toUpperCase() + d.r.slice(1)}.\n\n`
      + `Diurne: ${DEFINITIONS.diurne}\nNocturne: ${DEFINITIONS.nocturne}`,
    hint: 'Relis ta fiche: le jour → diurne · la nuit → nocturne.',
  };
}

// ===== 8. DOC 2 — à quoi sert ce sens chez cet animal? (photos du cahier) =====
// Le DOC 2 montre que la langue et le nez « remplissent plusieurs fonctions ».
export const FONCTIONS = [
  { sens: 'le goût', organe: 'la langue', animal: 'le chimpanzé', quoi: 'tire la langue pour communiquer' },
  { sens: 'le goût', organe: 'la langue', animal: 'le caméléon', quoi: 'utilise sa langue pour capturer ses proies' },
  { sens: 'le goût', organe: 'la langue', animal: 'le léopard', quoi: 'fait sa toilette en se léchant les pattes' },
  { sens: 'l’odorat', organe: 'le nez', animal: 'le guépard', quoi: 'marque son territoire par son odeur' },
  { sens: 'l’odorat', organe: 'le nez', animal: 'la fourmi', quoi: 'libère une substance odorante pour signaler un danger' },
  { sens: 'l’odorat', organe: 'le nez', animal: 'le loup', quoi: 'sent une proie à des kilomètres de distance' },
];
function fonction() {
  const f = pick(FONCTIONS);
  const autres = FONCTIONS.filter((x) => x.animal !== f.animal).map((x) => x.quoi);
  return {
    category: CATEGORY,
    type: 'fonction',
    text: `D’après le DOC 2, que fait ${f.animal}?`,
    correct: f.quoi,
    options: shuffle([f.quoi, ...shuffle(autres).slice(0, 2)]),
    explanation: `${f.animal.charAt(0).toUpperCase() + f.animal.slice(1)} ${f.quoi}.\n\n`
      + `C’est ${f.sens} (${f.organe}). ${f.sens === 'le goût'
        ? 'La langue ne sert pas seulement à goûter: elle a d’autres fonctions.'
        : 'L’odorat est souvent plus développé chez les animaux que chez l’être humain, et il remplit plusieurs fonctions.'}`,
    hint: 'Revois les photos du DOC 2: le chimpanzé, le caméléon, le léopard, le guépard, la fourmi, le loup.',
  };
}

// ===== 6. La conclusion: quelle hypothèse est vraie? =====
const HYPOTHESES = {
  A: 'A. Les animaux utilisent leurs oreilles pour se repérer la nuit.',
  B: 'B. Les animaux utilisent leurs yeux la nuit comme le jour.',
  C: 'C. Les animaux utilisent tous leurs sens pour se repérer la nuit.',
};
function conclusion() {
  return {
    category: CATEGORY,
    type: 'conclusion',
    text: 'TIRER UNE CONCLUSION — Comment les animaux se repèrent-ils la nuit? Quelle hypothèse est la plus juste?',
    correct: HYPOTHESES.C,
    options: [HYPOTHESES.A, HYPOTHESES.B, HYPOTHESES.C],
    explanation: 'C.\n\nJe sais maintenant que les animaux de nuit utilisent TOUS leurs sens, et que certains de leurs sens sont très développés: '
      + 'l’odorat du loup, l’ouïe de la chouette et de la chauve-souris, la vue du chat, le toucher de la souris.\n\n'
      + 'A n’est qu’une partie de la réponse (les oreilles, oui, mais pas seulement). B est faux: sans lumière, les yeux ne voient pas comme le jour.',
    hint: 'Repense aux cinq animaux: est-ce qu’ils utilisent tous le même sens?',
  };
}

// ===== 9. Le BILAN DES CONNAISSANCES du cahier (p. 20), question par question =====
// Le format le plus proche de l'évaluation: on le pose tel quel.
// Q1: D ou N? Les phrases ne nomment pas toujours le jour ou la nuit: il faut
// DÉDUIRE (« une très mauvaise vue » → il vit dans le noir; « la chaleur du
// Soleil » → le jour).
const BILAN_DN = [
  { p: 'Le diable de Tasmanie chasse dès que l’obscurité arrive.', r: 'N', why: 'Il chasse quand l’OBSCURITÉ arrive, donc la nuit: nocturne.' },
  { p: 'La souris possède une très mauvaise vue.', r: 'N', why: 'Sa vue est très faible: elle se déplace dans l’obscurité avec ses vibrisses, sa queue, son ouïe et son odorat. C’est un animal nocturne.' },
  { p: 'Les reptiles ont besoin de la chaleur du Soleil pour être actifs.', r: 'D', why: 'Le Soleil, c’est le JOUR: diurnes.' },
  { p: 'Le hibou chasse quand tout le monde dort.', r: 'N', why: 'Quand tout le monde dort, c’est la nuit: nocturne.' },
  { p: 'L’écureuil cherche ses noisettes en plein soleil.', r: 'D', why: 'En plein soleil = le jour: diurne (il est dans le DOC 1 avec les diurnes).' },
  { p: 'Le raton laveur dort à l’abri pendant la journée.', r: 'N', why: 'Il se repose le JOUR, donc il est actif la nuit: nocturne.' },
];
function bilanDN() {
  const b = pick(BILAN_DN);
  return {
    category: CATEGORY,
    type: 'bilan_dn',
    text: `BILAN 1 — Animal diurne ou nocturne? D pour diurne, N pour nocturne.\n« ${b.p} »`,
    correct: b.r === 'D' ? 'D (diurne)' : 'N (nocturne)',
    options: ['D (diurne)', 'N (nocturne)'],
    explanation: `${b.r === 'D' ? 'D — diurne' : 'N — nocturne'}.\n\n${b.why}`,
    hint: 'Cherche l’indice: obscurité, nuit, mauvaise vue → N · Soleil, jour, lumière → D.',
  };
}

const BILAN_CHOIX = [
  {
    text: 'BILAN 2 — Pourquoi le choix de la nourriture n’est-il pas une question de goût pour les animaux sauvages?',
    correct: 'Parce que l’important pour eux, c’est de trouver de la nourriture.',
    autres: ['Parce qu’ils ne possèdent pas le sens du goût.', 'Parce qu’ils ne possèdent pas de langue.'],
    why: 'Ils ont une langue et le sens du goût! Mais c’est la FACILITÉ à trouver la nourriture qui compte: ils mangent ce qui est à leur portée.',
  },
  {
    text: 'BILAN 3 — À quoi peut servir l’odorat chez la fourmi?',
    correct: 'À signaler un danger: elle libère une substance odorante.',
    autres: ['À marquer son territoire avec son odeur.', 'À sentir une proie à des kilomètres.'],
    why: 'La fourmi libère une substance odorante pour signaler un danger. (Marquer son territoire, c’est le guépard; sentir une proie à des kilomètres, c’est le loup.)',
  },
  {
    text: 'BILAN 5a — De quel sens s’agit-il? « Le fennec repère au son ses rares proies dans le désert. »',
    correct: 'l’ouïe', autres: ['la vue', 'l’odorat', 'le toucher'],
    why: 'AU SON → les oreilles → l’ouïe. (Le fennec a de très grandes oreilles!)',
  },
  {
    text: 'BILAN 5b — De quel sens s’agit-il? « Avec sa vue perçante, le faucon est un redoutable prédateur. »',
    correct: 'la vue', autres: ['l’ouïe', 'l’odorat', 'le toucher'],
    why: 'SA VUE perçante → les yeux → la vue. Le mot est dans la phrase!',
  },
  {
    text: 'BILAN 5c — De quel sens s’agit-il? « Le singe cueille les fruits des arbres avec ses mains. »',
    correct: 'le toucher', autres: ['la vue', 'le goût', 'l’ouïe'],
    why: 'Avec ses MAINS, il touche et attrape: c’est le toucher (la peau).',
  },
];
function bilanChoix() {
  const b = pick(BILAN_CHOIX);
  return {
    category: CATEGORY,
    type: 'bilan_choix',
    text: b.text,
    correct: b.correct,
    options: shuffle([b.correct, ...b.autres]),
    explanation: `${b.correct}\n\n${b.why}`,
    hint: 'Cherche le mot-indice dans la phrase: son, vue, mains, odeur…',
  };
}

// BILAN 4 — à ÉCRIRE, comme sur la feuille (une case, un mot).
function bilanPeau() {
  const bon = 'C’est la bonne réponse! Écris seulement le mot qui manque: peau.';
  return {
    category: CATEGORY,
    type: 'bilan_peau',
    text: 'BILAN 4 — Quel est l’organe responsable du toucher chez l’être humain?\nLa ______',
    correct: 'peau',
    tape: 'mot',
    presque: { 'la peau': bon, 'sa peau': bon, 'les mains': 'Les mains touchent, oui — mais l’organe du toucher, c’est celui qui couvre TOUT le corps: la peau.', mains: 'Les mains touchent, oui — mais l’organe du toucher, c’est celui qui couvre TOUT le corps: la peau.' },
    explanation: 'La peau.\n\nGrâce à ta peau, tu sens ce que tu touches. C’est le plus grand organe du corps humain, et elle sert aussi à nous protéger.',
    hint: 'Elle couvre tout ton corps. C’est le plus grand organe.',
  };
}

function buildOne() {
  return pickAdaptive(CATEGORY, [
    // Le bilan du cahier d'abord: c'est la forme de l'évaluation.
    { type: 'bilan_dn', w: 18, build: bilanDN },
    { type: 'bilan_choix', w: 22, build: bilanChoix, dur: true },
    { type: 'bilan_peau', w: 8, build: bilanPeau, dur: true },
    { type: 'diurne_nocturne', w: 18, build: diurneNocturne },
    { type: 'definition', w: 16, build: definition },
    { type: 'trou', w: 24, build: trou },
    { type: 'fonction', w: 14, build: fonction },
    { type: 'quel_sens', w: 20, build: quelSens },
    { type: 'vrai_faux', w: 18, build: vraiFaux, dur: true },
    { type: 'chauve_souris', w: 12, build: chauveSouris, dur: true },
    { type: 'conclusion', w: 12, build: conclusion, dur: true },
    { type: 'organe', w: 10, build: organe },
  ], (q) => `${q.type}|${q.text}`);
}

export function generateSciencesNuit() {
  return buildOne();
}

// =====================================================================
// LE DÉFI — plus difficile (11 nov. 2026, le matin de l'évaluation).
// Ryan a eu 15/15 à la série de base. Le parent: « make another one that's a
// little bit more difficult … make him write a few things » — les 5 sens, des
// animaux de nuit du livre. Donc ici: surtout des réponses À ÉCRIRE, des
// questions « lequel n'est PAS », des animaux nouveaux à déduire par l'indice
// (comme le fennec du bilan), et le « pourquoi » des hypothèses.
// =====================================================================
const CATEGORY_DEFI = 'sciences_nuit_defi';

// « ouïe », « l’ouïe », « l'ouie »… : l'article ne compte pas (la case du
// cahier ne le demande pas). L'accent, lui, compte (il reste « presque »).
const sansArticle = (m) => m.replace(/^(le |la |les |l’|l')/, '');
function formes(mot) {
  const nu = sansArticle(mot);
  return [nu, `le ${nu}`, `la ${nu}`, `les ${nu}`, `l’${nu}`, `l'${nu}`, `un ${nu}`, `une ${nu}`, `des ${nu}`];
}

function aEcrire({ type, text, bonnes, explanation, hint, presque }) {
  return {
    category: CATEGORY_DEFI,
    type,
    text,
    correct: sansArticle(bonnes[0]),
    tape: 'mot',
    accepte: bonnes.flatMap(formes),
    presque,
    explanation,
    hint,
  };
}

// ----- À écrire 1: le sens qui manque dans la liste des cinq -----
function ecrisSensManquant() {
  const manque = pick(CINQ_SENS);
  const liste = CINQ_SENS.map((x) => (x === manque ? '______' : x.sens)).join(', ');
  return aEcrire({
    type: 'ecris_sens_manquant',
    text: `ÉCRIS — Les 5 sens. Lequel manque?\n${liste}`,
    bonnes: [manque.sens],
    presque: manque.sens === 'l’ouïe' ? { ouie: 'Presque! « ouïe » prend un tréma sur le i: ï (le bouton est sous la case).' } : undefined,
    explanation: `${manque.sens}.\n\nLes 5 sens: ${CINQ_SENS.map((x) => `${x.sens} (${x.organe})`).join(', ')}.`,
    hint: `Son organe: ${manque.organe}.`,
  });
}

// ----- À écrire 2: l'organe ↔ le sens -----
const ORGANES_ECRITS = [
  { q: 'Avec quel organe perçoit-on les SONS? Les ______', r: 'oreilles' },
  { q: 'Avec quel organe perçoit-on les ODEURS? Le ______', r: 'nez' },
  { q: 'Avec quel organe perçoit-on les SAVEURS? La ______', r: 'langue' },
  { q: 'Avec quel organe perçoit-on les formes et les couleurs? Les ______', r: 'yeux' },
  { q: 'Les oreilles, c’est le sens de l’______.', r: 'ouïe' },
  { q: 'Le nez, c’est le sens de l’______.', r: 'odorat' },
  { q: 'La langue, c’est le sens du ______.', r: 'goût' },
  { q: 'La peau, c’est le sens du ______.', r: 'toucher' },
];
function ecrisOrgane() {
  const o = pick(ORGANES_ECRITS);
  return aEcrire({
    type: 'ecris_organe',
    text: `ÉCRIS — ${o.q}`,
    bonnes: [o.r],
    presque: o.r === 'ouïe' ? { ouie: 'Presque! « ouïe » prend un tréma sur le i: ï (le bouton est sous la case).' } : undefined,
    explanation: `${o.r}.\n\n${CINQ_SENS.map((x) => `${x.sens} → ${x.organe}`).join('\n')}`,
    hint: 'Pense à ta fiche des 5 sens.',
  });
}

// ----- À écrire 3: un animal nocturne / diurne du cahier -----
// Le DOC 1, plus les animaux nommés ailleurs dans la leçon (bilan, DOC 2) dont
// le cahier dit qu'ils sont actifs la nuit (ou le jour).
const NOCTURNES_CAHIER = [...NOCTURNES, 'la chouette lapone', 'le hibou', 'la souris', 'le diable de Tasmanie'];
const DIURNES_CAHIER = [...DIURNES, 'le faucon'];
function ecrisAnimal() {
  const nuit = Math.random() < 0.65;
  const bonnes = nuit ? NOCTURNES_CAHIER : DIURNES_CAHIER;
  const autres = nuit ? DIURNES_CAHIER : NOCTURNES_CAHIER;
  const piege = Object.fromEntries(autres.flatMap(formes).map((f) => [f,
    `Attention: ${sansArticle(f)} est ${nuit ? 'DIURNE (actif le jour)' : 'NOCTURNE (actif la nuit)'}. On cherche un animal ${nuit ? 'de NUIT' : 'de JOUR'}.`]));
  return aEcrire({
    type: nuit ? 'ecris_nocturne' : 'ecris_diurne',
    text: `ÉCRIS — Le nom d’un animal ${nuit ? 'NOCTURNE (actif la nuit)' : 'DIURNE (actif le jour)'} de ton cahier.`,
    bonnes,
    presque: piege,
    explanation: `Toutes ces réponses sont bonnes:\n${bonnes.join(', ')}.\n\n${nuit ? 'Nocturne' : 'Diurne'}: ${DEFINITIONS[nuit ? 'nocturne' : 'diurne']}`,
    hint: nuit ? 'Pense au DOC 1: celui qui vole la nuit et « voit » avec ses oreilles…' : 'Pense au DOC 1: un oiseau à la vue excellente, un papillon orange…',
  });
}

// ----- À écrire 4: un animal du cahier qui se sert beaucoup de tel sens -----
const PAR_SENS = {
  'l’ouïe': ['la chouette lapone', 'la chouette', 'la chauve-souris', 'le chien', 'le fennec'],
  'la vue': ['le chat', 'l’aigle', 'la mouche', 'le faucon'],
  'l’odorat': ['le loup', 'le guépard', 'la fourmi'],
  'le toucher': ['la souris', 'le singe'],
};
const INDICE_SENS = {
  'l’ouïe': 'Un oiseau de nuit qui entend des proies sous la neige…',
  'la vue': 'Ses pupilles s’ouvrent beaucoup dans le noir…',
  'l’odorat': 'Il sent une proie à des kilomètres…',
  'le toucher': 'Ses vibrisses et sa queue la guident dans le noir…',
};
function ecrisAnimalSens() {
  const sens = pick(Object.keys(PAR_SENS));
  const faits = ANIMAUX_NUIT.filter((a) => a.sens === sens).map((a) => `${a.animal}: ${a.fait}`).join('\n');
  return aEcrire({
    type: 'ecris_animal_sens',
    text: `ÉCRIS — Le nom d’un animal de ton cahier qui se sert beaucoup de ${sens}.`,
    bonnes: PAR_SENS[sens],
    explanation: `Toutes ces réponses sont bonnes: ${PAR_SENS[sens].join(', ')}.${faits ? `\n\n${faits}` : ''}`,
    hint: INDICE_SENS[sens],
  });
}

// ----- À écrire 5: les mots savants de la leçon -----
const MOTS_ECRITS = [
  { q: 'La chauve-souris émet des ______ qui reviennent à ses oreilles.', r: 'ultrasons', why: 'Des ULTRASONS: des sons trop aigus pour nos oreilles.' },
  { q: 'La technique de la chauve-souris s’appelle l’______.', r: 'écholocation', why: 'ÉCHO-LOCATION: l’écho lui dit où se trouve l’obstacle ou la proie.' },
  { q: 'Les moustaches de la souris s’appellent des ______.', r: 'vibrisses', why: 'Des VIBRISSES: des poils très épais et très sensibles (le toucher).' },
  { q: 'Les ______ du chat s’ouvrent beaucoup plus que celles de l’être humain.', r: 'pupilles', why: 'La PUPILLE, le rond noir de l’œil, laisse entrer la lumière.' },
  { q: 'Le loup sent une ______ à des kilomètres de distance.', r: 'proie', why: 'Une PROIE: l’animal qu’un prédateur chasse pour le manger.' },
  { q: 'Un animal actif la NUIT est un animal ______.', r: 'nocturne', why: 'NOCTURNE = la nuit.' },
  { q: 'Un animal actif le JOUR est un animal ______.', r: 'diurne', why: 'DIURNE = le jour.' },
  { q: 'Les animaux de nuit utilisent ______ leurs sens pour se repérer.', r: 'tous', why: 'TOUS leurs sens: c’est la conclusion (hypothèse C).' },
  { q: 'Pour voir, il faut de la ______.', r: 'lumière', why: 'Sans LUMIÈRE, les yeux ne voient rien.' },
  { q: 'Le plus grand organe du corps humain, c’est la ______.', r: 'peau', why: 'La PEAU couvre tout le corps: c’est l’organe du toucher.' },
];
function ecrisMot() {
  const m = pick(MOTS_ECRITS);
  return aEcrire({
    type: 'ecris_mot',
    text: `ÉCRIS le mot qui manque:\n« ${m.q} »`,
    bonnes: [m.r],
    explanation: `${m.r}.\n\n${m.why}`,
    hint: `Il commence par « ${m.r[0]} ».`,
  });
}

// ----- Choix 1: l'intrus (« lequel n'est PAS… ») -----
function intrus() {
  const nuit = Math.random() < 0.5;
  const groupe = nuit ? NOCTURNES : DIURNES;
  const autre = nuit ? DIURNES : NOCTURNES;
  const pasLa = pick(autre);
  return {
    category: CATEGORY_DEFI,
    type: 'intrus',
    text: `Attention au mot PAS! Lequel n’est PAS un animal ${nuit ? 'nocturne' : 'diurne'}?`,
    correct: pasLa,
    options: shuffle([pasLa, ...shuffle(groupe).slice(0, 3)]),
    explanation: `${pasLa}: il est ${nuit ? 'DIURNE' : 'NOCTURNE'}.\n\nDiurnes: ${DIURNES.join(', ')}.\nNocturnes: ${NOCTURNES.join(', ')}.`,
    hint: 'Trois se ressemblent, un seul est différent.',
  };
}

// ----- Choix 2: le sens que deux animaux ont en commun -----
const PAIRES = [
  { a: 'la chouette lapone', b: 'la chauve-souris', r: 'l’ouïe', why: 'La chouette lapone entend des proies sous la neige; la chauve-souris entend l’écho de ses ultrasons.' },
  { a: 'le chat', b: 'l’aigle', r: 'la vue', why: 'Les pupilles du chat s’ouvrent beaucoup; les yeux de l’aigle agrandissent les images.' },
  { a: 'l’aigle', b: 'la mouche', r: 'la vue', why: 'Les yeux de l’aigle agrandissent les images; la mouche voit tout autour d’elle.' },
  { a: 'le loup', b: 'la fourmi', r: 'l’odorat', why: 'Le loup sent une proie à des kilomètres; la fourmi libère une odeur pour signaler un danger.' },
  { a: 'le guépard', b: 'le loup', r: 'l’odorat', why: 'Le guépard marque son territoire par son odeur; le loup sent une proie à des kilomètres.' },
  { a: 'le chien', b: 'la chouette lapone', r: 'l’ouïe', why: 'L’ouïe du chien est environ six fois plus développée que la nôtre; la chouette lapone entend à 100 m.' },
];
function enCommun() {
  const p = pick(PAIRES);
  return {
    category: CATEGORY_DEFI,
    type: 'en_commun',
    text: `D’après ton cahier, quel sens très développé ont en commun ${p.a} et ${p.b}?`,
    correct: p.r,
    options: shuffle(['la vue', 'l’ouïe', 'l’odorat', 'le toucher']),
    explanation: `${p.r}.\n\n${p.why}`,
    hint: 'Pense à ce que chacun fait de spécial dans le DOC 2.',
  };
}

// ----- Choix 3: un animal NOUVEAU, à deviner par le mot-indice (comme le
// fennec, le faucon et le singe du bilan). Chaque phrase porte son indice.
const NOUVEAUX = [
  { p: 'Le hérisson trouve les vers de terre la nuit en reniflant le sol.', r: 'l’odorat', why: 'RENIFLER, c’est avec le NEZ → l’odorat.' },
  { p: 'Le lynx repère un lièvre de loin avec ses grands yeux.', r: 'la vue', why: 'Ses YEUX → la vue.' },
  { p: 'Le lapin tourne ses longues oreilles vers le moindre bruit.', r: 'l’ouïe', why: 'Le BRUIT et les OREILLES → l’ouïe.' },
  { p: 'Le raton laveur tâte sa nourriture avec ses pattes avant, dans le noir.', r: 'le toucher', why: 'TÂTER, c’est toucher → le toucher.' },
  { p: 'Le chien suit la piste d’une odeur dans la forêt.', r: 'l’odorat', why: 'Une ODEUR → le nez → l’odorat.' },
  { p: 'Le chat se faufile dans le noir en frôlant les murs avec ses moustaches.', r: 'le toucher', why: 'Les MOUSTACHES (vibrisses) → le toucher.' },
  { p: 'La baleine entend le chant des autres baleines très loin dans la mer.', r: 'l’ouïe', why: 'ENTENDRE → les oreilles → l’ouïe.' },
  { p: 'L’ours goûte le miel avec sa langue.', r: 'le goût', why: 'GOÛTER avec la LANGUE → le goût.' },
];
function nouvelAnimal() {
  const n = pick(NOUVEAUX);
  const opts = ['la vue', 'l’ouïe', 'l’odorat', 'le toucher', 'le goût'];
  return {
    category: CATEGORY_DEFI,
    type: 'nouvel_animal',
    text: `Un animal qui n’est pas dans ton cahier! De quel sens s’agit-il?\n« ${n.p} »`,
    correct: n.r,
    options: shuffle([n.r, ...shuffle(opts.filter((o) => o !== n.r)).slice(0, 3)]),
    explanation: `${n.r}.\n\n${n.why} Même sans connaître l’animal, le mot-indice donne la réponse.`,
    hint: 'Cherche le mot-indice: yeux, oreilles, bruit, odeur, renifler, tâter, moustaches, langue…',
  };
}

// ----- Choix 4: le POURQUOI -----
const POURQUOI = [
  {
    q: 'Pourquoi l’hypothèse A (« les animaux utilisent leurs oreilles ») n’est-elle pas la meilleure?',
    r: 'Les oreilles aident, mais les animaux utilisent aussi leurs autres sens.',
    o: ['Les animaux n’ont pas d’oreilles.', 'Les oreilles ne servent à rien la nuit.'],
    why: 'La chouette et la chauve-souris utilisent l’ouïe, oui. Mais le loup utilise l’odorat, la souris le toucher, le chat la vue: pas SEULEMENT les oreilles.',
  },
  {
    q: 'Pourquoi l’hypothèse B (« leurs yeux la nuit comme le jour ») est-elle fausse?',
    r: 'Sans lumière, les yeux ne voient pas comme le jour.',
    o: ['Parce que les animaux ferment les yeux la nuit.', 'Parce que les animaux n’ont pas d’yeux.'],
    why: 'Pour voir, il faut de la lumière. La nuit, il y en a très peu: les animaux se servent de leurs autres sens.',
  },
  {
    q: 'La vue de la souris est très faible. Comment fait-elle pour se déplacer la nuit?',
    r: 'Elle se sert de ses vibrisses, de sa queue, de son ouïe et de son odorat.',
    o: ['Elle reste immobile toute la nuit.', 'Elle allume la lumière avec ses yeux.'],
    why: 'Elle a une ouïe et un odorat exceptionnels, et ses vibrisses et sa queue sont des organes du toucher très sensibles.',
  },
  {
    q: 'Pourquoi l’aigle chasse-t-il le jour et non la nuit?',
    r: 'Ses yeux sont adaptés au jour, pas à l’obscurité.',
    o: ['Parce qu’il n’a jamais faim la nuit.', 'Parce qu’il a peur des chauves-souris.'],
    why: 'L’aigle est DIURNE: son excellente vision l’avantage le jour seulement. Les yeux des diurnes ne sont pas adaptés à l’obscurité.',
  },
  {
    q: 'Les souris s’enfuient quand elles entendent arriver un chat. Quel sens les sauve?',
    r: 'l’ouïe: pour certains animaux, les sons sont un mode de survie',
    o: ['la vue: elles voient le chat de loin', 'le goût: elles goûtent le danger'],
    why: 'Le cahier le dit: pour certains animaux, les sons sont un mode de SURVIE. Les souris ENTENDENT le chat et s’enfuient.',
  },
  {
    q: 'La chauve-souris chasse dans le noir complet. Comment trouve-t-elle les insectes?',
    r: 'Ses ultrasons rebondissent sur l’insecte et reviennent à ses oreilles.',
    o: ['Elle voit très bien les insectes dans le noir.', 'Elle sent l’odeur des insectes avec sa langue.'],
    why: 'C’est l’ÉCHOLOCATION: les ultrasons rebondissent sur la proie et reviennent à ses oreilles.',
  },
];
function pourquoi() {
  const p = pick(POURQUOI);
  return {
    category: CATEGORY_DEFI,
    type: 'pourquoi',
    text: p.q,
    correct: p.r,
    options: shuffle([p.r, ...p.o]),
    explanation: `${p.r.charAt(0).toUpperCase() + p.r.slice(1)}\n\n${p.why}`,
    hint: 'Relis la conclusion de ta fiche.',
  };
}

// ----- Choix 5: vrai ou faux, un seul détail piégé -----
const VF_DEFI = [
  { p: 'La chouette lapone entend des proies cachées sous la neige à 100 km.', r: 'faux', why: 'À 100 MÈTRES (100 m), pas 100 kilomètres! Lis bien l’unité.' },
  { p: 'L’ouïe du chien est environ six fois plus développée que celle de l’être humain.', r: 'vrai', why: 'C’est écrit dans le DOC 2: environ six fois.' },
  { p: 'L’aigle voit très bien la nuit.', r: 'faux', why: 'L’aigle est DIURNE: sa vision excellente l’avantage le JOUR seulement.' },
  { p: 'La souris a une excellente vue.', r: 'faux', why: 'Sa vue est très FAIBLE. Ce sont son ouïe et son odorat qui sont exceptionnels.' },
  { p: 'Le guépard marque son territoire avec sa langue.', r: 'faux', why: 'Avec son ODEUR (l’odorat), pas avec sa langue.' },
  { p: 'Le léopard fait sa toilette en se léchant les pattes.', r: 'vrai', why: 'DOC 2: la langue ne sert pas seulement à goûter.' },
  { p: 'Les vibrisses détectent les couleurs.', r: 'faux', why: 'Elles détectent les mouvements de l’air et les VIBRATIONS (le toucher). Les couleurs, c’est la vue.' },
  { p: 'Le caméléon attrape ses proies avec sa langue.', r: 'vrai', why: 'DOC 2: la langue a d’autres fonctions que goûter.' },
  { p: 'La mouche doit tourner la tête pour voir derrière elle.', r: 'faux', why: 'Ses grands yeux voient tout autour d’elle SANS bouger la tête.' },
  { p: 'TOUS les animaux voient de la même manière.', r: 'faux', why: 'TOUS → piège! La plupart ont la vue, mais ils ne voient pas tous de la même manière.' },
  { p: 'Certains animaux nocturnes ont une très mauvaise vue.', r: 'vrai', why: 'CERTAINS: la souris, par exemple. Elle se sert de ses autres sens.' },
  { p: 'Le loup se sert seulement de ses yeux pour chasser la nuit.', r: 'faux', why: 'SEULEMENT → piège! Son odorat est très puissant: il sent une proie à des kilomètres.' },
];
function vraiFauxDefi() {
  const v = pick(VF_DEFI);
  return {
    category: CATEGORY_DEFI,
    type: 'vrai_faux_defi',
    text: `Vrai ou faux? Lis CHAQUE mot.\n« ${v.p} »`,
    correct: v.r,
    options: ['vrai', 'faux'],
    explanation: `${v.r.toUpperCase()}.\n\n${v.why}`,
    hint: 'Un seul mot peut rendre la phrase fausse: un chiffre, une unité, TOUS, SEULEMENT.',
  };
}

function buildDefi() {
  return pickAdaptive(CATEGORY_DEFI, [
    // Plus de la moitié à ÉCRIRE: c'est ce que le parent a demandé.
    { type: 'ecris_sens_manquant', w: 12, build: ecrisSensManquant, dur: true },
    { type: 'ecris_organe', w: 12, build: ecrisOrgane, dur: true },
    { type: 'ecris_animal', w: 16, build: ecrisAnimal, dur: true },
    { type: 'ecris_animal_sens', w: 12, build: ecrisAnimalSens, dur: true },
    { type: 'ecris_mot', w: 18, build: ecrisMot, dur: true },
    { type: 'intrus', w: 8, build: intrus },
    { type: 'en_commun', w: 8, build: enCommun },
    { type: 'nouvel_animal', w: 12, build: nouvelAnimal, dur: true },
    { type: 'pourquoi', w: 12, build: pourquoi, dur: true },
    { type: 'vrai_faux_defi', w: 12, build: vraiFauxDefi },
  ], (q) => `${q.type}|${q.text}`);
}

export function generateSciencesNuitDefi() {
  return buildDefi();
}

export default generateSciencesNuit;
