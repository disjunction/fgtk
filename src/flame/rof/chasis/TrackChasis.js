var cc = require('cc'),
    b2 = require('jsbox2d'),
    rof = require('flame/rof'),
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
              
        if (mover.i[rof.TURN_LEFT] && config.wheelTorque) {
            body.ApplyTorque(config.wheelTorque, true);
        }
        
        if (mover.i[rof.TURN_RIGHT] && config.wheelTorque) {
            body.ApplyTorque(-config.wheelTorque, true);
        }
        
        if (mover.i[rof.ACCELERATE]) {            
            strength = config.accelForward;
            v1.Set(mover.config.engineX, 0);
            var point = body.GetWorldCenter();
            var force = v1.Set(strength * Math.cos(angle), strength * Math.sin(angle));
            body.ApplyForce(force, point, true);
        } else if (mover.i[rof.DECELERATE]) {
            strength = config.accelBackward;
            v1.Set(mover.config.engineX, 0);
            var point = body.GetWorldCenter();
            var force = v1.Set(-strength * Math.cos(angle), -strength * Math.sin(angle));
            body.ApplyForce(force, point, true);
        }
    }
});

module.exports = TrackChasis;
