var cc = require('cc'),
    Field = require('flame/entity/Field'),
    EventDispatcher = require('smog/util/EventDispatcher');

var stepEvent = {type: 'step', dt: 0},
    prestepEvent = {type: 'prestep', dt: 0},
    poststepEvent = {type: 'poststep', dt: 0};


var FieldEngine = cc.Class.extend({

    /**
     * opts:
     * * config
     * * cosmosManager
     * * assetManager
     * * mixins
     *    * box2d
     *    * cocos
     *      * viewport
     *      * stateBuilder
     *
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
        this.field = new Field();
    },

    registerModule: function(module, name) {
        this.m[name] = module;
        module.injectFe(this, name);
    },

    step: function(dt) {
        stepEvent.dt = prestepEvent.dt = poststepEvent.dt = dt;
        this.timeSum += dt;
        this.fd.dispatch(prestepEvent);
        this.fd.dispatch(stepEvent);
        this.fd.dispatch(poststepEvent);
    },

    injectThing: function(thing) {
        this.field.things.push(thing);
        this.fd.dispatch('injectThing', {
            thing: thing
        });
    },

    injectField: function(f) {
        for (var i =0; i < f.things.length; i++) {
            this.injectThing(f.things[i]);
        }
    }
});

module.exports = FieldEngine;
