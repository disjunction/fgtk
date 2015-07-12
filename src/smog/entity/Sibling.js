/*jslint node: true */
"use strict";

function Sibling(opts) {
    if (!opts || !opts.siblingId) {
        throw new Error('siblingId is required in Sibling ctor');
    }
    this.siblingId = opts.siblingId;

    if (!opts.playerId) {
        throw new Error('playerId is required in Sibling ctor');
    }
    this.playerId = opts.playerId;

    this.name = opts.name || 'Anonymous ' + this.id;
    this.settings = {};
}

module.exports = Sibling;
