"use strict";

var EventDispatcher = function() {
	this.listeners = {};
};

EventDispatcher.prototype.addListener = function (type, listener) {
	if (typeof this.listeners[type] == "undefined"){
		this.listeners[type] = [];
	}
	this.listeners[type].push(listener);
};

EventDispatcher.prototype.dispatch = function(event){
	if (typeof event == "string"){
		event = { type: event };
	}
	if (!event.target){
		event.target = this;
	}
	if (!event.type){  //false
		throw new Error("Event object missing 'type' property.");
	}

	if (typeof this.listeners[event.type] != 'undefined'){
		var listeners = this.listeners[event.type];
		for (var i=0, len=listeners.length; i < len; i++){
			listeners[i].call(this, event);
		}
	}
};

EventDispatcher.prototype.removeListener = function(type, listener){
	if (this.listeners[type] instanceof Array){
		var listeners = this.listeners[type];
		for (var i=0, len=listeners.length; i < len; i++){
			if (listeners[i] === listener){
				listeners.splice(i, 1);
				break;
			}
		}
	}
}

module.exports = EventDispatcher;