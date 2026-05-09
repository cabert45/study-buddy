// Persistent anti-repeat helper — avoids feeding the same exercise text twice.
// Tracks recent question texts in localStorage so it persists across sessions
// (the in-memory anti-repeat in some generators only lasts for one session).
//
// Usage:
//   import { wasRecent, markRecent, withFresh } from '../utils/antiRepeat';
//   const q = withFresh('pemdas', () => buildSomething(), 50, 30);
//
// `withFresh(category, generate, capacity, maxAttempts)`:
//   - generate(): returns { text, ... }
//   - capacity: how many recent question texts to remember (default 80)
//   - maxAttempts: how many tries before giving up and accepting a duplicate

const STORAGE_PREFIX = 'sb_recent_';

function loadList(category) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + category);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveList(category, list) {
  try {
    localStorage.setItem(STORAGE_PREFIX + category, JSON.stringify(list));
  } catch {}
}

export function wasRecent(category, key) {
  return loadList(category).includes(key);
}

export function markRecent(category, key, capacity = 80) {
  const list = loadList(category);
  // remove old occurrence if present, push to end (most recent)
  const idx = list.indexOf(key);
  if (idx >= 0) list.splice(idx, 1);
  list.push(key);
  while (list.length > capacity) list.shift();
  saveList(category, list);
}

// Generate a question, retrying up to `maxAttempts` times to avoid recent duplicates.
// `keyFn(question)` extracts a stable string for the question (defaults to question.text).
export function withFresh(category, generate, capacity = 80, maxAttempts = 30, keyFn) {
  const recent = new Set(loadList(category));
  const getKey = keyFn || ((q) => q && q.text);
  let attempts = 0;
  let q = null;
  let key = null;
  while (attempts < maxAttempts) {
    q = generate();
    key = getKey(q);
    if (!key) break; // can't track without a key — accept whatever
    if (!recent.has(key)) break; // fresh!
    attempts++;
  }
  if (q && key) markRecent(category, key, capacity);
  return q;
}

export function clearRecent(category) {
  try { localStorage.removeItem(STORAGE_PREFIX + category); } catch {}
}
