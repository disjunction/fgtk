var smog = require('smog'),
    util = smog.util,
    SchedulingQueue = util.SchedulingQueue,
    EventScheduler = util.EventScheduler,
    EventDispatcher = util.EventDispatcher;

describe('smog.util.EventScheduler', function() {
    it('works', function(){
        var es = new EventScheduler(
            new EventDispatcher(),
            new SchedulingQueue()
        );

        var test = "?";

        es.scheduleIn(5, {type: "apple"});
        es.scheduleIn(10, {type: "banana"});

        es.eventDispatcher.addListener("banana", function() {
            test = "yello";
        });
        es.eventDispatcher.addListener("apple", function() {
            test = "red";
        });

        es.advance(3);
        expect(test).toBe("?");
        es.advance(3);
        expect(test).toBe("red");
        es.advance(3);
        expect(test).toBe("red");
        es.advance(3);
        expect(test).toBe("yello");
    });
});
