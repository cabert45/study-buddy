const API_BASE = '/api';

export async function saveSession(mode, total, correct, details) {
  const res = await fetch(`${API_BASE}/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode, total, correct, details }),
  });
  return res.json();
}

export async function getProgress() {
  const res = await fetch(`${API_BASE}/progress`);
  return res.json();
}

export async function getDashboard() {
  const res = await fetch(`${API_BASE}/dashboard`);
  return res.json();
}

export async function getAdvice() {
  const res = await fetch(`${API_BASE}/dashboard/advice`);
  return res.json();
}

export async function resetData() {
  const res = await fetch(`${API_BASE}/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
}

export async function askTutor(prompt) {
  const res = await fetch(`${API_BASE}/tutor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  return res.json();
}
