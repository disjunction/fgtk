/*jslint node: true */
"use strict";

var LocalPumpkinClient = require('./client/LocalPumpkinClient'),
    PumpkinSerializer = require('./service/PumpkinSerializer');

function Pumpkin(opts) {
    this.opts = opts;
    this.serializer = new PumpkinSerializer();
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
