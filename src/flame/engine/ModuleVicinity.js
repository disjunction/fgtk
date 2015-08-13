/*jslint node: true */
"use strict";

var cc = require('cc'),
    geo = require('smog').util.geo,
    util = require('smog').util.util,
    ModuleAbstract = require('./ModuleAbstract');

/**
 * Sets and updates vicinity property on all things
 */
var ModuleVicity = ModuleAbstract.extend({
    ctor: function(opts) {
        this._super(opts);

        // bidimentional array x => y => vicinity
        this.vicinities = [];
        this.vicinitySize = 24;
    },

    injectFe: function(fe, name) {
        this._super(fe, name);
        this.addNativeListeners([
            "injectThing",
            "removeThing",
            "moveThing"
        ]);
        this.channelChangeVicinity = this.fe.eq.channel("changeVicinity");
    },

    getVicinity: function(x, y) {
        if (this.vicinities[x] === undefined) {
            this.vicinities[x] = [];
        }
        if (this.vicinities[x][y] === undefined) {
            this.vicinities[x][y] = {x: x, y: y, things: [], display: true};
        }
        return this.vicinities[x][y];
    },

    getVicinityByL: function(l) {
        var x = Math.floor(l.x / this.vicinitySize) + 1,
            y = Math.floor(l.y / this.vicinitySize) + 1;
        return this.getVicinity(x, y);
    },

    getVicinityByThing: function(thing) {
        if (!thing.vicinity) {
            thing.vicinity = this.getVicinityByL(thing.l);
        }
        return thing.vicinity;
    },

    broadcastAndChangeVicinity: function(thing, newVicinity) {
        this.channelChangeVicinity.broadcast({
            vicinity: newVicinity,
            thing: thing
        });
        util.removeOneFromArray(thing, thing.vicinity.things);
        newVicinity.things.push(thing);
        thing.vicinity = newVicinity;
    },

    onInjectThing: function(event) {
        var thing = event.thing;
        if (thing.plan.ignoreVicinity) {
            return;
        }

        thing.vicinity = this.getVicinityByThing(thing);
        thing.vicinity.things.push(thing);
        if (thing.things) {
            for (var i in thing.things) {
                thing.things[i].vicinity = thing.vicinity;
                thing.vicinity.things.push(thing.things[i]);
            }
        }
    },

    onRemoveThing: function(event) {
        var thing = event.thing;
        if (thing.things) {
            for (var i in thing.things) {
                this.onRemoveThing({thing: thing.things[i]});
            }
        }
        if (thing.vicinity) {
            util.removeOneFromArray(thing, thing.vicinity.things);
            delete thing.vicinity;
        }
    },

    onMoveThing: function(event) {
        var thing = event.thing;
        if (thing.vicinity) {
            var newVicinity = this.getVicinityByL(thing.l);
            if (newVicinity != thing.vicinity) {
                this.broadcastAndChangeVicinity(thing, newVicinity);
                if (thing.things) {
                    for (var i in thing.things) {
                        this.broadcastAndChangeVicinity(thing.things[i], newVicinity);
                    }
                }
            }
        }
    },
});

module.exports = ModuleVicity;
