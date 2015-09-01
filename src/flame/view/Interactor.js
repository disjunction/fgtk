/*jslint node: true */
"use strict";

var cc = require('cc'),
    smog = require('fgtk/smog'),
    Radiopaque = require('radiopaque');

/**
 * opts.layer - cocs2d.nodes.Layer to bind to
 * opts.applier - see ProtagonistApplier below
 * opts.layout = {
 *     states: {
 *          38: "up",
 *          32: ["shoot", "down"]
 *     },
 *
 * 	   events: {
 * 	   		38: {
 * 	   			"keyUp": ["shoot", "up"]
 * 	   		 	"keyDown": ["someEvent"]
 * 	   		}
 * 	   }
 * }
 */

var Interstate = cc.Class.extend({
    ctor: function(){
        this.array = [];
        this.map = {};
        this.enabled = true;
        this.changed = true;
    },

    /**
     * sets/unsets state
     * @param  {string|Array.<string>} key
     * @param  {boolean} value
     */
    set: function(key, value) {
        if (Array.isArray(key)) {
            for (var i = 0; i < key.length; i++) {
                this.set(key[i], value);
            }
            return;
        }

        if (value && !this.map[key]) {
            this.array.push(key);
            this.map[key] = true;
            this.changed = true;
        } else if (!value && this.map[key]) {
            this.array.splice(this.array.indexOf(key), 1);
            this.map[key] = false;
            this.changed = true;
        }
    },
    setArray: function(array) {
        this.array = array;
        var map = {};
        for (var i = 0; i < array.length; i++) {
            map[array[i]] = true;
        }
        this.map = map;
        this.changed = true;
    },
    get: function(key) {
        return this.map[key];
    },
    serialize: function() {
        var serial = [];
        for (var i in this.map) {
            if (this.map[i]) {
                serial.push(i);
            }
        }
        return serial;
    },
    applySerial: function(array) {
        var map = {};
        if (array) {
            for (var i = 0; i < array.length; i++) {
                map[array[i]] = true;
            }
        }
        this.map = map;
    }
});

var Interactor = cc.Class.extend({
    /**
     * @param opts object
     */
    ctor: function(opts) {
        opts = opts || {layout: {states: {}, events: {}}};
    	this.i = new Interactor.Interstate();
    	this.layout = opts.layout;
        this.dispatcher = Radiopaque.create();
    },

    fireEvent: function(eventName, nestedEvent) {
        if (Array.isArray(eventName)) {
            for (var i = 0; i < eventName.length; i++) {
                this.fireEvent(eventName[i]);
            }
            return;
        }

        this.dispatcher.channel(eventName).broadcast(nestedEvent);
    },

    /**
     * extracted as a method to allow consumers to fire it manually
     */
    fireChanged: function() {
        this.dispatcher.channel("interstateChanged").broadcast({
            i: this.i
        });
        this.i.changed = false;
    },

    processEvent: function(name, event) {

        var code = event.keyCode;

        // if it's not keyboard but a mouse
        // the _right_ way is to use getButton(), but who cares...
        if (event._button !== undefined) {
            code = (event._button == 2)? Interactor.RMB : Interactor.LMB;
        }

        if (event._scrollY !== undefined && event._scrollY !== 0 ) {
            code = Interactor.SCROLL;
            name = (event._scrollY > 0)? 'scrollUp' : 'scrollDown';
        }

        if (this.layout.states[code]) {
            switch (name) {
                case "keyDown":
                    this.i.set(this.layout.states[code], true);
                    break;
                case "keyUp":
                    this.i.set(this.layout.states[code], false);
                    break;
            }
            if (this.i.changed) {
                this.fireChanged();
            }
        }

        if (this.layout.events[code] && this.layout.events[code][name]) {
            this.fireEvent(this.layout.events[code][name], event);
        }
    },

    bindToCocos: function(layer) {
        var keyEvt = {keyCode: 0};
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:function(key, event) {
                keyEvt.keyCode = key;
            	this.processEvent("keyDown", keyEvt);
            }.bind(this),
            onKeyReleased:function(key, event) {
            	keyEvt.keyCode = key;
            	this.processEvent("keyUp", keyEvt);
            }.bind(this)
        }, layer);
    },

    bindToJquery: function(object) {
        object.keydown(function(event) {
            this.processEvent('keyDown', event);
        }.bind(this));

        object.keyup(function(event) {
            this.processEvent('keyUp', event);
        }.bind(this));
    },

    bindMouseToCustomCursor: function(jqueryObject, layer) {
        jqueryObject.css({
            cursor: 'none'
        });

        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseMove: function(event){
                this.dispatcher.channel("mouseMove").broadcast(event);
            }.bind(this),
            onMouseUp: function(event){
                this.processEvent("keyUp", event);
            }.bind(this),
            onMouseDown: function(event){
                this.processEvent("keyDown", event);
            }.bind(this),
            onMouseScroll: function(event){
                this.processEvent("mouseScroll", event);
            }.bind(this)
        }, layer);
    }
});

Interactor.Interstate = Interstate;

var keyMap = {
	ARROW_LEFT: 37,
	ARROW_UP: 38,
	ARROW_RIGHT: 39,
	ARROW_DOWN: 40,

    DIGIT_0: 48,
    DIGIT_1: 49,
    DIGIT_2: 50,
    DIGIT_3: 51,
    DIGIT_4: 52,
    DIGIT_5: 53,
    DIGIT_6: 54,
    DIGIT_7: 55,
    DIGIT_8: 56,
    DIGIT_9: 57,

    KEY_A: 65,
	KEY_B: 66,
	KEY_C: 67,
	KEY_D: 68,
	KEY_E: 69,
	KEY_F: 70,
	KEY_G: 71,
	KEY_H: 72,
	KEY_I: 73,
	KEY_J: 74,
	KEY_K: 75,
	KEY_L: 76,
	KEY_M: 77,
	KEY_N: 78,
	KEY_O: 79,
	KEY_P: 80,
	KEY_Q: 81,
	KEY_R: 82,
	KEY_S: 83,
	KEY_T: 84,
	KEY_U: 85,
	KEY_V: 86,
	KEY_W: 87,
	KEY_X: 88,
	KEY_Y: 89,
	KEY_Z: 95,

	SPACE: 32,

    EQUAL: 61,
    CHROME_EQUAL: 187,
    MINUS: 173,
    CHROME_MINUS: 189,

    PRESS_SHARP: 35,

    SHIFT: 16,
    CTRL: 17,

	LMB: 1001,
	RMB: 1002,

    SCROLL: 1010
};
for (var i in keyMap) {
	Interactor[i] = keyMap[i];
}

module.exports = Interactor;
