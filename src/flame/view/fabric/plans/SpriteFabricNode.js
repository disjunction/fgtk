"use strict";

var cc = require('cc');

/**
 * Sprite
 */

var SpriteFabricNode = cc.Class.extend({
    ctor: function(opts) {
        this.opts = opts || {};
        
        this.fabric = this.opts.fabric;
        this.canvas = this.opts.canvas;
        this.assetManager = this.opts.assetManager;
    },
    makeNode: function(plan) {
        var me = this;
        var img = this.assetManager.getResource(plan.src);
        var node = new this.fabric.Image(img);
        return node;
        /*
        this.opts.fabric.Image.fromURL(
            this.assetManager.resolveSrc(plan.src),
            function(img) {
                me.canvas.add(img);
            }
        );
        */
    }
});

module.exports = SpriteFabricNode;