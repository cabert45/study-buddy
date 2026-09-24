// La feuille Matcha 3e, Thème 1, Consolidation AS.1.02 (pages A-4 / A-5),
// à l'écran. « Nombres naturels et dénombrement ».
//
// Corrigée le 14 sept. 2026: environ 4/13. Trois malentendus, et la feuille
// est reconstruite AUTOUR d'eux — pas pour le noter une deuxième fois, mais
// pour qu'il comprenne ce qui cloche.
//
//   1. « mille » devient un chiffre de plus, et les zéros disparaissent.
//      mille six cent quinze → 16160 · trois mille quatre-vingts → 3180
//      → Il n'écrit plus le nombre d'un trait: il le pose dans le tableau
//        um/c/d/u, une colonne à la fois. La colonne vide RÉCLAME son zéro.
//
//   2. Il n'échange pas quand une colonne a 10 pièces ou plus.
//      10 plaques, pour lui, c'est « 10 » — pas « 1 000 ». Quatre questions
//      perdues pour cette seule raison (4b, 4c, 4d, 4e).
//      → Il ne tape aucun nombre tant qu'il n'a pas ÉCHANGÉ. Le bouton ne
//        lui donne pas la réponse, il fait le geste du cahier.
//
//   3. Il fait la moitié d'une consigne à deux temps.
//      « Ajoute 2 um ET 4 d » → il a entouré 2 358 au lieu de 2 398.
//      → Les deux étapes sont séparées à l'écran, et cochées une par une.

const n = (um, c, d, u) => um * 1000 + c * 100 + d * 10 + u;

export const FEUILLE_MATCHA = {
  code: 'AS.1.02',
  titre: 'Nombres naturels et dénombrement',
  cahier: 'Matcha 3e année · Thème 1',
  questions: [
    // ===== 1. Écris chaque nombre en chiffres (le tableau force les zéros) =====
    { id: 'm1a', numero: 1, sousTitre: 'a)', type: 'ecrire', mots: 'huit cent soixante', valeur: 860 },
    {
      id: 'm1b', numero: 1, sousTitre: 'b)', type: 'ecrire',
      mots: 'mille six cent quinze', valeur: 1615,
      piege: '« mille » tout seul, c\'est UN millier: on écrit 1 dans la colonne um, pas le mot.',
    },
    { id: 'm1c', numero: 1, sousTitre: 'c)', type: 'ecrire', mots: 'cinq mille cent quarante-deux', valeur: 5142 },
    {
      id: 'm1d', numero: 1, sousTitre: 'd)', type: 'ecrire',
      mots: 'neuf mille quatre cents', valeur: 9400,
      piege: 'On n\'entend ni les dizaines ni les unités: ces deux colonnes prennent un 0.',
    },
    {
      id: 'm1e', numero: 1, sousTitre: 'e)', type: 'ecrire',
      mots: 'trois mille quatre-vingts', valeur: 3080,
      piege: 'On n\'entend aucune centaine: la colonne c prend un 0. quatre-vingts = 8 dizaines.',
    },

    // ===== 2. Dénombrer un grand tas: par paquets de 10 =====
    {
      // `valeur` autant que `total`: sans elle, la question n'avait pas de
      // réponse attendue et « Vérifier » restait mort.
      id: 'm2', numero: 2, type: 'compter_dizaines', total: 63, valeur: 63,
      consigne: 'Dénombre les graines de tournesol.',
      aide: 'Ne compte pas une par une — tu perds ta place. Compte les rangées de 10.',
    },

    // ===== 3. Lire un abaque =====
    { id: 'm3a', numero: 3, sousTitre: 'a)', type: 'lire_abaque', valeur: 6035 },
    { id: 'm3b', numero: 3, sousTitre: 'b)', type: 'lire_abaque', valeur: 2714 },

    // ===== 4. Les blocs — il faut ÉCHANGER avant de pouvoir lire =====
    // Les quantités sont celles de la feuille, AVANT tout échange.
    {
      id: 'm4a', numero: 4, sousTitre: 'a)', type: 'echange',
      depart: { um: 2, c: 4, d: 1, u: 3 }, valeur: n(2, 4, 1, 3),
    },
    {
      id: 'm4b', numero: 4, sousTitre: 'b)', type: 'echange',
      depart: { um: 0, c: 6, d: 2, u: 11 }, valeur: 631,
      note: 'Il a écrit 602: les 11 petits cubes sont restés des « 11 ».',
    },
    {
      id: 'm4c', numero: 4, sousTitre: 'c)', type: 'echange',
      depart: { um: 0, c: 10, d: 4, u: 4 }, valeur: 1044,
      note: 'Il a écrit 1404. Dix plaques, ça fait mille — pas « dix ».',
    },
    {
      id: 'm4d', numero: 4, sousTitre: 'd)', type: 'echange',
      depart: { um: 3, c: 9, d: 10, u: 29 }, valeur: 4029,
      note: 'Trois échanges de suite ici.',
    },
    {
      id: 'm4e', numero: 4, sousTitre: 'e)', type: 'echange',
      depart: { um: 1, c: 6, d: 14, u: 18 }, valeur: 1758,
    },

    // ===== 5. Deux consignes dans la même phrase =====
    {
      id: 'm5', numero: 5, type: 'deux_etapes',
      depart: 358,
      etapes: [
        { mot: '2 unités de mille', valeur: 2000 },
        { mot: '4 dizaines', valeur: 40 },
      ],
      sacs: [2358, 2758, 2398],
      histoire: 'La mésange Citronnelle ne sait plus dans quel sac se trouve sa réserve de graines. Aide Citronnelle!',
    },
  ],
};

export const NOMS_BLOCS = {
  um: { un: 'gros cube', plusieurs: 'gros cubes', vaut: 1000 },
  c: { un: 'plaque', plusieurs: 'plaques', vaut: 100 },
  d: { un: 'bâtonnet', plusieurs: 'bâtonnets', vaut: 10 },
  u: { un: 'petit cube', plusieurs: 'petits cubes', vaut: 1 },
};
