importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

self.addEventListener('message', event => {
    if (event.data) {
        if (event.data === 'PWA running') {
            // Workbox will inject its caching code instead of the below line:
            precacheAndRoute(self.__WB_MANIFEST);
        } else if (event.data.type === "SKIP_WAITING") {
            self.skipWaiting();
        }
    }
});