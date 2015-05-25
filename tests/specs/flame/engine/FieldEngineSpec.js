var flame = require('flame'),
    FieldEngine = flame.engine.FieldEngine,
    Thing = flame.entity.Thing,
    fixtures = require('fgtk_tu/fixtures');

describe("FieldEngine", function() {
    it('can be created', function() {
        var fe = new FieldEngine({});
        expect(typeof fe).toBe('object');
    });

    it('basic box2d works', function() {
        var fe = fixtures.makeFeBox2d();
        fe.m.b.makeWorld();
    });

    it('check: removeThing()', function() {
        var fe = fixtures.makeFeBox2d();
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
