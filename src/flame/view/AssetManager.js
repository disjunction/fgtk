"use strict";

var cc = require('cc');

/**
 * opts:
 * * resources
 * @param opts
  */
var AssetManager = function(opts) {
    this.opts = opts || {};
};

var _p = AssetManager.prototype;

_p.resolveSrc = function(src) {
    return 'http://localhost/dispace-assets/vorschlag/' + src;
};

_p.getResource = function(path) {
    if (this.opts.resources[path]) {
        return this.opts.resources[path];
    } else {
        throw new Error('Resource not found: ' + path);
    }
};

module.exports = AssetManager;