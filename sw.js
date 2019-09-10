const STATIC_FILES = [
  '/pwa/',
  '/pwa/favicon.ico',
  '/pwa/manifest.json',
  '/pwa/src/js/index.js'
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

self.addEventListener('push', event => {
  console.log('Push Notification received', event);

  var data = {
    title: 'LBS notification',
    content: 'Something new happened',
    openUrl: '/'
  };
  if (event.data) {
    data.content = event.data.text();
  }

  var options = {
    body: data.content,
    icon: '/pwa/src/images/icons/content_paste_black-96x96.png',
    // image: '/src/images/sf-boat.jpg',
    lang: 'en-US', // BCP 47
    vibrate: [100, 50, 200],
    badge: '/pwa/src/images/icons/content_paste_black-96x96.png',
    tag: 'post-notification',
    renotify: true,
    data: {
      openUrl: data.openUrl
    },
    actions: [
      {
        action: 'confirm',
        title: 'OK'
      },
      {
        action: 'cancel',
        title: 'CANCEL'
      }
    ]
  };

  if (Notification.permission !== 'denied') {
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});
