/*jslint node: true */
"use strict";

var cc = require('cc'),
    ThingPlanHelper = require('flame/service/ThingPlanHelper');

/**
 * Manages non-asset definitions, such as rover components,
 * items, thing-plans, etc.
 *
 * opts:
 * * resources
 * * dirs
 * @param opts
  */
var CosmosManager = function(opts) {
    this.opts = opts || {resources: {}};
    if (!this.opts.resources) {
        this.opts.resources = {};
    }

    // opts.dirs is only supported in node.js
    if (this.opts.dirs) {
        var jsonlint = require('jsonlint');
        var fs = require('fs');
        var dirs = this.opts.dirs;
        for (var i = 0; i < dirs.length; i++) {
            var dir = fs.realpathSync(dirs[i]),
                execSync = require('exec-sync'),
                stdout =  execSync('find ' + dir + ' | grep .json$'),
                fileList = stdout.split('\n');
            for (var j = 0; j < fileList.length; j++) {
                var fileName = fileList[j].substring(dir.length + 1),
                    fileContents = fs.readFileSync(dir + '/' + fileName, "utf8");
                try {
                    this.opts.resources[fileName] = jsonlint.parse(fileContents);
                } catch (e) {
                    console.log('failed parsing ' + fileName + ' : ' + e);
                }
            }
        }
    }

    this.thingPlanHelper = new ThingPlanHelper({
        cosmosManager: this
    });

};

var _p = CosmosManager.prototype;

_p.getResource = function(path) {
    if (!path) {
        throw new Error('bad path for getResource: ' + path);
    }
    var originalPath = path;
    if (path.substring(path.length - 5) != '.json') {
        path += '.json';
    }

    var result;
    if (this.opts.resources[path]) {
        result = this.opts.resources[path];
    } else if (typeof window == 'undefined') {
        result = this.opts.resources[path] = require(path);
        return this.opts.resources[path];
    } else {
        throw new Error('Resource not found: ' + path);
    }
    if (result.from === undefined) {
        result.from = originalPath;
    }
    return result;
};

/**
 * alias
 */
_p.get = function(path) {
    return this.getResource(path);
};

_p.identifyPlan = function(plan) {
    if (plan.name) return plan.name;
    var node = this.thingPlanHelper.getPrimaryNode(plan);
    if (node.src) return node.src;
    return 'unknown';
};

_p.getAllAssets = function() {
    var result = [];
    for (var i in this.opts.resources) {
        result = result.concat(this.thingPlanHelper.getPlanAssets(this.opts.resources[i]));
    }

    // array_unique
    return result.filter(
        function(val, i, arr)
        {
            return (i <= arr.indexOf(val));
        }
    );
};

_p.getPathsInDirectory = function(path, recursive) {
    var result = [],
        jsonMatch = new RegExp('\.json$'),
        matcher;


    if (recursive) {
        matcher = new RegExp('^' + path + '/');
    } else {
        matcher = new RegExp('^' + path + '/[^/]+$');
    }
    for (var i in this.opts.resources) {
        if (i.match(matcher)) {
            result.push(i.replace(jsonMatch, ''));
        }
    }
    return result;
};

_p.getAllInDirectory = function(path, recursive) {
    var paths = this.getPathsInDirectory(path, recursive),
        result = {};
    for (var i = 0; i < paths.length; i++) {
        result[paths[i]] = this.getResource(paths[i]);
    }
    return result;
};

module.exports = CosmosManager;
