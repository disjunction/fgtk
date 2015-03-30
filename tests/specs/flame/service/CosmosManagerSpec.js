var flame = require('flame'),
    CosmosManager = require('flame/service/CosmosManager');
    
describe("CosmosManager", function() {
    it('reads plans from files', function() {
        var dir = __dirname + '/../../../cosmos';
        var o = new CosmosManager({
            dirs: [dir]
        });
        
        var plan = o.getResource('plans/rover/hull/hull_5x2');
        expect(plan.body).toBeDefined();
    });
});