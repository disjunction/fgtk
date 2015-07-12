/*jslint node: true, browser: true */
"use strict";

var cc = require('cc'),
    smog = require('fgtk/smog'),
    EventDispatcher = smog.util.EventDispatcher,
    util = smog.util.util;

var Webpage = cc.Class.extend({
    ctor: function(opts) {
        if (!opts) opts = {};
        if (opts.window) {
                this.window = opts.window;
        } else if (window) {
                this.window = window.parent;
        } else {
                throw new Error('window object not provided and not found in global scope');
        }
        this.eventDispatcher = new EventDispatcher();
    },

    updateSiblnigFromLocalStorage: function(sibling) {
        if (!localStorage) return;
        var stored = localStorage.getItem('dispace-sibling-settings');
        if (!stored) return;
        stored = JSON.parse(stored);
        sibling.settings = util.combineObjects(sibling.settings, stored);
    },

    persistSibling: function(sibling) {
        if (!localStorage) return;
        var stored = JSON.stringify(sibling.settings);
        localStorage.setItem('dispace-sibling-settings', stored);
    },
    _params: null,
});

var _p = Webpage.prototype;

cc.defineGetterSetter(_p, 'host', function() {
    var url = this.window.location.href;
        /https?:\/\/([^\/]+)/.exec(url);
    return RegExp.$1;
}, function(v) {
    throw new Error('Webpage.host setter unsupported');
});

cc.defineGetterSetter(_p, '$', function() {
    if (typeof this.window.$ != 'undefined') {
        return this.window.$;
    }
    throw new Error('jQuery not found in window');
}, function(v) {
    throw new Error('Webpage.$ setter unsupported');
});

cc.defineGetterSetter(_p, 'params', function() {
    if (this._params === null) {
            this._params = {};
            var match,
                pl     = /\+/g,  // Regex for replacing addition symbol with a space
                search = /([^&=]+)=?([^&]*)/g,
                decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
                query  = this.window.location.search.substring(1);
        while (match = search.exec(query)) {
            this._params[decode(match[1])] = decode(match[2]);
        }
    }
    return this._params;
}, function(v) {
    throw new Error('Webpage.params setter unsupported');
});

module.exports = Webpage;
