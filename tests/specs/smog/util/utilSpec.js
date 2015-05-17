var util = require('smog').util.util;

describe('smog.util.util', function() {
    it('check: removeOneFromArray()', function() {
        var o1 = {'z': 123},
            o2 = {'z': 123},
            o3 = {'a': 456},
            a = [o1, o2, o3];

        util.removeOneFromArray(o2, a);
        expect(a.length).toBe(2);
    });

    it('check: combineObjects()', function() {
        var o1 = {'z': 123, 'a': 1123},
            o2 = {'b': 5, 'z': 45},
            o3 = util.combineObjects(o1, o2);
        expect(o3).toEqual({
            a: 1123,
            b:5,
            z: 45
        });
    });
});
