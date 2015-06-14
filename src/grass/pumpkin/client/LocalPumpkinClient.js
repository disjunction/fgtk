/*jslint node: true, esnext: true */
"use strict";

var smog = require('fgtk/smog');

function LocalPumpkinClient(opts) {
    this.opts = opts;
    this.anonymousUidGenerator = new smog.util.UidGenerator('anon_');
}
var _p = LocalPumpkinClient.prototype;

_p.getSharedPlayer = function() {
    if (!this.sharedPlayer) {
        this.sharedPlayer = new smog.entity.Player({
            shared: true,
            playerId: 'p_shared'
        });
    }
    return this.sharedPlayer;
};

_p.makeAnonymousSibling = function() {
    var siblingId = this.anonymousUidGenerator.getNext(),
        sharedPlayer = this.getSharedPlayer();
    var sibling = new smog.entity.Sibling({
        siblingId: siblingId,
        playerId: sharedPlayer.playerId
    });
    return sibling;
};

_p.createAnonymousSibling = function() {
    var promise = new Promise(function(resolve, reject) {
        resolve(this.makeAnonymousSibling());
    }.bind(this));
    console.log('promise created');
    return promise;
};

module.exports = LocalPumpkinClient;
