var
    cc    = require('cc'),
    util  = require('smog/util/util');

var Field = cc.Class.extend({
    ctor: function(opts) {
        this.opts = opts || {};
        this.things = [];
    },
    remove: function(thing) {
        util.removeOneFromArray(thing, this.things);
    }
});

module.exports = Field;
