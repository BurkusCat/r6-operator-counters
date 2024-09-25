'use strict';

    var conf = require('./conf'),
    cssnano = require('gulp-cssnano'),
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass')(require('sass'))

function styles() {
    return gulp.src(conf.paths.src + '/styles/*.scss')
        .pipe(rename({ suffix: '.min' }))
        .pipe(sass())
        .pipe(gulp.dest(conf.paths.dist + '/css'))
        .pipe(cssnano());
};

exports.default = styles;