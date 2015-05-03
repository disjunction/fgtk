var geo = {},
    PI = Math.PI,
    PI2 = 2 * PI,
    halfPI = PI / 2;

geo.PI = PI;
geo.PI2 = PI2;
geo.halfPI = halfPI;
geo.deg2Rad = PI / 180;
geo.rad2Deg = 180 / PI;

geo.r2d = function(a) {
    return a * geo.rad2Deg;
};

geo.d2r = function(a) {
    return a * geo.deg2Rad;
};

geo.sign = function(v) {
	if (v == 0) return 0;
	return v > 0? 1 : -1;
};

geo.middle = function(p1, p2) {
    return cc.p((p2.x + p1.x) / 2, (p2.y + p1.y) / 2);
};

geo.ccp2Angle = function(point) {
    return Math.atan2(point.y, point.x);
};

geo.segment2Angle = function(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
};


/**
 * converts any angle to [-pi; pi]
 * @param Float a
 * @returns Float
 */
geo.floorAngle = function(a) {
	if (a > PI || a < -PI) {
		a -= Math.floor(a / PI2) * PI2;
		if (a > PI) a -= PI2;
		if (a < -PI) a += PI2;
	}
	return a;
};

/**
 * @param Float a1
 * @param Float a2
 * @returns
 */
geo.closestRotation = function(a1, a2) {
	a1 = geo.floorAngle(a1);
	a2 = geo.floorAngle(a2);
	if ( a1 < -halfPI && a2 > halfPI ) a1 += PI2;
	if ( a1 > halfPI && a2 < -halfPI ) a1 -= PI2;
	return geo.floorAngle(a2 - a1);
};


module.exports = geo;