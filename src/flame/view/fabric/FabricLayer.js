function FabricLayer() {
    this.nodes = [];
}

var _p = FabricLayer.prototype;

_p.addChild = function(child) {
    this.nodes.push(child);
}

_p.render = function(nb) {
    for (var i in this.nodes) {
        nb.addToCanvas(this.nodes[i]);
    }
}

module.exports = FabricLayer;