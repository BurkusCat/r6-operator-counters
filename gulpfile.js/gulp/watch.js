'use strict';

var gulp = require('gulp');



function fonts() {
    return gulp.watch('src/main/fonts/**/*', ['fonts']);
};
function html() {
    return gulp.watch('src/main/index.html', ['html']);
};
function images() {
    return gulp.watch('src/main/images/**/*', ['images']);
};
function json() {
    return gulp.watch('src/main/json/**/*', ['json']);
};
function scripts() {
    return gulp.watch('src/main/scripts/**/*.js', ['scripts']);
};
function styles() {
    return gulp.watch('src/main/styles/**/*.scss', ['styles']);
};

const watch = gulp.series(fonts, html, images, json, scripts, styles);

exports.default = watch;