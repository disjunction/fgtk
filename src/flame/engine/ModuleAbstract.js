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
    this.unregisterStack = [];
    this.name = name;
    this.fe = fe;
    this.fe.fd.dispatch({
        type: "injectModule",
        name: name,
        module: this
    });
};

/**
 * for eventName="someEvent" registers a listener this.onSomeEvent
 * and stores the listener handler in unregisterStack,
 * so that we can completely unregister the module in future
 */
_p.addNativeListener = function(eventName) {
    var methodName = "on" + eventName.charAt(0).toUpperCase() + eventName.substring(1);
    if (typeof this[methodName] != "function") {
        throw new Error("cannot find method " + methodName + " while registering native event for module " + this.name);
    }
    var listener = this[methodName].bind(this);
    this.fe.fd.addListener(eventName, listener);
    this.unregisterStack.push({
        event: eventName,
        listener: listener
    });
};

/**
 * wraper for addNativeListeners supporting arra of events
 */
_p.addNativeListeners = function(eventNames) {
    for (var i = 0; i < eventNames.length; i++) {
        this.addNativeListener(eventNames[i]);
    }
};

module.exports = ModuleAbstract;
