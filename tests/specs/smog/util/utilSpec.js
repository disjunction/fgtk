var util = require('smog').util.util;

describe('smog.util.util', function() {
    it('check: removeOneFromArray()', function() {
        var o1 = {'z': 123},
            o2 = {'z': 123},
            o3 = {'a': 456},
            a = [o1, o2, o3];

        util.removeOneFromArray(12, a);
        o1.zz = 454;
        console.log(a);
    });
});
