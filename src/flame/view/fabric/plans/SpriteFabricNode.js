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
    
    hydratePlan: function(plan) {
        return plan;
    },
    
    serializePlan: function(node) {
        var plan = {
            layer: node.layer,
            src: node.plan.src
        };
        
        
        if (node.getLeft() != 0) {
            plan.x = this.roundCoord(node.getLeft());
        }
        if (node.getTop() != 0) {
            plan.y = - this.roundCoord(node.getTop());
        }
        if (node.getAngle() != 0) {
            plan.a = this.roundAngle(node.getAngle());
        }
        if (node.getScaleX() != 1) {
            plan.scaleX = this.roundScale(node.getScaleX());
        }
        if (node.getScaleY() != 1) {
            plan.scaleY = this.roundScale(node.getScaleY());
        }
        return plan;
    }
});

module.exports = SpriteFabricNode;