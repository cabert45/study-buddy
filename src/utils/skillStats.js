// Statistiques par TYPE de question (« catégorie|type ») — rend les cahiers de Ryan
// adaptatifs, comme le Test d'Univers social de Cayla (data/universSocialStats.js).
//
// Deux sources fusionnées:
//   1. le serveur: toutes les sessions du profil (peu importe l'appareil), recalculées
//      à l'ouverture du menu (syncSkillStats)
//   2. la session en cours: chaque réponse compte tout de suite (recordSkillAnswer),
//      puis s'efface à la prochaine synchro (elle est alors dans les sessions serveur)
//
// Les générateurs choisissent leur prochain type de question avec pickAdaptive():
// ce qu'il vient de rater revient souvent, ce qu'il maîtrise revient rarement.
import { getDashboard } from './storage';
import { withFresh } from './antiRepeat';

const profile = () => localStorage.getItem('sb_profile') || 'ryan';
const serverKey = () => `sb_skill_stats_server_${profile()}`;
const localKey = () => `sb_skill_stats_local_${profile()}`;

function load(key) {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
}
function save(key, v) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
}

function add(store, category, type, ok) {
  if (!category || !type) return;
  const k = `${category}|${type}`;
  const s = store[k] || { right: 0, wrong: 0, streak: 0 };
  if (ok) { s.right++; s.streak++; } else { s.wrong++; s.streak = 0; }
  store[k] = s;
}

// Local = { at: dernière réponse (ms), stats }
export function recordSkillAnswer(category, type, ok) {
  const local = load(localKey());
  const stats = local.stats || {};
  add(stats, category, type, ok);
  save(localKey(), { at: Date.now(), stats });
}

export async function syncSkillStats() {
  try {
    const data = await getDashboard();
    const store = {};
    // le serveur rend les 30 dernières sessions, la plus récente d'abord: on les rejoue dans l'ordre
    const sessions = [...(data.sessions || [])].sort((a, b) => (a.id || 0) - (b.id || 0));
    for (const s of sessions) {
      let det = s.details;
      if (typeof det === 'string') { try { det = JSON.parse(det); } catch { det = []; } }
      for (const q of det || []) add(store, q.category, q.type, !!q.correct);
    }
    save(serverKey(), store);
    // Une session qui vient de finir n'est peut-être pas encore enregistrée sur le
    // serveur: on garde les réponses locales des 2 dernières minutes.
    const local = load(localKey());
    if (!local.at || Date.now() - local.at > 120000) save(localKey(), {});
    return store;
  } catch {
    return load(serverKey());
  }
}

export function getSkillStats() {
  const server = load(serverKey());
  const local = load(localKey()).stats || {};
  const out = {};
  for (const k of new Set([...Object.keys(server), ...Object.keys(local)])) {
    const a = server[k] || { right: 0, wrong: 0, streak: 0 };
    const b = local[k] || { right: 0, wrong: 0, streak: 0 };
    out[k] = { right: a.right + b.right, wrong: a.wrong + b.wrong, streak: b.right || b.wrong ? b.streak : a.streak };
  }
  return out;
}

// Multiplicateur de fréquence d'un type de question
function priority(s) {
  if (!s || s.right + s.wrong === 0) return 1.3;        // jamais vu → un peu plus
  const pct = s.right / (s.right + s.wrong);
  if (s.streak === 0 && s.wrong > 0) return 4 + Math.min(s.wrong, 3); // vient de le rater
  if (pct < 0.6) return 3;
  if (pct < 0.85) return 1.6;
  if (s.streak >= 4) return 0.35;                         // maîtrisé → presque plus
  return 1;
}

export function skillPriority(category, type, stats = getSkillStats()) {
  return priority(stats[`${category}|${type}`]);
}

// entries: [{ type, w, build }] — w = poids de base (le programme), × la priorité de Ryan.
// Si un build() rend null, on essaie un autre type.
// L'anti-répétition se fait À L'INTÉRIEUR du type choisi: sinon, un type avec peu de
// questions (déjà toutes vues) serait remplacé par un autre, et ce qu'il rate ne
// reviendrait plus.
const defaultKey = (q) => `${q.type}|${q.text}`;
export function pickAdaptive(category, entries, keyFn = defaultKey) {
  const stats = getSkillStats();
  let pool = entries.map((e) => ({ ...e, p: e.w * skillPriority(category, e.type, stats) }));
  while (pool.length) {
    const total = pool.reduce((t, e) => t + e.p, 0);
    let r = Math.random() * total;
    const e = pool.find((x) => (r -= x.p) <= 0) || pool[pool.length - 1];
    const q = withFresh(category, e.build, 100, 10, keyFn);
    if (q) return q;
    pool = pool.filter((x) => x !== e);
  }
  return null;
}

// Priorité d'une catégorie entière (pour les révisions qui mélangent les notions)
export function categoryPriority(category, stats = getSkillStats()) {
  const agg = { right: 0, wrong: 0, streak: 99 };
  for (const [k, s] of Object.entries(stats)) {
    if (!k.startsWith(`${category}|`)) continue;
    agg.right += s.right; agg.wrong += s.wrong; agg.streak = Math.min(agg.streak, s.streak);
  }
  if (agg.streak === 99) agg.streak = 0;
  return priority(agg);
}

// Noms lisibles pour le parent (écran du cahier)
export const SKILL_LABELS = {
  't1_nom|trouve_n': 'Trouver le nom', 't1_nom|nom_genre_nombre': 'Genre ET nombre du nom',
  't1_nom|nom_remplace': 'Remplacer par un autre nom', 't1_nom|nom_test': 'Est-ce un nom? (un/une)',
  't1_nom|nom_sorte': 'Ce que le nom nomme', 't1_nom|nom_propre': 'Nom propre ou commun',
  't1_nom|trouve_np': 'Trouver le nom propre', 't1_nom|manip_n': 'Manipulations du nom', 't1_nom|combien_n': 'Compter les noms',
  't1_determinant|trouve_d': 'Trouver le déterminant', 't1_determinant|det_ajout': 'Ajouter un nom après',
  't1_determinant|det_remplace': 'Remplacer le déterminant', 't1_determinant|det_accord': 'Genre ET nombre du déterminant',
  't1_determinant|manip_d': 'Manipulations du déterminant', 't1_determinant|det_nombre': 'Singulier ou pluriel',
  't1_determinant|combien_d': 'Compter les déterminants', 't1_determinant|classe': 'Classe du mot',
  't1_adjectif|trouve_a': "Trouver l'adjectif", 't1_adjectif|adj_tres': "Est-ce un adjectif? (très)",
  't1_adjectif|adj_quel_nom': "Le nom que l'adjectif décrit", 't1_adjectif|combien_a': 'Compter les adjectifs', 't1_adjectif|classe': 'Classe du mot',
  't1_verbe|trouve_v': 'Trouver le verbe', 't1_verbe|verbe_ne_pas': 'Encadrer par ne… pas', 't1_verbe|classe': 'Classe du mot',
  't1_pronom|trouve_p': 'Trouver le pronom', 't1_pronom|pronom_remplace': 'Pronom qui remplace',
  't1_pronom|pronom_forme': 'Pronom devant le verbe', 't1_pronom|classe': 'Classe du mot',
  't1_dialogue|dialogue': 'Qui parle dans le dialogue', 't1_dialogue|dialogue_tiret': 'Le tiret du dialogue',
  't1_dialogue|dialogue_verbe_parole': 'Verbe de parole', 't1_dialogue|portrait': 'Trouver la phrase (physique / caractère)',
  't1_dialogue|trait': 'Aspect physique ou caractère',
  't1_voc|comparaison_mot': 'Compléter la comparaison', 't1_voc|comparaison_sens': 'Sens de la comparaison',
  't1_voc|comparaison_image': "L'expression de l'image", 't1_dialogue|portrait_image': "Ce qu'on voit / ne voit pas",
  't1_revision|classe': 'Classe du mot',
  'matcha_nombres|blocs': 'Blocs base 10 avec échanges', 'matcha_nombres|tableau_zero': 'Le zéro dans le tableau',
  'matcha_nombres|jetons': 'Jetons dans le tableau', 'matcha_nombres|abaque': "Lire l'abaque",
  'matcha_nombres|lettres_chiffres': 'Lettres → chiffres', 'matcha_nombres|chiffres_lettres': 'Lire un nombre',
  'matcha_nombres|position_nom': 'Nom de la position', 'matcha_nombres|position_valeur': "Valeur d'un chiffre",
  'matcha_nombres|ajouter': 'Ajouter 1 centaine / dizaine', 'matcha_nombres|groupements': 'Problèmes de groupements',
  'matcha_nombres|sacs': 'Faire des sacs de 10 / 100',
};

// Les types les plus ratés d'un groupe de catégories (préfixe), pour le parent
export function weakSkills(prefixes, limit = 4) {
  const stats = getSkillStats();
  return Object.entries(stats)
    .filter(([k, s]) => prefixes.some((p) => k.startsWith(p)) && s.wrong > 0)
    .map(([k, s]) => ({ key: k, label: SKILL_LABELS[k] || k.split('|')[1], right: s.right, wrong: s.wrong, pct: Math.round((s.right / (s.right + s.wrong)) * 100) }))
    .sort((a, b) => a.pct - b.pct || b.wrong - a.wrong)
    .slice(0, limit);
}
