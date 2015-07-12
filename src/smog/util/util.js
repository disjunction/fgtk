/*jslint node: true */
"use strict";

var util = {};

/**
 * removes the first occurence of one in an array
 */
util.removeOneFromArray= function(one, array) {
    var pos = array.indexOf(one);
    if (pos >= 0) {
        return array.splice(pos, 1);
    }
    return array;
};

/**
 * creates a new object containing propertis of o1 and o2
 * o2 overwrites o1 if properties are the same
 */
util.combineObjects= function(o1, o2) {
    var o3 = {}, i;
    if (o1) for (i in o1) o3[i] = o1[i];
    if (o2) for (i in o2) o3[i] = o2[i];
    return o3;
};

/**
 * Returns a random element of an array
 * @param  {Array} array
 * @return {mixed|null}
 */
util.randomElement = function(array) {
    if (!array.length) {
        return null;
    }
    return array[Math.floor(Math.random() * array.length)];
};

module.exports = util;
