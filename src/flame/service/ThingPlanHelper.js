/*jslint node: true */
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

var assetFields = ['src', 'tilesets'];
_p.getNodePlanAssets = function(nodePlan) {
    var field;
    var result = [];
    for (var i = 0; i < assetFields.length; i++) {
        field = nodePlan[assetFields[i]];
        if (!field) continue;

        var candidates =  Array.isArray(field) ? field : [field];
        for (var j = 0; j < candidates.length; j++) {
            result.push(candidates[j]);
        }
    }
    return result;
};

_p.getPlanAssets = function(thingPlan) {
    var result = [];
    if (thingPlan.states) {
        for (var stateKey in thingPlan.states) {
            if (stateKey.substring(0, 1) == '_') continue;
            var state = thingPlan.states[stateKey];
            for (var nodeKey in state) {
                result = result.concat(this.getNodePlanAssets(state[nodeKey]));
            }
        }
    }
    return result;
};

_p.readColor = function(value) {
    if (typeof value != 'string') {
        return value;
    }

    return {
        r: parseInt(value.substring(1,3), 16),
        g: parseInt(value.substring(3,5), 16),
        b: parseInt(value.substring(5,7), 16),
        a: 255
    };
},

_p.readValue = function(value) {
    if (typeof value == 'string' && value[0] == '#') {
        return this.readColor(value);
    }
    return value;
};


module.exports = ThingPlanHelper;
