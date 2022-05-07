'use strict';

var conf = require('./conf'),
    connect = require('gulp-connect'),
    gulp = require('gulp'),
    imagemin = require('gulp-imagemin');

function site_images() {
    return gulp.src(conf.paths.src + '/images/site/*')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest(conf.paths.dist + '/img/site'))
        .pipe(connect.reload());
};

function appicon_images() {
    return gulp.src(conf.paths.src + '/images/appicons/**/*')
        .pipe(gulp.dest(conf.paths.dist + '/img/appicons'))
        .pipe(connect.reload());
};

const images = gulp.series(site_images, appicon_images);
exports.default = images;
