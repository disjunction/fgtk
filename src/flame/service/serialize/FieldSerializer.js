/*jslint node: true */
"use strict";

var AbstractSerializer = require('./AbstractSerializer');

/**
 * Serializes the field for initial feed, when a new player joins
 * Format:
 * {things: [["thingId1", {bundles...}], ["thingId2", {bundles...}] ...]}
 */
var FieldSerializer = AbstractSerializer.extend({
    ctor: function(opts) {
        if (!opts.thingSerializer) {
            throw new Error('FieldSerializer requires thingSerializer in opts');
        }
        AbstractSerializer.prototype.ctor.call(this, opts);
    }
});

var _p = FieldSerializer.prototype;

_p.serializeInitial = function(field) {
    var result = {things: []};
    for (var i = 0; i < field.things.length; i++) {
        result.things.push(this.opts.thingSerializer.serializeInitial(field.things[i]));
    }
    return result;
};

module.exports = FieldSerializer;
