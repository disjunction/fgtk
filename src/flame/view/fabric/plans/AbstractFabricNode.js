"use strict";

var cc = require('cc');

var AbstractFabricNode = cc.Class.extend({
    ctor: function(opts) {
        this.opts = opts || {};
        
        this.fabric = this.opts.fabric;
        this.canvas = this.opts.canvas;
        this.assetManager = this.opts.assetManager;
    },
    applyPlan: function(plan, node) {
        node.setOriginX('center');
        node.setOriginY('center');
        
        if (plan.a) node.setAngle(plan.a + 180);
        
        var x = plan.x || 0;
        var y = - plan.y || 0;
        node.setLeft(x);
        node.setTop(y);
        
        if (plan.alpha) node.setOpacity(plan.alpha / 100);
        if (plan.scale) {
            if (plan.scale.x) node.setScaleX(plan.scale.x);
            if (plan.scale.y) node.setScaleY(plan.scale.y);        
        }
    },
    roundCoord: function(v) {
        return Math.round(v*10)/10;
    },
    roundAngle: function(v) {
        var a = - (Math.round(v*100)/100) % 360;
        return a < 0 ? a + 360 : a
        
    },
    roundScale: function(v) {
        return Math.round(v*100)/100;
    }
});

module.exports = AbstractFabricNode;