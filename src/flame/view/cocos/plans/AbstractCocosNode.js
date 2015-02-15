"use strict";

var cc = require('cc');

var AbstractCocosNode = cc.Class.extend({
    ctor: function(opts) {
        this.opts = opts || {};
        
        this.fabric = this.opts.fabric;
        this.canvas = this.opts.canvas;
        this.assetManager = this.opts.assetManager;
    },
    applyPlan: function(plan, node) {
        if (plan.a) node.setAngle(plan.a);
        
        var x = plan.x || 0;
        var y = plan.y || 0;
        node.setLeft(x);
        node.setTop(y);
        
        if (plan.alpha) node.setOpacity(plan.alpha / 100);
    },
    roundCoord: function(v) {
        return Math.round(v*10)/10;
    },
    roundAngle: function(v) {
        return Math.round(v*10)/10;
    }
});

module.exports = AbstractCocos;