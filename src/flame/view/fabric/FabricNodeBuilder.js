"use strict";

var FabricLayer = require('flame/view/fabric/FabricLayer');

var planMapping = {
    sprite: require('flame/view/fabric/plans/SpriteFabricNode')
};

var FabricNodeBuilder = function(opts) {
    this.type = 'fabric';
    this.opts = opts || {};
    if (!this.opts.canvas) {
        throw new Error('FabricNodeBuilder requires opts.canvas (fabric canvas instance)');
    }
    
    this.builders = [];
};
    
var _p = FabricNodeBuilder.prototype;
    
/**
 * Lazy load of node builders for each plan type
 * @param {type} type
 * @returns {p.builders}
 */
_p.getNodeBuilderByType = function(type) {
    if (!this.builders[type]) {
        if (!planMapping[type]) {
            throw new Error('unknow node type: ' + type);
        }
        this.builders[type] = new (planMapping[type])(this.opts);
    }
    return this.builders[type];
};

_p.addToCanvas = function(node) {
    this.opts.canvas.add(node);
};

_p.makeNode =  function(plan) {
    plan.type = plan.type || 'sprite';
    var builder = this.getNodeBuilderByType(plan.type);
    
    // extend plan with defaults
    if (builder.hydratePlan) {
            builder.hydratePlan(plan);
    }
    
    var node = builder.makeNode(plan);
    node.hasBorders = false;
    node.plan = plan;
    return node;
};

_p.makeLayer =  function(opts) {
    return new FabricLayer(opts);
};

module.exports = FabricNodeBuilder;