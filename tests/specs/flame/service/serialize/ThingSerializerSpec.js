var cc = require('cc'),
    flame = require('flame'),
    Thing = flame.entity.Thing,
    fixtures = require('fgtk_tu/fixtures');

describe("flame.service.serialize.ThingSerializer", function() {

    it('check: makePhisicsBundle()', function() {
        var fe = fixtures.makeFeBox2d(),
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

    it('initial serialize/unserialize', function() {
        var fe = fixtures.makeFeBox2d(),
            plan = fe.opts.cosmosManager.get('thing/rover/hull/hull_3x2_box'),
            thing = new Thing({
                plan: plan
            });

        thing.l = {x: 5, y: 7};
        thing.a = 2;
        fe.injectThing(thing);

        var serializer =  new flame.service.serialize.ThingSerializer({
            cosmosManager: fe.opts.cosmosManager,
            thingBuilder: fe.opts.thingBuilder
        });
        var result = serializer.serializeInitial(thing);

        expect(result[2].planSrc).toBe('thing/rover/hull/hull_3x2_box');
        expect(result[2].p).toEqual([5,7,2]);

        var newThing = serializer.unserializeInitial(result);
        expect(newThing.l.x).toBe(5);
        expect(newThing.l.y).toBe(7);
        expect(newThing.a).toBe(2);
    });
});
