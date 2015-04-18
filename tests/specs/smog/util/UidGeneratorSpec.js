var smog = require('smog'),
    UidGenerator = smog.util.UidGenerator;

describe('smog.util.UidGenerator', function() {
    it('genertes :)', function(){
        var g = new UidGenerator('_');
        
        expect(g.getNext()).toBe('_A');
    });  
});
