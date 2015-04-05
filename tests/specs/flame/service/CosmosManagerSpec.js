var flame = require('flame'),
    CosmosManager = require('flame/service/CosmosManager');
    
describe("CosmosManager", function() {
    var dir = __dirname + '/../../../cosmos';
    var cm = new CosmosManager({
        dirs: [dir]
    });

    it('reads plans from files', function() {
        var plan = cm.getResource('thing/rover/hull/hull_5x2');
        expect(plan.body).toBeDefined();
    });
    
    it('collects assets', function() {       
        var assets = cm.getAllAssets();
        expect(assets).toContain('unittest/placeholder_5x2.png');
        expect(assets).toContain('vorschlag/bg/vorschlag_bg_vicinity2.tmx');
        expect(assets).toContain('vorschlag/bg/tileset1.png');
        expect(assets).toContain('vorschlag/bg/tileset2.png');
    });
    
});