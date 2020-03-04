'use strict';

    var conf = require('./conf'),
    gulp = require('gulp');


function index() {
	return gulp.src(conf.paths.src + '/html/index.html')
	.pipe(gulp.dest(conf.paths.dist))
};

function humans() {
	return gulp.src(conf.paths.src + '/humans.txt')
	.pipe(gulp.dest(conf.paths.dist))
};

function r6Json() {
	return gulp.src(conf.paths.src + '/json/r6OperatorCounters.json')
    	.pipe(gulp.dest(conf.paths.dist + '/json'));
};

const runStatic = gulp.series(index, humans, r6Json);

exports.default = runStatic;