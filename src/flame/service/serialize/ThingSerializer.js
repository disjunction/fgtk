/*jslint node: true */
"use strict";

/**
 * Serialized thing consists of serial-bundles in one object
 * - bundle is transferred as tuple [thingId, payload] - all numbers are rounded to 4th sign
 * - if payload is an object, then it contains bundles
 * - trailing zero values are omitted, e.g. if thing doesn't move, then "p" contains not more than 3 elements
 * ["thingId", {
 *    // phisics object
 *    "p": [
 *         10.3434, // location x
 *         20.4543, // location y
 *         1.3546,  // a (rotation)
 *         7.2343, // lin. velocity x
 *         5.2433, // lin. velocity y
 *         2.3435, // angular velocity
 *    ],
 *    "planSrc": "thing/obstacle/house4x4" // passed only in the initial serialization
 *
 *
 *    // interaction object
 *    "i": ["a", "l"], // in this example "accelerate" and "turn left"
 *
 *    // guts object
 *    "g": ["i": [5, 10], "a": [7, 20]], // passed as is
 *    "assembly": {"components": ... }, // custom assembly spec. passed as is, because is needed only when a new rover is added
 *    "assemblySrc": "assembly/mob/evil_guy", // predefined assembly, referenced just by src
 * ]
 */

var ThingSerializer = function(opts) {
    this.opts = opts;
};

var _p = ThingSerializer.prototype;

/**
 * not using toFixed() because of this benchmark
 * https://jsperf.com/parsefloat-tofixed-vs-math-round
 */
_p.outFloat = function(value) {
    return Math.round(value * 10000) / 10000;
};

_p.cutTrailingZeros = function(value) {
    while (value && value[value.length - 1] === 0) {
        value.pop();
    }
    return value;
};

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

_p.serializeInitial = function(thing) {
    return [
        thing.id,
        {
            p: this.makePhisicsBundle(thing),
            planSrc: thing.plan.from
        }
    ];
};

module.exports = ThingSerializer;
