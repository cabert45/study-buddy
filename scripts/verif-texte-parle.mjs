// Ce que la voix reçoit VRAIMENT, pour de vraies questions de l'app.
//   node scripts/verif-texte-parle.mjs
//
// Pourquoi ce fichier: « 4 + 4 = ? » partait tel quel, avec ses symboles, et la
// voix en faisait ce qu'elle voulait — Ryan entendait « quatre quatre » et
// attendait la question. On ne peut pas écouter depuis un test; on peut lire la
// phrase exacte qui part à la voix, et c'est elle qui décide de tout.
import { cleanForSpeech } from '../src/utils/speech.js';

let échecs = 0;
function dit(entree, attendu) {
  const obtenu = cleanForSpeech(entree);
  const ok = obtenu === attendu;
  if (!ok) échecs++;
  console.log(`  ${ok ? 'ok   ' : 'ÉCHEC'}  « ${entree.replace(/\n/g, ' / ')} »\n         → « ${obtenu} »`
    + (ok ? '' : `\n         attendu: « ${attendu} »`));
}

console.log('\n— Les calculs se disent —');
dit('4 + 4 = ?', '4 plus 4 égale combien');
dit('12 − 6 = ?', '12 moins 6 égale combien');
dit('? + 21 = 45', 'quel nombre plus 21 égale 45');
dit('70 − ? = 47', '70 moins quel nombre égale 47');
dit('24 + ? = 53', '24 plus quel nombre égale 53');
dit('3 × 4 = ?', '3 fois 4 égale combien');
dit('12 ÷ 3 = ?', '12 divisé par 3 égale combien');

console.log('\n— Les nombres du cahier Matcha —');
dit('Écris en chiffres:\n\n« deux mille quatre cent sept »', 'Écris en chiffres: « deux mille quatre cent sept »');
dit('Ajoute 2 unités de mille ET 4 dizaines au nombre 2 407.', 'Ajoute 2 unités de mille ET 4 dizaines au nombre 2407.');
dit('Il y a 1 626 carottes.', 'Il y a 1626 carottes.');

console.log('\n— Ce qu’il ne faut SURTOUT pas abîmer —');
// Le trait d'union d'un nombre n'est pas un moins.
dit('« quatre-vingt-dix »', '« quatre-vingt-dix »');
dit('Conjugue « manger » au PASSÉ COMPOSÉ avec « il »:', 'Conjugue « manger » au PASSÉ COMPOSÉ avec « il »:');
// Un vrai point d'interrogation de phrase reste un point d'interrogation.
dit('Combien de sacs PLEINS peut-on faire?', 'Combien de sacs PLEINS peut-on faire?');
dit('Quel signe va dans la case?', 'Quel signe va dans la case?');
dit('Noa a 38 bonbons. Ryan en a 6 de moins que Noa.', 'Noa a 38 bonbons. Ryan en a 6 de moins que Noa.');
dit('chanter → chanté', 'chanter devient chanté');

console.log(échecs === 0 ? '\n✅ Tout passe.\n' : `\n❌ ${échecs} échec(s).\n`);
process.exit(échecs === 0 ? 0 : 1);
