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

    findBodyAtLocation: function(l) {
        var aabb = new b2.AABB();
        point.Set(0.001, 0.001);
        aabb.lowerBound = b2.Vec2.Subtract(l, point);
        aabb.upperBound = b2.Vec2.Add(l, point);

        var callback = this.preciseFinder;

        callback.l.Set(l.x, l.y);
        callback.fixture = null;
        this.opts.fe.m.b.world.QueryAABB(callback, aabb);

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
     *
     * @param  {[b2.Vec2]} bottomLeft {x,y}
     * @param  {[b2.Vec2]} topRight {x,y}
     * @return {b2.Fixture|false}
     */
    findBodyInAreaDirty: function(bottomLeft, topRight) {
        var callback = this.dirtyFinder;
        callback.fixture = null;

        var aabb = new b2.AABB();
        aabb.lowerBound = bottomLeft;
        aabb.upperBound = topRight;

        this.opts.fe.m.b.world.QueryAABB(callback, aabb);

        return callback.fixture ? callback.fixture.GetBody() : null;
    }
});

module.exports = ThingFinder;
