const API_BASE = '/api';

// Profile is stored in localStorage, set when user picks profile
function getProfile() {
  return localStorage.getItem('sb_profile') || 'ryan';
}

export function setProfile(profile) {
  localStorage.setItem('sb_profile', profile);
}

// Les sessions qui n'ont pas pu partir attendent ici.
//
// Le 24 sept. 2026, le conteneur Railway a perdu l'accès à la base: pendant
// deux jours, /api/session répondait 500 et personne ne l'a vu. Ryan a
// travaillé, et tout est parti à la poubelle en silence — parce qu'ici on
// faisait `res.json()` sans jamais regarder `res.ok`. Un 500 ressemblait
// exactement à un succès.
//
// Maintenant une session qui échoue est gardée sur l'appareil et repart au
// prochain envoi réussi (ou au prochain démarrage de l'app).
const FILE_ATTENTE = 'sb_sessions_en_attente';
const MAX_EN_ATTENTE = 50;

function lireFile() {
  try { return JSON.parse(localStorage.getItem(FILE_ATTENTE) || '[]'); } catch { return []; }
}
function ecrireFile(liste) {
  try { localStorage.setItem(FILE_ATTENTE, JSON.stringify(liste.slice(-MAX_EN_ATTENTE))); } catch {}
}

async function envoyerSession(charge) {
  const res = await fetch(`${API_BASE}/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(charge),
  });
  // Sans ce test, un 500 passait pour un succès.
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Renvoie ce qui attend. Appelée au démarrage et après chaque envoi réussi.
export async function renvoyerSessionsEnAttente() {
  const file = lireFile();
  if (!file.length) return { envoyees: 0, restantes: 0 };
  const restantes = [];
  let envoyees = 0;
  for (const charge of file) {
    try { await envoyerSession(charge); envoyees++; }
    catch { restantes.push(charge); }
  }
  ecrireFile(restantes);
  return { envoyees, restantes: restantes.length };
}

export function nbSessionsEnAttente() {
  return lireFile().length;
}

export async function saveSession(mode, total, correct, details) {
  const charge = { mode, total, correct, details, profile: getProfile() };
  try {
    const reponse = await envoyerSession(charge);
    // On en profite pour rattraper le retard accumulé pendant la panne.
    if (nbSessionsEnAttente()) renvoyerSessionsEnAttente().catch(() => {});
    return reponse;
  } catch {
    ecrireFile([...lireFile(), charge]);
    return { ok: false, enAttente: true };
  }
}

export async function getProgress() {
  const res = await fetch(`${API_BASE}/progress?profile=${getProfile()}`);
  return res.json();
}

export async function getDashboard() {
  const res = await fetch(`${API_BASE}/dashboard?profile=${getProfile()}`);
  return res.json();
}

export async function getAdvice() {
  const res = await fetch(`${API_BASE}/dashboard/advice?profile=${getProfile()}`);
  return res.json();
}

export async function resetData() {
  const res = await fetch(`${API_BASE}/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile: getProfile() }),
  });
  return res.json();
}

export async function generateAISentence(word, grade) {
  try {
    const res = await fetch(`${API_BASE}/dictee/sentence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word, grade }),
    });
    const data = await res.json();
    return data.sentence;
  } catch {
    return null;
  }
}

export async function askTutor(prompt) {
  const res = await fetch(`${API_BASE}/tutor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Sans le profil, le serveur croyait parler à Ryan quoi qu'il arrive —
    // et à un Ryan de 7 ans en 2e année, en plus.
    body: JSON.stringify({ prompt, profile: getProfile() }),
  });
  return res.json();
}

// ===== « Mes blocs » =====
export async function getBlocs() {
  const res = await fetch(`${API_BASE}/blocs?profile=${getProfile()}`);
  return res.json();
}

export async function saveBlocs(blocs) {
  const res = await fetch(`${API_BASE}/blocs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blocs, profile: getProfile() }),
  });
  return res.json();
}
