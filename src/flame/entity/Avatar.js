/*jslint node: true */
"use strict";

var cc = require('cc');

/**
 * Reflection of smog.entity.Sibling in a given FieldEngine
 * opts:
 * * thing
 * * sibling
 */
var Avatar = cc.Class.extend({
    ctor: function(opts) {
        this.opts = opts;
    }
});

module.exports = Avatar;
