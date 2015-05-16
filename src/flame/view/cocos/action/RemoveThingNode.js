/*jslint node: true */ "use strict";

var cc = require('cc');

var RemoveThingNode = cc.ActionInstant.extend({
     _isNeedCleanUp: true,
    ctor:function(isNeedCleanUp){
        cc.FiniteTimeAction.prototype.ctor.call(this);
        if (isNeedCleanUp !== undefined) {
            this.init(isNeedCleanUp);
        }
    },
    update:function(dt){
        if (this.target.backlink && this.target.backlink.state) {
            //this.target.backlink.state.nodes) {
            //
            //}
        }

        //this.target.removeFromParent(this._isNeedCleanUp);
    },
    /**
     * Initialization of the node, please do not call this function by yourself, you should pass the parameters to constructor to initialize it.
     * @param isNeedCleanUp
     * @returns {boolean}
     */
    init:function(isNeedCleanUp){
        this._isNeedCleanUp = isNeedCleanUp;
        return true;
    },
    reverse:function(){
        return new RemoveThingNode(this._isNeedCleanUp);
    },
    clone:function(){
        return new RemoveThingNode(this._isNeedCleanUp);
    }
});

module.exports = RemoveThingNode;
