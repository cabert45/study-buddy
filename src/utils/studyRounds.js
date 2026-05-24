// Tracks how many full study rounds (sessions) a user has completed per mode.
// Used to switch modes from "study with rules visible" to "recall from memory"
// after the first round.

const KEY_PREFIX = 'sb_rounds_';

export function getStudyRounds(mode) {
  try {
    return parseInt(localStorage.getItem(KEY_PREFIX + mode) || '0', 10);
  } catch {
    return 0;
  }
}

export function incrementStudyRounds(mode) {
  try {
    const n = getStudyRounds(mode) + 1;
    localStorage.setItem(KEY_PREFIX + mode, String(n));
    return n;
  } catch {
    return 0;
  }
}

export function resetStudyRounds(mode) {
  try {
    localStorage.removeItem(KEY_PREFIX + mode);
  } catch {}
}
