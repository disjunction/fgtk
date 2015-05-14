var flame = require('flame'),
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


describe("FieldEngine", function() {
    it('can be created', function() {
        var fe = new FieldEngine({});
        expect(typeof fe).toBe('object');
    });

    it('basic box2d works', function() {
      var fe = makeFieldEngine();
      fe.m.b.makeWorld();
   });
});
