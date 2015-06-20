/*jslint node: true */
"use strict";

var cc = require('cc'),
    smog = require('fgtk/smog');

/**
 * opts: none?
 */
function PumpkinSerializer(opts) {
    this.opts = opts;
}

var _p = PumpkinSerializer.prototype;

_p.serializeSibling = function(sibling){
    var serial = {};
    for (var i in sibling) {
        if (i == "avatar") {
            continue;
        }
        serial[i] = sibling[i];
    }
    return serial;
};

_p.unserializeSibling = function(serialSibling) {
    return new smog.entity.Sibling(serialSibling);
};

module.exports = PumpkinSerializer;
