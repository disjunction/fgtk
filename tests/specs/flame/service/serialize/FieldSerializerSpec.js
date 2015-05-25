var cc = require('cc'),
    flame = require('flame'),
    Thing = flame.entity.Thing,
    fixtures = require('fgtk_tu/fixtures'),
    FieldSerializer = flame.service.serialize.FieldSerializer,
    ThingSerializer = flame.service.serialize.ThingSerializer;

describe("flame.service.serialize.FieldSerializer", function() {

    it('check: makePhisicsBundle()', function() {
        var fe = fixtures.makeFeBox2d(),
            plan = fe.opts.cosmosManager.get('thing/rover/hull/hull_3x2_box'),
            thing1 = new Thing({
                plan: plan
            }),
            thing2 = new Thing({
                plan: plan
            });

        fe.injectThing(thing1);
        fe.injectThing(thing2);

        var serializer =  new FieldSerializer({
            thingSerializer: new ThingSerializer()
        });
        var result = serializer.serializeInitial(fe.field);
        expect(result.things.length).toBe(2);
    });
});
