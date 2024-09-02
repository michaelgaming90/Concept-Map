const CACHE_NAME = 'my-app-cache-v2';
const urlsToCache = [

  '/static/css/main.668d5cc5.css',
  '/static/css/main.668d5cc5.css.map',
  
  '/static/js/main.5288fb11.js',
  '/static/js/main.5288fb11.js.LICENSE.txt',
  '/static/js/main.5288fb11.js.map',

  '/asset-manifest.json',
  '/favicon.ico',
  '/index.html',
  '/logo192.png',
  '/logo512.png',
  '/manifest.json',
  '/robots.txt',
  '/Show_Description.png'
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


