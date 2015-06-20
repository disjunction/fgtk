var smog = require('smog'),
    grass = require('grass'),
    Pumpkin = grass.pumpkin.Pumpkin;

describe("grass.pumpkin.service.PumpkinSerializer", function() {
    it("serialize/unserialize Sibling", function() {
        var pumpkin = Pumpkin.bootstrapLocal();
        var sibling = new smog.entity.Sibling({
            siblingId: "sabc",
            playerId: "pefd"
        });
        var serialSibling = pumpkin.serializer.serializeSibling(sibling),
            newSibling = pumpkin.serializer.unserializeSibling(serialSibling);

        expect(newSibling).toEqual(sibling);
    });
});
