var b2 = require('jsbox2d'),
    flame = require('flame'),
    BodyBuilder = flame.engine.BodyBuilder;

var makeBodyBuilder = function() {
    var am = new flame.service.AssetManager({resources: {
            'some/image.png' : {
                width: 64,
                height: 32
            }
        }}),
        cm = new flame.service.CosmosManager({resources: {}}),
        world = new b2.World(new b2.Vec2(0, 0)),
        builder = new BodyBuilder({
           cosmosManager: cm,
           assetManager: am,
           world: world,
           config: {
               ppm: 32
           }
        });
    return builder;
};

describe("flame.engine.BodyBuilder", function() {
    it('can be created', function() {
        expect(typeof makeBodyBuilder()).toBe('object');
    });

    it('brick is created', function() {
        var bb = makeBodyBuilder();
        var brick = bb.makeBody({
            "states" : {
                "basic" : {
                    "main": {
                        "layer": "main",
                        "src": "some/image.png"
                    }
                }
            },
            "body" : "brick"
        });
        expect(typeof brick).toBe('object');
    });

    it('box is created', function() {
        var bb = makeBodyBuilder();
        var brick = bb.makeBody({
            "body" : {
                type: "box",
                size: {
                    width: 3,
                    height: 2
                }
            }
        });
        expect(typeof brick).toBe('object');
    });
});
