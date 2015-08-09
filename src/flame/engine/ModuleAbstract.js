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
    this.fe.eq.channel("injectModule").broadcast({
        name: name,
        module: this
    });
};

_p.addNativeListeners = function(eventNames) {
    this.fe.eq.audience(this).subscribeObject(this, eventNames);
};

module.exports = ModuleAbstract;
