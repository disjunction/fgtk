/*jslint node: true */
"use strict";

var cc = require('cc'),
    app = require('smog/app');

/**
 * plays an effect sound which is heard globally
 */
var PlayEffect = cc.ActionInstant.extend({
    _effectSrc: "",
    ctor: function(effectSrc) {
        this._effectUrl = app.assetManager.resolveSrc(effectSrc);
    },
    update:function (dt) {
        cc.audioEngine.playEffect(this._effectUrl);
    },
    reverse:function () {
        return new cc.Hide();
    },
    clone:function(){
        // do not clone, nothing can't be changed anyway
        return this;
    }
});

PlayEffect.create = function(effectSrc) {
    return new PlayEffect(effectSrc);
};

module.exports = PlayEffect;
