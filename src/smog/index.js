/*
exports.entity = {};
exports.entity.Credential = require('./entity/Credential');
exports.entity.Player = require('./entity/Player');
*/

module.exports = {
    EMPTY: {},
    app: require('./app'),
    util: {
        EventDispatcher: require('./util/EventDispatcher'),
        SchedulingQueue: require('./util/SchedulingQueue'),
        UidGenerator: require('./util/UidGenerator'),
        geo: require('./util/geo'),
        util: require('./util/util')
    }
};
