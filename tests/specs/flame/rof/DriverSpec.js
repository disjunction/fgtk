var b2 = require('jsbox2d'),
    flame = require('flame'),
    BodyBuilder = flame.engine.BodyBuilder,
    Driver = flame.rof.Driver;

var world, bodyBuilder;

var makeBody = function() {
    world = new b2.World(new b2.Vec2(0, 0));
    bodyBuilder = new BodyBuilder({
        world: world,
        config: {
            ppm: 32
        }
    });
    var body = bodyBuilder.makeBody({
        "body" : {
            type: "box",
            size: {
                width: 3,
                height: 2
            }
        }
    });
    return body;
};


describe('flame.rof.Driver', function() {
    it('makes a mover and drives', function(){
        var thing = new flame.entity.Thing();

        thing.body = makeBody();
        var d = new Driver({
            world: world
        });
        thing.mover = d.makeMover(thing, {
            chasis: 'airCushion',
            accelFront: 50,
            engineX: -2
        });
        thing.i = new flame.view.Interactor.Interstate();
        thing.i.set('a', true);
        expect(typeof thing.mover).toBe('object');
        d.drive(thing);
   });
});
