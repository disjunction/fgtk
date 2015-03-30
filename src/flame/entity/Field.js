"use strict";

var
    cc    = require('cc');
    
var Field = cc.Class.extend({
    ctor: function(opts) {
        this.opts = opts || {};
        this.things = [];
    }
});

module.exports = Field;