'use strict';

var gulp = require('gulp'),
    Server = require('karma').Server;

process.env.NODE_PATH = process.cwd();

function test_client(done) {
    var configFile = require('path').resolve('karma.conf.js');

    return new Server({
        configFile: configFile,
        singleRun: true
    }, done).start();
};

function watch_test() {
    gulp.watch(['src/main/scripts/**/*.js', 'src/test/scripts/**/*.js'], test_client);
};

exports.default = gulp.series(test_client, watch_test);
