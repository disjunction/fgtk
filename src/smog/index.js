module.exports = {
    EMPTY: {},
    app: require('./app'),
    util: {
        EventDispatcher: require('./util/EventDispatcher'),
        SchedulingQueue: require('./util/SchedulingQueue'),
        EventScheduler: require('./util/EventScheduler'),

        UidGenerator: require('./util/UidGenerator'),
        geo: require('./util/geo'),
        util: require('./util/util')
    }
};
