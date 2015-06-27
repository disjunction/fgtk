/*jslint node: true */
"use strict";

function EventScheduler(eventDispatcher, schedulingQueue) {
    this.eventDispatcher = eventDispatcher;
    this.schedulingQueue = schedulingQueue;
    this.timeSum = 0;
}
var _p = EventScheduler.prototype;

_p.scheduleIn = function(dt, event) {
    this.schedulingQueue.schedule(this.timeSum + dt, event);
};

_p.advance = function(dt) {
    this.timeSum += dt;
    while (true) {
        var payload = this.schedulingQueue.fetch(this.timeSum);
        if (!payload) {
            break;
        }
        if (typeof payload == 'function') {
            payload();
        } else {
            this.eventDispatcher.dispatch(payload);
        }
    }
};

module.exports = EventScheduler;
