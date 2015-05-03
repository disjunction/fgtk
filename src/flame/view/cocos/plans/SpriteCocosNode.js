"use strict";

var cc = require('cc'),
    AbstractCocosNode = require('flame/view/cocos/plans/AbstractCocosNode');

var SpriteCocosNode = AbstractCocosNode.extend({
    makeNode: function(plan) {
        var node = cc.Sprite.create(plan.spriteCache.frames[0]);
        this.applyPlan(plan, node);                
        return node;
    },
    hydratePlan: function(plan) {
        if (!plan.spriteCache) {
            var texture = cc.textureCache.addImage(this.assetManager.resolveSrc(plan.src)),
                rect = (plan.subrect ?
                    cc.rect.apply(cc, plan.subrect) :
                    cc.rect(0, 0, texture._contentSize.width, texture._contentSize.height)),
                c = {
                    texture: texture,
                    frames: [
                        new cc.SpriteFrame(texture, rect)
                    ]
                };
                
            if (plan.frames) {
                for (var i = 0; i < plan.frames.length; i++) {
                    c.frames.push(new cc.SpriteFrame(texture, cc.rect.apply(cc, plan.frames[i])));
                }
            }

            plan.spriteCache = c;
        }
        AbstractCocosNode.prototype.hydratePlan.call(this, plan);
    }
});

module.exports = SpriteCocosNode;
