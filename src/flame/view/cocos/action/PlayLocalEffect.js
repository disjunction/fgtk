/*jslint node: true */
"use strict";

var cc = require('cc'),
    PlayEffect = require('./PlayEffect');

/**
 * plays an effect sound
 * which is heard only when viewport si close to thing
 */
var PlayLocalEffect = PlayEffect.extend({
    update:function (dt) {
        if (this.target.backlink) {
            var viewport = this.target.backlink.fe.m.c.opts.viewport,
                l = this.target.backlink.thing.l;
            viewport.playLocalEffect(l, this._effectUrl);
        }
    }
});

PlayLocalEffect.create = function(effectSrc) {
    return new PlayLocalEffect(effectSrc);
};

module.exports = PlayLocalEffect;
