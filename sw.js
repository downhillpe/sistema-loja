const CACHE_NAME = 'filhao-v13'; // Lembre de mudar esse número sempre que atualizar o HTML
const ASSETS = [
  './',
  './index.html',
  './icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js'
];

// Instalação: Força o novo Service Worker a assumir imediatamente
self.addEventListener('install', (e) => {
  self.skipWaiting(); // <--- O PULO DO GATO: Não espera o antigo fechar
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

// Ativação: Limpa caches antigos e assume controle das abas abertas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    }).then(() => self.clients.claim()) // <--- Controla a página na hora
  );
});

// Fetch: Tenta buscar na rede primeiro (Network First), se falhar usa cache
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Se a internet funcionar, atualiza o cache com a versão nova
        let clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request)) // Se offline, usa o cache
  );
});
