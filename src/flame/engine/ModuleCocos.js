/*jslint node: true */
"use strict";

var cc = require('cc'),
    geo = require('smog').util.geo,
    ModuleAbstract = require('./ModuleAbstract');

var x,y,node,thing;

var events = {
    renderCall: {type: "renderCall", dt: 0},
    renderEnd: {type: "renderEnd", dt: 0}
};

/**
 * opts:
 * * viewport
 * * stateBuilder
 * * config
 */
var ModuleCocos = ModuleAbstract.extend({
    ctor: function(opts) {
        ModuleAbstract.prototype.ctor.call(this, opts);

        var config = cc.clone(opts.config);
        if (!config.viewport) config.viewport = {};

        // shift in meters for a thing haveing elevation of 1 and being 1 meter away from camera
        if (!config.viewport.elevationShiftFactor) {
            config.viewport.elevationShiftRatio = 0.008;
        }
        if (!config.viewport.scaleFactor) config.viewport.elevationScaleRatio = 0;

        this.config = config;
    },
    getContainerNode: function(thing, containerName) {
        if (!thing.state.nodes[containerName]) {
            if (!this.opts.containerPlans || !this.opts.containerPlans[containerName]) {
                throw new Error('trying to get an unknown container: ' + containerName);
            }
            var plan = this.opts.containerPlans[containerName],
                container = this.opts.viewport.opts.nb.makeNode(plan);
            this.opts.viewport.addNodeToLayer(container);
            thing.state.nodes[containerName] = container;
        }
        return thing.state.nodes[containerName];
    },
    attachNodeToContainerNode: function(node, thing, localL, containerName) {
        var container = this.getContainerNode(thing, containerName);
        node.setPosition(cc.pMult(localL, this.fe.opts.config.ppm));
        container.addChild(node);
        this.opts.viewport.applyAnimation(node);
    },
    attachStateToContainerNode: function(state, thing, localL, containerName) {
        for (var i in state.nodes) {
            this.attachNodeToContainerNode(state.nodes[i], thing, localL, containerName);

            // currently not needed, as removeSelf should suffice
            // this.setupNodeForThing(state.nodes[i], thing);
        }
    },

    injectFe: function(fe, name) {
        ModuleAbstract.prototype.injectFe.call(this, fe, name);

        this.fe.fd.addListener('injectThing', function(event) {
            thing = event.thing;
            if (!thing.plan) return;
            this.envision(thing);
        }.bind(this));

        this.fe.fd.addListener('removeThing', function(event) {
            this.removeThing(event.thing);
        }.bind(this));

        this.fe.fd.addListener('moveThing', function(event) {
            this.syncStateFromThing(event.thing);
        }.bind(this));

        this.fe.fd.addListener('loopEnd', function(event) {
            this.fe.setDtAndDispatch(event.dt, events.renderCall);

            for (var i = 0; i < this.fe.field.things.length; i++) {
                thing = this.fe.field.things[i];
                if (!thing.state || (thing.plan.static && !thing.plan.elevated)) continue;
                this.syncStateFromThing(thing);
            }

            this.fe.setDtAndDispatch(event.dt, events.renderEnd);

        }.bind(this));
    },
    removeThing: function(thing) {
        // remove subthings recursively
        if (thing.things) {
            for (var j in thing.things) {
                this.removeThing(thing.things[j]);
            }
        }

        if (!thing.state) return;
        for (var i in thing.state.nodes) {
            thing.state.nodes[i].removeFromParent();
        }
        thing.state = null;
    },
    setupNodeForThing: function(node, thing) {
        if (node.plan.ani &&
            node.plan.ani[0] == 'sequence' &&
            node.plan.ani[1][node.plan.ani[1].length -1][0] == 'removeThingNode'
        ) {
            node.backlink = {
                thing: thing
            };
        }
    },
    applyState: function(thing) {
        // set thingShift vectors where needed
        // thingShift defines distance and angle of this node, relative to Thing origin
        for (var i in thing.state.nodes) {
            var node = thing.state.nodes[i];
            if (node.plan.x || node.plan.y) {
                var nodePoint = cc.p(node.plan.x / this.opts.config.ppm || 0, node.plan.y  / this.opts.config.ppm || 0);
                node.thingShift = {
                    r: cc.pLength(nodePoint),
                    a: cc.pToAngle(nodePoint)
                };
            }

            this.setupNodeForThing(node, thing);
        }

        this.syncStateFromThing(thing);

        this.opts.viewport.addStateToLayer(thing.state);
    },

    envision: function(thing) {
        var stateName = thing.s || 'basic';
        var state = this.opts.stateBuilder.makeState(thing.plan, stateName);
        thing.state = state;
        thing.stateName = stateName;
        this.applyState(thing);
    },

    changeState: function(thing, newState, ignoreSame) {
        if (ignoreSame && thing.stateName == newState) {
            return;
        }
        var state = this.opts.stateBuilder.makeState(thing.plan, newState, thing.state);
        for (var i in thing.state.nodes) {
            if (thing.state.nodes[i].inherited) {
                thing.state.nodes[i].inherited = false;
            } else {
                thing.state.nodes[i].removeFromParent();
            }
        }
        thing.state = state;
        thing.stateName = newState;
        this.applyState(thing);
    },

    syncStateFromThing: function(thing) {
        if (!thing.state) return;
        for (var i in thing.state.nodes) {
            node = thing.state.nodes[i];

            x = thing.l.x;
            y = thing.l.y;

            if (node.plan.elevation && !this.opts.skipElevation) {
                var elevatedRatio = node.plan.elevation * this.config.viewport.elevationShiftRatio;
                x += (thing.l.x - this.opts.viewport.camera.cameraLocation.x) * elevatedRatio;
                y += (thing.l.y - this.opts.viewport.camera.cameraLocation.y) * elevatedRatio;
            }

            if (node.thingShift) {
                x += node.thingShift.r * Math.cos(thing.a + node.thingShift.a);
                y += node.thingShift.r * Math.sin(thing.a + node.thingShift.a);
            }

            x = x *  this.config.ppm;
            y = y *  this.config.ppm;

            if (node.plan.round) {
                x = Math.round(x);
                y = Math.round(y);
            }

            if (thing.stretcher) {
                if (thing.stretcher.scaleX < 0) {
                    thing.stretcher.scaleX = thing.stretcher.distance / thing.stretcher.size.width * this.opts.config.ppm;
                    thing.stretcher.primaryNode.setScaleX(thing.stretcher.scaleX);
                }
            }

            node.setPositionX(x);
            node.setPositionY(y);
            if (!node.plan.skipRotation) {
                node.setRotation(geo.r2d(-thing.a) - (node.plan.a || 0));
            }
        }
    },
});

module.exports = ModuleCocos;
