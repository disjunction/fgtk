"use strict";

var cc = require('cc'),
    AbstractCocosNode = require('flame/view/cocos/plans/AbstractCocosNode');

var LabelCocosNode = AbstractCocosNode.extend({
    makeNode: function(plan) {
        var node = new cc.LabelTTF(
            plan.text,
            plan.fontFamily || "Arial",
            plan.fontSize || 24,
            plan.size || cc.size(256, 32),
            cc.TEXT_ALIGNMENT_LEFT
        );
        node.anchorX = 0.5;
        node.anchorY = 0.5;

        if (plan.color) {
            node.color = plan.color;
        }

        if (plan.stroke) {
            var helper = this.opts.cosmosManager.thingPlanHelper;
            var color = helper.readValue(plan.stroke.color) || cc.color(0,0,0);
            var width = helper.readValue(plan.stroke.width) || 1;
            node.enableStroke(color, width);
        }
        // node.enableStroke(cc.color(0, 0, 0, 1), 3.0);

        this.applyPlan(plan, node);
        return node;
    }
});

module.exports = LabelCocosNode;
