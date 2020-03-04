'use strict';

var conf = require('./conf'),
    gulpConnect = require('gulp-connect'),
    gulp = require('gulp');

function connect() {
    return gulpConnect.server({
        livereload: true,
        root: conf.paths.dist
    });
};

exports.default = connect;