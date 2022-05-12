importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

// Workbox injects paths to cache into the function parameter
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('message', event => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});