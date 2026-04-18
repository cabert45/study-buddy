// Weekly dictée words — Theme 6
// Teacher gives word lists in advance, Ryan studies them for Tuesday's test
// Each week has a focus rule and a list of words

export const dicteeWeeks = {
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
      { correct: 'paire', wrongs: ['père', 'pére', 'paire'] },
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
};

// Get the current week's words (default to first available)
export function getCurrentWeekWords(weekKey = 'theme6_s1') {
  return dicteeWeeks[weekKey] || dicteeWeeks['theme6_s1'];
}

export function getAllWeekKeys() {
  return Object.keys(dicteeWeeks);
}
