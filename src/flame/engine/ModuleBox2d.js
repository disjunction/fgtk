var b2 = require('jsbox2d'),
    cc = require('cc'),
    BodyBuilder = require('flame/engine/BodyBuilder'),
    ModuleAbstract = require('./ModuleAbstract');

var moveThingEvent = {
    type: 'moveThing',
    thing: null
};

/**
 * opts:
 * * cosmosManager
 * * assetManager
 * * config
 */
var ModuleBox2d = ModuleAbstract.extend({
    injectFe: function(fe, name) {
        ModuleAbstract.prototype.injectFe.call(this, fe, name);
        
        this.fe.fd.addListener('injectThing', function(event) {
            var thing = event.extra.thing;
            if (!thing.plan || !thing.plan.body) return;
            this.embody(thing);
        }.bind(this));

        this.fe.fd.addListener('step', function(event) {
            this.world.Step(event.dt, 8, 3);
            for (var i = 0; i < this.fe.field.things.length; i++) {
                var thing = this.fe.field.things[i];
                if (thing.body) {
                    this.syncThingFromBody(thing);
                }
            }
        }.bind(this));
    },
    
    makeWorld: function(size) {
        this.world = new b2.World(new b2.Vec2(0, 0));
        this.world.size = size || {width: 100, height: 100};
                
        this.bodyBuilder = new BodyBuilder({
            world: this.world,
            cosmosManager: this.opts.cosmosManager,
            assetManager: this.opts.assetManager,
            config: this.opts.config
        });
    },
    
    syncThingFromBody: function(thing) {
        thing.l = thing.body.GetPosition();
        thing.a = thing.body.GetAngle();
        moveThingEvent.thing = thing;
        this.fe.fd.dispatch(moveThingEvent);
    },
    
    syncBodyFromThing: function(thing) {
        thing.body.SetTransform(thing.l, thing.a);
    },
    
    embody:  function(thing) {
        thing.body = this.bodyBuilder.makeBody(thing.plan, thing.moverConfig || {});
        this.syncBodyFromThing(thing);
        return thing.body;
    }
});

module.exports = ModuleBox2d;