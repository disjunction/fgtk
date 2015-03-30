"use strict";

var planMapping = {
    sprite: require('flame/view/cocos/plans/SpriteCocosNode'),
    layer: require('flame/view/cocos/plans/LayerCocosNode'),
    tiledMap: require('flame/view/cocos/plans/TiledMapCocosNode')
};

var CocosNodeBuilder = function(opts) {
    this.type = 'cocos';
    this.opts = opts || {};
    this.builders = [];
};
    
var _p = CocosNodeBuilder.prototype;
    
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

_p.makeNode =  function(plan) {
    plan.type = plan.type || 'sprite';
    var builder = this.getNodeBuilderByType(plan.type);
    
    // extend plan with defaults
    if (builder.hydratePlan) {
        builder.hydratePlan(plan);
    }
    
    var node = builder.makeNode(plan);
    node.plan = plan;
    return node;
};

_p.makeLayer =  function(opts) {
    return this.makeNode({type: 'layer', opts: opts});
};

module.exports = CocosNodeBuilder;