var b2 = require('jsbox2d'),
    flame = require('flame'),
    BodyBuilder = flame.engine.BodyBuilder,
    FieldEngine = flame.engine.FieldEngine;

var makeFieldEngine = function() {
    var am = new flame.service.AssetManager({resources: {
            'unittest/placeholder_5x2.png' : {
                width: 160,
                height: 64
            }
        }});
    var dir = __dirname + '/../../../cosmos',
        cm = new flame.service.CosmosManager({
            dirs: [
                dir
            ]
        });
    var fe = new FieldEngine({
            config: {ppm: 32},
            assetManager: am,
            cosmosManager: cm,
        });

    fe.registerModule(new flame.engine.ModuleBox2d({
        cosmosManager: cm,
        assetManager: am,
        config: {ppm: 32}
    }), 'b');

    return fe;
};

describe('ModuleBox2d', function() {
    it('supports: embody()', function() {
        var fe = makeFieldEngine();

        fe.m.b.makeWorld();

        var thing = new flame.entity.Thing({
            plan: fe.opts.cosmosManager.getResource('thing/rover/hull/hull_5x2')
        });
        var body = fe.m.b.embody(thing);
        expect(body.GetPosition()).toBeDefined();
    });

    it('supports: rayCast() and rayCastFromThing()', function() {
        var fe = makeFieldEngine(),
            moduleBox2d = fe.m.b;

        moduleBox2d.makeWorld();

        var plan = fe.opts.cosmosManager.getResource('thing/rover/hull/hull_5x2'),
            t1 = new flame.entity.Thing({
                plan: plan,
                l: {x: 7, y: 3}
            }),
            t2 = new flame.entity.Thing({
                plan: plan,
                l: {x: 20, y: 3}
            });

        var body1 = moduleBox2d.embody(t1),
            body2 = moduleBox2d.embody(t2),
            callback = new flame.engine.ray.RayClosest();

        moduleBox2d.rayCast(callback, {x: 0, y: 3}, {x: 30, y: 3});
        expect(callback.isHit).toBe(true);
        expect(callback.results[0].thing.__instanceId).toBe(t1.__instanceId);

        moduleBox2d.rayCast(callback, {x: 0, y: 9}, {x: 30, y: 9});
        expect(callback.isHit).toBe(false);

        moduleBox2d.rayCastFromThing(callback, t1, 30);
        expect(callback.isHit).toBe(true);
        expect(callback.results[0].thing.__instanceId).toBe(t2.__instanceId);
    });

});
