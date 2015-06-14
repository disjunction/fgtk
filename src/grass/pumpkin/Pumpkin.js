/*jslint node: true */
"use strict";

var LocalPumpkinClient = require('./client/LocalPumpkinClient');

function Pumpkin(opts) {
    this.opts = opts;
}

var _p = Pumpkin.prototype;

_p.makeClient = function() {
    return new LocalPumpkinClient({
        pumpkin: this
    });
};

Pumpkin.bootstrapLocal = function () {
    return new Pumpkin({});
};

module.exports = Pumpkin;
