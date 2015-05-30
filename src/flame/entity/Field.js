/*jslint node: true */
"use strict";

var
    cc    = require('cc'),
    util  = require('smog/util/util');

var Field = cc.Class.extend({
    ctor: function(opts) {
        this.opts = opts || {};
        this.things = [];
        this.size = this.size = {width: 128, height: 128};
    },
    push: function(thing) {
        this.things.push(thing);
    },
    remove: function(thing) {
        util.removeOneFromArray(thing, this.things);
    },
    pushField: function(field) {
        for (var i = 0; i < field.things.length; i++ ) {
            this.things.push(field.things[i]);
        }
    }
});

module.exports = Field;
