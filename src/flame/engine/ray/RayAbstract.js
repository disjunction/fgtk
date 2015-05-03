var cc = require('cc'),
    b2 = require('jsbox2d');

var RayAbstract = cc.Class.extend({
    ctor: function(opts) {
        this.opts = opts || {};
    },

    reset: function() {
        this.isHit = false;
        if (!this.results) {
            this.muzzlePoint = b2.Vec2();
            this.missPoint = b2.Vec2();
            this.results =  [
                {
                    p: b2.Vec2(),
                    normal: b2.Vec2(),
                    fraction: 0
                }
            ];
        }
    },
    
    markResult: function(thing, point, normal, fraction, index) {
        if (typeof index == 'undefined') {
            index = 0;
        }
        var result = this.results[index];
        result.p = point;
        result.normal = normal;
        result.fraction = fraction;
        result.thing = thing;
        
        this.isHit = true;
    }
});

module.exports = RayAbstract;