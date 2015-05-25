/*jslint node: true */
"use strict";

var cc = require('cc'),
    b2 = require('jsbox2d');


/**
 * opts:
 * * fe
 * @param opts
  */
var ThingFinder = cc.Class.extend({
    ctor: function(opts) {
        this.opts = opts;
    },

    findBodyAtLocation: function(l) {

        function QueryCallback(l) {
            this.l = l;
            this.fixture = null;
        }

        QueryCallback.prototype = {
            ReportFixture: function(fixture) {
                var body = fixture.GetBody();
                        var inside = fixture.TestPoint(this.l);
                        if (inside) {
                                this.fixture = fixture;
                                // We are done, terminate the query.
                                return false;
                        }
                // Continue the query.
                return true;
            }
        };

        var aabb = new b2.AABB();
        var d = new b2.Vec2();
        d.Set(0.001, 0.001);
        aabb.lowerBound = b2.Vec2.Subtract(l, d);
        aabb.upperBound = b2.Vec2.Add(l, d);

        var callback = new QueryCallback(l);
        this.opts.fe.m.b.world.QueryAABB(callback, aabb);

        if (callback.fixture) {
            return callback.fixture.GetBody();
        }

        return null;
    },

    findThingAtLocation: function(l) {
        var body = this.findBodyAtLocation(l);
        if (body) {
            var thing = body.GetUserData();
            return thing;
        }
        return null;
    }
});

module.exports = ThingFinder;
