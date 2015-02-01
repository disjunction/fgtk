function FabricLayer(opts) {
    this.opts = opts;
    this.nodes = [];
}

var _p = FabricLayer.prototype;

_p.addChild = function(child) {
    this.nodes.push(child);
    child.layer = this.opts.name;
};

_p.render = function(nb) {
    for (var i in this.nodes) {
        nb.addToCanvas(this.nodes[i]);
    }
};

module.exports = FabricLayer;