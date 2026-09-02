const API_BASE = '/api';

// Profile is stored in localStorage, set when user picks profile
function getProfile() {
  return localStorage.getItem('sb_profile') || 'ryan';
}

export function setProfile(profile) {
  localStorage.setItem('sb_profile', profile);
}

export async function saveSession(mode, total, correct, details) {
  const res = await fetch(`${API_BASE}/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode, total, correct, details, profile: getProfile() }),
  });
  return res.json();
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
    body: JSON.stringify({ prompt }),
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
