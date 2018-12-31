'use strict';

var conf = require('./conf'),
    del = require('del'),
    gulp = require('gulp');

gulp.task('clean', function() {
    return del([
        conf.paths.dist + '*',
    ]);
});
