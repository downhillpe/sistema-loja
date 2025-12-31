const CACHE_NAME = 'filhao-v9';
const ASSETS = [
  './',
  './index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://cdn-icons-png.flaticon.com/512/3616/3616230.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
