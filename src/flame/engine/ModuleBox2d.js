var b2 = require('jsbox2d'),
    cc = require('cc'),
    smog = require('smog'),
    Thing = require('flame/entity/Thing'),
    BodyBuilder = require('flame/engine/BodyBuilder'),
    ThingFinder = require('flame/service/ThingFinder'),
    ModuleAbstract = require('./ModuleAbstract');

/**
 * opts:
 * * cosmosManager
 * * assetManager
 * * config
 */
var ModuleBox2d = ModuleAbstract.extend({
    injectFe: function(fe, name) {
        ModuleAbstract.prototype.injectFe.call(this, fe, name);

        this.prepared = {
            moveThingEvent: fe.eq.channel("moveThing").prepare(function(template, args) {
                template.thing = args[0];
                template.dt = args[1];
            })
        };

        this.addNativeListeners([
            "injectThing",
            "removeThing",
            "simStepCall",
        ]);
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

        this.thingFinder = new ThingFinder({
            fe: this.fe
        });

        return this.world;
    },

    syncThingFromBody: function(thing, dt) {
        if (thing.pup) {
            this.fe.opts.fieldSerializer.opts.thingSerializer.applyPhisicsBundleToBody(thing, thing.pup);
            thing.pup = null;
        } else {
            thing.l = thing.body.GetPosition();
            thing.a = thing.body.GetAngle();
        }
    },

    syncBodyFromThing: function(thing, dt) {
        thing.body.SetTransform(thing.l, thing.a);
    },

    embody:  function(thing) {
        thing.body = this.bodyBuilder.makeBody(thing.plan, thing.bodyExtra || thing.plan.body);
        thing.body.SetUserData(thing);
        this.syncBodyFromThing(thing, 0);
        return thing.body;
    },

    makeLoopEdges: function(points, edgeThing) {
        if (!edgeThing) {
            throw new Error('edgeThing must be defined in makeLoopEdges');
        }

        var bd = new b2.BodyDef();
        this.loopEdges = this.world.CreateBody(bd);
        this.loopEdges.SetUserData(edgeThing);
        var shape = new b2.ChainShape();
        shape.CreateLoop(points, points.length);
        this.loopEdges.CreateFixture(shape, 0.0);
    },

    /**
     * @param {RayAbstract} callback
     * @param {b2.Vec2} p1
     * @param {b2.Vec2} p2
     */
    rayCast: function(callback, p1, p2) {
        callback.reset();
        this.world.RayCast(callback, p1, p2);
        callback.muzzlePoint = p1;
        callback.missPoint = p2;
    },

    /**
     *
     * @param {RayAbstract} callback
     * @param {Thing} thing
     * @param {float} range
     * @param {float} radius - starting distance
     * @returns {b2.Vec2} p2 (i.e. furthest possible point in casde of miss)
     */
    rayCastFromThing: function(callback, thing, range, radius) {
        var cos = Math.cos(thing.a),
            sin = Math.sin(thing.a),
            muzzlePoint;

        if (radius) {
            muzzlePoint = new b2.Vec2(
                thing.l.x + radius * cos,
                thing.l.y + radius * sin
            );
        } else {
            muzzlePoint = thing.l;
        }

        var endPoint = new b2.Vec2(
                thing.l.x + range * cos,
                thing.l.y + range * sin
            );
        this.rayCast(callback, muzzlePoint, endPoint);
    },

    createEdges: function(){
        var edgeThing = new Thing();

        var size = this.fe.field.size,
            points = [];

        points.push(new b2.Vec2(size.width, size.height));
        points.push(new b2.Vec2(0, size.height));
        points.push(new b2.Vec2(0, 0));
        points.push(new b2.Vec2(size.width, 0));
        this.makeLoopEdges(points, edgeThing);
    },

    onInjectThing: function(event) {
        var thing = event.thing;
        if (!thing.plan || !thing.plan.body) return;
        this.embody(thing);
    },

    onRemoveThing: function(event) {
        var thing = event.thing;
        if (thing.body) {
            this.world.DestroyBody(thing.body);
        }
    },

    onSimStepCall: function(event) {
        this.world.Step(event.dt, 8, 3);
        for (var i = 0; i < this.fe.field.things.length; i++) {
            var thing = this.fe.field.things[i];
            if (thing.body && !thing.plan.static && (thing.body.IsAwake() || thing.pup)) {
                this.syncThingFromBody(thing, event.dt);
                this.prepared.moveThingEvent.execute(thing, event.dt);
            }
        }
    },
});

module.exports = ModuleBox2d;
