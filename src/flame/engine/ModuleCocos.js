var cc = require('cc'),
    geo = require('smog').util.geo,
    ModuleAbstract = require('./ModuleAbstract');

var x,y,node,thing;

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

    injectFe: function(fe, name) {
        ModuleAbstract.prototype.injectFe.call(this, fe, name);

        this.fe.fd.addListener('injectThing', function(event) {
            thing = event.extra.thing;
            if (!thing.plan) return;
            this.envision(thing);
        }.bind(this));

        this.fe.fd.addListener('moveThing', function(event) {
            this.syncStateFromThing(event.thing);
        }.bind(this));

        this.fe.fd.addListener('step', function(event) {
            for (var i = 0; i < this.fe.field.things.length; i++) {
                thing = this.fe.field.things[i];
                if (!thing.state || thing.plan.static) continue;
                this.syncStateFromThing(thing);
            }
        }.bind(this));
    },

    envision: function(thing) {
        var stateName = thing.s || 'basic';
        var state = this.opts.stateBuilder.makeState(thing.plan, stateName);
        thing.state = state;

        // set thingShift vectors where needed
        // thingShift defines distance and angle of this node, relative to Thing origin
        for (var i in thing.state.nodes) {
            var node = thing.state.nodes[i];
            if (node.plan.x || node.plan.y) {
                var nodePoint = cc.p(node.plan.x / this.opts.config.ppm || 0, node.plan.y  / this.opts.config.ppm || 0);
                node.thingShift = {
                    r: cc.pLength(nodePoint),
                    a: cc.pToAngle(nodePoint)
                }
            }
        }

        this.syncStateFromThing(thing);

        this.opts.viewport.addStateToLayer(state);
    },

    syncStateFromThing: function(thing) {
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

            //x = (node.plan.x || 0) + x *  this.config.ppm;
            //y = (node.plan.y || 0) + y * this.config.ppm;

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
