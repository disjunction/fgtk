/*jslint node: true */
"use strict";

var cc = require('cc'),
    b2 = require('jsbox2d');

var chasisMapping = {
    airCushion: require('flame/rof/chasis/AirCushionChasis'),
    track: require('flame/rof/chasis/TrackChasis')
};

var Driver = cc.Class.extend({
    /**
     * opts:
     * * world
     * @param object opts
     */
    ctor: function(opts) {
        this.opts = opts || {};

        // convert classes into objects, injecting driver options
        for (var i in chasisMapping) {
            if (typeof chasisMapping[i] == 'function') {
                chasisMapping[i] = new (chasisMapping[i])(this.opts);
            }
        }
    },

    makeMover: function(thing, config) {
        var mover = {config: config};
        mover.chasis = chasisMapping[config.chasis];
        if (!mover.chasis) {
            throw new Error('unexecpected chasis for mover: "' + mover.chasis + '"');
        }
        mover.chasis.initMover(thing, mover);
        return mover;
    },

    drive: function(thing, driveOn) {
        var interState = thing.i,
            mover = thing.mover,
            chasis = mover.chasis;

        if (!driveOn) {
            chasis.applyState(mover, interState);
        }

        if (!thing.removed && !thing.hasEffect('inert')) {
            chasis.driveBody(thing.body, mover);
        }
    }
});

module.exports = Driver;
