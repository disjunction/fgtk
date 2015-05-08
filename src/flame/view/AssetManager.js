"use strict";

var cc = require('cc');

/**
 * opts:
 * * config
 * * resources
 * @param opts
  */
var AssetManager = function(opts) {
    this.opts = opts || {};
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

_p.getSize = function(path) {
    var resource = this.getResource(path);
    return cc.size(resource.width, resource.height);
};

module.exports = AssetManager;