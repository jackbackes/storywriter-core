"use strict";
var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');

module.exports = function (app) {

    var root = app.getValue('projectRoot');

    var npmPath = path.join(root, './node_modules');
    var bowerPath = path.join(root, './bower_components');
    var publicPath = path.join(root, './public');
    var browserPath = path.join(root, './browser');
    var gitPath = path.join(root, './git_modules');

    app.use(favicon(app.getValue('faviconPath')));
    app.use(express.static(npmPath));
    app.use(express.static(publicPath));
    app.use(express.static(browserPath));
    app.use(express.static(bowerPath));
    app.use(express.static(gitPath));

};
