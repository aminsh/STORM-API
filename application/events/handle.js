"use strict";

const SettingsService = require('../settings');

module.exports = function (module, eventName, defaultHandler, state, params) {
    let event = new SettingsService(state.branchId).getEvent(module, eventName),
        handler = event && event.handler
            ? eval(`(${event.handler})`)
            : defaultHandler,
        parameters = Array.isArray(params) ? params : [params];

    handler.apply({runService}, parameters);

    function runService(serviceName, params) {
        return RunService(serviceName, params, state);
    }
};