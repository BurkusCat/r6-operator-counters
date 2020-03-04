'use strict';

var conf = require('./conf'),
    connect = require('gulp-connect'),
    gulp = require('gulp'),
    imagemin = require('gulp-imagemin');

function images() {
    return gulp.src(conf.paths.src + '/images/**/*')
    // !FIX THIS LATER
        // .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest(conf.paths.dist + '/img'))
        .pipe(connect.reload());
};

exports.default = images;
