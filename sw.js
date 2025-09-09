/**
 * Service Worker for TDE Trading
 * Implements caching strategies for improved performance and offline support
 */

const CACHE_NAME = 'tde-trading-v1.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/bootstrap.min.css',
    '/css/custom.css',
    '/js/jquery-3.7.1.min.js',
    '/js/bootstrap.min.js',
    '/js/function.js',
    '/images/TDE-Trading-logo.png',
    '/offline.html'
];

// Install event - cache essential files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(err => console.log('Cache install error:', err))
    );
    // Force the new service worker to activate
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Take control of all pages immediately
    self.clients.claim();
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }

    // Network first for API calls
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/script/email/')) {
        event.respondWith(
            fetch(request)
                .catch(() => {
                    return new Response(
                        JSON.stringify({ error: 'Network error' }),
                        { headers: { 'Content-Type': 'application/json' } }
                    );
                })
        );
        return;
    }

    // Cache first for assets
    if (request.url.match(/\.(css|js|woff2?|ttf|otf|eot|svg|jpg|jpeg|png|gif|webp)$/)) {
        event.respondWith(
            caches.match(request)
                .then(response => {
                    if (response) {
                        return response;
                    }
                    return fetch(request).then(response => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(request, responseToCache);
                            });

                        return response;
                    });
                })
        );
        return;
    }

    // Network first for HTML pages
    event.respondWith(
        fetch(request)
            .then(response => {
                // Cache successful responses
                if (response && response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(request, responseToCache);
                        });
                }
                return response;
            })
            .catch(() => {
                // Try to serve from cache
                return caches.match(request)
                    .then(response => {
                        if (response) {
                            return response;
                        }
                        // Serve offline page if available
                        return caches.match('/offline.html');
                    });
            })
    );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'sync-forms') {
        event.waitUntil(syncFormData());
    }
});

async function syncFormData() {
    // Implement form data syncing logic here
    console.log('Syncing form data...');
}