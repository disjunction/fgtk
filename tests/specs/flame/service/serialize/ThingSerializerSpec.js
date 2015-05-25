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
});
