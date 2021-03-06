/*jslint node: true */
"use strict";

var cc = require('cc');


// this only exists in a real cocos environment, because it extends form Actions
var customActionMap;
if (cc.ActionInstant) {
    customActionMap = {
        removeThingNode: require('flame/view/cocos/action/RemoveThingNode'),
        playEffect: require('flame/view/cocos/action/PlayEffect'),
        playLocalEffect: require('flame/view/cocos/action/PlayLocalEffect'),
    };
} else {
    customActionMap = {};
}

var AbstractCocosNode = cc.Class.extend({
    ctor: function(opts) {
        this.opts = opts || {};
        this.canvas = this.opts.canvas;
        this.assetManager = this.opts.assetManager;
    },
    applyPlan: function(plan, node) {
        if (plan.a) node.setRotation(plan.a);

        var x = plan.x || 0;
        var y = plan.y || 0;
        node.setPositionX(x);
        node.setPositionY(y);

        var a = plan.a || 0;
        node.setRotation(a);

        if (plan.alpha) node.setOpacity(plan.alpha / 100);

        var s = this.opts.cosmosManager.thingPlanHelper.getNodeScale(plan);
        if (s) {
            if (s.x) node.setScaleX(s.x);
            if (s.y) node.setScaleY(s.y);
        }
    },
    roundCoord: function(v) {
        return Math.round(v*10)/10;
    },
    roundAngle: function(v) {
        return Math.round(v*10)/10;
    },
    hydratePlan: function(plan) {
        if (plan.ani && !plan.compiledAni) {
            plan.compiledAni = this.compileAnimation(plan);
        }
    },
    compileAnimation: function(plan) {
        var ani = plan.ani;
        function makeFrameAnimation(def) {
            if (!plan.spriteCache) {
                throw new Error('spriteCache not found. Calling animate on non-sprite?');
            }
            var frames;
            if (def.length < 2) {
                frames = plan.spriteCache.frames;
            } else {
                frames = [];
                for (var i = 0; i < def[1].length; i++) {
                    frames.push(plan.spriteCache.frames[def[1][i]]);
                }
            }
            return cc.animate(new cc.Animation(frames, def[0]));
        }

        function repeat(def) {
            var action = makeAction(def[2]);
            if (def[1] == 'forever') {
                return action.repeatForever();
            } else {
                return action.repeat(def[1]);
            }
        }

        function makeAction(def) {
            switch (def[0]) {
                case 'spawn':
                    return groupAction(cc.spawn, def[1]);
                case 'sequence':
                    return groupAction(cc.sequence, def[1]);
                case 'animate':
                    return makeFrameAnimation(def[1]);
                case 'repeat':
                    return repeat(def);
            }

            if (customActionMap[def[0]]) {
                return customActionMap[def[0]].create.apply(cc, def[1]);
            }

            if (!def[0] || !cc[def[0]]) {
                throw new Error('bad action ' + def[0]);
            }

            if (typeof def[1] == 'undefined') {
                return cc[def[0]].call(cc);
            } else {
                return cc[def[0]].apply(cc, def[1]);
            }
        }

        function groupAction(groupFunction, def) {
            var array = [];
            for (var i = 0; i < def.length; i++) {
                array.push(makeAction(def[i]));
            }
            return groupFunction(array);
        }
        return makeAction(ani);
    }
});

module.exports = AbstractCocosNode;
