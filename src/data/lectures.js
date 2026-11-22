// Les textes à lire à voix haute (« Écoute, puis lis », comme Boukili).
//
// « Le monstre du lac » — Stéphanie Gervais, Dominique et compagnie, 2023,
// tel qu'il est reproduit dans Jazz 3e année, p. 56-57 (extrait sous licence
// COPIBEC). Recopié des photos du 22 nov. 2026 pour le devoir de lecture de
// Ryan (semaine du 23 nov.): l'app le lit pour qu'il entende comment on le
// lit, puis il le lit lui-même. Les « […] » sont ceux du cahier.
//
// Un paragraphe = un tour de lecture (ce qu'il lit d'un coup au micro).
// `dire` = la version pour la voix, quand l'écrit se lit mal tel quel.

export const LECTURES = {
  monstre_du_lac: {
    titre: 'Le monstre du lac',
    source: 'Jazz 3e année, p. 56-57 · Stéphanie Gervais, Le monstre du lac (2023)',
    questions: 'monstre_du_lac',
    // Trois morceaux, un par soir (le parent, 22 nov.: « It's such a long
    // text… »). Indices de paragraphes [premier, dernier], et les lignes du cahier.
    morceaux: [
      { de: 0, a: 5, lignes: '1 à 21', titre: 'Le vieux camp' },
      { de: 6, a: 8, lignes: '22 à 35', titre: 'La nuit du monstre' },
      { de: 9, a: 12, lignes: '36 à 55', titre: 'La légende' },
    ],
    paragraphes: [
      ['— Ce que je vais vous raconter remonte à très longtemps, à une époque où les téléphones cellulaires, les ordinateurs et les tablettes n\'existaient même pas…'],
      ['— Wow, vraiment? lance Magalie, étonnée.'],
      [
        '— Je devais alors avoir une dizaine d\'années.',
        'Mes parents, c\'est-à-dire vos arrière-grands-parents, […] venaient tout juste d\'acheter la parcelle de terrain sur laquelle nous nous trouvons présentement.',
        'Cette année-là, à l\'endroit où est le chalet, il n\'y avait que des arbres.',
        'Mes parents, mes frères, mes sœurs et moi-même dormions dans un ancien camp de bûcherons qui se trouvait un peu plus loin, là-bas.',
      ],
      [
        'Les trois amis se tournent vers la direction que leur indique Léo.',
        'Ils n\'y voient qu\'une toute petite clairière.',
      ],
      ['— Mais il est où, ce camp? demande Alexandra, intriguée.'],
      [
        '— Il n\'existe plus, répond Yolande.',
        'Nous l\'avons fait démolir il y a quelques années.',
        'Il était trop vieux et risquait de s\'écrouler.',
      ],
      [
        '— Je me souviens qu\'à cette époque, reprend Léo, mes parents et mes oncles travaillaient très fort pour défricher une plus grande superficie de forêt.',
        'Ils voulaient construire un nouveau chalet qui pourrait nous accueillir tous et nous offrir beaucoup plus de confort.',
        { t: 'Un certain soir, aux environs de 23 h, un bruit m\'a réveillé.', dire: 'Un certain soir, aux environs de vingt-trois heures, un bruit m\'a réveillé.' },
      ],
      [
        'Je me suis levé et je suis allé vers la fenêtre de ma chambre.',
        'Mes frères et mes sœurs étaient toujours endormis.',
        'Et là, j\'ai vu mes parents courir vers le lac, en pyjama.',
        'Ils fixaient la surface de l\'eau et semblaient stupéfaits.',
        'Puis, je l\'ai vue moi aussi, cette étrange créature aquatique, parcourir le lac d\'est en ouest, en laissant derrière elle un énorme sillage…',
      ],
      [
        'Magalie se met à frissonner.',
        'Craintive, elle s\'agrippe à sa couverture tout en jetant quelques regards en direction du lac. […]',
      ],
      [
        '— Le lendemain matin, reprend Léo, j\'ai surpris mes parents en pleine discussion avec un vieil homme d\'origine autochtone qui habitait tout près d\'ici.',
        'Ils discutaient de ce qu\'ils avaient vu dans le lac la veille au soir.',
        'Ils parlaient de la légende du monstre du lac des Îles.',
        'Selon ce que racontait le vieillard, un énorme monstre aquatique vivrait ici depuis la nuit des temps.',
        'Cette créature n\'apprécierait pas la présence des humains.',
      ],
      ['Léo fait une pause.'],
      ['Il boit quelques gorgées de chocolat chaud, puis reprend son histoire :'],
      [
        '— Un peu plus tard dans la journée, j\'ai questionné mes parents à propos de cette légende et de ce que j\'avais aperçu la veille.',
        'Mes parents m\'ont répondu que j\'avais probablement rêvé.',
        'De plus, ils ont tout nié à propos de la légende.',
        'Nous n\'en avons jamais reparlé, et je n\'ai jamais revu ce monstre.',
      ],
    ],
  },
};

// Une phrase peut être une chaîne ou { t, dire }.
export const texteDe = (p) => (typeof p === 'string' ? p : p.t);
export const voixDe = (p) => (typeof p === 'string' ? p : p.dire || p.t).replace(/\s*\[…\]\s*/g, ' ').trim();

// ---- La correction de la lecture ----
//
// On compare les mots du texte à ce que Scribe a entendu: plus longue
// sous-suite commune (les mots dans le bon ordre). Ce que ça mesure: les mots
// LUS et les mots SAUTÉS ou remplacés. Ce que ça ne mesure pas: l'intonation,
// et une petite erreur de prononciation que Scribe « corrige » tout seul.
const normaliser = (s) => s
  .toLowerCase()
  .replace(/[’']/g, ' ')
  .replace(/[—–\-…«»"“”.,;:!?()[\]]/g, ' ')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/œ/g, 'oe')
  .split(/\s+/)
  .filter(Boolean);

// Les nombres que Scribe écrit en chiffres ou en lettres.
const EQUIV = { 23: 'vingt-trois', h: 'heures' };

export function motsAffiches(paragraphe) {
  // Les mots tels qu'ils s'affichent (avec leur ponctuation), un par case.
  return paragraphe.map(texteDe).join(' ').replace(/\s*\[…\]\s*/g, ' ').split(/\s+/).filter((m) => m && m !== '—');
}

export function corrigerLecture(paragraphe, transcription) {
  const affiches = motsAffiches(paragraphe);
  // Chaque mot affiché peut donner plusieurs mots normalisés (c'est-à-dire).
  const attendus = [];
  affiches.forEach((m, i) => normaliser(m).forEach((n) => attendus.push({ n, i })));
  const lus = normaliser(String(transcription || '').replace(/vingt-trois/g, '23').replace(/heures?/g, 'h'));
  const eq = (a, b) => a === b || EQUIV[a] === b || (a.length > 3 && b.length > 3 && (a.startsWith(b) || b.startsWith(a)) && Math.abs(a.length - b.length) <= 1);

  // LCS
  const A = attendus.length, B = lus.length;
  const t = Array.from({ length: A + 1 }, () => new Int16Array(B + 1));
  for (let x = A - 1; x >= 0; x--) {
    for (let y = B - 1; y >= 0; y--) {
      t[x][y] = eq(attendus[x].n, lus[y]) ? t[x + 1][y + 1] + 1 : Math.max(t[x + 1][y], t[x][y + 1]);
    }
  }
  const trouve = new Array(A).fill(false);
  let x = 0, y = 0;
  while (x < A && y < B) {
    if (eq(attendus[x].n, lus[y])) { trouve[x] = true; x++; y++; }
    else if (t[x + 1][y] >= t[x][y + 1]) x++;
    else y++;
  }
  // Un mot affiché est « lu » si toutes ses parties ont été entendues.
  const ok = affiches.map((_, i) => attendus.filter((a) => a.i === i).every((a) => trouve[attendus.indexOf(a)]));
  const nbOk = ok.filter(Boolean).length;
  return { mots: affiches.map((m, i) => ({ m, ok: ok[i] })), nbOk, total: affiches.length, pct: affiches.length ? Math.round((nbOk / affiches.length) * 100) : 0 };
}
