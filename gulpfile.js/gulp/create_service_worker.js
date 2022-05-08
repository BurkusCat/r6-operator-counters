'use strict';

const conf = require('./conf');
const workboxBuild = require('workbox-build');
const gulp = require('gulp');
    
function serviceWorker() {
    return workboxBuild.generateSW({
        swDest: conf.paths.dist + '/service-worker.js',
        globDirectory: conf.paths.dist,
        globPatterns: [
            '**/*.{html,js,css,json}',
            'img/site/**/*.{png,webp,svg,jpg,gif}',
            'img/svg/**/*.svg',
            'img/webp/**/*.webp',
            'img/png/**/*.png',
        ],
        skipWaiting: true,
        clientsClaim: true,
        //mode: 'development',
    });
};

exports.default = serviceWorker;