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

function buildOne() {
  return pickAdaptive(CATEGORY, [
    { type: 'diurne_nocturne', w: 18, build: diurneNocturne },
    { type: 'definition', w: 16, build: definition },
    { type: 'trou', w: 24, build: trou },
    { type: 'fonction', w: 14, build: fonction },
    { type: 'quel_sens', w: 20, build: quelSens },
    { type: 'vrai_faux', w: 18, build: vraiFaux },
    { type: 'chauve_souris', w: 12, build: chauveSouris },
    { type: 'conclusion', w: 12, build: conclusion },
    { type: 'organe', w: 10, build: organe },
  ], (q) => `${q.type}|${q.text}`);
}

export function generateSciencesNuit() {
  return buildOne();
}

export default generateSciencesNuit;
