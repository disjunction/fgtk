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

var _p = CocosViewport.prototype;


_p.initLayers = function() {
    this.scrolled = this.nb.makeLayer({name: 'scrolled'});
    var sublayers = ['bg', 'obstacle', 'main', 'stuff', 'targets'];
    for (var i in sublayers) {
        this.scrolled[sublayers[i]] =  this.nb.makeLayer({name: sublayers[i]});
        this.scrolled.addChild(this.scrolled[sublayers[i]]);
    }
    
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
    
    /*
    this.scrolled = this.nb.makeLayer({name: 'scrolled'});
    var sublayers = ['bg', 'obstacle', 'main', 'stuff', 'targets'];
    for (var i in sublayers) {
        this.scrolled[sublayers[i]] =  this.nb.makeLayer({name: sublayers[i]});
        this.scrolled.addChild(this.scrolled[sublayers[i]]);
    }
    */
};

_p.popScene = function() {
    cc.director.popScene();
}

_p.renderLayers = function() {
    /*
    var me = this;
    cc.game.onStart = function(){
        var MyScene = cc.Scene.extend({
            onEnter: function () {
                this._super();
                this.addChild(me.scrolled, 0);
            }
        });
        cc.director.setDisplayStats(true);                
        cc.director.runScene(new MyScene());
    };
    cc.game.run(this.opts.canvasId);
    */
};

module.exports = CocosViewport;