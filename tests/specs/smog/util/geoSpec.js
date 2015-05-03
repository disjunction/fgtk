var geo = require('smog').util.geo;
function fuzzyEqual(v1, v2) {
    return Math.abs(v1 - v2) < 0.0001;
}

describe('util.geo', function() {
    it('check: closestRotation()', function() {
        expect(geo.closestRotation(0.3, 0.8)).toBe(0.5);
        expect(geo.closestRotation(0.8, 0.3)).toBe(-0.5);
        expect(fuzzyEqual(-1, geo.closestRotation(0.8, 4 * Math.PI - 0.2))).toBe(true);
        expect(fuzzyEqual(2, geo.closestRotation(0.8, 2 * Math.PI + 2.8))).toBe(true);
    });
});