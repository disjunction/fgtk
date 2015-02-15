"use strict";

var cc = require('cc');

/**
 * opts:
 * * nb
 * @param opts
  */
var StateBuilder = function(opts) {
    this.opts = opts || {};
};

var _p = StateBuilder.prototype;

_p.makeState = function(nodeBunchPlan, stateName) {
    var state = {nodes: {}};
    if (!nodeBunchPlan.states[stateName]) {
        throw new Error('unknown state "' + stateName + '"');
    }
    for (var i in nodeBunchPlan.states[stateName]) {
        var plan = nodeBunchPlan.states[stateName][i];
        plan.name = i;
        var node = this.opts.nb.makeNode(plan);
        state.nodes[i] = node;
    }
    return state;
};


module.exports = StateBuilder;