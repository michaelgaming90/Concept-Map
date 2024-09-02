const CACHE_NAME = 'my-app-cache-v2';
const urlsToCache = [

  '%PUBLIC_URL%/static/css/main.668d5cc5.css',
  '%PUBLIC_URL%/static/css/main.668d5cc5.css.map',
  
  '%PUBLIC_URL%/static/js/main.5288fb11.js',
  '%PUBLIC_URL%/static/js/main.5288fb11.js.LICENSE.txt',
  '%PUBLIC_URL%/static/js/main.5288fb11.js.map',

  '%PUBLIC_URL%/asset-manifest.json',
  '%PUBLIC_URL%/favicon.ico',
  '%PUBLIC_URL%/index.html',
  '%PUBLIC_URL%/logo192.png',
  '%PUBLIC_URL%/logo512.png',
  '%PUBLIC_URL%/manifest.json',
  '%PUBLIC_URL%/robots.txt',
  '%PUBLIC_URL%/Show_Description.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
    }).catch(error => console.log(error))
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
    }).catch(error => console.log(error))
  );
});


