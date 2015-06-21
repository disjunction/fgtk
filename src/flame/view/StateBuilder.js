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

_p.inlcudeNodePlans = function(includeTo, includeDef, stateName) {
    var plan = this.opts.nb.opts.cosmosManager.get(includeDef.planSrc),
        includeState = includeDef.state || stateName,
        state = this.makeState(plan, includeState);
    for (var i in state.nodes) {
        includeTo.nodes[i] = state.nodes[i];
    }
};

_p.makeState = function(thingPlan, stateName, parentState) {
    var state = {nodes: {}};
    if (!thingPlan.states[stateName]) {
        throw new Error('unknown state "' + stateName + '"');
    }

    for (var i in thingPlan.states[stateName]) {
        // treat nodeId starting with underscore, as comments
        if (i.substring(0,1) == '_') {
            continue;
        }
        if (i == '$include') {
            this.inlcudeNodePlans(state, thingPlan.states[stateName][i], stateName);
            continue;
        }

        var newNodePlan = thingPlan.states[stateName][i],
            node;

        newNodePlan.name = i;

        if (newNodePlan.inherit && parentState && parentState.nodes[newNodePlan.inherit]) {
            node = parentState.nodes[newNodePlan.inherit];
            if (newNodePlan.ani) {
                node.plan.ani = newNodePlan.ani;
                // cache the compiledAni in the newPlanNode, even if node.plan stays the same (inherited)
                if (!newNodePlan.compiledAni) {
                    newNodePlan.compiledAni = AbstractCocosNode.prototype.compileAnimation.call(this, node.plan);
                }
                node.plan.compiledAni = newNodePlan.compiledAni;
            } else {
                delete node.plan.ani;
                delete node.plan.compiledAni;
            }

            // the original plan properties are overwritten by the new plan ones
            for (var j in newNodePlan) {
                if (j != 'inherit' && j != 'ani') {
                    //node.plan[j] = newNodePlan[j];
                }
            }

            node.inherited = true;
        } else {
            node = this.opts.nb.makeNode(newNodePlan);
        }

        state.nodes[i] = node;
    }
    state.name = stateName;
    return state;
};


module.exports = StateBuilder;
