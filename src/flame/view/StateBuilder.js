/*jslint node: true */
"use strict";

var cc = require('cc'),
    geo = require('smog').util.geo,
    AbstractCocosNode = require('flame/view/cocos/plans/AbstractCocosNode');

/**
 * opts:
 * * nb
 * @param opts
  */
var StateBuilder = function(opts) {
    this.opts = opts || {};
};

var _p = StateBuilder.prototype;

_p.makeState = function(nodeBunchPlan, stateName, parentState) {
    var state = {nodes: {}};
    if (!nodeBunchPlan.states[stateName]) {
        throw new Error('unknown state "' + stateName + '"');
    }

    for (var i in nodeBunchPlan.states[stateName]) {
        // treat nodeId starting with underscore, as comments
        if (i.substring(0,1) == '_') {
            continue;
        }
        var plan = nodeBunchPlan.states[stateName][i],
            node;

        plan.name = i;

        if (plan.inherit && parentState && parentState.nodes[plan.inherit]) {
            node = parentState.nodes[plan.inherit];
            if (plan.ani) {
                node.plan.ani = plan.ani;
                node.plan.compiledAni = AbstractCocosNode.prototype.compileAnimation.call(this, node.plan);
            }
            node.inherited = true;
        } else {
            node = this.opts.nb.makeNode(plan);
        }

        state.nodes[i] = node;
    }
    state.name = stateName;
    return state;
};


module.exports = StateBuilder;
