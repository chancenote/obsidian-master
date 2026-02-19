const CACHE_NAME = 'nextcowork-v1';
const ASSETS = [
  '/obsidian-master/',
  '/obsidian-master/index.html',
  '/obsidian-master/styles.css',
  '/obsidian-master/app.js',
  '/obsidian-master/curriculum-data.js',
  '/obsidian-master/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
