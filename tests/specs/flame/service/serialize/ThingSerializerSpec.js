var cc = require('cc'),
    flame = require('flame'),
    Thing = flame.entity.Thing,
    CosmosManager = require('flame/service/CosmosManager');


var makeFieldEngine = function() {
    var am = new flame.view.AssetManager({resources: {
            'unittest/placeholder_5x2.png' : {
                width: 160,
                height: 64
            }
        }});
    var dir = __dirname + '/../../../../cosmos',
        cm = new flame.service.CosmosManager({
            dirs: [
                dir
            ]
        });
    var fe = new flame.engine.FieldEngine({
            config: {ppm: 32},
            assetManager: am,
            cosmosManager: cm,
        });

    fe.registerModule(new flame.engine.ModuleBox2d({
        cosmosManager: cm,
        assetManager: am,
        config: {ppm: 32}
    }), 'b');
    fe.m.b.makeWorld();
    return fe;
};

describe("flame.service.serialize.ThingSerializer", function() {

    it('check: makePhisicsBundle()', function() {
        var fe = makeFieldEngine(),
            plan = fe.opts.cosmosManager.get('thing/rover/hull/hull_3x2_box'),
            thing = new Thing({
                plan: plan
            });

        fe.m.b.embody(thing);
        thing.body.SetTransform(cc.p(2, 7), 1);
        thing.body.SetLinearVelocity(cc.p(3, 5));
        thing.body.SetAngularVelocity(1.5);
        fe.m.b.syncThingFromBody(thing);

        var serializer =  new flame.service.serialize.ThingSerializer();
        var result = serializer.makePhisicsBundle(thing);

        expect(result).toEqual([2,7,1,3,5,1.5]);
    });
});
