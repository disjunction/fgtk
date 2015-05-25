/*jslint node: true */
"use strict";

var cc = require('cc');

/**
 * opts:
 * * config
 * * resources
 * @param opts
  */
var AssetManager = function(opts) {
    this.opts = opts;
    if (!opts.resources) {
        this.opts.resources = {};
    }
};

var _p = AssetManager.prototype;

_p.resolveSrc = function(src) {
    var prefix;
    if (this.opts.config) {
        prefix = this.opts.config.assetPrefix;
    } else {
        prefix = '/';
    }
    return prefix + src;
};

_p.resolveSrcArray = function(arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        result.push(this.resolveSrc(arr[i]));
    }
    return result;
};

_p.getResource = function(path) {
    if (this.opts.resources[path]) {
        return this.opts.resources[path];
    } else {
        throw new Error('Resource not found: ' + path);
    }
};

_p.getSizeFromFs = function(path) {
    var sizeOf = require('image-size'),
        fs = require('fs');
    for (var i = 0; i < this.opts.dirs.length; i++) {
        var fileName = this.opts.dirs[i] + '/' + path;
        if (fs.existsSync(fileName)) {
            var size = sizeOf(fileName);
            this.opts.resources[path] = size;
            return size;
        }
    }
    throw new Error('file not found in assetManager dirs: ' + path);
};

_p.getSize = function(path) {
    if (this.opts.resources[path]) {
        var resource = this.getResource(path);
        return cc.size(resource.width, resource.height);
    } else if (this.opts.dirs) {
        return this.getSizeFromFs(path);
    } else {
        throw new Error('image not found while trying to get size: ' + path);
    }
};

module.exports = AssetManager;
