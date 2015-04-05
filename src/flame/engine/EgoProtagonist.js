var cc = require('cc'),
    b2 = require('jsbox2d'),
    Interactor = require('flame/view/Interactor'),
    rof = require('flame/rof');

var EgoProtagonist = cc.Class.extend({
    /**
     * opts:
     * * fe
     * * viewport
     * * ego
     * * syncCamera : boolean
     * @param opts object
     */
    ctor: function(opts) { 
        this.opts = opts;
        this.setupInteractor();
        this.registerStepListener();
    },
    
    setupInteractor: function() {
        var keys = {};
        keys[Interactor.ARROW_UP] = keys[Interactor.KEY_W] = [{type: 'state', state: rof.ACCELERATE}];
        keys[Interactor.ARROW_DOWN] = keys[Interactor.KEY_S] = [{type: 'state', state: rof.DECELERATE}];
        keys[Interactor.ARROW_LEFT] = keys[Interactor.KEY_A] = [{type: 'state', state: rof.TURN_LEFT}];
        keys[Interactor.ARROW_RIGHT] = keys[Interactor.KEY_D] = [{type: 'state', state: rof.TURN_RIGHT}];
        
        keys[Interactor.KEY_Q] = [{type: 'state', state: 'strafeLeft'}];
        keys[Interactor.KEY_E] = [{type: 'state', state: 'strafeRight'}];
        
        keys[Interactor.MINUS] = [{type: 'event', on: 'keyDown', event: 'zoomOut'}];
        keys[Interactor.EQUAL] = [{type: 'event', on: 'keyDown', event: 'zoomIn'}];

        var layout = {keys: keys};
        
        var me = this;
        
        function InteractorApplier() {
        }

        var _p = InteractorApplier.prototype;

        _p.applyEvent = function(evt, name) {
            switch(name) {
                case 'zoomIn':
                    me.opts.viewport.scaleCameraTo(me.opts.viewport.camera.scale * 1.25);
                    break;
                case 'zoomOut':
                    me.opts.viewport.scaleCameraTo(me.opts.viewport.camera.scale / 1.25);
                    break;
            }
        };

        _p.applyState = function(interState) {
            //console.log(interState.accelerate);
        };

        var applier = new InteractorApplier();

        this.interactor = new Interactor({
            applier: applier,
            layout: layout
        });
        
        this.interactor.bindToJquery($('body'));
        
    },

    registerStepListener: function() {
        var fe = this.opts.fe;
        fe.fd.addListener('step', function(event) {
            var body = this.opts.ego.body,
                center = body.GetWorldCenter(),
                state = this.interactor.state;
                
            var strength = 200;
            
            //if (state.accelerate) body.ApplyForce(new b2.Vec2(0, strength), center, true);
            if (state.decelerate) body.ApplyForce(new b2.Vec2(0, -strength), center, true);
            if (state.strafeLeft) body.ApplyForce(new b2.Vec2(-strength, 0), center, true);
            if (state.strafeRight) body.ApplyForce(new b2.Vec2(strength, 0), center, true);
            
            if (state.turnLeft) body.ApplyAngularImpulse(5, true);
            if (state.turnRight) body.ApplyAngularImpulse(-5, true);
            
            
            
        }.bind(this));
    },
    
    stepListener: function(event) {
        
    }
});

module.exports = EgoProtagonist;