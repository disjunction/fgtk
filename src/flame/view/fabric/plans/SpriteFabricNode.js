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
        
        var x = (typeof plan.x == 'undefined') ? - node.width / 2  : plan.x,
            y = (typeof plan.y == 'undefined') ? - node.width / 2  : plan.y;
        
        node.setLeft(x);
        node.setTop(y);
        
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
        if (node.getLeft() != - node.width / 2) {
            plan.x = this.roundCoord(node.getLeft());
        }
        if (node.getTop() != - node.height / 2) {
            plan.y = this.roundCoord(node.getTop());
        }
        if (node.getAngle() != 0) {
            plan.a = this.roundAngle(node.getAngle());
        }
        return plan;
    }
});

module.exports = SpriteFabricNode;