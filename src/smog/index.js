module.exports = {
    EMPTY: {},
    entity: {
        Player: require('./entity/Player'),
        Sibling: require('./entity/Sibling')
    },
    app: require('./app'),
    util: {
        EventDispatcher: require('./util/EventDispatcher'),
        SchedulingQueue: require('./util/SchedulingQueue'),
        EventScheduler: require('./util/EventScheduler'),

        UidGenerator: require('./util/UidGenerator'),

        b2p: require('./util/b2p'),
        geo: require('./util/geo'),
        util: require('./util/util')
    }
};
