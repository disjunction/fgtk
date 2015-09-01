/*jslint node: true */
"use strict";

var cc = require('cc'),
    geo = require('smog').util.geo;


var Thing = cc.Class.extend({
    /**
     * @param opts object
     */
    ctor: function(opts) {
        opts = opts || {};

        if (opts.plan) {
            this.plan = opts.plan;
            if (opts.plan.type) {
                this.type = opts.plan.type;
            }
        }

        // short for effects
        this.e = opts.e || {};

        // location
        this.l = opts.l ? opts.l : cc.p();

        // angle
        this.a = opts.a ? opts.a : 0.0;
    },

    /**
     * applies strings like "+inert" or "-spawn"
     * @param  {String} effectString
     * @return {boolean} returns true if the effect actually changed
     */
    applyEffect: function(effectString) {
        var effect = effectString.substring(1);
        switch (effectString[0]) {
            case "+":
                if (!this.e[effect]) {
                    this.e[effect] = 1;
                } else {
                    this.e[effect]++;
                }
                return (this.e[effect] == 1);
            case "-":
                if (this.e[effect]) {
                    this.e[effect]--;
                    return (this.e[effect] === 0);
                }
                return false;
            default:
                throw new Error("unexpected effectString: '" + effectString + "'");
        }
    },

    hasEffect: function(effect) {
        return !!this.e[effect];
    },
});

/**
 * returns the node named 'primary' or just the first one
 * @param {Thing} thing
 * @returns {Node}
 */
Thing.getPrimaryNode = function(thing) {
    if (thing.look.nodes.primary) {
        return thing.look.nodes.primary;
    }

    // ugly - getting the first node
    for (var i in thing.look.nodes) {
        return thing.look.nodes[i];
    }

    return null;
};

Thing.stretch = function(thing, l1, l2) {
    var primaryNode = Thing.getPrimaryNode(thing);
    thing.stretcher = {
        l1: l1,
        l2: l2,
        distance: cc.pDistance(l2, l1),
        primaryNode: primaryNode,
        scaleX: -1.0, // this can be oly defined further in cocos Module
        size: {width: primaryNode.width, height: primaryNode.height}
    };

    thing.a = geo.segment2Angle(l1, l2);
    thing.l = geo.middle(l2, l1);
};


module.exports = Thing;
