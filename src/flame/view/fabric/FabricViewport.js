"use strict";

var cc = require('cc'),
    Viewport = require('flame/view/Viewport');


var FabricViewport = Viewport.extend({
});

var _p = FabricViewport.prototype;

_p.initLayers = function() {
    this.scrolled = {
        bg: this.nb.makeLayer({name: 'bg'}),
        obstacle: this.nb.makeLayer({name: 'obstacle'}),
        main: this.nb.makeLayer({name: 'main'}),
        stuff: this.nb.makeLayer({name: 'stuff'}),
        targets: this.nb.makeLayer({name: 'targets'})
    };
};

_p.renderLayers = function() {
    for (var i in this.scrolled) {
        this.scrolled[i].render(this.opts.nb);
    }
};


module.exports = FabricViewport;