const STATIC_FILES = [
  '/',
  '/favicon.ico',
  '/manifest.json',
  '/src/js/index.js'
];

const CACHE_STATIC_NAME = 'static-v2';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then(cache => {
      cache.addAll(STATIC_FILES);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_STATIC_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(res => {
        return caches.open(CACHE_STATIC_NAME).then(cache => {
          cache.put(event.request.url, res.clone());
          return res;
        });
      })
      .catch(err => {
        console.log(err);
        return caches.match(event.request);
      })
  );
});
