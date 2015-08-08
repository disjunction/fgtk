var flame = require('flame'),
    Interactor = flame.view.Interactor;

describe ('flame.view.Interactor', function() {
    describe('Interactor.Interstate', function() {
        it('sets/unsets states correctly', function() {
            var i = new Interactor.Interstate();
            i.set('a', true);
            i.set('b', true);
            expect(i.array).toEqual(['a', 'b']);
            expect(i.map).toEqual({a: true, b: true});

            i.set('a', false);
            expect(i.array).toEqual(['b']);
            expect(i.map).toEqual({a: false, b: true});

            i.set(['a', 'c'], true);
            expect(i.array).toEqual(['b','a','c']);
            expect(i.map).toEqual({a: true, b: true, c:true});
        });
    });

    it('switches states when processing events', function(done) {
        var layout = {states:{}, events:{}};
        layout.states[Interactor.KEY_A] = ["a", "aa"];
        layout.states[Interactor.KEY_B] = ["b"];
        layout.states[Interactor.LMB] = ["c"];
        var interactor = new Interactor({
            layout: layout
        });

        interactor.dispatcher.channel('interstateChanged').subscribe(function() {
            done();
        });

        interactor.processEvent("keyDown", {keyCode: Interactor.KEY_A});
        expect(interactor.i.map.a).toBe(true);

        interactor.processEvent("keyDown", {keyCode: Interactor.KEY_B});
        expect(interactor.i.map.b).toBe(true);

        interactor.processEvent("keyUp", {keyCode: Interactor.KEY_A});
        expect(interactor.i.map.a).toBe(false);
        expect(interactor.i.map.b).toBe(true);

        interactor.processEvent("keyUp", {keyCode: Interactor.KEY_B});
        expect(interactor.i.map.a).toBe(false);
        expect(interactor.i.map.b).toBe(false);
    });

    describe('events firing', function() {
        var layout, interactor;
        beforeEach(function() {
            layout = {states:{}, events:{}};
            layout.events[Interactor.KEY_A] = {};
            layout.events[Interactor.KEY_A].keyDown = ["a-down"];
            layout.events[Interactor.KEY_A].keyUp = ["a-up", "aa-up"];
            interactor = new Interactor({
                layout: layout
            });
        });

        it ('fires an event for keyDown', function(done) {
            interactor.dispatcher.channel('a-down').subscribe(function() {
                done();
            });
            interactor.processEvent("keyDown", {keyCode: Interactor.KEY_A});
        });

        it ('fires two events for keyUp', function(done) {
            var count = 0;
            interactor.dispatcher.channel('a-up').subscribe(function() {
                count++;
            });
            interactor.dispatcher.channel('aa-up').subscribe(function() {
                count++;
                expect(count).toBe(2);
                done();
            });
            interactor.processEvent("keyUp", {keyCode: Interactor.KEY_A});
        });
    });
});
