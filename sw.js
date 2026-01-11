const CACHE_NAME = 'portfolio-cache-v2'; // Updated version for cache invalidation
const STATIC_CACHE = 'portfolio-static-v2';
const DYNAMIC_CACHE = 'portfolio-dynamic-v2';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/assets/style.css',
    '/assets/script.js',
    '/sw.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install service worker
self.addEventListener('install', event => {
    console.log('Service Worker installing.');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting()) // Force activation
    );
});

// Activate service worker
self.addEventListener('activate', event => {
    console.log('Service Worker activating.');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => self.clients.claim()) // Take control immediately
    );
});

// Fetch event with cache-first strategy for static assets, network-first for dynamic content
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }

    // Handle navigation requests
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then(response => {
                    // Cache successful responses
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(DYNAMIC_CACHE)
                            .then(cache => cache.put(request, responseClone));
                    }
                    return response;
                })
                .catch(() => {
                    // Fallback to cache if offline
                    return caches.match('/index.html');
                })
        );
        return;
    }

    // Cache-first strategy for static assets
    if (STATIC_ASSETS.includes(url.pathname) || request.destination === 'style' || request.destination === 'script') {
        event.respondWith(
            caches.match(request)
                .then(response => {
                    return response || fetch(request).then(networkResponse => {
                        // Cache new static assets
                        if (networkResponse.status === 200) {
                            const responseClone = networkResponse.clone();
                            caches.open(STATIC_CACHE)
                                .then(cache => cache.put(request, responseClone));
                        }
                        return networkResponse;
                    });
                })
        );
        return;
    }

    // Network-first strategy for other requests
    event.respondWith(
        fetch(request)
            .then(response => {
                // Cache successful responses
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(DYNAMIC_CACHE)
                        .then(cache => cache.put(request, responseClone));
                }
                return response;
            })
            .catch(() => {
                // Fallback to cache
                return caches.match(request);
            })
    );
});

// Handle background sync for offline messages
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    // Implement background sync logic here if needed
    console.log('Background sync triggered');
}
