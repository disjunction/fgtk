"use strict";

var cc = require('cc');

/**
 * opts:
 * * nb
 * @param opts
  */
var NodeBunchBuilder = function(opts) {
    this.opts = opts || {};
};

var _p = NodeBunchBuilder.prototype;

_p.makeNodeBunch = function(nodeBunchPlan) {
    var nodeBunch = {nodes: {}};
    for (var i in nodeBunchPlan.nodePlans) {
        var plan = nodeBunchPlan.nodePlans[i];
        plan.name = i;
        var node = this.opts.nb.makeNode(plan);
        nodeBunch.nodes[i] = node;
    }
    return nodeBunch;
};


module.exports = NodeBunchBuilder;