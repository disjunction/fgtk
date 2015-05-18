/*jslint node: true */
"use strict";

var AbstractSerializer = function(opts) {
    this.opts = opts;
};

var _p = AbstractSerializer.prototype;


_p.outFloat = function(value) {
    return value.toFixed(4);
};

_p.cutTrailingZeros= function(a) {
    while (a[a.length - 1] === 0) {
        a.pop();
    }
    return a;
};


module.exports = AbstractSerializer;
