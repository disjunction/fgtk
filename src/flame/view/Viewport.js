/*jslint node: true */
"use strict";

var cc = require('cc');

/**
 * Used as a structured container for visual elements; encapsulates node factory and layers
 * opts:
 * * nb - node builder
 * @param opts
 */
var Viewport = cc.Class.extend({
    ctor: function(opts) {
        this.opts = opts;

        this.nb = this.opts.nb;

        this.scale = 1;

        // main cocos2d layer, see addLayersTo()
        this.layer = null;
    }
});

var _p = Viewport.prototype;

_p.initLayers = function() {
    this.scrolled = {
        bg: this.nb.makeLayer({name: 'bg'}),
        obstacle: this.nb.makeLayer({name: 'obstacle'}),
        main: this.nb.makeLayer({name: 'main'}),
        stuff: this.nb.makeLayer({name: 'stuff'}),
        targets: this.nb.makeLayer({name: 'targets'})
    };
};

_p.renderLayers = function() {
    throw new Error('should be implemented only for fabric');
};

_p.addNodeToLayer = function(node, layerId) {
    var zIndex = 0;
    if (!layerId) {
        layerId = 'main';
        if (node.plan.layer) {
            layerId = node.plan.layer;
        }
    }

    if (node.plan.zIndex) {
        zIndex = node.plan.zIndex;
    } else if (node.plan.elevation) {
        zIndex = node.plan.elevation * 100;
        //layerId += node.plan.elevation;
    }

    if (this.scrolled[layerId]) {
        this.scrolled[layerId].addChild(node, zIndex);
    } else if (this[layerId]) {
        this[layerId].addChild(node, zIndex);
    } else {
        throw new Error('unknown layerId ' + layerId);
    }
};

_p.removeNodeFromLayer = function(node) {
    // cleanup = false, because we want to re-attach it when needed
    node.removeFromParent(false);
};

_p.addLookToLayer = function(look) {
    for (var i in look.nodes) {
        this.addNodeToLayer(look.nodes[i]);
    }
};

_p.cleanupChildren = function(node) {
    var children = node.getChildren();
    for (var i = 0; i < children.length; i++) {
        children[i].removeFromParent();
    }
};

_p.removeLookFromLayer = function(look) {
    for (var i in look.nodes) {
        if (i == "effects") {
            this.cleanupChildren(look.nodes[i]);
        }
        this.removeNodeFromLayer(look.nodes[i]);
    }
};

_p.addLayersTo = function(layer) {
    layer.addChild(this.far);
    layer.addChild(this.scrolled);
    layer.addChild(this.hud);

    this.layer = layer;
};

_p.locationToPosition = function(point) {
    throw Error('must be implemented in concrete Viewport');
};


module.exports = Viewport;
