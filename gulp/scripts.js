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
    terser = require('gulp-terser'),
    watchify = require('watchify');

gulp.task('scripts', ['scripts:internal'], function() {
    return gulp.src([
            conf.paths.src + '/scripts/d3.min.js'
        ])
        .pipe(gulp.dest(conf.paths.dist + '/js'));
});

gulp.task('scripts:internal', ['scripts:jshint','scripts:derequire'], function() {
    return gulp.src(conf.paths.dist + '/js/neo4jd3.js')
        .pipe(concat('neo4jd3.js'))
        .pipe(gulp.dest(conf.paths.dist + '/js'))
        .pipe(terser())
        .pipe(gulp.dest(conf.paths.dist + '/js'));
});

gulp.task('scripts:jshint', function() {
    return gulp.src('src/main/scripts/neo4jd3.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'));
});

var entryFile = path.join(conf.paths.src, '/index.js');

gulp.task('scripts:derequire', function() {
    return buildScript(entryFile, 'dev');
});

function buildScript(filename, mode) {
    var bundleFilename = 'index.js';

    var browserifyConfig = {
        standalone: 'Neo4jd3'
    };

    var bundler;

    if (mode === 'dev') {
        bundler = browserify(filename, _.extend(browserifyConfig, { debug: true }));
    } else if (mode === 'prod') {
        bundler = browserify(filename, browserifyConfig);
    } else if (mode === 'watch') {
        if (cached[filename]) {
            return cached[filename].bundle();
        }

        bundler = watchify(browserify(filename, _.extend(browserifyConfig, watchify.args, { debug: true })));
        cached[filename] = bundler;
    }

    function rebundle() {
        var stream = bundler.bundle()
            .on('error', function(err) {
                error.call(this, err);
            });

        return stream
            .pipe(plumber({ errorHandler: error }))
            .pipe(source(bundleFilename))
            .pipe(derequire())
            .pipe(buffer())
            .pipe(gulpif(mode === 'prod', terser({ mangle: true })))
            .pipe(concat('neo4jd3.js'))
            .pipe(gulp.dest(conf.paths.dist + '/js'));
    }

    // listen for an update and run rebundle
    bundler.on('update', function() {
        rebundle();
        gutil.log('Rebundle...');
    });

    // run it once the first time buildScript is called
    return rebundle();
}

function error(err) {
    notifier.notify({message: 'Error: ' + err.message});
    gutil.log(gutil.colors.red('Error: ' + err));
    this.emit('end');
}
