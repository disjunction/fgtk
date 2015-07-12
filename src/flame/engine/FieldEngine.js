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
    simStepCall: {type: 'simStepCall', dt: 0, steps: 0},
    simStepEnd: {type: 'simStepEnd', dt: 0, steps: 0},
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
     * * interactor
     * @param opts object
     */
    ctor: function(opts) {

        this.opts = opts || {};

        /**
         * space for modules
         */
        this.m = {};

        /**
         * varios debug statistics
         */
        this.stats = {};

        this.fd = new EventDispatcher();
        this.scheduler = new EventScheduler(this.fd, new SchedulingQueue());
        this.field = new Field();

        this.siblingMap = {};
        this.thingMap = {};

        /**
         * sum of all dt since start of the engine
         */
        this.timeSum = 0;

        this.simAccumulator = 0;
        this.simStep = 0.02;

        /**
         * this should correspond to timeSum, unless simSteps where dropped
         */
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


        this.simAccumulator += dt;
        var simSteps = Math.floor(this.simAccumulator / this.simStep);

        if (this.opts.config.fe && this.opts.config.fe.discardSteps && this.opts.config.fe.discardSteps < simSteps) {
            console.log('discarded ' + (simSteps - 1));
            this.scheduler.advance(dt - this.simStep);
            this.simAccumulator = this.simStep;
            simSteps = 1;
        }

        if (this.opts.config.fe && this.opts.config.fe.maxSimSteps) {
            if (this.opts.config.fe.maxSimSteps < simSteps) {
                console.log('limited ' + simSteps);
            }
            simSteps = Math.min(simSteps, this.opts.config.fe.maxSimSteps);
        }

        events.simCall.steps = events.simEnd.steps = simSteps;

        this.setDtAndDispatch(dt, events.simCall);

        for (var i = 0; i < simSteps; i++) {
            events.simStepCall.step = i;
            this.setDtAndDispatch(this.simStep, events.simStepCall);

            this.scheduler.advance(this.simStep);

            events.simStepEnd.step = i;
            this.setDtAndDispatch(this.simStep, events.simStepEnd);

            this.simAccumulator -= this.simStep;
            this.simSum += this.simStep;
        }
        this.setDtAndDispatch(dt, events.simEnd);
        this.setDtAndDispatch(dt, events.loopEnd);
    },

    injectThing: function(thing) {
        if (!thing) {
            throw new Error('empty thing injected');
        }
        if (!thing.id) {
            thing.id = this.uidGenerator.getNext();
        }
        this.field.things.push(thing);
        this.thingMap[thing.id] = thing;
        this.fd.dispatch({
            type: 'injectThing',
            thing: thing
        });
    },

    injectAvatar: function(avatar) {
        this.fd.dispatch({
            type: 'injectAvatar',
            avatar: avatar
        });
    },

    injectSibling: function(sibling) {
        this.siblingMap[sibling.siblingId] = sibling;
        this.fd.dispatch({
            type: 'injectSibling',
            sibling: sibling
        });
    },

    injectField: function(f) {
        for (var i = 0; i < f.things.length; i++) {
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
        delete this.thingMap[thing.id];
	},
});

module.exports = FieldEngine;
