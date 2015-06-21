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

var AirCushionChasis = AbstractChasis.extend({
    applyState: function(mover, interState) {
        mover.i = interState;
    },

    initMover: function(thing, mover) {
        AbstractChasis.prototype.initMover.call(this, thing, mover);
        config = mover.config;

        mover.engineAngleRad = config.engineAngle / 180 * Math.PI;
        mover.engineAngleAdditionalRad = config.engineAngleAdditional / 180 * Math.PI;
    },

    driveBody: function(body, mover) {
        config = mover.config;
        angle = body.GetAngle();

        var point, force,
            angleAdjust = 0;

        if (mover.i.get(core.TURN_LEFT)) {
            angleAdjust = mover.engineAngleRad;
        }

        if (mover.i.get(core.TURN_RIGHT) && config.wheelTorque) {
            angleAdjust = -mover.engineAngleRad;
        }

        angle += angleAdjust;

        if (mover.i.get(core.ACCELERATE)) {

            strength = config.accelForward;
            v1.Set(mover.config.engineX, 0);
            point = body.GetWorldPoint(v1);
            force = v1.Set(strength * Math.cos(angle), strength * Math.sin(angle));

            body.ApplyForce(force, point, true);
        } else if (mover.i.get(core.DECELERATE)) {
            strength = config.accelBackward;
            v1.Set(mover.config.engineX, 0);
            point = body.GetWorldPoint(v1);
            force = v1.Set(-strength * Math.cos(angle), -strength * Math.sin(angle));
            body.ApplyForce(force, point, true);
        } else if (angleAdjust !== 0) {
            angle += Math.sign(angleAdjust) * mover.engineAngleAdditionalRad;
            strength = config.accelTurn;
            v1.Set(mover.config.engineX, 0);
            point = body.GetWorldPoint(v1);
            force = v1.Set(strength * Math.cos(angle), strength * Math.sin(angle));
            body.ApplyForce(force, point, true);
        }
    }
});

module.exports = AirCushionChasis;
