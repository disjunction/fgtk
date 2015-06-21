/*jslint node: true */
"use strict";

var cc = require('cc'),
    b2 = require('jsbox2d'),
    core = require('flame/rof/core'),
    AbstractChasis = require('flame/rof/chasis/AbstractChasis');

// temp reusable objects
var strength, config, angle,
    v1 = new b2.Vec2(),
    v2 = new b2.Vec2();

var TrackChasis = AbstractChasis.extend({
    applyState: function(mover, interState) {
        mover.i = interState;
    },

    initMover: function(thing, mover) {
        AbstractChasis.prototype.initMover.call(this, thing, mover);
    },

    driveBody: function(body, mover) {
        config = mover.config;
        angle = body.GetAngle();

        var enginePoint, force;

        if (!mover.i) return;

        if (!mover.i.get) {
            console.log(mover);
            throw new Error('mover has interactor, without get() method');
        }

        if (mover.i.get(core.TURN_LEFT) && config.wheelTorque) {
            if (!isFinite(config.wheelTorque)) {
                throw new Error('wheelTorque is not finite');
            }
            body.ApplyTorque(config.wheelTorque, true);
        }

        if (mover.i.get(core.TURN_RIGHT) && config.wheelTorque) {
            if (!isFinite(config.wheelTorque)) {
                throw new Error('wheelTorque is not finite');
            }
            body.ApplyTorque(-config.wheelTorque, true);
        }

        if (mover.i.get(core.ACCELERATE)) {
            strength = config.accelForward;
            if (!isFinite(strength)) {
                throw new Error('accelForward is not finite');
            }
            v1.Set(mover.config.engineShiftX, 0);
            enginePoint = body.GetWorldCenter();
            force = v1.Set(strength * Math.cos(angle), strength * Math.sin(angle));
            body.ApplyForce(force, enginePoint, true);
        } else if (mover.i.get(core.DECELERATE)) {
            strength = config.accelBackward;
            if (!isFinite(strength)) {
                throw new Error('accelBackward is not finite');
            }
            v1.Set(mover.config.engineShiftX, 0);
            enginePoint = body.GetWorldCenter();
            force = v1.Set(-strength * Math.cos(angle), -strength * Math.sin(angle));
            body.ApplyForce(force, enginePoint, true);
        }
    }
});

module.exports = TrackChasis;
