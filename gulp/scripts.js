'use strict';

var _ = require('lodash'),
    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    concat = require('gulp-concat'),
    conf = require('./conf'),
    connect = require('gulp-connect'),
    derequire = require('gulp-derequire'),
    gulp = require('gulp'),
    gulpif = require('gulp-if'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    notifier = require('node-notifier'),
    notify = require('gulp-notify'),
    path = require('path'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    uglify = require('gulp-uglify'),
    watchify = require('watchify');

gulp.task('scripts', function() {
    return gulp.src([
            conf.paths.src + '/scripts/neo4jd3.js',
            conf.paths.src + '/scripts/neo4jd3.min.js',
            conf.paths.src + '/scripts/d3.min.js'
        ])
        .pipe(gulp.dest(conf.paths.dist + '/js'));
});

function error(err) {
    notifier.notify({message: 'Error: ' + err.message});
    gutil.log(gutil.colors.red('Error: ' + err));
    this.emit('end');
}
