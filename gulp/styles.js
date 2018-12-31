'use strict';

var autoprefixer = require('gulp-autoprefixer'),
    conf = require('./conf'),
    connect = require('gulp-connect'),
    cssnano = require('gulp-cssnano'),
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass');

gulp.task('styles', ['styles:build'], function() {
    gulp.src(conf.paths.src + '/styles/*.scss')
        .pipe(rename({ suffix: '.min' }))
        .pipe(sass())
        .pipe(gulp.dest(conf.paths.dist + '/css'))
        .pipe(cssnano());
});

gulp.task('styles:build', function() {
	gulp.watch(conf.paths.src + '/styles/*.scss', ['sass']);
    /*return sass('src/main/styles/neo4jd3.scss', { style: 'expanded' })
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest(conf.paths.docs + '/css'))
        
        .pipe(gulp.dest(conf.paths.docs + '/css'))
        .pipe(connect.reload());*/
});
