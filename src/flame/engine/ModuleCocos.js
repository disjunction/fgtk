var cc = require('cc'),
    ModuleAbstract = require('./ModuleAbstract');
    
var x,y,node,thing;

/**
 * opts:
 * * viewport
 * * stateBuilder
 * * config
 */
var ModuleCocos = ModuleAbstract.extend({
    injectFe: function(fe, name) {
        ModuleAbstract.prototype.injectFe.call(this, fe, name);

        this.fe.fd.addListener('injectThing', function(event) {
            thing = event.extra.thing;
            if (!thing.plan) return;
            this.envision(thing);
        }.bind(this));    

        this.fe.fd.addListener('moveThing', function(event) {
            this.syncStateFromThing(event.thing);
        }.bind(this));
        /*
        this.fe.fd.addListener('step', function(event) {
            for (var i = 0; i < this.fe.field.things.length; i++) {
                thing = this.fe.field.things[i];
                if (!thing.state || thing.plan.static) continue;
                this.syncStateFromThing(thing);
            }
        }.bind(this));
        */
    },
   
    envision: function(thing) {
        var stateName = thing.s || 'basic';
        var state = this.opts.stateBuilder.makeState(thing.plan, stateName);
        thing.state = state;
        
        this.syncStateFromThing(thing);
        
        this.opts.viewport.addStateToLayer(state);
    },
        
    syncStateFromThing: function(thing) {
        for (var i in thing.state.nodes) {
            node = thing.state.nodes[i];
            x = (node.plan.x || 0) + thing.l.x * this.opts.config.ppm;
            node.setPositionX(x);
            y = (node.plan.y || 0) + thing.l.y * this.opts.config.ppm;
            node.setPositionY(y);
            node.setRotation(- thing.a / Math.PI * 180 - (node.plan.a || 0));
        }
    }
});

module.exports = ModuleCocos;