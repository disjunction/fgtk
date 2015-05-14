var b2 = require('jsbox2d'),
    flame = require('flame'),
    BodyBuilder = flame.engine.BodyBuilder,
    FieldEngine = flame.engine.FieldEngine;

var makeFieldEngine = function() {
    var am = new flame.view.AssetManager({resources: {
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

describe('ThingFinder', function() {
    var fe = makeFieldEngine(),
        b = fe.m.b;

    it('check: findBodyAtLocation() and findThingAtLocation()', function() {

        b.makeWorld();

        var plan = fe.opts.cosmosManager.get('thing/rover/hull/hull_5x2'),
            t1 = new flame.entity.Thing({
                plan: plan,
                l: {x: 7, y: 3}
            }),
            t2 = new flame.entity.Thing({
                plan: plan,
                l: {x: 20, y: 3}
            });

        var body1 = b.embody(t1),
            body2 = b.embody(t2);

        var thingFinder = new flame.service.ThingFinder({
            fe: fe
        });

        var result;

        result = thingFinder.findBodyAtLocation({x: 0, y: 0});
        expect(result).toBe(null);

        result = thingFinder.findBodyAtLocation({x: 7, y: 3});
        expect(typeof result).toBe('object');

        result = thingFinder.findThingAtLocation({x: 7, y: 3});
        expect(result).toBe(t1);
    });

});
