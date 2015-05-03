"use strict";

var cc = require('cc'),
    Viewport = require('flame/view/Viewport');

var node;

var Stretcher = cc.Class.extend({
    /**
     * opts:
     * * fe
     * @param {object} opts
     */
    ctor: function(opts) {
        this.opts = opts;
    },
    
    syncStretchedNodes: function(thing) {
        
        for (var i in thing.state.nodes) {
            node = thing.state.nodes[i];
            if (!node.plan.stretched) continue;
            x = (node.plan.x || 0) + thing.l.x * this.opts.config.ppm;
            y = (node.plan.y || 0) + thing.l.y * this.opts.config.ppm;
            if (node.plan.position == 'precise') {
                //x = Math.round(x);
            }
            node.setPositionX(x);
            node.setPositionY(y);
            node.setRotation(- thing.a / Math.PI * 180 - (node.plan.a || 0));
        }
    }
    
});