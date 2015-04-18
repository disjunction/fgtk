"use strict";

var cc = require('cc'),
    Viewport = require('flame/view/Viewport');

/** Used as a structured container for visual elements; encapsulates node factory and layers
 * opts:
 * * nb - node builder
 * * director - cc.director
 * * game - cc.game
 * * canvasId string
 */
var CocosViewport = Viewport.extend({
});

// reusable point objects
var p1 = cc.p(0, 0),
    p2 = cc.p(0, 0);
    
var _p = CocosViewport.prototype;

_p.initLayers = function() {
    this.scrolled = this.nb.makeLayer({name: 'scrolled'});
    var sublayers = ['bg', 'shadow', 'obstacle', 'main', 'stuff', 'targets'];

    var size = this.getSize();

    this.camera = {
        scale: 0.5,
        point: cc.p(0, 0)
    };
    this.camera.anchor = cc.p(size.width / 2 * this.camera.scale, size.height / 2 * this.camera.scale);
    
    
    for (var i in sublayers) {
        this.scrolled[sublayers[i]] =  this.nb.makeLayer({name: sublayers[i]});
        this.scrolled.addChild(this.scrolled[sublayers[i]]);
        this.scrolled.setScale(this.camera.scale);
    }
    
    this.hud = this.nb.makeLayer({name: 'hud'});
 
};

_p.runScene = function(opts) {
    var opts = opts || {};
    var me = this;
    
    var resources = opts.preload || [];
    cc.game.onStart = function(){
        if (opts.onStart) {
            opts.onStart();
        }
        
        cc.LoaderScene.preload(resources, function() {
            me.SceneClass = cc.Scene.extend({
                onEnter: function () {
                    this._super();
                    me.initLayers();
                    this.addChild(me.scrolled, 0);
                    this.addChild(me.hud, 0);
                    if (opts.onRun) {
                        opts.onRun();
                    }

                    if (opts.onUpdate) {
                        var mainLayer = me.scrolled;
                        mainLayer.update = opts.onUpdate;
                        mainLayer.scheduleUpdate();
                    }
                }
            });
            me.scene = new me.SceneClass();

            cc.director.setDisplayStats(true);
            cc.director.runScene(me.scene);
        });
    };
    cc.game.run(this.opts.canvasId);
};

_p.getSize = function() {
    return cc.director.getWinSize();
};

_p.popScene = function() {
    cc.director.popScene();
};

_p.renderLayers = function() {
};

/**
 * ugly manual calculation to avoid extra object creation
 * @param float x
 * @param float y
 */
_p.moveCameraToLocationXY = function(x, y) {
    var point = this.camera.point;
    point.x = x;
    point.y = y;
    var pixelScale = this.camera.scale * this.opts.config.ppm;
    p1.x = this.camera.anchor.x - x * pixelScale;
    p1.y = this.camera.anchor.y - y * pixelScale;
    this.scrolled.setPosition(p1);
};

_p.scaleCameraTo = function(scale) {
    this.camera.scale = scale;
    this.scrolled.setScale(scale);
    var size = this.getSize();
    this.camera.anchor = cc.p(size.width / 2 * this.camera.scale, size.height / 2 * this.camera.scale);
};

_p.locationToPosition = function(point) {
    return cc.pMult(point, this.opts.config.ppm);
};

module.exports = CocosViewport;