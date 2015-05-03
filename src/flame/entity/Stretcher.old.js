"use strict";

var Thing  = require('./Thing'),
    geo    = require('pointExtension'),
    ccp    = geo.ccp;

/**
 * visual thing, binding 2 other things
 */
function Stretcher(opts) {
	Stretcher.superclass.constructor.call(this, opts);
}

Stretcher.inherit(Thing, {
	nobody: true,
	
	// this tells default FieldEngine to support actual state of the stretcher
	group: 'stretcher',
	
	stretch: {
		method: 'scale',
		start: {
			thing: null,
			anchor: {point: ccp(0,0)},
			follow: true
		},
		end: {
			thing: null,
			anchor: {point: ccp(0,0)},
			follow: true
		}
	},
	
	_getAnchorLocation: function(thing, anchor) {
		return anchor? geo.ccpAdd(thing.location, anchor.point) : thing.location;
	},
	
	get startLocation() {
		return this._getAnchorLocation(this.stretch.start.thing, this.stretch.start.anchor);
	},
	
	get endLocation() {
		return this._getAnchorLocation(this.stretch.end.thing, this.stretch.end.anchor);
	},
	
	get middleLocation() {
		return geo.ccp((this.startLocation.x + this.endLocation.x) / 2,
					   (this.startLocation.y + this.endLocation.y) / 2);
	}
});

module.exports = Stretcher;


/**
 * special initialization for Stretcher things (ropes, lasers)
 * @param Sretcher thing
 * @param node
 */
ThingNodeBuilder.prototype.stretchScaleRotate = function(thing, node) {
	if (!node.initialSize) {
		// size  has to be clone, otherwise we don't know how to resize each time
		node.initialSize = jsein.clone(node._boundingBox.size);
	}
	var angle = Math.atan2(thing.endLocation.y - thing.startLocation.y, thing.endLocation.x - thing.startLocation.x),
		distance = geo.ccpDistance(thing.startLocation, thing.endLocation);
	node.scaleX = distance * config.ppm / node.initialSize.width;
	node.rotation = geo.r2d(-angle);
};

/**
 * helper method for stretcher movement
 * @param Stretcher thing
 * @param node
 */
ThingNodeBuilder.prototype.stretchPlaceNode = function(thing, node) {
	this.placeNode(node, thing.middleLocation);
};

/**
 * commonly used wrapper around ::stretchScaleRotate()
 * @param Stretcher thing
 * @param node
 */
ThingNodeBuilder.prototype.stretchUpdateNode = function(thing, node) {
	thing.location = thing.middleLocation;
	this.stretchScaleRotate(thing, node);
};

/**
 * initialization for composite stretchers
 * @param thing
 */
ThingNodeBuilder.prototype.stretch = function(thing) {
	for (var key in thing.nodes) {
		this.stretchUpdateNode(thing, thing.nodes[key]);
	}
};