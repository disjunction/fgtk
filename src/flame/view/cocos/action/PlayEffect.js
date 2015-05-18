/*jslint node: true */
"use strict";

var cc = require('cc'),
    app = require('smog/app');

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
        // do not clone, nothing can't be cahnged anyway
        return this;
    }
});

PlayEffect.create = function(effectSrc) {
    return new PlayEffect(effectSrc);
};

module.exports = PlayEffect;