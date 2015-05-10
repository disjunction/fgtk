"use strict";

var cc = require('cc'),
    AbstractCocosNode = require('flame/view/cocos/plans/AbstractCocosNode');

var BarCocosNode = AbstractCocosNode.extend({
    makeNode: function(nodePlan) {
        if (!nodePlan.width || !nodePlan.height || !nodePlan.color) {
            throw new Error('Invalid nodePlan for BarCocosNode');
        }
        if (nodePlan.color.length != 7 || nodePlan.color[0] != '#') {
            throw new Error('bad color code ' + nodePlan.color + ' for BarCocosNode');
        }

        var color = this.opts.cosmosManager.thingPlanHelper.readValue(nodePlan.color);

        var node = cc.LayerColor.create(color, nodePlan.width, nodePlan.height);
        this.applyPlan(nodePlan, node);
        return node;
    },

    hydratePlan: function(nodePlan) {
        if (!nodePlan.x) {
            nodePlan.x = - nodePlan.width / 2;
        }
        if (!nodePlan.y) {
            nodePlan.y = - nodePlan.height / 2;
        }
    }
});

module.exports = BarCocosNode;
