'use strict';

var autoprefixer = require('gulp-autoprefixer'),
    conf = require('./conf'),
    connect = require('gulp-connect'),
    gulp = require('gulp'),
    sass = require('gulp-sass');

gulp.task('static', function() {
	gulp.src(conf.paths.src + '/html/index.html')
	.pipe(gulp.dest(conf.paths.dist))
	
	gulp.src(conf.paths.src + '/json/r6OperatorCounters.json')
    .pipe(gulp.dest(conf.paths.dist + '/json'));
});
