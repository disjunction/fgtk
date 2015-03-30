"use strict";

var cc = require('cc'),
    AbstractCocosNode = require('flame/view/cocos/plans/AbstractCocosNode');

var LayerCocosNode = AbstractCocosNode.extend({
    makeNode: function(plan) {
        var node = cc.Layer.create();
        return node;
    },
    
    hydratePlan: function(plan) {
        return plan;
    }
});

module.exports = LayerCocosNode;