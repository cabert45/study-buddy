// Real iOS push notifications via Web Push + VAPID
// Works on iOS 16.4+ as installed PWA, all modern Android/desktop browsers

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from(rawData, c => c.charCodeAt(0));
}

export async function isPushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

export async function getSubscription() {
  if (!(await isPushSupported())) return null;
  const reg = await navigator.serviceWorker.ready;
  return reg.pushManager.getSubscription();
}

export async function subscribeToPush(profile) {
  if (!(await isPushSupported())) {
    throw new Error('Push notifications not supported on this device');
  }

  // Request notification permission
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Permission refused');
  }

  // Wait for SW
  const reg = await navigator.serviceWorker.ready;

  // Get existing subscription or create new
  let subscription = await reg.pushManager.getSubscription();

  if (!subscription) {
    // Get VAPID public key from server
    const keyRes = await fetch('/api/push/vapid-key');
    const { key } = await keyRes.json();

    subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(key),
    });
  }

  // Send subscription to server
  await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, subscription }),
  });

  return subscription;
}

export async function unsubscribeFromPush() {
  const subscription = await getSubscription();
  if (!subscription) return;
  await fetch('/api/push/unsubscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint: subscription.endpoint }),
  });
  await subscription.unsubscribe();
}

// Send a test push (calls backend which sends to all subs of profile)
export async function sendTestPush(profile, title, body) {
  const res = await fetch('/api/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, title, body, url: '/' }),
  });
  return res.json();
}
