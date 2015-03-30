"use strict";

var cc = require('cc');

/**
 * opts:
 * * cosmosManager
 * @param opts
  */
var ThingPlanHelper = function(opts) {
    this.opts = opts;
};

var _p = ThingPlanHelper.prototype;

_p.getPrimaryNode = function(plan) {
    if (plan.states && plan.states.basic) {
        var nodeKeys = Object.keys(plan.states.basic);
        var node = plan.states.basic[nodeKeys[0]];
        if (node) return node;
    }
    return false;
};

_p.getNodeScale = function(nodePlan) {
    var s = nodePlan.scale;   
    if (s) {
        if (typeof s != 'object') {
            s = {x: s, y: s};
        }
    }
    return s;
};

module.exports = ThingPlanHelper;