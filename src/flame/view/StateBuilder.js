/*jslint node: true */
"use strict";

var cc = require('cc'),
    geo = require('smog').util.geo,
    AbstractCocosNode = require('flame/view/cocos/plans/AbstractCocosNode');

/**
 * opts:
 * * nb
 * * config
 * @param opts
  */
var StateBuilder = function(opts) {
    this.opts = opts || {};
};

var _p = StateBuilder.prototype;

_p.inlcudeNodePlans = function(targetPlan, includeTo, includeDef, stateName) {
    var i;

    if (Array.isArray(includeDef)) {
        for (i = 0; i < includeDef.length; i++) {
            this.inlcudeNodePlans(targetPlan, includeTo, includeDef[i], stateName);
        }
        return;
    }

    var plan = includeDef.planSrc ? this.opts.nb.opts.cosmosManager.get(includeDef.planSrc) : targetPlan,
        includeState = includeDef.state || stateName,
        state = this.makeState(plan, includeState);
    for (i in state.nodes) {
        includeTo.nodes[i] = state.nodes[i];
    }
};

_p.makeState = function(thingPlan, stateName, parentState) {
    var state = {nodes: {}};
    if (!thingPlan.states[stateName]) {
        throw new Error('unknown state "' + stateName + '"');
    }

    plans: for (var i in thingPlan.states[stateName]) {
        // treat nodeId starting with underscore, as comments
        if (i.substring(0,1) == '_') {
            continue;
        }
        if (i == '$include') {
            this.inlcudeNodePlans(thingPlan, state, thingPlan.states[stateName][i], stateName);
            continue;
        }

        var newNodePlan = thingPlan.states[stateName][i],
            node;

        if (newNodePlan.features && this.opts.config.features) {
            for (var j in newNodePlan.features) {
                if (newNodePlan.features[j] != this.opts.config.features[j]) {
                    continue plans;
                }
            }
        }

        newNodePlan.name = i;

        if (newNodePlan.inherit) {
            if (parentState && parentState.nodes[newNodePlan.inherit]) {
                node = parentState.nodes[newNodePlan.inherit];

                if (node.currentAction && node.compiledAni) {
                    node.stopAction(node.compiledAni);
                }

                if (newNodePlan.ani) {
                    node.ani = newNodePlan.ani;

                    // cache the compiledAni in the newPlanNode, even if node.plan stays the same (inherited)
                    if (!newNodePlan.compiledAni) {
                        if (node.plan.spriteCache) {
                            newNodePlan.spriteCache = node.plan.spriteCache;
                        }
                        newNodePlan.compiledAni = AbstractCocosNode.prototype.compileAnimation.call(this, newNodePlan);
                    }
                    node.compiledAni = newNodePlan.compiledAni.copy();
                } else {
                    node.ani = false;
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
