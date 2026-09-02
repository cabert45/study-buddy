// Custom service worker — handles PWA + push notifications
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Aggressive update: take over immediately on install/activate so users always get the latest
// (PWA cache bugs caused white screens on math section May 9 2026)
self.addEventListener('install', () => {
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// ⚠ ORDRE IMPORTANT — Workbox teste les routes dans l'ordre d'enregistrement.
// La navigation doit être déclarée AVANT precacheAndRoute: sinon la route de
// précache attrape « / » (via directoryIndex: index.html) et sert la coquille
// de l'app depuis le cache. On restait alors coincé sur l'ancienne version,
// qui pointe vers l'ancien bundle JS — même après avoir rechargé.
// NetworkFirst: en ligne on prend toujours la version fraîche; hors ligne on
// retombe sur la dernière copie mise en cache.
registerRoute(new NavigationRoute(new NetworkFirst({
  cacheName: 'app-shell',
  networkTimeoutSeconds: 4,
  plugins: [new ExpirationPlugin({ maxEntries: 4 })],
})));

// Workbox precache (handled by injectManifest)
precacheAndRoute(self.__WB_MANIFEST || []);

// Google Fonts caching
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new CacheFirst({
    cacheName: 'google-fonts-stylesheets',
    plugins: [new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 })],
  })
);

registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts-files',
    plugins: [new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 })],
  })
);

// API: network first
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 5,
  })
);

// === PUSH NOTIFICATION HANDLER ===
self.addEventListener('push', (event) => {
  let data = { title: 'Study Buddy', body: '' };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {
    if (event.data) data.body = event.data.text();
  }

  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || 'study-buddy',
    data: { url: data.url || '/' },
    vibrate: [200, 100, 200],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Click handler — opens the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});

// Skip waiting on update
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
