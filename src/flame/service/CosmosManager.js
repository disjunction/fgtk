"use strict";

var cc = require('cc');

/**
 * opts:
 * * resources
 * @param opts
  */
var CosmosManager = function(opts) {
    this.opts = opts || {};
};

var _p = CosmosManager.prototype;

_p.getResource = function(path) {
    if (path.substring(path.length - 5) != '.json') {
        path += '.json';
    }
    
    if (this.opts.resources[path]) {
        return this.opts.resources[path];
    } else if (typeof window == 'undefined') {
        this.opts.resources[path] = require(path);
        return this.opts.resources[path];
    } else {
        throw new Error('Resource not found: ' + path);
    }
};

module.exports = CosmosManager;