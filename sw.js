const CACHE_NAME = 'zizi-hebat-v1'; // Ganti 'v1' menjadi 'v2', 'v3' dst. setiap kali Anda memperbarui file game (HTML, CSS, JS, ikon)
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json', // Tambahkan manifest.json
  '/images/icon-48x48.png', // Pastikan semua ikon yang ada di manifest ada di sini
  '/images/icon-72x72.png',
  '/images/icon-96x96.png',
  '/images/icon-144x144.png',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png'
  // Tambahkan asset lain yang mungkin Anda miliki, seperti gambar latar belakang atau suara
];

// Event 'install': Menginstal service worker dan membuka cache, menambahkan semua file yang ditentukan ke dalamnya.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache dibuka');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Service Worker: Gagal menyimpan aset ke cache', error);
      })
  );
  self.skipWaiting(); // Memaksa service worker baru untuk aktif segera setelah diinstal
});

// Event 'fetch': Mencegat permintaan jaringan. Jika aset ada di cache, itu akan disajikan dari sana; jika tidak, itu akan diambil dari jaringan.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika ada di cache, kembalikan dari cache
        if (response) {
          return response;
        }
        // Jika tidak, ambil dari jaringan
        return fetch(event.request);
      })
  );
});

// Event 'activate': Membersihkan cache lama saat service worker baru diaktifkan.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // Hanya cache dengan nama ini yang akan disimpan
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Memungkinkan service worker untuk mengontrol semua client yang tidak terkontrol pada aktivasi pertama
});