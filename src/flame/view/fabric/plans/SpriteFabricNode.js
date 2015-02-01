"use strict";

var cc = require('cc'),
    AbstractFabricNode = require('./AbstractFabricNode');

/**
 * Sprite
 */

var SpriteFabricNode = AbstractFabricNode.extend({
    makeNode: function(plan) {
        var me = this;
        var img = this.assetManager.getResource(plan.src);
        var node = new this.fabric.Image(img);
        
        this.applyPlan(plan, node);
        
        return node;
    },
    hidratePlan: function(node, plan) {
        
    }
});

module.exports = SpriteFabricNode;