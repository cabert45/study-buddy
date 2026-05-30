// Word Problem generator — multi-step problems
// Ryan's #3 weakness: scored 0/11 on Section 22
// Updated with actual exam themes: zoo, château, poissons, autobus
// May 8 2026: added stepCalcs to force démarche (show your work) instead of mental math

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const names = ['Noa', 'Léo', 'Ryan', 'Sofia', 'Justin', 'Rémi', 'Olivia', 'Mathieu', 'Daphnée', 'Chloé'];

function pickName(exclude = []) {
  const available = names.filter((n) => !exclude.includes(n));
  return available[Math.floor(Math.random() * available.length)];
}

const templates = [
  // Zoo bus problem
  () => {
    const a = rand(20, 49);
    const b = rand(20, 49);
    if (a + b > 99) return null;
    const correct = a + b;
    return {
      text: `La sortie au zoo est terminée. Il y a ${a} élèves dans le 1er autobus et ${b} dans le 2e autobus. Combien d'élèves sont allés au zoo?`,
      steps: [{ label: 'Étape 1', text: `${a} + ${b} = ${correct}`, operation: 'addition' }],
      stepCalcs: [{ a, b, op: '+', result: correct, label: 'Combien en tout?' }],
      operationQuestion: 'Quelle opération faut-il faire?',
      correctOperation: 'addition',
      correct,
    };
  },
  // Château princess problem
  () => {
    const n1 = pickName();
    const total = rand(40, 80);
    const give = rand(10, 25);
    const correct = total - give;
    if (correct < 1) return null;
    return {
      text: `La princesse ${n1} a ${total} pierres précieuses. Elle en donne ${give} au chevalier. Combien lui reste-t-il de pierres?`,
      steps: [{ label: 'Étape 1', text: `${total} − ${give} = ${correct}`, operation: 'soustraction' }],
      stepCalcs: [{ a: total, b: give, op: '−', result: correct, label: 'Combien reste-t-il?' }],
      operationQuestion: 'Quelle opération faut-il faire?',
      correctOperation: 'soustraction',
      correct,
    };
  },
  // Fish/poisson problem
  () => {
    const oiseaux = rand(15, 40);
    const mammiferes = rand(15, 40);
    if (oiseaux + mammiferes > 99) return null;
    const correct = oiseaux + mammiferes;
    return {
      text: `Nougat doit donner ${oiseaux} kg de poissons aux oiseaux et ${mammiferes} kg aux mammifères. Combien de kg de poissons faut-il en tout?`,
      steps: [{ label: 'Étape 1', text: `${oiseaux} + ${mammiferes} = ${correct}`, operation: 'addition' }],
      stepCalcs: [{ a: oiseaux, b: mammiferes, op: '+', result: correct, label: 'Combien en tout?' }],
      operationQuestion: 'Quelle opération faut-il faire?',
      correctOperation: 'addition',
      correct,
    };
  },
  // Add then subtract (billes)
  () => {
    const n1 = pickName();
    const a = rand(20, 50);
    const b = rand(10, 25);
    const c = rand(10, a + b - 5);
    if (a + b - c < 1 || a + b > 99) return null;
    const correct = a + b - c;
    return {
      text: `${n1} a ${a} billes. Il en reçoit ${b}, puis il en donne ${c}. Combien lui reste-t-il de billes?`,
      steps: [
        { label: 'Étape 1', text: `${a} + ${b} = ${a + b}`, operation: 'addition' },
        { label: 'Étape 2', text: `${a + b} − ${c} = ${correct}`, operation: 'soustraction' },
      ],
      stepCalcs: [
        { a, b, op: '+', result: a + b, label: 'D\'abord, combien de billes après en avoir reçu?' },
        { a: a + b, b: c, op: '−', result: correct, label: 'Ensuite, combien après en avoir donné?' },
      ],
      operationQuestion: 'Quelle est la première opération?',
      correctOperation: 'addition',
      correct,
    };
  },
  // Subtract then subtract
  () => {
    const n1 = pickName();
    const a = rand(50, 89);
    const b = rand(10, 25);
    const c = rand(10, a - b - 5);
    if (a - b - c < 1) return null;
    const correct = a - b - c;
    return {
      text: `${n1} a ${a} autocollants. Il en perd ${b}, puis il en donne ${c}. Combien lui reste-t-il?`,
      steps: [
        { label: 'Étape 1', text: `${a} − ${b} = ${a - b}`, operation: 'soustraction' },
        { label: 'Étape 2', text: `${a - b} − ${c} = ${correct}`, operation: 'soustraction' },
      ],
      stepCalcs: [
        { a, b, op: '−', result: a - b, label: 'D\'abord, combien après avoir perdu?' },
        { a: a - b, b: c, op: '−', result: correct, label: 'Ensuite, combien après avoir donné?' },
      ],
      operationQuestion: 'Quelle est la première opération?',
      correctOperation: 'soustraction',
      correct,
    };
  },
  // Sacs de cailloux (skip — uses multiplication, not 2nd grade level)
  // Jardinier rosiers
  () => {
    const total = rand(40, 80);
    const part = rand(20, total - 5);
    const correct = total - part;
    if (correct < 1) return null;
    return {
      text: `Le jardinier plante ${total} rosiers dans le jardin. Le jardin du château en avait déjà ${part}. Combien de rosiers y avait-il avant dans le jardin?`,
      steps: [{ label: 'Étape 1', text: `${total} − ${part} = ${correct}`, operation: 'soustraction' }],
      stepCalcs: [{ a: total, b: part, op: '−', result: correct, label: 'Combien y avait-il avant?' }],
      operationQuestion: 'Quelle opération faut-il faire?',
      correctOperation: 'soustraction',
      correct,
    };
  },
  // Irrelevant info — must ignore extra data
  () => {
    const n1 = pickName();
    const roses = rand(10, 30);
    const roses2 = rand(10, 30);
    const marguerites = rand(20, 40);
    if (roses + roses2 > 99) return null;
    const correct = roses + roses2;
    return {
      text: `Le jardinier coupe ${roses} roses pour la princesse Delphine, ${roses2} roses pour la princesse Carla et ${marguerites} marguerites pour la princesse Chloé. Combien de roses le jardinier a-t-il coupées?`,
      steps: [
        { label: 'Attention', text: `Les marguerites ne comptent pas! On demande les ROSES.` },
        { label: 'Calcul', text: `${roses} + ${roses2} = ${correct}` },
      ],
      stepCalcs: [{ a: roses, b: roses2, op: '+', result: correct, label: 'Combien de ROSES en tout? (ignore les marguerites!)' }],
      operationQuestion: 'Quelle opération faut-il faire?',
      correctOperation: 'addition',
      correct,
    };
  },
  // Boulangère petits pains (sub then sub)
  () => {
    const total = rand(50, 90);
    const eat1 = rand(10, 25);
    const eat2 = rand(10, total - eat1 - 5);
    if (total - eat1 - eat2 < 1) return null;
    const correct = total - eat1 - eat2;
    return {
      text: `La boulangère a préparé ${total} petits pains. Les chevaliers en mangent ${eat1} pour déjeuner. Les jardiniers en mangent ${eat2} pour dîner. Combien de petits pains reste-t-il pour le souper?`,
      steps: [
        { label: 'Étape 1', text: `${total} − ${eat1} = ${total - eat1}` },
        { label: 'Étape 2', text: `${total - eat1} − ${eat2} = ${correct}` },
      ],
      stepCalcs: [
        { a: total, b: eat1, op: '−', result: total - eat1, label: 'Après le déjeuner, combien reste?' },
        { a: total - eat1, b: eat2, op: '−', result: correct, label: 'Après le dîner, combien reste?' },
      ],
      operationQuestion: 'Quelle est la première opération?',
      correctOperation: 'soustraction',
      correct,
    };
  },
  // Garage cars
  () => {
    const total = rand(40, 90);
    const sortis = rand(10, total - 10);
    const correct = total - sortis;
    return {
      text: `Il y avait ${total} voitures dans le stationnement. ${sortis} sont sorties. Combien reste-t-il de voitures?`,
      steps: [{ label: 'Étape 1', text: `${total} − ${sortis} = ${correct}` }],
      stepCalcs: [{ a: total, b: sortis, op: '−', result: correct, label: 'Combien reste-t-il?' }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'soustraction',
      correct,
    };
  },
  // Bibliothèque (sub then add)
  () => {
    const livresOriginal = rand(30, 70);
    const empruntes = rand(10, 25);
    const rendus = rand(5, 20);
    const correct = livresOriginal - empruntes + rendus;
    if (correct < 0 || correct > 99) return null;
    return {
      text: `La bibliothèque a ${livresOriginal} livres. Les enfants empruntent ${empruntes} livres. Plus tard, ${rendus} livres sont rendus. Combien y a-t-il de livres maintenant?`,
      steps: [
        { label: 'Étape 1', text: `${livresOriginal} − ${empruntes} = ${livresOriginal - empruntes}` },
        { label: 'Étape 2', text: `${livresOriginal - empruntes} + ${rendus} = ${correct}` },
      ],
      stepCalcs: [
        { a: livresOriginal, b: empruntes, op: '−', result: livresOriginal - empruntes, label: 'Après les emprunts, combien reste?' },
        { a: livresOriginal - empruntes, b: rendus, op: '+', result: correct, label: 'Après les retours, combien?' },
      ],
      operationQuestion: 'Quelle est la première opération?',
      correctOperation: 'soustraction',
      correct,
    };
  },
  // Pommes (apples)
  () => {
    const a = rand(15, 40);
    const b = rand(15, 40);
    const total = a + b;
    if (total > 99) return null;
    return {
      text: `Maman a cueilli ${a} pommes rouges et ${b} pommes vertes. Combien de pommes a-t-elle cueilli en tout?`,
      steps: [{ label: 'Calcul', text: `${a} + ${b} = ${total}` }],
      stepCalcs: [{ a, b, op: '+', result: total, label: 'Combien de pommes en tout?' }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'addition',
      correct: total,
    };
  },
  // Birthday cake
  () => {
    const invites = rand(15, 30);
    const cousinsExtra = rand(3, 8);
    const total = invites + cousinsExtra;
    if (total > 99) return null;
    return {
      text: `Ryan invite ${invites} amis à sa fête. Il invite aussi ${cousinsExtra} cousins. Combien de personnes seront à la fête en tout (avec Ryan)?`,
      steps: [
        { label: 'Étape 1', text: `${invites} + ${cousinsExtra} = ${total} invités` },
        { label: 'Étape 2', text: `${total} + 1 (Ryan) = ${total + 1}` },
      ],
      stepCalcs: [
        { a: invites, b: cousinsExtra, op: '+', result: total, label: 'Combien d\'invités?' },
        { a: total, b: 1, op: '+', result: total + 1, label: 'Et avec Ryan?' },
      ],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'addition',
      correct: total + 1,
    };
  },
  // Argent / money
  () => {
    const argent = rand(50, 99);
    const cout = rand(15, argent - 5);
    const correct = argent - cout;
    return {
      text: `Olivia a ${argent}$ dans sa tirelire. Elle achète un jouet à ${cout}$. Combien d'argent lui reste-t-il?`,
      steps: [{ label: 'Calcul', text: `${argent} − ${cout} = ${correct}` }],
      stepCalcs: [{ a: argent, b: cout, op: '−', result: correct, label: 'Combien lui reste-t-il?' }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'soustraction',
      correct,
    };
  },
  // Voyage / distance (3-term sum split into 2 binary)
  () => {
    const km1 = rand(15, 35);
    const km2 = rand(15, 35);
    const km3 = rand(10, 30);
    const total = km1 + km2 + km3;
    if (total > 99) return null;
    return {
      text: `Papa conduit ${km1} km, puis ${km2} km, puis encore ${km3} km. Combien de kilomètres a-t-il fait en tout?`,
      steps: [{ label: 'Calcul', text: `${km1} + ${km2} + ${km3} = ${total}` }],
      stepCalcs: [
        { a: km1, b: km2, op: '+', result: km1 + km2, label: 'D\'abord les 2 premiers trajets' },
        { a: km1 + km2, b: km3, op: '+', result: total, label: 'Puis ajoute le 3e trajet' },
      ],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'addition',
      correct: total,
    };
  },
  // Animaux à la ferme (3-term sum split)
  () => {
    const poules = rand(15, 30);
    const lapins = rand(10, 25);
    const vaches = rand(5, 15);
    const correct = poules + lapins + vaches;
    if (correct > 99) return null;
    return {
      text: `À la ferme, il y a ${poules} poules, ${lapins} lapins et ${vaches} vaches. Combien d'animaux y a-t-il en tout?`,
      steps: [{ label: 'Calcul', text: `${poules} + ${lapins} + ${vaches} = ${correct}` }],
      stepCalcs: [
        { a: poules, b: lapins, op: '+', result: poules + lapins, label: 'Poules + lapins' },
        { a: poules + lapins, b: vaches, op: '+', result: correct, label: 'Ajoute les vaches' },
      ],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'addition',
      correct,
    };
  },
  // Bouteilles eau (sub then add)
  () => {
    const totalBouteilles = rand(40, 90);
    const bues = rand(10, 30);
    const enPlus = rand(5, 15);
    const correct = totalBouteilles - bues + enPlus;
    if (correct > 99) return null;
    return {
      text: `Le club de soccer a ${totalBouteilles} bouteilles d'eau. Les joueurs en boivent ${bues}. L'entraîneur en achète ${enPlus} de plus. Combien de bouteilles y a-t-il maintenant?`,
      steps: [
        { label: 'Étape 1', text: `${totalBouteilles} − ${bues} = ${totalBouteilles - bues}` },
        { label: 'Étape 2', text: `${totalBouteilles - bues} + ${enPlus} = ${correct}` },
      ],
      stepCalcs: [
        { a: totalBouteilles, b: bues, op: '−', result: totalBouteilles - bues, label: 'Après que les joueurs ont bu' },
        { a: totalBouteilles - bues, b: enPlus, op: '+', result: correct, label: 'Après l\'achat' },
      ],
      operationQuestion: 'Que faut-il faire en premier?',
      correctOperation: 'soustraction',
      correct,
    };
  },
  // Pièces de monnaie (add then sub)
  () => {
    const pieces1 = rand(10, 30);
    const pieces2 = rand(10, 30);
    const perdu = rand(3, 10);
    const correct = pieces1 + pieces2 - perdu;
    if (correct < 0 || correct > 99) return null;
    return {
      text: `Léa a ${pieces1} pièces de monnaie. Sa grand-mère lui en donne ${pieces2}. Mais elle en perd ${perdu} au parc. Combien lui reste-t-il?`,
      steps: [
        { label: 'Étape 1', text: `${pieces1} + ${pieces2} = ${pieces1 + pieces2}` },
        { label: 'Étape 2', text: `${pieces1 + pieces2} − ${perdu} = ${correct}` },
      ],
      stepCalcs: [
        { a: pieces1, b: pieces2, op: '+', result: pieces1 + pieces2, label: 'Après le cadeau de grand-mère' },
        { a: pieces1 + pieces2, b: perdu, op: '−', result: correct, label: 'Après avoir perdu au parc' },
      ],
      operationQuestion: 'Quelle opération en premier?',
      correctOperation: 'addition',
      correct,
    };
  },
  // ===== 3-DIGIT PATTERNS (added 2026-05-29 — match June 3 exam patterns) =====
  // Castor — addition 3-chiffres avec échange (mirror of his test problem)
  () => {
    const printemps = rand(120, 250);
    const ete = rand(40, 99); // forces a hundreds-tens échange
    const correct = printemps + ete;
    return {
      text: `Un castor a coupé ${printemps} arbres au printemps et ${ete} arbres cet été. Combien d'arbres a-t-il coupés en tout?`,
      steps: [{ label: 'Calcul', text: `${printemps} + ${ete} = ${correct}` }],
      stepCalcs: [{ a: printemps, b: ete, op: '+', result: correct, label: 'Combien en tout? (montre l\'échange)' }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'addition',
      correct,
    };
  },
  // Bleuets — same person, two times of day (3-digit)
  () => {
    const n1 = pickName();
    const matin = rand(150, 300);
    const aprem = rand(150, 300);
    const correct = matin + aprem;
    return {
      text: `${n1} cueille ${matin} bleuets en avant-midi et ${aprem} bleuets en après-midi. Combien de bleuets a-t-il cueillis en tout?`,
      steps: [{ label: 'Calcul', text: `${matin} + ${aprem} = ${correct}` }],
      stepCalcs: [{ a: matin, b: aprem, op: '+', result: correct, label: 'Total des deux moments' }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'addition',
      correct,
    };
  },
  // ===== TWO-PERSON COMPARISON (matches Martin/Simone caillou test) =====
  // CRITICAL: Ryan failed this on his test — he mixed up which numbers belong to whom.
  // Pattern: X has A blancs + B noirs; Y has C blancs + D noirs. Qui en a plus?
  () => {
    const n1 = pickName();
    const n2 = pickName([n1]);
    const xBlancs = rand(100, 300);
    const xNoirs = rand(100, 300);
    const yBlancs = rand(100, 300);
    const yNoirs = rand(100, 300);
    const xTotal = xBlancs + xNoirs;
    const yTotal = yBlancs + yNoirs;
    if (xTotal === yTotal) return null;
    const winner = xTotal > yTotal ? n1 : n2;
    return {
      text: `${n1} a une collection de cailloux: ${xBlancs} blancs et ${xNoirs} noirs. ${n2} a ${yBlancs} cailloux blancs et ${yNoirs} cailloux noirs. Qui a plus de cailloux?`,
      steps: [
        { label: `Étape 1 — ${n1}`, text: `${xBlancs} + ${xNoirs} = ${xTotal}` },
        { label: `Étape 2 — ${n2}`, text: `${yBlancs} + ${yNoirs} = ${yTotal}` },
        { label: 'Étape 3', text: `${xTotal > yTotal ? `${xTotal} > ${yTotal}` : `${yTotal} > ${xTotal}`} → ${winner} a plus` },
      ],
      stepCalcs: [
        { a: xBlancs, b: xNoirs, op: '+', result: xTotal, label: `D'abord, combien ${n1} en a en tout` },
        { a: yBlancs, b: yNoirs, op: '+', result: yTotal, label: `Ensuite, combien ${n2} en a en tout` },
      ],
      operationQuestion: `Pour comparer ${n1} et ${n2}, que dois-tu faire d'abord?`,
      correctOperation: 'addition',
      correct: winner,
      // Force literal-name answer for the final compare step
      finalAnswerType: 'name',
      nameOptions: [n1, n2],
    };
  },
  // ===== MULTIPLICATIVE ACCUMULATION (May 28 test: alvéoles, sauterelles) =====
  // Ryan answered "7 alvéoles" instead of 35 on his test — he confused the
  // unit being asked. Forces him to recognize "X per unit × N units = total".
  // 2e année uses repeated addition + (×), so stepCalcs uses ×.
  () => {
    const perJour = rand(3, 8);
    const jours = rand(4, 7);
    const total = perJour * jours;
    return {
      text: `Les abeilles remplissent ${perJour} alvéoles par jour. En ${jours} jours, combien d'alvéoles remplissent-elles en tout?`,
      steps: [{ label: 'Calcul', text: `${perJour} × ${jours} = ${total} (ou ${perJour}+${perJour}+...)` }],
      stepCalcs: [{ a: perJour, b: jours, op: '×', result: total, label: `${perJour} alvéoles par jour, pendant ${jours} jours` }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'multiplication',
      correct: total,
    };
  },
  // Sauterelles dans des pots (mirror of his test problem)
  () => {
    const pots = rand(3, 6);
    const parPot = rand(5, 12);
    const total = pots * parPot;
    return {
      text: `Samuel a ${pots} pots. Chaque pot contient ${parPot} sauterelles. Combien de sauterelles a-t-il en tout?`,
      steps: [{ label: 'Calcul', text: `${pots} × ${parPot} = ${total}` }],
      stepCalcs: [{ a: pots, b: parPot, op: '×', result: total, label: `${pots} pots × ${parPot} sauterelles` }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'multiplication',
      correct: total,
    };
  },
  // Dessins par jour
  () => {
    const n1 = pickName();
    const perJour = rand(2, 6);
    const jours = rand(3, 7);
    const total = perJour * jours;
    return {
      text: `${n1} fait ${perJour} dessins chaque jour. Au bout de ${jours} jours, combien de dessins a-t-il/elle faits en tout?`,
      steps: [{ label: 'Calcul', text: `${perJour} × ${jours} = ${total}` }],
      stepCalcs: [{ a: perJour, b: jours, op: '×', result: total, label: `${perJour} dessins/jour × ${jours} jours` }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'multiplication',
      correct: total,
    };
  },
  // Partage (division) — Nougat distributes cards
  () => {
    const total = rand(12, 30);
    const parPaquet = pick([2, 3, 4, 5]);
    // Ensure total divides evenly
    const adjustedTotal = Math.floor(total / parPaquet) * parPaquet;
    if (adjustedTotal < parPaquet * 2) return null;
    const paquets = adjustedTotal / parPaquet;
    return {
      text: `Nougat a ${adjustedTotal} cartes. Il les met dans des paquets de ${parPaquet}. Combien de paquets va-t-il faire?`,
      steps: [{ label: 'Calcul', text: `${adjustedTotal} ÷ ${parPaquet} = ${paquets}` }],
      stepCalcs: [{ a: adjustedTotal, b: parPaquet, op: '÷', result: paquets, label: `Partage ${adjustedTotal} en groupes de ${parPaquet}` }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'division',
      correct: paquets,
    };
  },
  // ===== TERME MANQUANT in story context =====
  // Ryan does fine with isolated terme manquant (18/20!) but struggles when
  // it's embedded in a word problem ("Marc had ?. Lost 12. Has 15 left.").
  // Story uses "lost/gave/spent" but math operation is reverse (+).
  () => {
    const n1 = pickName();
    const reste = rand(10, 40);
    const perdu = rand(5, 25);
    const debut = reste + perdu;
    return {
      text: `${n1} avait des billes. Il en a perdu ${perdu}. Il lui en reste ${reste}. Combien de billes avait-il au début?`,
      steps: [{ label: 'Calcul', text: `${reste} + ${perdu} = ${debut}` }],
      stepCalcs: [{ a: reste, b: perdu, op: '+', result: debut, label: `Pour retrouver le début, on AJOUTE ce qu'il a perdu` }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'addition',
      correct: debut,
    };
  },
  // Terme manquant — bonbons given away
  () => {
    const n1 = pickName();
    const debut = rand(20, 50);
    const reste = rand(5, debut - 5);
    const donne = debut - reste;
    return {
      text: `${n1} a ${debut} bonbons. Elle en donne à ses amis. Il lui en reste ${reste}. Combien de bonbons a-t-elle donnés?`,
      steps: [{ label: 'Calcul', text: `${debut} − ${reste} = ${donne}` }],
      stepCalcs: [{ a: debut, b: reste, op: '−', result: donne, label: `Combien manquent? On SOUSTRAIT ce qu'il reste` }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'soustraction',
      correct: donne,
    };
  },
  // Terme manquant — age problem
  () => {
    const totalAge = rand(13, 25);
    const aA = rand(5, totalAge - 4);
    const aB = totalAge - aA;
    if (aB < 4) return null;
    return {
      text: `Tom a ${aA} ans. Sa sœur a un autre âge. Ensemble, ils ont ${totalAge} ans. Quel âge a sa sœur?`,
      steps: [{ label: 'Calcul', text: `${totalAge} − ${aA} = ${aB}` }],
      stepCalcs: [{ a: totalAge, b: aA, op: '−', result: aB, label: `Total − l'âge connu = l'âge cherché` }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'soustraction',
      correct: aB,
    };
  },
  // Terme manquant — pages read
  () => {
    const n1 = pickName();
    const total = rand(40, 80);
    const lu = rand(15, total - 10);
    const reste = total - lu;
    return {
      text: `${n1} lit un livre de ${total} pages. Il en a déjà lu plusieurs. Il lui reste ${reste} pages à lire. Combien de pages a-t-il déjà lues?`,
      steps: [{ label: 'Calcul', text: `${total} − ${reste} = ${lu}` }],
      stepCalcs: [{ a: total, b: reste, op: '−', result: lu, label: `Total du livre − reste à lire = pages déjà lues` }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'soustraction',
      correct: lu,
    };
  },
  // ===== INVERSE COMPARISON — "de plus que / de moins que" =====
  // The wording is the trap: "Tom en a 7 de MOINS" should trigger subtraction
  // but Ryan often adds (or vice versa). Single-step but tricky.
  () => {
    const n1 = pickName();
    const n2 = pickName([n1]);
    const aN1 = rand(15, 60);
    const diff = rand(3, 12);
    return {
      text: `${n1} a ${aN1} billes. ${n2} en a ${diff} de MOINS que ${n1}. Combien ${n2} a-t-il/elle de billes?`,
      steps: [{ label: 'Calcul', text: `${aN1} − ${diff} = ${aN1 - diff}` }],
      stepCalcs: [{ a: aN1, b: diff, op: '−', result: aN1 - diff, label: `"De moins" = soustraction` }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'soustraction',
      correct: aN1 - diff,
    };
  },
  () => {
    const n1 = pickName();
    const n2 = pickName([n1]);
    const aN1 = rand(15, 60);
    const diff = rand(3, 15);
    return {
      text: `${n1} a ${aN1} cartes. ${n2} en a ${diff} de PLUS que ${n1}. Combien ${n2} a-t-il/elle de cartes?`,
      steps: [{ label: 'Calcul', text: `${aN1} + ${diff} = ${aN1 + diff}` }],
      stepCalcs: [{ a: aN1, b: diff, op: '+', result: aN1 + diff, label: `"De plus" = addition` }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'addition',
      correct: aN1 + diff,
    };
  },
  () => {
    const n1 = pickName();
    const n2 = pickName([n1]);
    const aN2 = rand(20, 50);
    const diff = rand(3, 10);
    return {
      text: `${n2} a ${aN2} autocollants. C'est ${diff} de PLUS que ${n1}. Combien ${n1} a-t-il/elle d'autocollants?`,
      steps: [{ label: 'Calcul', text: `${aN2} − ${diff} = ${aN2 - diff}` }],
      stepCalcs: [{ a: aN2, b: diff, op: '−', result: aN2 - diff, label: `${n2} en a PLUS — pour trouver ${n1}, on SOUSTRAIT` }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'soustraction',
      correct: aN2 - diff,
    };
  },
  // ===== MEASUREMENT — centimètres =====
  () => {
    const n1 = pickName();
    const total = rand(40, 99);
    const coupe = rand(10, total - 5);
    return {
      text: `${n1} a une ficelle de ${total} cm. Elle coupe ${coupe} cm. Combien de cm de ficelle lui reste-t-il?`,
      steps: [{ label: 'Calcul', text: `${total} − ${coupe} = ${total - coupe} cm` }],
      stepCalcs: [{ a: total, b: coupe, op: '−', result: total - coupe, label: `Longueur restante en cm` }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'soustraction',
      correct: total - coupe,
    };
  },
  () => {
    const bloc1 = rand(8, 30);
    const bloc2 = rand(8, 30);
    return {
      text: `Marc empile deux blocs: un de ${bloc1} cm et un de ${bloc2} cm. Quelle est la hauteur totale en cm?`,
      steps: [{ label: 'Calcul', text: `${bloc1} + ${bloc2} = ${bloc1 + bloc2} cm` }],
      stepCalcs: [{ a: bloc1, b: bloc2, op: '+', result: bloc1 + bloc2, label: `Hauteur des deux blocs ensemble` }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'addition',
      correct: bloc1 + bloc2,
    };
  },
  () => {
    // Compare two lengths — "combien de cm de plus?"
    const a = rand(40, 95);
    const b = rand(15, a - 10);
    return {
      text: `Le crayon de Léo mesure ${a} cm. Celui de Marie mesure ${b} cm. Combien de cm de plus mesure le crayon de Léo?`,
      steps: [{ label: 'Calcul', text: `${a} − ${b} = ${a - b} cm` }],
      stepCalcs: [{ a: a, b: b, op: '−', result: a - b, label: `Différence entre les deux longueurs` }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'soustraction',
      correct: a - b,
    };
  },
  // ===== TIME / DURATION — minutes (2e année stays in minutes) =====
  () => {
    const matin = rand(15, 35);
    const soir = rand(10, 30);
    return {
      text: `Ryan joue dehors ${matin} minutes le matin et ${soir} minutes après l'école. Combien de minutes a-t-il joué en tout?`,
      steps: [{ label: 'Calcul', text: `${matin} + ${soir} = ${matin + soir} min` }],
      stepCalcs: [{ a: matin, b: soir, op: '+', result: matin + soir, label: `Total en minutes` }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'addition',
      correct: matin + soir,
    };
  },
  () => {
    const recreation = rand(30, 60);
    const passe = rand(10, recreation - 5);
    return {
      text: `La récréation dure ${recreation} minutes. Il s'est déjà passé ${passe} minutes. Combien de minutes reste-t-il avant la fin?`,
      steps: [{ label: 'Calcul', text: `${recreation} − ${passe} = ${recreation - passe} min` }],
      stepCalcs: [{ a: recreation, b: passe, op: '−', result: recreation - passe, label: `Temps restant en minutes` }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'soustraction',
      correct: recreation - passe,
    };
  },
  () => {
    // Hour-based: simple "start at Xh, lasts N min, what hour?"
    // To stay within the picker model, keep the answer in MINUTES past the hour
    const startHour = rand(9, 14);
    const duration = pick([15, 20, 25, 30, 40, 45, 50]);
    return {
      text: `L'activité commence à ${startHour}h00 et dure ${duration} minutes. À quelle heure se termine-t-elle? (Donne la réponse en minutes après ${startHour}h00.)`,
      steps: [{ label: 'Calcul', text: `0 + ${duration} = ${duration} min après ${startHour}h00` }],
      stepCalcs: [{ a: 0, b: duration, op: '+', result: duration, label: `Minutes après le début` }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'addition',
      correct: duration,
    };
  },
  // ===== TWO-PERSON COMPARISON — combien de plus =====
  // (variant: how MANY more, not just who)
  () => {
    const n1 = pickName();
    const n2 = pickName([n1]);
    const xRouges = rand(100, 400);
    const xBleus = rand(50, 200);
    const yRouges = rand(100, 400);
    const yBleus = rand(50, 200);
    const xTotal = xRouges + xBleus;
    const yTotal = yRouges + yBleus;
    if (xTotal === yTotal) return null;
    const diff = Math.abs(xTotal - yTotal);
    const winner = xTotal > yTotal ? n1 : n2;
    return {
      text: `${n1} a ${xRouges} billes rouges et ${xBleus} billes bleues. ${n2} a ${yRouges} billes rouges et ${yBleus} billes bleues. Combien ${winner} a-t-il/elle de billes de PLUS que l'autre?`,
      steps: [
        { label: `Étape 1 — ${n1}`, text: `${xRouges} + ${xBleus} = ${xTotal}` },
        { label: `Étape 2 — ${n2}`, text: `${yRouges} + ${yBleus} = ${yTotal}` },
        { label: 'Étape 3 — différence', text: `${Math.max(xTotal, yTotal)} − ${Math.min(xTotal, yTotal)} = ${diff}` },
      ],
      stepCalcs: [
        { a: xRouges, b: xBleus, op: '+', result: xTotal, label: `Combien ${n1} en a en tout` },
        { a: yRouges, b: yBleus, op: '+', result: yTotal, label: `Combien ${n2} en a en tout` },
        { a: Math.max(xTotal, yTotal), b: Math.min(xTotal, yTotal), op: '−', result: diff, label: 'La différence entre les deux totaux' },
      ],
      operationQuestion: 'Quelle est la dernière opération à faire?',
      correctOperation: 'soustraction',
      correct: diff,
    };
  },
];

export function generateWordProblem() {
  let question = null;
  let attempts = 0;
  while (!question && attempts < 50) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    question = template();
    attempts++;
  }
  if (!question) {
    const a = rand(20, 50);
    const b = rand(10, 25);
    question = {
      text: `Ryan a ${a} billes. Il en reçoit ${b}. Combien en a-t-il maintenant?`,
      steps: [{ label: 'Étape 1', text: `${a} + ${b} = ${a + b}` }],
      stepCalcs: [{ a, b, op: '+', result: a + b, label: 'Combien en tout?' }],
      operationQuestion: 'Quelle opération?',
      correctOperation: 'addition',
      correct: a + b,
    };
  }

  const { correct } = question;
  const options = new Set([correct]);
  while (options.size < 4) {
    const fake = correct + rand(-10, 10);
    if (fake !== correct && fake > 0 && fake <= 99) options.add(fake);
  }

  return {
    category: 'multi_step',
    type: 'word_problem',
    text: question.text,
    correct: question.correct,
    steps: question.steps,
    stepCalcs: question.stepCalcs,
    operationQuestion: question.operationQuestion,
    correctOperation: question.correctOperation,
    options: shuffle([...options].slice(0, 4)),
  };
}
