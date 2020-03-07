'use strict';

var conf = require('./conf'),
    del = require('del');
function clean() {
    return del([
        conf.paths.dist + '*',
    ]);
};

exports.default = clean;
