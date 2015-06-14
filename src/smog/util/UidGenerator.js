/*jslint node: true */
"use strict";

var dictionary = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    dictLength = dictionary.length;

/**
 * recursive, packs int to base64 form
 * @param {int} int
 * @returns {string}
 */
function packInt(int) {
    var remainder = int % dictionary.length,
        letter = dictionary.charAt(remainder);
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
