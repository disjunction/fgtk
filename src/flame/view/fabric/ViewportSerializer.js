"use strict";

var ViewportSerializer = function(opts) {};

var _p = ViewportSerializer.prototype;


_p.nodeToPlan = function (node) {
    var plan = {
        layer: node.layer,
        src: node.plan.src
    };
    
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
    return {nodePlans: collect};
};

module.exports = ViewportSerializer;