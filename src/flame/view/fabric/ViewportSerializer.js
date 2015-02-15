"use strict";

/**
 * opts:
 * * nb (fabric node builder)
 * @param object opts
 * 
 */
var ViewportSerializer = function(opts) {
    this.opts = opts;
};

var _p = ViewportSerializer.prototype;


_p.nodeToPlan = function (node) {
    var planBuilder = this.opts.nb.getNodeBuilderByType(node.plan.type);
    var plan = planBuilder.serializePlan(node);    
    return plan;
};

_p.pushLayer = function (layer, collect) {
    for (var i in layer.nodes) {
        var nodeId = layer.nodes[i].plan.name;
        collect[nodeId] = this.nodeToPlan(layer.nodes[i]);
    }
};

_p.toBunchPlan = function(viewport) {
    collect = {};
    for (var i in viewport.scrolled) {
        this.pushLayer(viewport.scrolled[i], collect);
    }
    return collect;
};

module.exports = ViewportSerializer;