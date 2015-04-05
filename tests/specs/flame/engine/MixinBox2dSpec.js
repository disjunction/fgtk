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
            mixins: {box2d: {}}
        });
    fe.makeWorld();
    return fe;
};

describe('MixinBox2d', function() {
    it('supports: embody()', function() {
        var fe = makeFieldEngine();
        fe.makeWorld();
        
        var thing = new flame.entity.Thing({
            plan: fe.opts.cosmosManager.getResource('thing/rover/hull/hull_5x2')
        });
        var body = fe.embody(thing);
        expect(body.GetPosition()).toBeDefined();
    });
});