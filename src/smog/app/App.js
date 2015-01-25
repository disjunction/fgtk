"use strict";

var cc = require('cc');

var App = cc.Class.extend({
    ctor: function App(opts) {
        if (!opts) {
            opts = {
                ppm: 32
            };
        }
        this.config = opts.config || {};
    },

    mergeConfig: function(config) {
        for (var key in config) {
            this.config[key] = config[key];
        }
    }
});

module.exports = App;