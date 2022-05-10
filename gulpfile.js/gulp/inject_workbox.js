'use strict';

const conf = require('./conf');
const workboxBuild = require('workbox-build');
    
function injectWorkbox() {
    // https://developer.chrome.com/docs/workbox/modules/workbox-build/#injectmanifest-mode
    return workboxBuild.injectManifest({
        swSrc: conf.paths.dist + '/service-worker.js',
        swDest: conf.paths.dist + '/service-worker.js',
        globDirectory: conf.paths.dist,
        globPatterns: [
            '**/*.{html,js,css,json}',
            'img/site/**/*.{png,webp,svg,jpg,gif}',
            'img/svg/**/*.svg',
            'img/webp/**/*.webp',
            'img/png/**/*.png',
        ],
        //mode: 'development',
    });
};

exports.default = injectWorkbox;