var flame = require('flame'),
    AssetManager = require('flame/service/AssetManager');

describe("flame.service.AssetManager", function() {
    var dir = __dirname + '/../../../assets';
    var am = new AssetManager({
        dirs: [dir]
    });

    it('check: getSize()', function() {
        var size = am.getSize('bg/obstacle2x4.png');
        expect(size.width).toBe(64);
        expect(size.height).toBe(128);
    });
});
