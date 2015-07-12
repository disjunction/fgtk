/*jslint node: true */
"use strict";

var Field = require('flame/entity/Field');

var AbstractSerializer = require('./AbstractSerializer');

/**
 * Serializes the field for initial feed, when a new player joins
 * Format:
 * {
 * 	  things: [["thingId1", "inject", {bundles...}], ["thingId2", "inject", {bundles...}] ...],
 * 	  size: {width: ..., height: ...}
 * }
 *
 * opts:
 * * thingSerializer
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
    result.size = field.size;
    return result;
};

_p.unserializeInitial = function(fieldBundle) {
    var field = new Field();
    for (var i = 0; i < fieldBundle.things.length; i++) {
        var thing = this.opts.thingSerializer.unserializeInitial(fieldBundle.things[i]);
        field.things.push(thing);
    }
    field.size = fieldBundle.size;
    return field;
};

module.exports = FieldSerializer;
