/*jslint node: true */
"use strict";

var AbstractSerializer = require('./AbstractSerializer');

/**
 * Serialized thing consists of serial-bundles in one object
 * - bundle is transferred as tuple [thingId, payload] - all numbers are rounded to 4th sign
 * - if payload is an object, then it contains bundles
 * - trailing zero values are omitted, e.g. if thing doesn't move, then "p" contains not more than 3 elements
 * ["thingId", {
 * 	  "type": "rover" // (only in initial)
 *
 *    // phisics object
 *    "p": [
 *         10.3434, // location x
 *         20.4543, // location y
 *         1.3546,  // a (rotation)
 *         7.2343, // lin. velocity x
 *         5.2433, // lin. velocity y
 *         2.3435, // angular velocity
 *    ],
 *
 *    "planSrc": "thing/obstacle/house4x4" // passed only in the initial serialization
 *
 *
 *    // interaction object
 *    "i": ["a", "l"], // in this example "accelerate" and "turn left"
 * ]
 *
 * opts:
 * * cosmosManager (only for unserializing)
 * * thingBuilder (only for unserializing)
 */

var ThingSerializer = AbstractSerializer.extend({
    ctor: function(opts) {
        AbstractSerializer.prototype.ctor.call(this, opts);
    }
});

var _p = ThingSerializer.prototype;

_p.makePhisicsBundle = function(thing, skipVelocity) {
    var result = [
        this.outFloat(thing.l.x),
        this.outFloat(thing.l.y),
        this.outFloat(thing.a)
    ];
    if (thing.body && !skipVelocity) {
        var linearVelocity = thing.body.GetLinearVelocity();
        var angularVelocity = thing.body.GetAngularVelocity();
        result.push(
            this.outFloat(linearVelocity.x),
            this.outFloat(linearVelocity.y),
            this.outFloat(angularVelocity)
        );
    }
    return this.cutTrailingZeros(result);
};

_p.makeIterstateBundle = function(thing, skipVelocity) {
    return ["a"];
};

_p.serializeInitial = function(thing) {
    var bundle = [
        thing.id,
        {
            p: this.makePhisicsBundle(thing),
            planSrc: thing.plan.from
        }
    ];
    if (thing.type !== undefined) {
        bundle[1].type = thing.type;
    }
    return bundle;
};

_p.applyPhisicsBundle = function(thing, phisicsBundle) {
    var l = phisicsBundle.length;
    if (l > 0) thing.l.x = phisicsBundle[0];
    if (l > 1) thing.l.y = phisicsBundle[1];
    if (l > 2) thing.a = phisicsBundle[2];
    if (l > 3) {
        if (thing.linearVelocity === undefined) {
            thing.linearVelocity = {x: 0.0, y: 0.0};
        }
        thing.linearVelocity.x = phisicsBundle[3];
        if (l > 4) {
            thing.linearVelocity.y = phisicsBundle[4];
        }
        if (l > 5) {
            thing.angularVelocity = phisicsBundle[5];
        }
    }
};

_p.unserializeInitial = function(thingBundle) {
    var plan = this.opts.cosmosManager.get(thingBundle[1].planSrc);
    var thing = this.opts.thingBuilder.makeThing({
        plan: plan
    });
    thing.id = thingBundle[0];
    this.applyPhisicsBundle(thing, thingBundle[1].p);
    return thing;
};


module.exports = ThingSerializer;
