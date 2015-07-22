var Thing = require('flame').entity.Thing;

describe("flame.entity.Thing", function() {
   it('can be created', function() {
      var t = new Thing();
   });

   it('effects can be applied and checked', function() {
       var thing =  new Thing();

       expect(thing.hasEffect('some')).toBe(false);
       expect(thing.applyEffect('+some')).toBe(true);
       expect(thing.hasEffect('some')).toBe(true);

       expect(thing.applyEffect('+some')).toBe(false);
       expect(thing.applyEffect('-some')).toBe(false);
       expect(thing.hasEffect('some')).toBe(true);

       expect(thing.applyEffect('-some')).toBe(true);
       expect(thing.hasEffect('some')).toBe(false);
   });

   it('applyEffect exception on bad effectString', function() {
       var thing =  new Thing();
       expect(function() {
           thing.applyEffect('bla-blah');
       }).toThrow();
   });
});
