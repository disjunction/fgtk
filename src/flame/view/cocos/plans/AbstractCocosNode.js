"use strict";

var cc = require('cc');

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
            return cc.animate(new cc.Animation(plan.spriteCache.frames, def[0]));
        }
        
        function makeAction(def) {
            if (def[0] == 'spawn') {
                return groupAction(cc.spawn, def[1]);
            }
            if (def[0] == 'sequence') {
                return groupAction(cc.sequence, def[1]);
            }
            if (def[0] == 'animate') {
                return makeFrameAnimation(def[1]);
            }

            if (!def[0] || !cc[def[0]]) {
                throw new Error('bad action ' + def[0]);
            }

            if (typeof def[1] == 'undefined') {
                return cc[def[0]].call(cc);
            } else {
                return cc[def[0]].apply(cc, def[1]);
            }

            return action;
        }
        function groupAction(groupFunction, def) {
            var array = [];
            for (var i = 0; i < def.length; i++) {
                if (def[i][0] == "repeat") {
                    continue;
                }
                array.push(makeAction(def[i]));
            }
            return groupFunction(array);
        }

        return makeAction(ani);
    }
});

module.exports = AbstractCocosNode;
