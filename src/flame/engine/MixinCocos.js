var cc = require('cc');
    
var x,y,node,thing;

module.exports = function(fe) {
    fe.m.cocos = {};
  
    var viewport = fe.opts.mixins.cocos.viewport;
    var stateBuilder = fe.opts.mixins.cocos.stateBuilder;
    var config = fe.opts.config;
    
    fe.envision = function(thing) {
        var stateName = thing.s || 'basic';
        var state = stateBuilder.makeState(thing.plan, stateName);
        thing.state = state;
        
        this.syncStateFromThing(thing);
        
        viewport.addStateToLayer(state);
    };
        
    fe.syncStateFromThing = function(thing) {
        //if (!thing.state) return;
        //if (thing.plan.static) return;
        for (var i in thing.state.nodes) {
            node = thing.state.nodes[i];
            x = (node.plan.x || 0) + thing.l.x * config.ppm;
            node.setPositionX(x);
            y = (node.plan.y || 0) + thing.l.y * config.ppm;
            node.setPositionY(y);
            node.setRotation(- thing.a / Math.PI * 180 - (node.plan.a || 0));
        }
    };
    
    fe.fd.addListener('onInjectThing', function(event) {
        thing = event.extra.thing;
        if (!thing.plan) return;
        this.envision(thing);
    }.bind(fe));    
    
    fe.fd.addListener('step', function(event) {
        for (var i = 0; i < this.field.things.length; i++) {
            thing = this.field.things[i];
            if (!thing.state || thing.plan.static) continue;
            this.syncStateFromThing(thing);
        }
    }.bind(fe));
};