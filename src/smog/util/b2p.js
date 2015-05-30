/*jslint node: true */
"use strict";

/**
 * b2p stands for "Box2d Plus"
 * Provides some direct hacky performance helpers
 */
var b2p = {};

/**
 * avoid needing to have an extra Vec2 just to assign x and y
 * @param  {b2.Vec2} vec2
 * @param  {float} x
 * @param  {float} y
 */
b2p.assignVec2 = function(vec2, x, y) {
    vec2.x = x;
    vec2.y = y;
};

/**
 * more prompt way to set the body velocity
 * - check for static body is omitted (you don't want ot do it)
 * - more simple check when setting isAwake
 * - avoid replacing one obect with a new one
 *
 * @param  {[type]} body [description]
 * @param  {[type]} x    [description]
 * @param  {[type]} y    [description]
 * @return {[type]}      [description]
 */
b2p.assignLinearVelocity = function(body, x, y) {
	if (x !== 0.0 && y !== 0.0) {
		body.SetAwake(true);
	}
	b2p.assignVec2(body.m_linearVelocity, x, y);
};

module.exports = b2p;
