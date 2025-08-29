
const CACHE = 'tc-wm-cache-v1';
const OFFLINE_URLS = ['/', '/api/menu']; // best-effort; API may not cache due to auth

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(['/']))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map(k => k === CACHE ? null : caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Network-first for API, cache-first for static/content
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => caches.match('/'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request).then((response) => {
        const copy = response.clone();
        if (request.method === 'GET' && response.status === 200 && response.type === 'basic') {
          caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(()=>{});
        }
        return response;
      }).catch(() => cached || caches.match('/'));
      return cached || fetchPromise;
    })
  );
});
