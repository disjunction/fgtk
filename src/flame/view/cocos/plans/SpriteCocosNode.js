"use strict";

var cc = require('cc'),
    AbstractCocosNode = require('flame/view/cocos/plans/AbstractCocosNode');

var SpriteCocosNode = AbstractCocosNode.extend({
    makeNode: function(plan) {
        var imgSrc = this.assetManager.resolveSrc(plan.src),
            node;
        if (plan.subrect) {
            node = cc.Sprite.create(imgSrc, cc.rect.apply(cc, plan.subrect));
        } else {
            node = cc.Sprite.create(imgSrc);
        }

        this.applyPlan(plan, node);                
        return node;
    },
    
    hydratePlan: function(plan) {
        return plan;
    }
});

module.exports = SpriteCocosNode;