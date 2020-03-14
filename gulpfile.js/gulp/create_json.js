'use strict'

var gulp = require('gulp'),
run = require('gulp-run');

function createJson() {
    return run('npm run createjson').exec();    // run "npm createjson". 
}

exports.default = createJson;