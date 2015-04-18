var cc = require('cc');

/**
 * @param assoc opts
  */
var ModuleAbstract = cc.Class.extend({
    ctor: function(opts) {
        this.opts = opts;
    }
});

var _p = ModuleAbstract.prototype;

_p.injectFe = function(fe, name)
{
    this.name = name;
    this.fe = fe;
    this.fe.fd.dispatch({
        type: "injectModule",
        name: name,
        module: this
    });
};

module.exports = ModuleAbstract;