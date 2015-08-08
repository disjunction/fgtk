/*jslint node: true */
"use strict";

var cc = require('cc'),
    b2 = require('jsbox2d');


var point = new b2.Vec2();

/**
 * opts:
 * * fe
 * @param opts
  */
var ThingFinder = cc.Class.extend({
    ctor: function(opts) {
        this.opts = opts;

        this.dirtyAllFinder = {
            fixtures: [],
            ReportFixture: function(fixture) {
                this.fixtures.push(fixture);
                return true;
            }
        };

        this.dirtyFinder = {
            fixture: null,
            ReportFixture: function(fixture) {
                this.fixture = fixture;
                return false;
            }
        };

        this.preciseFinder = {
            l: new b2.Vec2(),
            fixture: null,
            ReportFixture: function(fixture) {
                var body = fixture.GetBody(),
                    inside = fixture.TestPoint(this.l);
                if (inside) {
                    this.fixture = fixture;
                    // We are done, terminate the query.
                    return false;
                }
                // Continue the query.
                return true;
            }
        };
    },

    doAABBQuery: function(lowerBound, upperBound, callback) {
        var aabb = new b2.AABB();
        aabb.lowerBound = lowerBound;
        aabb.upperBound = upperBound;
        this.opts.fe.m.b.world.QueryAABB(callback, aabb);
    },

    findBodyAtLocation: function(l) {
        var callback = this.preciseFinder;
        callback.l.Set(l.x, l.y);
        callback.fixture = null;

        point.Set(0.001, 0.001);

        this.doAABBQuery(b2.Vec2.Subtract(l, point), b2.Vec2.Add(l, point), callback);

        return callback.fixture ? callback.fixture.GetBody() : null;
    },

    findThingAtLocation: function(l) {
        var body = this.findBodyAtLocation(l);
        if (body) {
            var thing = body.GetUserData();
            return thing;
        }
        return null;
    },

    /**
     * @param  {[b2.Vec2]} bottomLeft {x,y}
     * @param  {[b2.Vec2]} topRight {x,y}
     * @return {b2.Fixture|false}
     */
    findBodyInAreaDirty: function(bottomLeft, topRight) {
        var callback = this.dirtyFinder;
        callback.fixture = null;

        this.doAABBQuery(bottomLeft, topRight, callback);

        return callback.fixture ? callback.fixture.GetBody() : null;
    },


    // NOT TESTED!!!!
    findThingInAreaDirty: function(bottomLeft, topRight) {
        var body = this.findBodyInAreaDirty(bottomLeft, topRight);
        if (body) {
            var thing = body.GetUserData();
            return thing;
        }
        return null;
    },

    findAllBodiesInAreaDirty: function(bottomLeft, topRight) {
        var callback = this.dirtyAllFinder;
        callback.fixtures = [];

        this.doAABBQuery(bottomLeft, topRight, callback);

        var bodies = [];
        callback.fixtures.forEach(function(fixture) {
            bodies.push(fixture.GetBody());
        });

        return bodies;
    },

    findAllThingsInAreaDirty: function(bottomLeft, topRight) {
        var things = [],
            bodies = this.findAllBodiesInAreaDirty(bottomLeft, topRight);

        bodies.forEach(function(body) {
            var thing = body.GetUserData();
            if (thing) {
                things.push(thing);
            }
        });
        return things;
    },
});

module.exports = ThingFinder;
