"use strict";

var cc = require('cc');


var Thing = cc.Class.extend({
    /**
     * @param opts object
     */
    ctor: function(opts) {
        opts = opts || {};
        
        if (opts.plan) this.plan = opts.plan;
        
        // location
        this.l = opts.l ? opts.l : cc.p(0, 0);
        
        // angle
        this.a = opts.a ? opts.a : 0;
    }
});

module.exports = Thing;
