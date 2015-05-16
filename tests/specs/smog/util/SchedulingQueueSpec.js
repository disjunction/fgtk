var smog = require('smog'),
    SchedulingQueue = smog.util.SchedulingQueue;

describe('smog.util.SchedulingQueue', function() {
    it('check: basic push and shift', function(){
        var q = new SchedulingQueue();
        q.schedule(10, "banana");
        expect(q.fetch(15)).toBe("banana");
    });

    it('returns messages in the right order', function(){
        var q = new SchedulingQueue();
        q.schedule(5, "apple");
        q.schedule(7, "banana");
        q.schedule(1, "orange");
        q.schedule(3, "tomato");

        expect(q.fetch(10)).toBe("orange");
        expect(q.fetch(10)).toBe("tomato");
        expect(q.fetch(10)).toBe("apple");
        expect(q.fetch(10)).toBe("banana");
    });

    it('returns null when empty or no matches', function(){
        var q = new SchedulingQueue();
        q.schedule(5, "apple");
        q.schedule(7, "banana");

        expect(q.fetch(1)).toBeNull();
        expect(q.fetch(10)).not.toBeNull();
        expect(q.fetch(10)).not.toBeNull();
        expect(q.fetch(10)).toBeNull();
    });

    it('check: fetchArray()', function(){
        var q = new SchedulingQueue();
        q.schedule(5, "apple");
        q.schedule(7, "banana");
        q.schedule(1, "orange");
        q.schedule(3, "tomato");

        expect(q.fetchArray(4)).toEqual(
            ["orange", "tomato"]
        );
    });

});
