// Univers social — statistiques par mot pour rendre le Test adaptatif.
//
// Deux sources fusionnées:
//   1. le serveur: toutes les sessions « univers_social » de Cayla (peu importe
//      l'appareil) → recalculées à chaque ouverture de l'écran (syncFromServer)
//   2. la session en cours: chaque réponse est ajoutée tout de suite (recordUsAnswer)
//      puis effacée à la prochaine synchro (elle sera dans les sessions serveur)
//
// On garde aussi les CONFUSIONS: quand la bonne réponse est « Culte » et qu'elle
// a choisi « Déesses-mères », le générateur ressort ce distracteur exprès.

import { MOTS, motById } from './universSocialD1.js';

const SERVER_KEY = 'sb_us_stats_server';
const LOCAL_KEY = 'sb_us_stats_local';
const VARIANTS_KEY = 'sb_us_variants';

const byMot = Object.fromEntries(MOTS.map((m) => [m.mot, m.id]));
const byCle = Object.fromEntries(MOTS.map((m) => [m.cle, m.id]));

function load(key) {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
}
function save(key, v) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
}

// Retrouve l'id du mot à partir d'une réponse (mot ou idée-clé)
function idOf(answer) {
  return byMot[answer] || byCle[answer] || null;
}

function empty() { return { right: 0, wrong: 0, streak: 0, confusions: {} }; }

function add(store, correctAnswer, userAnswer, ok) {
  const id = idOf(correctAnswer);
  if (!id) return;
  const s = store[id] || empty();
  if (ok) { s.right++; s.streak++; }
  else {
    s.wrong++; s.streak = 0;
    const chosen = idOf(userAnswer);
    if (chosen && chosen !== id) s.confusions[chosen] = (s.confusions[chosen] || 0) + 1;
  }
  store[id] = s;
}

// Réponse donnée à l'instant (Test en cours)
export function recordUsAnswer(correctAnswer, userAnswer, ok) {
  const local = load(LOCAL_KEY);
  add(local, correctAnswer, userAnswer, ok);
  save(LOCAL_KEY, local);
}

// Recalcule depuis toutes les sessions serveur de ce profil
export async function syncFromServer(profile) {
  try {
    const res = await fetch(`/api/dashboard?profile=${profile}`);
    const data = await res.json();
    const store = {};
    for (const s of data.sessions || []) {
      let det = s.details;
      if (typeof det === 'string') { try { det = JSON.parse(det); } catch { det = []; } }
      for (const q of det || []) {
        if (q.category !== 'univers_social' || !('correctAnswer' in q)) continue;
        add(store, q.correctAnswer, q.userAnswer, !!q.correct);
      }
    }
    save(SERVER_KEY, store);
    save(LOCAL_KEY, {}); // les réponses locales sont maintenant dans les sessions serveur
    return store;
  } catch {
    return load(SERVER_KEY);
  }
}

// Stats fusionnées par id de mot
export function getUsStats() {
  const server = load(SERVER_KEY);
  const local = load(LOCAL_KEY);
  const out = {};
  for (const id of new Set([...Object.keys(server), ...Object.keys(local)])) {
    const a = server[id] || empty();
    const b = local[id] || empty();
    const confusions = { ...a.confusions };
    for (const [k, v] of Object.entries(b.confusions || {})) confusions[k] = (confusions[k] || 0) + v;
    out[id] = { right: a.right + b.right, wrong: a.wrong + b.wrong, streak: b.right || b.wrong ? b.streak : a.streak, confusions };
  }
  return out;
}

// Priorité d'un mot pour le Test: ses erreurs réelles d'abord, puis sa pastille
export function usPriority(m, stats) {
  const s = stats[m.id];
  const base = m.confiance === 'rouge' ? 3 : m.confiance === 'jaune' ? 2 : 1;
  if (!s || s.right + s.wrong === 0) return base + 1; // jamais vu → un peu plus
  const total = s.right + s.wrong;
  const pct = s.right / total;
  if (s.streak === 0 && s.wrong > 0) return 6 + s.wrong; // vient de le rater
  if (pct < 0.6) return 5;
  if (pct < 0.85) return 3;
  if (s.streak >= 3) return 0.5; // maîtrisé → presque plus
  return 1;
}

// Les mots les plus ratés, avec leurs confusions — pour l'écran
export function weakWords(limit = 8) {
  const stats = getUsStats();
  return MOTS
    .map((m) => {
      const s = stats[m.id];
      const total = s ? s.right + s.wrong : 0;
      const conf = s ? Object.entries(s.confusions).sort((a, b) => b[1] - a[1]).map(([id, n]) => ({ mot: motById[id]?.mot, n })) : [];
      return { ...m, right: s?.right || 0, wrong: s?.wrong || 0, total, pct: total ? Math.round((s.right / total) * 100) : null, confusions: conf };
    })
    .filter((w) => w.wrong > 0)
    .sort((a, b) => b.wrong - a.wrong || a.pct - b.pct)
    .slice(0, limit);
}

// ---- Variantes générées par l'IA (nouveaux textes / phrases pour les mots faibles)
export function getVariants() { return load(VARIANTS_KEY); }

export async function fetchVariants(ids) {
  if (!ids.length) return getVariants();
  try {
    const res = await fetch('/api/univers-social/variantes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mots: ids.map((id) => ({ id, mot: motById[id].mot, cle: motById[id].cle })) }),
    });
    const data = await res.json();
    const cur = getVariants();
    for (const [id, v] of Object.entries(data.variantes || {})) {
      const prev = cur[id] || { textes: [], trous: [] };
      cur[id] = {
        textes: [...prev.textes, ...(v.textes || [])].slice(-6),
        trous: [...prev.trous, ...(v.trous || [])].filter((t) => t.includes('___')).slice(-6),
      };
    }
    save(VARIANTS_KEY, cur);
    return cur;
  } catch {
    return getVariants();
  }
}
