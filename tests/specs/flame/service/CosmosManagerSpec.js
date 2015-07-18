var flame = require('flame'),
    CosmosManager = require('flame/service/CosmosManager');

describe("flame.service.CosmosManager", function() {
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

    it('check: getPathsInDirectory() and getAllInDirectory()', function() {
        var result;

        result = cm.getPathsInDirectory('thing');
        expect(result).not.toContain('thing/bg/vicinity1');

        result = cm.getPathsInDirectory('thing/bg');
        expect(result).toContain('thing/bg/vicinity1');

        result = cm.getPathsInDirectory('thing', true);
        expect(result).toContain('thing/bg/vicinity1');

        result = cm.getAllInDirectory('thing', true);
        expect(result['thing/bg/vicinity1']).toBeDefined();
        expect(result['thing/bg/vicinity1'].states.basic.bg).toBeDefined();

        result = cm.getAllInDirectory('thing', true, true);
        expect(result['bg/vicinity1']).toBeDefined();
        expect(result['bg/vicinity1'].states.basic.bg).toBeDefined();

    });
});
