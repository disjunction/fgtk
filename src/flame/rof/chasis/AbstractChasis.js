var cc = require('cc'),
    b2 = require('jsbox2d'),
    rof = require('flame/rof');


var AbstractChasis = cc.Class.extend({
    ctor: function(opts) {
        this.opts = opts || {};
    },
    
    initMover: function(thing, mover) {
        
    },
    
    drive: function(thing, driveOn) {
        throw new Error('drive() must be implemented in subclass of AbstractChasis')
    }
});

module.exports = AbstractChasis;