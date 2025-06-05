const CACHE_NAME = 'zizi-hebat-game-cache-v1';
const urlsToCache = [
    '/GameZizi/', // Meng-cache root dari subfolder
    '/GameZizi/index.html',
    '/GameZizi/style.css',
    '/GameZizi/script.js',
    '/GameZizi/manifest.json',
    '/GameZizi/images/icon-48x48.png',
    '/GameZizi/images/icon-72x72.png',
    '/GameZizi/images/icon-96x96.png',
    '/GameZizi/images/icon-144x144.png',
    '/GameZizi/images/icon-192x192.png',
    '/GameZizi/images/icon-512x512.png',
    '/GameZizi/images/screenshot-menu.png', // Tambahkan screenshot jika ada
    '/GameZizi/images/screenshot-game.png',
    '/GameZizi/images/screenshot-result.png'
];

// Event: Install Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('Failed to open cache or add URLs:', error);
            })
    );
});

// Event: Fetch (mengintersep permintaan jaringan)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // Jika tidak ada di cache, lakukan fetch dari jaringan
                return fetch(event.request)
                    .then((fetchResponse) => {
                        // Periksa apakah kami menerima respons yang valid
                        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                            return fetchResponse;
                        }

                        // Kloning respons karena stream hanya bisa dibaca sekali
                        const responseToCache = fetchResponse.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return fetchResponse;
                    })
                    .catch((error) => {
                        console.error('Fetch failed for:', event.request.url, error);
                        // Anda bisa menambahkan fallback untuk halaman offline di sini
                        // Misalnya, return caches.match('/offline.html');
                        return new Response('<h1>You are offline!</h1>', {headers: {'Content-Type': 'text/html'}});
                    });
            })
    );
});

// Event: Activate Service Worker (membersihkan cache lama)
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
