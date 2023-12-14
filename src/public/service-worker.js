// service-worker.js
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('miPWA').then((cache) => {
            return cache.addAll([
                '/',
                '/css/estilos.css',
                '/js/script.js',
                '/images/icon.png'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
