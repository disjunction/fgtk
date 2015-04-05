"use strict";

var cc = require('cc'),
    AbstractCocosNode = require('flame/view/cocos/plans/AbstractCocosNode');

var TiledMapCocosNode = AbstractCocosNode.extend({
    makeNode: function(plan) {
        var src = this.assetManager.resolveSrc(plan.src),
            node;
        
        var TilemapClass = cc.TMXTiledMap.extend({
            ctor : function() {
                this._super();
                this.initWithTMXFile(src);
            }
        });
        node = new TilemapClass();
        node.setAnchorPoint(0.5,  0.5);
        this.applyPlan(plan, node);
        return node;
    },
    
    hydratePlan: function(plan) {
        return plan;
    }
});

module.exports = TiledMapCocosNode;