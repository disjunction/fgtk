/*
exports.entity = {};
exports.entity.Credential = require('./entity/Credential');
exports.entity.Player = require('./entity/Player');
*/

module.exports = {
    EMPTY: {},
    
    app: new (require('./app/App')),
    util: {
        EventDispatcher: require('./util/EventDispatcher'),
        UidGenerator: require('./util/UidGenerator')
    }
};