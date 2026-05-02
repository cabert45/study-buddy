// In-app notification system
// Stores notifications in localStorage, dispatches event for live updates

const STORAGE_KEY = 'sb_notifications';
const MAX_NOTIFICATIONS = 50;

export function addNotification({ title, message, type = 'info', profile = null, score = null }) {
  const notif = {
    id: Date.now() + Math.random(),
    title,
    message,
    type, // 'success', 'warning', 'info', 'celebration'
    profile,
    score,
    timestamp: new Date().toISOString(),
    read: false,
  };
  const list = getNotifications();
  list.unshift(notif);
  const trimmed = list.slice(0, MAX_NOTIFICATIONS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  window.dispatchEvent(new CustomEvent('notifications-updated'));
  return notif;
}

export function getNotifications() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getUnreadCount() {
  return getNotifications().filter(n => !n.read).length;
}

export function markAllRead() {
  const list = getNotifications().map(n => ({ ...n, read: true }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('notifications-updated'));
}

export function deleteNotification(id) {
  const list = getNotifications().filter(n => n.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('notifications-updated'));
}

export function clearAll() {
  localStorage.setItem(STORAGE_KEY, '[]');
  window.dispatchEvent(new CustomEvent('notifications-updated'));
}

// Auto-generate notification from session result
export function notifySessionResult({ profile, mode, correct, total, streak, results }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const profileName = profile === 'ryan' ? 'Ryan' : profile === 'cayla' ? 'Cayla' : 'Un ami';

  // Identify weak categories
  const errorsByCategory = {};
  if (results) {
    results.forEach(r => {
      if (!r.correct) errorsByCategory[r.category] = (errorsByCategory[r.category] || 0) + 1;
    });
  }
  const worstCategory = Object.entries(errorsByCategory).sort((a, b) => b[1] - a[1])[0]?.[0];

  let title, message, type;

  if (pct === 100) {
    title = `🏆 ${profileName} parfait!`;
    message = `${correct}/${total} sur ${mode} — score parfait!`;
    type = 'celebration';
  } else if (pct >= 90) {
    title = `⭐ ${profileName} excellent!`;
    message = `${correct}/${total} (${pct}%) sur ${mode}`;
    type = 'success';
  } else if (pct >= 70) {
    title = `${profileName} a fait du bon travail`;
    message = `${correct}/${total} (${pct}%) sur ${mode}`;
    type = 'success';
  } else if (pct >= 50) {
    title = `${profileName} progresse`;
    message = `${correct}/${total} (${pct}%) sur ${mode}${worstCategory ? ` — point faible: ${worstCategory}` : ''}`;
    type = 'info';
  } else {
    title = `${profileName} a besoin d'aide`;
    message = `Seulement ${correct}/${total} (${pct}%) sur ${mode}${worstCategory ? ` — bloqué sur ${worstCategory}` : ''}. Regarde le tableau de bord.`;
    type = 'warning';
  }

  if (streak >= 5) {
    message += ` 🔥 Série de ${streak}!`;
  }

  return addNotification({ title, message, type, profile, score: { correct, total, pct } });
}
