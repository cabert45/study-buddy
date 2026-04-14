// Curated YouTube video links for each category
// Channels: Maître Lucas, Foufou, Alloprof, Calcul Mental Facile

export const videoLinks = {
  // MATH
  calcul: [
    { title: 'Addition avec retenue', url: 'https://www.youtube.com/results?search_query=addition+retenue+2e+ann%C3%A9e+maitre+lucas', channel: 'Recherche' },
    { title: 'Soustraction avec emprunt', url: 'https://www.youtube.com/results?search_query=soustraction+emprunt+CE1+maitre+lucas', channel: 'Recherche' },
    { title: 'Additionner des dizaines entières', url: 'https://www.youtube.com/watch?v=2MxQ0kVBXzE', channel: 'Maître Lucas' },
  ],
  terme: [
    { title: 'Terme manquant - Addition', url: 'https://www.youtube.com/results?search_query=terme+manquant+addition+2e+ann%C3%A9e', channel: 'Recherche' },
    { title: 'Trouver le nombre manquant', url: 'https://www.youtube.com/results?search_query=nombre+manquant+CE1+math', channel: 'Recherche' },
  ],
  multi_step: [
    { title: 'Problèmes à étapes', url: 'https://www.youtube.com/results?search_query=probl%C3%A8mes+%C3%A0+%C3%A9tapes+CE1+math', channel: 'Recherche' },
    { title: 'Foufou - Problèmes de math', url: 'https://www.youtube.com/watch?v=pE9sMYDFZxo', channel: 'Foufou' },
  ],
  relational: [
    { title: 'De plus, de moins que', url: 'https://www.youtube.com/results?search_query=de+plus+de+moins+que+CE1+math', channel: 'Recherche' },
  ],
  compare: [
    { title: 'Comparer des nombres', url: 'https://www.youtube.com/results?search_query=comparer+nombres+CE1+plus+grand+plus+petit', channel: 'Recherche' },
  ],
  pair_impair: [
    { title: 'Pair et impair', url: 'https://www.youtube.com/results?search_query=pair+impair+CE1+maitre+lucas', channel: 'Recherche' },
  ],
  mental: [
    { title: 'Calcul mental - Addition', url: 'https://www.youtube.com/results?search_query=calcul+mental+addition+CE1', channel: 'Recherche' },
    { title: 'Ajouter 9 (astuce +10 -1)', url: 'https://www.youtube.com/results?search_query=ajouter+9+astuce+CE1+math', channel: 'Recherche' },
    { title: 'Table du 10', url: 'https://www.youtube.com/results?search_query=table+du+10+CE1+compl%C3%A9ments', channel: 'Recherche' },
  ],
  statistique: [
    { title: 'Lire un diagramme à bandes', url: 'https://www.youtube.com/results?search_query=diagramme+%C3%A0+bandes+CE1+lire', channel: 'Recherche' },
    { title: 'Pictogrammes', url: 'https://www.youtube.com/results?search_query=pictogramme+math+CE1+2e+ann%C3%A9e', channel: 'Recherche' },
  ],

  // FRENCH
  determinant: [
    { title: 'Les déterminants', url: 'https://www.youtube.com/results?search_query=les+d%C3%A9terminants+CE1+le+la+les+un+une', channel: 'Recherche' },
    { title: 'Le genre des noms', url: 'https://www.youtube.com/results?search_query=genre+noms+masculin+f%C3%A9minin+CE1', channel: 'Recherche' },
  ],
  verbes: [
    { title: 'Être et avoir', url: 'https://www.youtube.com/results?search_query=%C3%AAtre+avoir+CE1+conjugaison+maitre+lucas', channel: 'Recherche' },
    { title: 'Aller, faire, dire', url: 'https://www.youtube.com/results?search_query=aller+faire+dire+CE1+conjugaison', channel: 'Recherche' },
  ],
  adjectif: [
    { title: "L'adjectif", url: 'https://www.youtube.com/results?search_query=adjectif+CE1+accord+maitre+lucas', channel: 'Recherche' },
    { title: 'Accord de l\'adjectif', url: 'https://www.youtube.com/results?search_query=accord+adjectif+f%C3%A9minin+pluriel+CE1', channel: 'Recherche' },
    { title: 'Lettres muettes', url: 'https://www.youtube.com/results?search_query=lettre+muette+CE1+fran%C3%A7ais', channel: 'Recherche' },
  ],
};

export function getVideosForCategory(category) {
  return videoLinks[category] || [];
}
