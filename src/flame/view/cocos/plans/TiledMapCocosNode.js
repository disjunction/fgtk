"use strict";

var cc = require('cc'),
    AbstractCocosNode = require('flame/view/cocos/plans/AbstractCocosNode');

var TiledMapCocosNode = AbstractCocosNode.extend({
    makeNode: function(plan) {
        console.log('der start');
        var src = this.assetManager.resolveSrc(plan.src),
            node;
        
        var TilemapClass = cc.TMXTiledMap.extend({
            ctor : function() {
                this._super();
                this.initWithTMXFile(src);
            }
        });
        node = new TilemapClass();
        this.applyPlan(plan, node);
        console.log('der end');
        return node;
    },
    
    hydratePlan: function(plan) {
        return plan;
    }
});

module.exports = TiledMapCocosNode;