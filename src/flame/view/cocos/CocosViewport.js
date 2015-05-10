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

_p.initLayers = function () {
    this.scrolled = this.nb.makeLayer({name: 'scrolled'});
    var sublayers = ['bg', 'shadow', 'obstacle', 'main', 'stuff', 'targets'];

    this.camera = {
        scale: 0.5,
        point: cc.p(0, 0)
    };

    /*
     this.camera.anchor = cc.p(size.width / 2 * this.camera.scale, size.height / 2 * this.camera.scale);
     this.camera.pixelScale = this.camera.scale * this.opts.config.ppm;
     */

    this.scaleCameraTo(this.camera.scale);

    for (var i in sublayers) {
        this.scrolled[sublayers[i]] = this.nb.makeLayer({name: sublayers[i]});
        this.scrolled.addChild(this.scrolled[sublayers[i]]);
        this.scrolled.setScale(this.camera.scale);
    }

    this.hud = this.nb.makeLayer({name: 'hud'});

};

_p.runScene = function (opts) {
    var opts = opts || {};
    var me = this;

    var resources = opts.preload || [];
    cc.game.onStart = function () {
        if (opts.onStart) {
            opts.onStart();
        }

        cc.LoaderScene.preload(resources, function () {
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

_p.getSize = function () {
    return cc.director.getWinSize();
};

_p.popScene = function () {
    cc.director.popScene();
};

_p.renderLayers = function () {
};

/**
 * ugly manual calculation to avoid extra object creation
 * @param float x
 * @param float y
 */
_p.moveCameraToLocationXY = function (x, y) {
    var point = this.camera.point;
    point.x = x;
    point.y = y;
    p1.x = this.camera.anchor.x - x * this.camera.pixelScale;
    p1.y = this.camera.anchor.y - y * this.camera.pixelScale;
    this.scrolled.setPosition(p1);

    // cached values for further reuse
    this.camera.cameraLocation = cc.pMult(cc.pSub(this.camera.anchor, p1), this.camera.pixelScaleRev);
};

_p.scaleCameraTo = function (scale) {
    this.camera.scale = scale;
    this.scrolled.setScale(scale);
    var size = this.getSize();
    this.camera.anchor = cc.p(size.width / 2 * this.camera.scale, size.height / 2 * this.camera.scale);

    // cached values for further reuse
    this.camera.pixelScale = this.camera.scale * this.opts.config.ppm;
    this.camera.pixelScaleRev = 1 / this.camera.pixelScale; // this is used to divide by pixelScale, because we have only cc.pMult
    this.camera.centerShift = cc.pMult({x: size.width, y: size.height}, 0.5 / this.camera.pixelScale);

    // duplicates one in ::moveCameraToLocationXY()
    this.camera.cameraLocation = cc.pMult(cc.pSub(this.camera.anchor, this.scrolled.getPosition()), this.camera.pixelScaleRev);
};

_p.locationToPosition = function (point) {
    return cc.pMult(point, this.opts.config.ppm);
};

_p.targetToScrolledLocation = function (point) {
    var absCorner = cc.pSub(this.camera.cameraLocation, this.camera.centerShift);
    return cc.pAdd(absCorner, cc.pMult(point, this.camera.pixelScaleRev));
};

_p.scrolledLocation2Target = function (point) {
    var absCorner = cc.pSub(this.camera.cameraLocation, this.camera.centerShift),
            result = cc.pMult(cc.pSub(point, absCorner), this.camera.pixelScale);
    return result;
    //return cc.p(Math.round(result.x), Math.round(result.y));  
};

_p.applyAnimation = function (node) {
    if (node.plan && node.plan.compiledAni) {
        node.runAction(node.plan.compiledAni.copy());
    }
};

_p.addNodeToLayer = function (node, layerId) {
    Viewport.prototype.addNodeToLayer.call(this, node, layerId);
    this.applyAnimation(node);
    
};

module.exports = CocosViewport;