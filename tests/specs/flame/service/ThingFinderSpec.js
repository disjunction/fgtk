/*jslint node: true, jasmine:true */
"use strict";

var b2 = require('jsbox2d'),
    flame = require('flame'),
    BodyBuilder = flame.engine.BodyBuilder,
    FieldEngine = flame.engine.FieldEngine,
    fixtures = require('fgtk_tu/fixtures');

describe('flame.service.ThingFinder', function() {
    var fe = fixtures.makeFeBox2d(),
        b = fe.m.b;

    it('check: findBodyAtLocation() and findThingAtLocation()', function() {

        b.makeWorld();

        var plan = fe.opts.cosmosManager.get('thing/rover/hull/hull_5x2'),
            t1 = new flame.entity.Thing({
                plan: plan,
                l: {x: 7, y: 3}
            }),
            t2 = new flame.entity.Thing({
                plan: plan,
                l: {x: 20, y: 3}
            });

        var body1 = b.embody(t1),
            body2 = b.embody(t2);

        var thingFinder = new flame.service.ThingFinder({
            fe: fe
        });

        var result;

        result = thingFinder.findBodyAtLocation({x: 0, y: 0});
        expect(result).toBe(null);

        result = thingFinder.findBodyAtLocation({x: 7, y: 3});
        expect(typeof result).toBe('object');

        result = thingFinder.findThingAtLocation({x: 7, y: 3});
        expect(result).toBe(t1);
    });

    it('check: checkRectEmpty', function() {

        b.makeWorld();

        var plan = fe.opts.cosmosManager.get('thing/rover/hull/hull_5x2'),
            t1 = new flame.entity.Thing({
                plan: plan,
                l: {x: 7, y: 3}
            }),
            t2 = new flame.entity.Thing({
                plan: plan,
                l: {x: 20, y: 3}
            });

        var body1 = b.embody(t1),
            body2 = b.embody(t2);

        var thingFinder = new flame.service.ThingFinder({
            fe: fe
        });

        var result;

        // complete inclusion
        result = thingFinder.findBodyInAreaDirty({x: 7, y: 3}, {x: 12, y: 5});
        expect(result).not.toBe(null);

        // partial inclusion
        result = thingFinder.findBodyInAreaDirty({x: 6, y: 2}, {x: 12, y: 5});
        expect(result).not.toBe(null);

        // no intersection
        result = thingFinder.findBodyInAreaDirty({x: 7, y: 33}, {x: 34, y: 9});
        expect(result).toBe(null);
    });
});
