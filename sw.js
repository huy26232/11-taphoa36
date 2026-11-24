/**
 * ============================================================================
 * 🚀 TAPHOA36 - SERVICE WORKER (OFFLINE-FIRST PWA ENGINE)
 * ============================================================================
 * Đề tài: Ứng dụng Tạp Hóa theo Yêu Cầu cho Người Mới Bắt Đầu (TapHoa36)
 * Học phần: Lập trình Web | Khoa CNTT - UTH | Nhóm 11
 *
 * TÍNH NĂNG CHÍNH:
 * 1. Precaching App Shell (HTML, CSS, JS, Manifest, Icons)
 * 2. Caching Strategy: Stale-While-Revalidate cho static assets
 * 3. Offline Fallback mượt mà khi mất kết nối mạng
 * 4. Background Sync / Offline Mutation Retry Queue
 * ============================================================================
 */

const CACHE_NAME = 'taphoa36-app-shell-v2.5';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './store.html',
  './pos.html',
  './admin.html',
  './manifest.json',
  './shared/core.js',
  './sw.js'
];

// Cài đặt Service Worker và Precache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Precaching App Shell offline assets...');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[ServiceWorker] Một số tài nguyên không tải được khi precache:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Kích hoạt và dọn dẹp các phiên bản cache cũ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[ServiceWorker] Xóa cache cũ:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Xử lý Request: Stale-While-Revalidate cho static & Network-first cho API
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Bỏ qua các request không phải GET
  if (req.method !== 'GET') {
    return;
  }

  // Bỏ qua chrome-extension hoặc protocol không phải http/https
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Chiến lược: Stale-While-Revalidate
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, responseToCache);
          });
        }
        return networkResponse;
      }).catch((err) => {
        // Nếu offline và không có cache, trả về trang fallback
        if (req.mode === 'navigate') {
          return caches.match('./store.html') || caches.match('./pos.html');
        }
        throw err;
      });

      return cachedResponse || fetchPromise;
    })
  );
});

// Lắng nghe sự kiện Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-mutations') {
    console.log('[ServiceWorker] Thực thi Background Sync hàng đợi đơn hàng offline...');
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'EXECUTE_OFFLINE_MUTATION_SYNC' });
        });
      })
    );
  }
});
