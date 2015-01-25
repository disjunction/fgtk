"use strict";

var cc = require('cc');

var PanelManager = cc.Class.extend({
    ctor: function (opts) {
        this.opts = opts || {};
        if (!this.opts.webpage) {
            throw new Error('webpage expected in opts');
        }
        if (!this.opts.eventDispatcher) {
            throw new Error('eventDispatcher expected in opts');
        }
        this.loadedControllers = {};
        this.placeholders = this.opts.placeholders || {};
        this.panels = this.opts.panels || {};
    },
    getPlaceholder: function (id) {
        if (!this.placeholders[id]) {
            this.placeholders[id] = this.opts.webpage.$('#' + id);
        }
        return this.placeholders[id];
    },
    getPanelDescriptor: function (panelName) {
        if (!this.panels[panelName]) {
            throw new Error('panel ' + panelName + ' not found');
        }
        return this.panels[panelName];
    },
    registerPanel: function (panelName, controllerClass, url) {
        this.controllers[panelName].controllerClass = controllerClass;
        this.controllers[panelName].url = url;
    },
    loadPanel: function (placeholderId, panelName, params) {
        var placeholder = this.getPlaceholder(placeholderId);
        
        if (this.loadedControllers[placeholderId]) {
            placeholder.addClass('hend-hidden-panel');
            if (this.loadedControllers[placeholderId].unload) {
                this.loadedControllers[placeholderId].unload();
            }
            this.loadedControllers = null;
        }
        
        var panelDescriptor = this.getPanelDescriptor(panelName);
        var me = this;
        this.opts.webpage.$.get(panelDescriptor.url, params, function (data) {
            placeholder.html(data);
            placeholder.removeClass('hend-hidden-panel').addClass('hend-shown-panel');
            var controller = new panelDescriptor.controllerClass(placeholderId, me, params);
            this.loadedControllers[placeholderId] = controller;
            
            var event = {
                type: 'panelLoaded',
                panelName: panelName
            };
            this.opts.eventDispatcher.dispatch(event);
        });
    }
});

module.exports = PanelManager;