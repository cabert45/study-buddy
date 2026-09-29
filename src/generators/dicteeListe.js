// Dictée — choisir la bonne écriture, sur les listes de 3e année.
//
// « C'est ça que je veux pour la dictée. » (29 sept. 2026, captures d'écran à
// l'appui) Les deux écrans de 2e année, et rien d'autre:
//   ▶ Choix multiple  — la voix dit le mot, quatre écritures à l'écran
//   🃏 Écris les mots  — la dictée tapée, avec sa barre de maîtrise
//
// Ce générateur est le premier des deux, branché sur le cahier de 3e année au
// lieu du Thème 7 de l'an dernier. Même forme de question que
// `generateDicteeSemaine`, donc exactement le même écran — c'est voulu: c'est
// ce format-là qui l'a débloqué en 2e année.
import { dicteeDeLaListe, listeCetteSemaine, cleDictee } from '../data/orthographeQuotidien';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// La liste visée. Par défaut celle de la semaine; le menu peut en demander une
// autre (révision d'une liste déjà vue).
let listeCourante = null;
export function setListeDictee(cle) {
  listeCourante = cle || null;
}

function laListe() {
  const cle = listeCourante || cleDictee(listeCetteSemaine().id);
  return dicteeDeLaListe(cle) || dicteeDeLaListe(cleDictee(listeCetteSemaine().id));
}

export function generateDicteeListe() {
  const liste = laListe();
  if (!liste || !liste.words?.length) return null;
  const mot = liste.words[Math.floor(Math.random() * liste.words.length)];

  // Trois mauvaises écritures, jamais moins: un choix à deux options se devine.
  const faux = (mot.wrongs || []).filter((w) => w && w !== mot.correct);
  while (faux.length < 3) faux.push(mot.correct + 'e'.repeat(faux.length + 1));

  // L'écran préfixe déjà « Dictée — »; `liste.name` vaut « Dictée — Liste 3 ».
  // Sans ça, le bandeau affiche « DICTÉE — DICTÉE — LISTE 3 ».
  const titre = `Liste ${liste.listeNumero}`;

  return {
    category: 'dictee_liste',
    type: 'dictee_liste',
    text: titre,
    spokenWord: mot.correct,   // PracticeSession le dit lentement à l'ouverture
    correct: mot.correct,
    options: shuffle([mot.correct, ...faux.slice(0, 3)]),
    // Le truc du mot sert d'explication quand il se trompe: il ne suffit pas
    // de lui montrer la bonne écriture, il faut lui redonner le geste
    // (« je dis la bordure, j'entends le D »).
    explanation: mot.truc ? `${mot.correct} — ${mot.truc}` : `La bonne orthographe est: ${mot.correct}`,
    hint: mot.truc || null,
    weekName: titre,
  };
}
