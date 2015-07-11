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

        if (newNodePlan.inherit) {
            if (parentState && parentState.nodes[newNodePlan.inherit]) {
                node = parentState.nodes[newNodePlan.inherit];

                if (newNodePlan.ani) {
                    node.ani = newNodePlan.ani;

                    // cache the compiledAni in the newPlanNode, even if node.plan stays the same (inherited)
                    if (!newNodePlan.compiledAni) {
                        if (node.plan.spriteCache) {
                            newNodePlan.spriteCache = node.plan.spriteCache;
                        }
                        newNodePlan.compiledAni = AbstractCocosNode.prototype.compileAnimation.call(this, newNodePlan);
                        console.log('compiled new');
                    }
                    node.compiledAni = newNodePlan.compiledAni.copy();
                    console.log('compiled assigned');
                } else {
                    delete node.ani;
                    delete node.compiledAni;
                }

                node.inherited = true;
            } else {
                console.warn('failed to inherit ' + i);
                continue;
            }
        } else {
            node = this.opts.nb.makeNode(newNodePlan);
        }

        state.nodes[i] = node;
    }
    state.name = stateName;
    return state;
};


module.exports = StateBuilder;
