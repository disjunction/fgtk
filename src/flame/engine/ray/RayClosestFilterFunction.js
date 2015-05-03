var cc = require('cc'),
    RayAbstract = require('./RayAbstract');
    
var RayClosestFilterFunction = RayAbstract.extend({
    ReportFixture: function(fixture, point, normal, fraction) {
        if (!this.opts.filterFunction) {
            throw new Error('opts.filterFunction not defined for RayFilterFunction instance');
        }
        var thing = fixture.GetBody().GetUserData();

        if (this.opts.filterFunction(thing, point, normal, fraction)) {
            return -1.0;
        }
        
        this.markResult(thing, point, normal, fraction);
        return fraction;
    }
});

module.exports = RayClosestFilterFunction;
