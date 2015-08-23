/*jslint node: true */
"use strict";

var cc = require('cc'),
    AbstractCocosNode = require('flame/view/cocos/plans/AbstractCocosNode');

var TiledMapCocosNode = AbstractCocosNode.extend({

    ctor: function(opts) {
        this._super(opts);
        this.tilemapCache = {};
        this.tilemapPool = {};
    },

    makeNode: function(plan) {
        var from = plan.from,
            src = this.assetManager.resolveSrc(plan.src),
            me = this,
            node;

        if (plan.from && me.tilemapCache[plan.from]) {
            node = cc.clone(me.tilemapCache[plan.from]);
        } else {
            node = new cc.TMXTiledMap();
            node.setAnchorPoint(0.5,  0.5);
            node.initWithTMXFile(src);
            if (plan.from) {
                me.tilemapCache[plan.from] = node;
            }
        }

        this.applyPlan(plan, node);
        return node;
    },

    hydratePlan: function(plan) {
        return plan;
    }
});

module.exports = TiledMapCocosNode;
