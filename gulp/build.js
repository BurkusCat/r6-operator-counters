'use strict';

var gulp = require('gulp'),
    runSequence = require('run-sequence');

gulp.task('build', function(callback) {
    runSequence('clean', 'images', 'scripts', 'node_modules', 'static', callback);
});
