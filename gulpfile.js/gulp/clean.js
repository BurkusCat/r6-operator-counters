'use strict';

var conf = require('./conf'),
    del = require('del'),
    gulp = require('gulp');

function clean() {
    return del([
        conf.paths.dist + '*',
    ]);
};

exports.default = clean;
