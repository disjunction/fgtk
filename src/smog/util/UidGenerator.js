/*jslint node: true */
"use strict";

var dictionary = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

/**
 * recursive, packs int to base64 form
 * @param {type} int
 * @returns {packInt@pro;dictionary@call;substring}
 */
function packInt(int) {
    var remainder = int % dictionary.length,
        letter = dictionary.substring(remainder, remainder + 1);
    if (remainder != int) {
        return packInt(Math.floor(int / dictionary.length)) + letter;
    } else {
        return letter;
    }
}

/**
 * Generates compact readble unique IDs within script lifetime
 * @param string prefix
 * @param int seed
 */
function UidGenerator(prefix, seed) {
    this.prefix = prefix || '';
    this.counter = seed || 0;

    this.getNext = function() {
        return this.prefix + packInt(this.counter++);
    };
}

module.exports = UidGenerator;
