// service-worker-register.js
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('../service-worker.js');
    });

    navigator.serviceWorker.ready.then(registration => {
        // if we are running as an installed PWA
        if (navigator.standalone === true
            || window.matchMedia('(display-mode: standalone)').matches) {
            registration.active.postMessage("PWA running");
        }
    });
};