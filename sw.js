const CACHE_NAME = 'filhaocell-v40-split';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// 1. Instalação: Baixa os arquivos para o Cache
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Força o SW a ativar imediatamente
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Ativação: Limpa caches antigos para não dar conflito
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // Assume o controle da página imediatamente
});

// 3. Interceptação (Fetch): Serve arquivos do cache se estiver offline
self.addEventListener('fetch', (event) => {
  // Não cacheia chamadas para o Google Firestore/Firebase (deixa a lib tratar isso)
  if (event.request.url.includes('firestore') || event.request.url.includes('googleapis')) {
    return; 
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Se encontrar no cache, retorna o cache. Se não, busca na rede.
      return response || fetch(event.request);
    })
  );
});
