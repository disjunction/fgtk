/*jslint node: true */
"use strict";

var cc = require('cc'),
    Field = require('flame/entity/Field'),
    EventDispatcher = require('smog/util/EventDispatcher'),
    SchedulingQueue = require('smog/util/SchedulingQueue'),
    EventScheduler = require('smog/util/EventScheduler'),
    UidGenerator = require('smog/util/UidGenerator');

// reusable event objects. We're avoiding creating new objects this way
var events = {
    loopCall: {type: 'loopCall', dt: 0},
    simCall: {type: 'simCall', dt: 0},
    simStepCall: {type: 'simStepCall', dt: 0, step: 0},
    simStepEnd: {type: 'simStepEnd', dt: 0, step: 0},
    simEnd: {type: 'simEnd', dt: 0},
    loopEnd: {type: 'loopEnd', dt: 0}
};

var FieldEngine = cc.Class.extend({

    /**
     * opts:
     * * config
     * * cosmosManager
     * * assetManager
     * * uidGenerator
     * * thingBuilder
     * @param opts object
     */
    ctor: function(opts) {

        this.opts = opts || {};

        /**
         * space for mixins
         */
        this.m = {};

        /**
         * sum of all dt since start of the engine
         */
        this.timeSum = 0;

        this.fd = new EventDispatcher();
        this.scheduler = new EventScheduler(this.fd, new SchedulingQueue());
        this.field = new Field();

        this.simAccumulator = 0;
        this.simStep = 0.02;
        this.simSum = 0;

        // here "m" stands for "master"
        this.uidGenerator = opts.uidGenerator || new UidGenerator('m');
    },

    registerModule: function(module, name) {
        this.m[name] = module;
        module.injectFe(this, name);
    },

    setDtAndDispatch: function(dt, event) {
        event.dt = dt;
        this.fd.dispatch(event);
    },

    step: function(dt) {
        var self = this;

        this.timeSum += dt;

        this.setDtAndDispatch(dt, events.loopCall);
        this.setDtAndDispatch(dt, events.simCall);

        this.simAccumulator += dt;
        var simSteps = Math.floor(this.simAccumulator / this.simStep);
        for (var i = 0; i < simSteps; i++) {
            events.simStepCall.step = i;
            this.setDtAndDispatch(this.simStep, events.simStepCall);

            this.scheduler.advance(this.simStep);

            events.simStepEnd.step = i;
            this.setDtAndDispatch(this.simStep, events.simStepEnd);

            this.simAccumulator -= this.simStep;
        }

        this.setDtAndDispatch(dt, events.simEnd);
        this.setDtAndDispatch(dt, events.loopEnd);
    },

    injectThing: function(thing) {
        if (!thing.id) {
            thing.id = this.uidGenerator.getNext();
        }
        this.field.things.push(thing);
        this.fd.dispatch('injectThing', {
            thing: thing
        });
    },

    injectField: function(f) {
        for (var i =0; i < f.things.length; i++) {
            this.injectThing(f.things[i]);
        }
    },

	removeThing: function(thing) {
        this.fd.dispatch({
            type: 'removeThing',
            thing: thing
        });

		// remove from field
		this.field.remove(thing);
	},
});

module.exports = FieldEngine;
