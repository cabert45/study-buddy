// Study reminder system
// Uses Browser Notification API to pop dictée words while she's not in the app

import { dicteeWeeks } from '../data/dicteeWeekly';

const STORAGE_PERMISSION = 'sb_notif_permission_asked';
const STORAGE_ACTIVE = 'sb_study_reminders_active';
const STORAGE_INTERVAL = 'sb_study_reminders_interval';
const STORAGE_WEEK = 'sb_study_reminders_week';

let intervalRef = null;

export async function requestPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  localStorage.setItem(STORAGE_PERMISSION, 'yes');
  return result === 'granted';
}

export function hasPermission() {
  return 'Notification' in window && Notification.permission === 'granted';
}

export function isActive() {
  return localStorage.getItem(STORAGE_ACTIVE) === 'yes';
}

export function getInterval() {
  return parseInt(localStorage.getItem(STORAGE_INTERVAL) || '15', 10);
}

export function getWeek() {
  return localStorage.getItem(STORAGE_WEEK) || 'cayla_t6_s1';
}

function pickRandomWord(weekKey) {
  const week = dicteeWeeks[weekKey];
  if (!week) return null;
  const w = week.words[Math.floor(Math.random() * week.words.length)];
  return { word: w.correct, weekName: week.name };
}

function fireOne() {
  if (!hasPermission()) return;
  const weekKey = getWeek();
  const picked = pickRandomWord(weekKey);
  if (!picked) return;

  const titles = [
    `📝 Mot à mémoriser`,
    `🧠 Quizz éclair`,
    `✏️ Pratique rapide`,
    `🎯 Tu te souviens?`,
  ];
  const title = titles[Math.floor(Math.random() * titles.length)];

  try {
    new Notification(title, {
      body: `Comment écris-tu: "${picked.word}"?\n(${picked.weekName})`,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'study-reminder',
      vibrate: [200, 100, 200],
      requireInteraction: false,
    });
  } catch (e) {
    console.log('Notif failed:', e.message);
  }
}

export function startReminders(intervalMinutes, weekKey) {
  stopReminders();
  const mins = intervalMinutes || getInterval();
  const wk = weekKey || getWeek();
  localStorage.setItem(STORAGE_ACTIVE, 'yes');
  localStorage.setItem(STORAGE_INTERVAL, String(mins));
  localStorage.setItem(STORAGE_WEEK, wk);

  intervalRef = setInterval(fireOne, mins * 60 * 1000);
  // Fire one immediately so she sees it works
  setTimeout(fireOne, 2000);
}

export function stopReminders() {
  if (intervalRef) {
    clearInterval(intervalRef);
    intervalRef = null;
  }
  localStorage.setItem(STORAGE_ACTIVE, 'no');
}

// Auto-resume on page load if was active
export function autoResume() {
  if (isActive() && hasPermission()) {
    const mins = getInterval();
    const wk = getWeek();
    intervalRef = setInterval(fireOne, mins * 60 * 1000);
  }
}
