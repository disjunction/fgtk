var smog = require('smog'),
    grass = require('grass'),
    Pumpkin = grass.pumpkin.Pumpkin;

describe("grass.pumpkin.client.LocalPumpkinClient", function() {
    it("creates anonymous Sibling", function(done) {
        var client = Pumpkin.bootstrapLocal().makeClient();
        client.createAnonymousSibling().then(function(sibling) {
            expect(sibling).toEqual(jasmine.any(smog.entity.Sibling));
            done();
        }, function(err) {
            done(err);
        });
    });
});
