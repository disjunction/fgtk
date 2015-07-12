/*jslint node: true */
"use strict";

/**
 * cospeak is a json-based definition language
 * used for "cosmos" resources. Primarily for the things
 */
function Cospeak() {}

/**
 * abstracts both formats of point definition as:
 * * [x, y]
 * * {x: x, y: y}
 * @param  {mixed} def
 * @return {cc.Point}
 */
Cospeak.readPoint = function(def) {
    if (Array.isArray(def)) {
        return {x: def[0], y: def[1]};
    }
    return def;
};

/**
 * abstracts size definition as:
 * * int - a quadrat or circle is assumed in this case
 * * [width, height]
 * * {width: width, height: y}
 * @param  {mixed} def
 * @return {cc.Size}
 */
Cospeak.readSize = function(def) {
    if (Array.isArray(def)) {
        return {width: def[0], height: def[1]};
    }
    if (isFinite(def)) {
        return {width: def, height: def};
    }
    return def;
};

module.exports = Cospeak;
