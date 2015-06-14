/*jslint node: true */
"use strict";

function Player(opts) {
    if (!opts || !opts.playerId) {
        throw new Error('playerId is required in Sibling ctor');
    }
    this.playerId = opts.playerId;

    switch (true) {
        case opts.shared:
            this.method = 'shared';
            break;
        case opts.login !== undefined:
            this.method = 'login';
            this.login = opts.login;
            break;
        case opts.email !== undefined:
            this.method = 'email';
            this.email = opts.email;
            break;
        default:
            throw new Error('can not find sign in method');
    }
}

module.exports = Player;
