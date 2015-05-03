var cc = require('cc'),
    RayAbstract = require('./RayAbstract');
    
var RayClosest = RayAbstract.extend({
    ReportFixture: function(fixture, point, normal, fraction) {
        var thing = fixture.GetBody().GetUserData();
        this.markResult(thing, point, normal, fraction);
        return fraction;
    }
});

module.exports = RayClosest;