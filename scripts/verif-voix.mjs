// Quelle voix parle VRAIMENT français?
//   node scripts/verif-voix.mjs
//
// À relancer quand une nouvelle liste de mots arrive, ou quand on veut changer
// de voix. Le résultat du 28 sept. 2026 est recopié dans server.js, au-dessus
// de VOIX_FR_DEFAUT — si on change la voix par défaut, on refait la mesure et
// on met le tableau à jour. Une voix « qui a l'air française » parce qu'elle
// porte un prénom français, ça ne veut rien dire: Émilie disait « board » pour
// « bord ».
//
// Ça consomme des crédits ElevenLabs (un clip par mot et par voix), mais le
// serveur met chaque clip en cache: une deuxième exécution ne coûte rien.

//
// On ne peut pas juger un accent depuis une session. Mais on peut mesurer une
// chose qui ne ment pas: on fait dire un mot francais a la voix, on renvoie le
// son a la transcription, et on regarde si le MOT ressort. « bord » qui revient
// « board » et « nid » qui revient « need », ce n'est pas une nuance d'accent:
// c'est une voix anglaise qui lit du francais.
import { writeFileSync, readFileSync } from 'node:fs';
const APP = 'https://study-buddy-production-79f1.up.railway.app';
const S = 'C:/Users/ZBook/AppData/Local/Temp/claude/c--Users-ZBook-Documents-Study-Buddy-study-buddy/68176904-da61-4b22-b410-05b3bc867093/scratchpad';

const VOIX = [
  { id: 'DmA5Za3LKQf1NQcbHfdZ', nom: 'Emilie (actuelle)' },
  { id: 'Cy2zXKmu2kQeAuze0rzV', nom: 'Chloe' },
  { id: 'LAUUUZAQpu1khF4zl6Vl', nom: 'Lucie' },
  { id: 'uOw88F5bjqRiVuZLhXEA', nom: 'Victoria' },
  { id: 'LFtQZWdaqmvamcTNGpwl', nom: 'Lucie (posee)' },
  { id: 'aiFobLbZNvpjmWZD7HBh', nom: 'Alex' },
  { id: '43TArLZXN5r3L8mJ6AGR', nom: 'Quentin' },
];
// Les mots qui ont rate, plus deux pieges classiques d'une voix anglaise.
const EPREUVE = ['bord', 'nid', 'doigt', 'soie', 'août', 'sourcil'];
const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '');

for (const v of VOIX) {
  const details = [];
  let bons = 0;
  for (const mot of EPREUVE) {
    const p = new URLSearchParams({ text: mot, voice: v.id, slow: '1' });
    const r = await fetch(`${APP}/api/tts?${p}`);
    if (!r.ok) { details.push(`${mot}:http${r.status}`); continue; }
    const buf = Buffer.from(await r.arrayBuffer());
    writeFileSync(`${S}/v.mp3`, buf);
    const t = await fetch(`${APP}/api/ecoute`, { method: 'POST', headers: { 'Content-Type': 'audio/mpeg' }, body: readFileSync(`${S}/v.mp3`) });
    const j = await t.json().catch(() => ({}));
    const entendu = String(j.texte || '').trim();
    const ok = norm(entendu).includes(norm(mot)) || (norm(mot).length > 3 && norm(mot).includes(norm(entendu)));
    if (ok) bons++;
    details.push(`${mot}→${entendu || '?'}`);
  }
  console.log(`${String(bons).padStart(2)}/${EPREUVE.length}  ${v.nom.padEnd(18)} ${details.join('  ')}`);
}
