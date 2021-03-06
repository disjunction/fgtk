/*jslint node: true */
"use strict";

var AbstractSerializer = require('./AbstractSerializer'),
    b2 = require('jsbox2d'),
    smog = require('fgtk/smog'),
    util = smog.util.util,
    b2p = smog.util.b2p;

// reusable temporary Vec2
var v1 = new b2.Vec2();


/**
 * Serialized thing consists of serial-bundles in one object
 * - bundle is transferred as tuple [thingId, payload] - all numbers are rounded to 4th sign
 * - if payload is an object, then it contains bundles
 * - trailing zero values are omitted, e.g. if thing doesn't move, then "p" contains not more than 3 elements
 * ["thingId", "inject", {
 * 	  "type": "rover" // (only in initial)
 *
 *    // phisics bundle
 *    "p": [
 *         10.3434, // location x
 *         20.4543, // location y
 *         1.3546,  // a (rotation)
 *         7.2343, // lin. velocity x
 *         5.2433, // lin. velocity y
 *         2.3435, // angular velocity
 *    ],
 *    "i": ["a", "l"], // in this example "accelerate" and "turn left"
 *    "e": {"invuln": 1, "shoot": 2}, // thnig effects
 *    "planSrc": "thing/obstacle/house4x4" // passed only in the initial serialization
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
        this.outCoord(thing.l.x),
        this.outCoord(thing.l.y),
        this.outAngle(thing.a)
    ];
    if (thing.body && !skipVelocity) {
        var linearVelocity = thing.body.GetLinearVelocity();
        var angularVelocity = thing.body.GetAngularVelocity();
        result.push(
            this.outVelocity(linearVelocity.x),
            this.outVelocity(linearVelocity.y),
            this.outVelocity(angularVelocity)
        );
        return this.cutTrailingZeros(result);
    } else {
        return result;
    }
};

_p.makeIterstateBundle = function(thing) {
    return thing.i.array;
};

_p.applyInterstateBundle = function(thing, interstateBundle) {
    thing.i.setArray(interstateBundle);
};

/**
 * Logic with delayed velocity update is too complicated
 * Better use applyPhisicsBundleToBody unless it's initial
 * TO CONSIDER - remove support for velocity? it's too ugly/complicated
 */
_p.applyPhisicsBundleToThing = function(thing, phisicsBundle) {
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

/**
 * a bit paranoid function, but it's called very often (each pup)
 * on all awake dynamic bodies
 * @param  {Thing} thing
 * @param  {Array} phisicsBundle
 */
_p.applyPhisicsBundleToBody = function(thing, phisicsBundle) {
    var body = thing.body,
        x = 0.0,
        y = 0.0,
        a = 0.0,
        vx = 0.0,
        vy = 0.0,
        va = 0.0;

    // normally this should not even happen. maybe report error?
    if (!thing.body) return;

    var l = phisicsBundle.length;
    if (l > 0) {
        x = phisicsBundle[0];
        if (l > 1) y = phisicsBundle[1];
        if (l > 2) a = phisicsBundle[2];
        b2p.assignVec2(v1, x, y);
        body.SetTransform(v1, a);
        thing.l.x = x;
        thing.l.y = y;
        thing.a = a;

        if (l > 3) {
            body.SetAwake(true);
            vx = phisicsBundle[3];
            if (l > 4) vy = phisicsBundle[4];
            if (l > 5) va = phisicsBundle[5];
            b2p.assignLinearVelocity(body, vx, vy);
            body.SetAngularVelocity(va);
        }
    }
};

_p.makeEffectsBundle = function(thing) {
    return thing.e;
};

_p.applyEffectsBundle = function(thing, effectsBundle) {
    thing.e = util.combineObjects(thing.e, effectsBundle);
};

_p.serializeInitial = function(thing) {
    var bundle = [
        thing.id,
        "inject",
        {
            p: this.makePhisicsBundle(thing),
            e: this.makeEffectsBundle(thing),
            planSrc: thing.plan.from
        }
    ];
    if (thing.type !== undefined) {
        bundle[2].type = thing.type;
    }
    return bundle;
};

_p.unserializeInitial = function(thingBundle) {
    var plan = this.opts.cosmosManager.get(thingBundle[2].planSrc);
    var thing = this.opts.thingBuilder.makeThing({
        plan: plan
    });
    thing.id = thingBundle[0];
    if (thingBundle[2].type !== undefined) {
        thing.type = thingBundle[2].type;
    }
    this.applyPhisicsBundleToThing(thing, thingBundle[2].p);

    if (thingBundle[2].e) {
        this.applyEffectsBundle(thing, thingBundle[2].e);
    }

    return thing;
};


module.exports = ThingSerializer;
