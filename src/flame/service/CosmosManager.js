var cc = require('cc'),
    ThingPlanHelper = require('flame/service/ThingPlanHelper');

/**
 * opts:
 * * resources
 * @param opts
  */
var CosmosManager = function(opts) {
    this.opts = opts || {resources: {}};
    if (!this.opts.resources) {
        this.opts.resources = {};
    }

    // opts.dirs is only supported in node.js
    if (this.opts.dirs) {
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
                this.opts.resources[fileName] = JSON.parse(fileContents);
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
    if (path.substring(path.length - 5) != '.json') {
        path += '.json';
    }

    if (this.opts.resources[path]) {
        return this.opts.resources[path];
    } else if (typeof window == 'undefined') {
        this.opts.resources[path] = require(path);
        return this.opts.resources[path];
    } else {
        throw new Error('Resource not found: ' + path);
    }
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

module.exports = CosmosManager;
