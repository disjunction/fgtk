/*jslint node: true */
"use strict";

var cc = require('cc'),
    geo = require('smog').util.geo,
    ModuleAbstract = require('./ModuleAbstract');

var x,y,node,thing;

/**
 * opts:
 * * viewport
 * * lookBuilder
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

    injectFe: function(fe, name) {
        ModuleAbstract.prototype.injectFe.call(this, fe, name);
        this.addNativeListeners([
            "injectThing",
            "removeThing",
            "moveThing",
            "loopEnd",
        ]);
    },

    getContainerNode: function(thing, containerName) {
        if (!thing.look.nodes[containerName]) {
            if (!this.opts.containerPlans || !this.opts.containerPlans[containerName]) {
                throw new Error('trying to get an unknown container: ' + containerName);
            }
            var plan = this.opts.containerPlans[containerName],
                container = this.opts.viewport.opts.nb.makeNode(plan);
            this.syncNodeFromThing(container, thing);
            container.setCascadeOpacityEnabled(true);
            thing.look.nodes[containerName] = container;
            this.attachLook(thing);
        }
        return thing.look.nodes[containerName];
    },
    attachNodeToContainerNode: function(node, thing, localL, containerName) {
        var container = this.getContainerNode(thing, containerName);
        node.setPosition(cc.pMult(localL, this.fe.opts.config.ppm));
        container.addChild(node);
        this.setupNodeForThing(node, thing);
        this.opts.viewport.applyAnimation(node);
    },

    attachLookToContainerNode: function(look, thing, localL, containerName) {
        for (var i in look.nodes) {
            this.attachNodeToContainerNode(look.nodes[i], thing, localL, containerName);
        }
    },

    setupNodeForThing: function(node, thing) {
        // this creates ugly cyclic references,
        // but is necessary for playLocalEffect and removeThingNode
        node.backlink = {
            fe: this.fe,
            thing: thing
        };
    },

    applyLook: function(thing) {
        // set thingShift vectors where needed
        // thingShift defines distance and angle of this node, relative to Thing origin
        for (var i in thing.look.nodes) {
            var node = thing.look.nodes[i];
            if (node.plan.x || node.plan.y) {
                var nodePoint = cc.p(node.plan.x / this.opts.config.ppm || 0, node.plan.y  / this.opts.config.ppm || 0);
                node.thingShift = {
                    r: cc.pLength(nodePoint),
                    a: cc.pToAngle(nodePoint)
                };
            }

            this.setupNodeForThing(node, thing);
        }

        this.syncLookFromThing(thing);
        this.attachLook(thing);
    },

    /**
     * method extracted from applyLook, to make it overridable by ModuleCocosVicinity
     * @param  {Thing} thing
     */
    attachLook: function(thing) {
        this.opts.viewport.addLookToLayer(thing.look);
        this.syncLookFromThing(thing);
    },

    envision: function(thing) {
        var stateName = thing.s || 'basic';
        thing.look = this.opts.lookBuilder.makeLook(thing.plan, stateName);
        thing.stateName = stateName;
        this.applyLook(thing);
    },

    changeLook: function(thing, newState, ignoreSame) {
        if (ignoreSame && thing.stateName == newState) {
            return;
        }
        if (!thing.look) {
            throw new Error('cannot changeLook of empty look')
            return;
        }
        var look = this.opts.lookBuilder.makeLook(thing.plan, newState, thing.look);
        for (var i in thing.look.nodes) {
            var node = thing.look.nodes[i];
            if (node.inherited) {
                node.inherited = false;
            } else {
                if (node.plan && node.plan.type == "container") {
                    look.nodes[i] = node;
                } else {
                    node.removeFromParent();
                }
            }
        }
        thing.look = look;
        thing.stateName = newState;
        this.applyLook(thing);
    },

    syncNodeFromThing: function(node, thing) {
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
    },

    syncLookFromThing: function(thing) {
        if (!thing.look) {
            return;
        }
        for (var i in thing.look.nodes) {
            this.syncNodeFromThing(thing.look.nodes[i], thing);
        }
    },

    removeThing: function(thing) {
        if (thing.things) {
            for (var j in thing.things) {
                this.removeThing(thing.things[j]);
            }
        }

        if (!thing.look) {
            return;
        }
        for (var i in thing.look.nodes) {
            delete thing.look.nodes[i].backlink;
            thing.look.nodes[i].removeFromParent();
        }
        thing.look = null;
    },

    //////////// EVENTS

    onInjectThing: function(event) {
        thing = event.thing;
        if (!thing.plan || !thing.plan.states) {
            return;
        }
        this.envision(thing);
    },

    onRemoveThing: function(event) {
        this.removeThing(event.thing);
    },

    onMoveThing: function(event) {
        this.syncLookFromThing(event.thing);
    },

    onLoopEnd: function(event) {
        for (var i = 0; i < this.fe.field.things.length; i++) {
            thing = this.fe.field.things[i];
            if (!thing.look || (thing.plan.static && !thing.plan.elevated)) continue;
            this.syncLookFromThing(thing);
        }
    },
});

module.exports = ModuleCocos;
