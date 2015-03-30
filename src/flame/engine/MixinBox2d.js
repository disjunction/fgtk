var b2 = require('jsbox2d'),
    BodyBuilder = require('flame/engine/BodyBuilder');
    
module.exports = function(fe) {
    var ppm = fe.opts.config.ppm;
    
    fe.m.box2d = {};
    
    fe.makeWorld = function() {
        this.m.box2d.world = new b2.World(new b2.Vec2(0, 0));
        
        this.m.box2d.bodyBuilder = new BodyBuilder({
            world: this.m.box2d.world,
            cosmosManager: this.opts.cosmosManager,
            assetManager: this.opts.assetManager,
            config: this.opts.config
        });
    };
    
    fe.syncThingFromBody = function(thing) {
        thing.l = thing.body.GetPosition();
        thing.a = thing.body.GetAngle();
    };
    
    fe.syncBodyFromThing = function(thing) {
        thing.body.SetTransform(thing.l, thing.a);
    };
    
    fe.embody =  function(thing) {
        thing.body = this.m.box2d.bodyBuilder.makeBody(thing.plan);
        this.syncBodyFromThing(thing);
        return thing.body;
    };
    
    fe.fd.addListener('onInjectThing', function(event) {
        var thing = event.extra.thing;
        if (!thing.plan || !thing.plan.body) return;
        this.embody(thing);
    }.bind(fe));
    
    fe.fd.addListener('step', function(event) {
        this.m.box2d.world.Step(event.dt, 8, 3);
        for (var i = 0; i < this.field.things.length; i++) {
            var thing = this.field.things[i];
            if (thing.body) {
                this.syncThingFromBody(thing);
                this.syncStateFromThing(thing);
            }
        }
    }.bind(fe));
};