"use strict";

var cc = require('cc');

var AbstractCocosNode = cc.Class.extend({
    ctor: function(opts) {
        this.opts = opts || {};
        this.canvas = this.opts.canvas;
        this.assetManager = this.opts.assetManager;
    },
    applyPlan: function(plan, node) {
        if (plan.a) node.setRotation(plan.a);
        
        var x = plan.x || 0;
        var y = plan.y || 0;
        node.setPositionX(x);
        node.setPositionY(y);
        
        var a = plan.a || 0;
        node.setRotation(a);
        
        if (plan.alpha) node.setOpacity(plan.alpha / 100);
        
        var s = this.opts.cosmosManager.thingPlanHelper.getNodeScale(plan);
        if (s) {
            if (s.x) node.setScaleX(s.x);
            if (s.y) node.setScaleY(s.y);        
        }
    },
    roundCoord: function(v) {
        return Math.round(v*10)/10;
    },
    roundAngle: function(v) {
        return Math.round(v*10)/10;
    }
});

module.exports = AbstractCocosNode;