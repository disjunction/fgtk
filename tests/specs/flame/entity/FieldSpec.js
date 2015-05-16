var flame = require('flame'),
    Field = flame.entity.Field,
    Thing = flame.entity.Thing;

describe("Field", function() {
    it('can be created', function() {
        var o = new Field();
    });

    it('check: remove()', function() {
        var o = new Field(),
            thing = new Thing();
        o.things.push(thing);
        expect(o.things.length).toBe(1);
        o.remove(thing);
        expect(o.things.length).toBe(0);
    });
});
