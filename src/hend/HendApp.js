"use strict";

var cc = require('cc'),
    flame = require('flame');

var HendApp = cc.Class.extend({
   ctor: function(opts) {
       opts = opts || {};
       this.opts = opts;
       this.webpage = opts.webpage || new flame.view.Webpage(opts)
   }
});

module.exports = HendApp;