/*jslint node: true */
"use strict";

var cc = require('cc'),
    Thing = require('flame/entity/Thing'),
    ThingPlanHelper = require('flame/service/ThingPlanHelper');

/**
 * opts:
 * * classCollections
 * @param opts
  */
var ThingBuilder = function(opts) {
    this.opts = opts || {classCollections: {}};
};

var _p = ThingBuilder.prototype;

_p.getClass = function(name) {
    if (name == 'Thing') {
        return Thing;
    }
    for (var i in this.opts.classCollections) {
        if (this.opts.classCollections[i][name]) {
            return this.opts.classCollections[i][name];
        }
    }
    throw new Error('ThingBuilder can not resolve class ' + name);
};

_p.makeThingByPlan = function(plan) {
    return this.makeThing({plan: plan});
};

_p.makeThing = function(opts) {
    var plan = opts.plan,
        className = plan.class || 'Thing',
        classCtor = this.getClass(className),
        thing = new classCtor(opts);

    return thing;
};


module.exports = ThingBuilder;
