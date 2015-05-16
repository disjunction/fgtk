/*jslint node: true */
"use strict";

var SchedulingQueue = function() {
    this.latestTime = 0;

    // messages, sorted by time
    // each message is an array [time, payload]
    this.messages = [];
};

var _p = SchedulingQueue.prototype;

/**
 * finds the index, which has the schedule > time
 */
_p.findIndex = function(time) {
    for (var i = 0; i < this.messages.length; i++) {
        if (this.messages[i][0] > time) {
            return i;
        }
    }
    return null;
};
_p.schedule = function(time, payload) {
    var message = [time, payload];

    // take advantage of faster push/unshift of V8
    if (time >= this.latestTime || !this.messages.length) {
        this.latestTime = time;
        this.messages.push(message);
    } else if (this.messages[0][0] > time) {
        this.messages.unshift(message);
    } else {
        var i = this.findIndex(time);
        this.messages.splice(i, 0, message); // oh god, i'm soooo slow
    }
};

_p.fetch = function(time) {
    if (!this.messages.length) return null;
    if (this.messages[0][0] <= time) {
        return this.messages.shift()[1];
    }
    return null;
};

/**
 * can be optimized when etire queue is fetched,
 * but why add complexity?
 */
_p.fetchArray = function(time) {
    var message,
        result = [];

    while (true) {
        message = this.fetch(time);
        if (message === null) {
            break;
        } else {
            result.push(message);
        }
    }
    return result;
};

module.exports = SchedulingQueue;
