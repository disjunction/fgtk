var cc = require('cc'),
    Field = require('flame/entity/Field'),
    EventDispatcher = require('smog/util/EventDispatcher');

var stepEvent = {
    type: 'step',
    dt: 0
};

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
        
        this.fd = new EventDispatcher();
        this.field = new Field();
                        
        if (opts.mixins) {
            if (opts.mixins.box2d) {
                var mixinBox2d = require('flame/engine/MixinBox2d');
                mixinBox2d(this);
            }
            if (opts.mixins.cocos) {
                var mixinCocos = require('flame/engine/MixinCocos');
                mixinCocos(this);
            }
        }
    },

    registerModule: function(module, name) {
        this.m[name] = module;
        module.injectFe(this, name);
    },
    
    step: function(dt) {
        stepEvent.dt = dt;
        this.fe.fd.dispatch(stepEvent);
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