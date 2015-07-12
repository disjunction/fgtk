/*jslint node: true */
"use strict";

var cc = require('cc'),
    AbstractCocosNode = require('flame/view/cocos/plans/AbstractCocosNode');

var ContainerCocosNode = AbstractCocosNode.extend({
    makeNode: function() {
        return cc.Node.create();
    }
});

module.exports = ContainerCocosNode;
