/*jslint node: true */
"use strict";

var flame = require('flame'),
    FieldEngine = flame.engine.FieldEngine,
    Thing = flame.entity.Thing,
    ThingBuilder = flame.service.ThingBuilder;

module.exports = {
    makeConfig: function() {
        return {ppm: 32};
    },

    makeAssetManager: function() {
        return new flame.service.AssetManager({resources: {
            'unittest/placeholder_5x2.png' : {
                width: 160,
                height: 64
            }
        }});
    },

    makeCosmosManager: function() {
        var dir = __dirname + '/../cosmos';
        return new flame.service.CosmosManager({
            dirs: [
                dir
            ]
        });
    },

    makeFeBox2d: function() {
        var am = module.exports.makeAssetManager(),
            cm = module.exports.makeCosmosManager(),
            tb = new ThingBuilder();
        var fe = new FieldEngine({
                config: {ppm: 32},
                assetManager: am,
                cosmosManager: cm,
                thingBuilder: tb
            });

        fe.registerModule(new flame.engine.ModuleBox2d({
            cosmosManager: cm,
            assetManager: am,
            config: {ppm: 32}
        }), 'b');

        fe.m.b.makeWorld();

        return fe;
    }
};
