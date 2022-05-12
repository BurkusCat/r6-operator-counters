if ('serviceWorker' in navigator) {
    const serviceWorkerFilePath = '../service-worker.js';

    window.addEventListener('load', function() {
        navigator.serviceWorker.register(serviceWorkerFilePath);
    });
};
