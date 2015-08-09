/*jslint node: true */
"use strict";

var cc = require('cc'),
    smog = require('fgtk/smog'),
    Field = require('flame/entity/Field'),
    UidGenerator = require('smog/util/UidGenerator');

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

        // identifies the current "room"
        this.name = 'default';

        this.opts = opts || {};

        /**
         * space for modules
         */
        this.m = {};

        /**
         * varios debug statistics
         */
        this.stats = {};

        this.eq = require('radiopaque').create();

        var setDt = function(template, args) {
                template.dt = args[0];
            },
            setDtSteps = function(template, args) {
                template.dt = args[0];
                template.steps = args[1];
            },
            setDtStep = function(template, args) {
                template.dt = args[0];
                template.step = args[1];
            };

        this.prepared = {
            loopCall: this.eq.channel("loopCall").prepare(setDt),
            simCall: this.eq.channel("simCall").prepare(setDtSteps),
            simStepCall: this.eq.channel("simStepCall").prepare(setDtStep),
            simStepEnd: this.eq.channel("simStepEnd").prepare(setDtStep),
            simEnd: this.eq.channel("simEnd").prepare(setDtSteps),
            loopEnd: this.eq.channel("loopEnd").prepare(setDt),

            teff: this.eq.channel("teff").prepare(function(template, args) {
                template.thing = args[0];
                template.teff = args[1];
            })
        };

        this.field = opts.field || new Field();
        delete opts.field;

        this.siblingMap = {};
        this.thingMap = {};

        /**
         * sum of all dt since start of the engine, including drops
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

    step: function(dt) {
        var prepared = this.prepared;

        this.timeSum += dt;

        prepared.loopCall.execute(dt);


        this.simAccumulator += dt;
        var simSteps = Math.floor(this.simAccumulator / this.simStep);

        if (this.opts.config.fe && this.opts.config.fe.discardSteps && this.opts.config.fe.discardSteps < simSteps) {
            console.log('discarded ' + (simSteps - 1));
            this.eq.timeIn(dt - this.simStep).run();
            this.simAccumulator = this.simStep;
            simSteps = 1;
        }

        if (this.opts.config.fe && this.opts.config.fe.maxSimSteps) {
            if (this.opts.config.fe.maxSimSteps < simSteps) {
                console.log('limited ' + simSteps);
            }
            simSteps = Math.min(simSteps, this.opts.config.fe.maxSimSteps);
        }

        prepared.simCall.execute(dt, simSteps);

        for (var i = 0; i < simSteps; i++) {
            prepared.simStepCall.execute(this.simStep, i);

            this.eq.timeIn(this.simStep).run();

            prepared.simStepEnd.execute(this.simStep, i);

            this.simAccumulator -= this.simStep;
            this.simSum += this.simStep;
        }
        prepared.simEnd.execute(dt, simSteps);
        prepared.loopEnd.execute(dt);
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
        this.eq.channel("injectThing").broadcast({
            thing: thing
        });
    },

    removeThing: function(thing) {
        this.eq.channel("removeThing").broadcast({
            thing: thing
        });

        thing.removed = true;

        // remove from field
        this.field.remove(thing);
        delete this.thingMap[thing.id];
	},

    injectField: function(f) {
        this.eq.channel("injectField").broadcast({
            field: f
        });
        for (var i = 0; i < f.things.length; i++) {
            this.injectThing(f.things[i]);
        }
    },

    injectAvatar: function(avatar) {
        this.eq.channel("injectAvatar").broadcast({
            avatar: avatar
        });
    },

    removeAvatar: function(avatar) {
        this.eq.channel("removeAvatar").broadcast({
            avatar: avatar
        });
    },

    injectSibling: function(sibling) {
        this.siblingMap[sibling.siblingId] = sibling;
        this.eq.channel("injectSibling").broadcast({
            sibling: sibling
        });
    },

    removeSibling: function(sibling) {
        this.eq.channel("removeSibling").broadcast({
            sibling: sibling
        });
        delete this.siblingMap[sibling.siblingId];
    },

    registerDb: function(db) {
        this.db = db;
        this.eq.channel("registerDb").broadcast({
            db: db
        });
    },

    /**
     * teff means "apply Thing EFFeffect"
     *
     * this is an often used operation - dispatching an effect for thing
     * optionally you can provide delay and unteff - the effect removal command
     * if this operation is often repeated, you might want to have a shared teff/unTeff arrays
     *
     * the actual changing of effects is not implemented here,
     * because each application might want to watch teff changes in its own way
     *
     * @param  {Thing} thing  [description]
     * @param  {Array.[String]|String} teff
     * @param  {float} delay in seconds relative to current simSum
     * @param  {Array.[String]|String} unTeff
     */
    dispatchTeff: function(thing, teff, delay, unTeff) {
        this.prepared.teff.execute(thing, teff);

        if (delay !== undefined) {
            this.eq.channel("teff").broadcastIn(delay, {
                thing: thing,
                teff: unTeff
            });
        }
    },
});

module.exports = FieldEngine;
