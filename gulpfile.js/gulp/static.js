'use strict';

var conf = require('./conf'),
gulp = require('gulp');

function rootFiles() {
    return gulp.src([
			conf.paths.src + '/html/index.html',
            conf.paths.src + '/humans.txt',
            conf.paths.src + '/json/manifest.json',
        ])
        .pipe(gulp.dest(conf.paths.dist));
};

function r6Json() {
	return gulp.src(conf.paths.src + '/json/r6OperatorCounters.json')
    	.pipe(gulp.dest(conf.paths.dist + '/json'));
};

const runStatic = gulp.series(rootFiles, r6Json);

exports.default = runStatic;