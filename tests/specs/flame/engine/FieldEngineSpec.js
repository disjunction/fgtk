var flame = require('flame'),
    FieldEngine = flame.engine.FieldEngine,
    Thing = flame.entity.Thing;

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

    it('check: removeThing()', function() {
        var fe = makeFieldEngine();
        fe.m.b.makeWorld();
        var field = new flame.entity.Field(),
            thing1 = new Thing(),
            thing2 = new Thing(),
            thing3 = new Thing(),
            thing4 = new Thing();
        field.things.push(thing1);
        field.things.push(thing2);
        fe.injectField(field);
        fe.injectThing(thing3);
        fe.injectThing(thing4);
        fe.removeThing(thing2);
        expect(fe.field.things.length).toBe(3);
    });
});
