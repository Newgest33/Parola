const CACHE = 'parola-v6';
const FILES = ['./', 'index.html', 'style.css', 'src/app.js', 'src/lib.js', 'src/content.js', 'src/fx.js', 'src/chat.js', 'src/mascot.js', 'manifest.webmanifest', 'icon.png', 'img/leo-idle.webp', 'img/leo-happy.webp', 'img/leo-sad.webp'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))));
self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request).then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, cp)); return r; })
    .catch(() => caches.match(e.request)));
});
