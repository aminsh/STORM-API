"use strict";

const SettingsService = require('../settings'),
    Queries = require('../queries');

module.exports = function (module, eventName, defaultHandler, state, params) {
    let settings = new Queries.SettingsQuery(state.branchId).get(),
        event = new SettingsService(state.branchId).getEvent(module, eventName),
        handler = event && event.handler
            ? eval(`(${event.handler})`)
            : defaultHandler,
        parameters = Array.isArray(params) ? params : [params];

    handler.apply({runService, query, settings}, parameters);

    function runService(serviceName, params) {
        return RunService(serviceName, params, state);
    }

    function query(queryName) {
        return new Queries[queryName](state.branchId);
    }
};