// Weekly dictée words — all themes
// Teacher gives word lists in advance, Ryan studies them for Tuesday's test

export const dicteeWeeks = {
  // ======= THEME 6 (CURRENT) =======
  'theme6_s1': {
    name: 'Thème 6 - Semaine 1',
    rule: 'Le son "é" à la fin d\'un verbe à l\'infinitif s\'écrit toujours -er',
    testDate: 'Mardi',
    words: [
      { correct: 'aller', wrongs: ['allé', 'alé', 'allère'] },
      { correct: 'arriver', wrongs: ['arrivé', 'ariver', 'ariveer'] },
      { correct: 'pincer', wrongs: ['pincé', 'painser', 'pinser'] },
      { correct: 'réviser', wrongs: ['révisé', 'révisère', 'révizer'] },
      { correct: 'amuser', wrongs: ['amusé', 'amusère', 'ammuzer'] },
      { correct: 'passer', wrongs: ['passé', 'pacer', 'pasère'] },
      { correct: 'rester', wrongs: ['resté', 'rèster', 'restère'] },
      { correct: 'trouver', wrongs: ['trouvé', 'troover', 'trouvère'] },
      { correct: 'appeler', wrongs: ['appelé', 'apeler', 'apellé'] },
      { correct: 'penser', wrongs: ['pensé', 'panser', 'pensère'] },
    ],
  },
  'theme6_s2': {
    name: 'Thème 6 - Semaine 2',
    rule: 'Le son "p" qui s\'écrit p en début de mot',
    testDate: 'Mardi',
    words: [
      { correct: 'paire', wrongs: ['père', 'pére', 'pair'] },
      { correct: 'parce que', wrongs: ['parce ke', 'parsque', 'pasque'] },
      { correct: 'partout', wrongs: ['partoue', 'parto', 'partous'] },
      { correct: 'prendre', wrongs: ['prandre', 'prendr', 'prandres'] },
      { correct: 'par', wrongs: ['pare', 'pars', 'pard'] },
      { correct: "parce qu'", wrongs: ["parsqu'", "pasqu'", "parsk'"] },
      { correct: 'patate', wrongs: ['pattate', 'patatte', 'patat'] },
      { correct: 'propre', wrongs: ['prope', 'propres', 'propere'] },
      { correct: 'parasol', wrongs: ['parassol', 'parasole', 'parazol'] },
      { correct: 'parent', wrongs: ['paran', 'parant', 'parents'] },
      { correct: 'pépin', wrongs: ['pépain', 'pépine', 'paepin'] },
    ],
  },
  'theme6_s3': {
    name: 'Thème 6 - Semaine 3',
    rule: 'Le son "o" qui s\'écrit o, au ou eau',
    testDate: 'Mardi',
    words: [
      { correct: "aujourd'hui", wrongs: ["aujourdui", "aujourd'huit", "aujour'hui"] },
      { correct: 'autre', wrongs: ['otre', 'autres', 'autr'] },
      { correct: 'motoneige', wrongs: ['motonège', 'mautoneige', 'motonneige'] },
      { correct: 'peau', wrongs: ['po', 'peaux', 'paux'] },
      { correct: 'auto', wrongs: ['oto', 'autau', 'autos'] },
      { correct: 'chameau', wrongs: ['chamau', 'chamot', 'chameaux'] },
      { correct: 'nouveau', wrongs: ['nouvau', 'nouvo', 'noveau'] },
      { correct: 'tableau', wrongs: ['tablau', 'tablo', 'tableaux'] },
      { correct: 'autour', wrongs: ['otour', 'autoure', 'auteur'] },
      { correct: 'moto', wrongs: ['mauto', 'motau', 'moteau'] },
      { correct: 'nouvelle', wrongs: ['nouvel', 'nouvèle', 'novelle'] },
    ],
  },
  'theme6_s4': {
    name: 'Thème 6 - Semaine 4',
    rule: 'Des mots dont le n devient m devant b ou p',
    testDate: 'Mardi',
    words: [
      { correct: 'campagne', wrongs: ['canpagne', 'campagn', 'kampagne'] },
      { correct: 'compote', wrongs: ['conpote', 'compot', 'kompote'] },
      { correct: 'printemps', wrongs: ['prin temps', 'printan', 'printemp'] },
      { correct: 'tomber', wrongs: ['tonber', 'tombé', 'tombère'] },
      { correct: 'compost', wrongs: ['conpost', 'compos', 'compauste'] },
      { correct: 'concombre', wrongs: ['conconbre', 'concombr', 'koncombre'] },
      { correct: 'temps', wrongs: ['tan', 'tant', 'tems'] },
      { correct: 'trombone', wrongs: ['tronbone', 'trombon', 'tronbon'] },
    ],
  },

  // ======= PAST WEEKS (for cumulative review — Ryan got 0/10 on cumulative test!) =======
  'theme4_past': {
    name: 'Révision Thème 4',
    rule: 'Mots des dictées passées — révision cumulative',
    testDate: 'Révision',
    words: [
      { correct: 'lasagnes', wrongs: ['lasagne', 'lazagnes', 'lassagnes'] },
      { correct: 'treize', wrongs: ['treizes', 'trèze', 'treyze'] },
      { correct: 'roses', wrongs: ['rose', 'rozes', 'rauses'] },
      { correct: 'Grand-papa', wrongs: ['Grandpapa', 'grand-papa', 'Grand-Papa'] },
      { correct: 'à', wrongs: ['a', 'ah', 'â'] },
      { correct: 'faire', wrongs: ['fère', 'faires', 'fair'] },
      { correct: 'reine', wrongs: ['rène', 'rein', 'rennes'] },
      { correct: 'poires', wrongs: ['poire', 'pwares', 'poirs'] },
      { correct: 'sont', wrongs: ['son', 'sons', 'sonts'] },
      { correct: 'poivrons', wrongs: ['poivron', 'pwavrons', 'poivronts'] },
      { correct: 'au', wrongs: ['o', 'aux', 'haut'] },
      { correct: 'et', wrongs: ['est', 'é', 'è'] },
      { correct: 'seule', wrongs: ['seul', 'seula', 'sœule'] },
      { correct: 'celle', wrongs: ['cèle', 'cell', 'celles'] },
      { correct: 'tout', wrongs: ['tous', 'toute', 'toot'] },
      { correct: 'seul', wrongs: ['sœul', 'seuls', 'sèul'] },
      { correct: 'en', wrongs: ['an', 'ens', 'em'] },
    ],
  },
  'theme5_past': {
    name: 'Révision Thème 5',
    rule: 'Mots des dictées passées — révision cumulative',
    testDate: 'Révision',
    words: [
      { correct: 'fantôme', wrongs: ['fontôme', 'fantome', 'fantaume'] },
      { correct: 'à', wrongs: ['a', 'ah', 'â'] },
      { correct: 'sous', wrongs: ['sou', 'sout', 'soux'] },
      { correct: 'foulard', wrongs: ['foular', 'foullard', 'foulart'] },
      { correct: 'ananas', wrongs: ['ananass', 'ananat', 'anana'] },
      { correct: 'dernière', wrongs: ['derniere', 'dernier', 'dernièr'] },
      { correct: 'élèves', wrongs: ['élèvent', 'éleves', 'éléves'] },
      { correct: 'vieux', wrongs: ['vieus', 'vieu', 'vieuxs'] },
      { correct: 'souvent', wrongs: ['souvant', 'souven', 'sauvent'] },
      { correct: 'vieille', wrongs: ['vieil', 'vielle', 'viéille'] },
      { correct: 'faux', wrongs: ['fau', 'fauxs', 'fôx'] },
      { correct: 'fausse', wrongs: ['fôsse', 'fauce', 'fausses'] },
      { correct: 'licorne', wrongs: ['licorn', 'licornes', 'licone'] },
      { correct: 'quarante', wrongs: ['carante', 'quarrante', 'quaran'] },
      { correct: 'cactus', wrongs: ['kactus', 'cactusse', 'cactu'] },
      { correct: 'quelques', wrongs: ['quelque', 'kelques', 'qelques'] },
      { correct: 'coqs', wrongs: ['cocs', 'coks', 'coq'] },
      { correct: 'encore', wrongs: ['oncor', 'encor', 'ancore'] },
      { correct: 'figure', wrongs: ['figur', 'figures', 'figeure'] },
    ],
  },
};

let currentWeekKey = 'theme6_s1';

export function setCurrentWeek(key) {
  currentWeekKey = key;
}

export function getCurrentWeekWords(weekKey) {
  return dicteeWeeks[weekKey || currentWeekKey] || dicteeWeeks['theme6_s1'];
}

export function getAllWeekKeys() {
  return Object.keys(dicteeWeeks);
}
