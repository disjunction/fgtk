"use strict";

var
    cc    = require('cc'),
    smog   = require('smog'),
    config = smog.app.config,
    ccp    = cc.Point;

var Thing = cc.Class.extend({
    /**
     * @param opts object
     */
    ctor: function(opts) {
        opts = opts || {};
        
        if (opts.plan) this.plan = opts.plan;
        
        // location
        this.l = opts.l ? opts.l : cc.p(0, 0);
        
        // angle
        this.a = opts.a ? opts.a : 0;
        
        // state
        this.s = opts.s ? opts.s : 'basic';
        
        this.nodes = {};
    },
    
	/**
	 * abstract setter supporting event dispatcher (see HudObserver)
	 * @param propName
	 * @param newValue
	 * @param delay - the smallest period of event dispatching
	 * @return newValue
	 */
	setter: function(property, newValue, delay) {
		var old = this[property];
				
		if (old != newValue) {
                    this['_' + property] = newValue;

                    // EventDispatcher
                    if (this.ed) {
                            if (delay) {
                                    if (this['_' + property + 'Planned']) return newValue;
                                    this['_' + property + 'Planned'] = true;
                                    setTimeout((function(){
                                            this.ed.dispatchProperty(this, property, old, this[property]);
                                            this['_' + property + 'Planned'] = false;
                                    }).bind(this), delay * 1000);
                            } else {
                                    this.ed.dispatchProperty(this, property, old, newValue);
                            }
                    }
		}
		
		return newValue;
	},
	
	get location() {return this._l;},
	set location(v) {
		this._l = v;
		for (var key in this.nodes) {
			this.nodes[key].position = geo.ccpMult(v, ccp(config.ppm, config.ppm));
		}
	},
	_l: null,
	
	get angle() {return this._a;},
	set angle(v) {
		this._a = v;
		this.ac = true;
		for (var key in this.nodes) {
			this.nodes[key].rotation = geo.radiansToDegrees(-v);
		}
	},
	_a: 0,
	
	_t: '',
	get type() {return this._t;},
	set type(v) {this._t = v;},
	
	syncBody: function(body) {
		body.SetPosition(this.location);
		body.SetAngle(this.angle);
	}    
});

module.exports = Thing;
