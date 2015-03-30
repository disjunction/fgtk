var FieldEngine = require('flame').engine.FieldEngine;
    
describe("FieldEngine", function() {
   it('can be created', function() {
      var fe = new FieldEngine({});
      expect(typeof fe).toBe('object');
   });
   
    it('basic box2d works', function() {
      var fe = new FieldEngine({
          config: {
              ppm: 32
          },
          mixins: {
              box2d: {
                  
              }
          }
      });
      fe.makeWorld();
      
   });
});