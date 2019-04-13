'use strict';

var gulp = require('gulp'),
    runSequence = require('run-sequence');

gulp.task('default', function(callback) {
    runSequence('clean', 'images', 'styles', 'node_modules', 'static', 'connect', 'watch', callback);
});
