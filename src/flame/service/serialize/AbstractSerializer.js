/*jslint node: true */
"use strict";

var cc = require('cc');

var AbstractSerializer = cc.Class.extend({
    ctor: function(opts) {
        this.opts = opts;
    }
});

var _p = AbstractSerializer.prototype;


/**
 * not using toFixed() because of this benchmark
 * https://jsperf.com/parsefloat-tofixed-vs-math-round
 */
_p.outFloat = function(value) {
    return Math.round(value * 10000) / 10000;
};

_p.outCoord = function(value) {
    return Math.round(value * 100) / 100;
};

_p.outVelocity = function(value) {
    return Math.round(value * 100) / 100;
};

_p.outAngle = function(value) {
    return Math.round(value * 100) / 100;
};

_p.cutTrailingZeros = function(value) {
    while (value && value[value.length - 1] === 0) {
        value.pop();
    }
    return value;
};

module.exports = AbstractSerializer;
