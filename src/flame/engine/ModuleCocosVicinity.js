/*jslint node: true */
"use strict";

var cc = require('cc'),
    Radiopaque = require('radiopaque'),
    geo = require('smog').util.geo,
    util = require('smog').util.util,
    ModuleAbstract = require('./ModuleCocos');

/**
 * extension of ModuleCocos suppoprting automatic showing/hiding
 * objects depending on their vicinity (distance)
 *
 * opts:
 * * viewport
 * * stateBuilder
 * * config
 */
var ModuleCocosVicity = ModuleAbstract.extend({
    ctor: function(opts) {
        this._super(opts);

        this.vicinityShowRange = 2;
        this.vicinityHideRange = 2;

        this.currentVicinity = null;

        this.displayed = [];

        this.envisionQueue = Radiopaque.create();
        this.hideQueue = Radiopaque.create();

        this.hiddenStates = {};
    },

    injectFe: function(fe, name) {
        this._super(fe, name);
        this.moduleVicinity = fe.m.vicinity;
        this.addNativeListeners([
            "moveCamera",
            "changeVicinity",
            "loopEnd",
        ]);
    },

    getStateKeyByThing: function(thing) {
        return thing.plan.from + ":" + (thing.stateName || thing.s || 'basic');
    },

    envisionVicinity: function(v) {
        v.visible = true;
        for (var i = 0; i < v.things.length; i++) {
            var thing = v.things[i];
            if (thing.state) {

                if (thing.state.delayed) {
                    var key = this.getStateKeyByThing(thing);
                    if (this.hiddenStates[key] && this.hiddenStates[key].length > 0) {
                        thing.state = this.hiddenStates[key].pop();
                    } else {
                        this.envision(thing);
                    }
                    thing.state.delayed = false;
                }

                this.opts.viewport.addStateToLayer(thing.state);
                this.syncStateFromThing(thing);
            }
        }

        this.displayed.push(v);
    },

    hideState: function(thing) {
        var isDelayed = false;

        for (var i in thing.state.nodes) {
            var node = thing.state.nodes[i];
            if (node.plan && node.plan.cleanupOnHide) {
                node.removeFromParent();
                delete thing.state.nodes[i];
            }
        }

        if (thing.state.delayed === false && thing.plan.static && thing.plan.from) {
            isDelayed = true;
            var key = this.getStateKeyByThing(thing);
            if (this.hiddenStates[key] === undefined) {
                this.hiddenStates[key] = [];
            }

            this.hiddenStates[key].push(thing.state);
        }

        this.opts.viewport.removeStateFromLayer(thing.state);

        if (isDelayed) {
            thing.state = {nodes: {}, delayed: true};
        }
    },

    hideVicinity: function(v) {
        v.visible = false;
        for (var i = 0; i < v.things.length; i++) {
            var thing = v.things[i];
            if (thing.state) {
                this.hideState(thing);
            }
        }

        util.removeOneFromArray(v, this.displayed);
    },

    attachState: function(thing) {
        if (thing.vicinity) {
            if (thing.vicinity.visible) {
                this._super(thing);
            }
        } else {
            this._super(thing);
        }
    },

    syncStateFromThing: function(thing) {
        if (thing.vicinity && !thing.vicinity.visible) {
            return;
        }
        this._super(thing);
    },

    onInjectThing: function(event) {
        var thing = event.thing,
            plan = event.thing.plan;
        if (plan.states && plan.cocos && plan.cocos.delayedEnvision) {
            thing.state = {nodes: {}, delayed: true};
            return;
        }

        this._super(event);
    },

    onMoveCamera: function(l) {
        var vicinity = this.moduleVicinity.getVicinityByL(l);
        if (vicinity != this.currentVicinity) {
            var startX = Math.max(0, vicinity.x - this.vicinityShowRange),
                endX = vicinity.x + this.vicinityShowRange,
                startY = Math.max(0, vicinity.y - this.vicinityShowRange),
                endY = vicinity.y + this.vicinityShowRange,
                hideDiff = this.vicinityHideRange - this.vicinityShowRange,
                v;

            // hide all within hide range, which are not visible area
            if (this.currentVicinity) {
                var hideStartX = Math.max(0, this.currentVicinity.x - this.vicinityHideRange),
                    hideEndX = this.currentVicinity.x + this.vicinityHideRange,
                    hideStartY = Math.max(0, this.currentVicinity.y - this.vicinityHideRange),
                    hideEndY = this.currentVicinity.y + this.vicinityHideRange;

                for (var hi = 0; hi < this.displayed.length; hi++) {
                    v = this.displayed[hi];
                    if (v.x >= startX && v.x <= endX && v.y >= startY && v.y <= endY) {
                        continue;
                    }

                    this.hideQueue.pushIn(0.02, v);
                }
            }

            this.currentVicinity = vicinity;

            for (var i = startX; i <= endX; i++) {
                for (var j = startY; j <= endY; j++) {
                    v = this.moduleVicinity.getVicinity(i, j);
                    if (!v.visible) {
                        this.envisionQueue.pushIn(0.02, v);
                    }
                }
            }
        }
    },

    onChangeVicinity: function(event) {
        var thing = event.thing;
        if (!thing.state) {
            return;
        }

        if (thing.vicinity.visible != event.vicinity.visible) {
            if (event.vicinity.visible) {
                this.opts.viewport.addStateToLayer(thing.state);
            } else {
                this.hideState(thing);
            }
        }
    },

    onLoopEnd: function(event) {
        var v = this.hideQueue.timeAt(this.fe.simSum).fetch();
        if (v) {
            this.hideVicinity(v);
        }
        v = this.envisionQueue.timeAt(this.fe.simSum).fetch();
        if (v) {
            this.envisionVicinity(v);
        }

        for (var i = 0; i < this.displayed.length; i++) {
            for (var j = 0; j < this.displayed[i].things.length; j++) {
                var thing = this.displayed[i].things[j];
                if (!thing.state || (thing.plan.static && !thing.plan.elevated)) continue;
                this.syncStateFromThing(thing);
            }
        }
    }
});

module.exports = ModuleCocosVicity;
