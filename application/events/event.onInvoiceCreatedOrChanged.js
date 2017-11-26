"use strict";

const async = require('asyncawait/async'),
    EventEmitter = instanceOf('EventEmitter'),
    InvoiceQuery = require('../queries').InvoiceQuery,
    SettingsService = require('../settings'),
    defaultOnInvoiceCreated = require('../defaulEventHandlers/invoice.events');


function onInvoiceCreatedChanged(invoiceId, state) {

    let invoice = new InvoiceQuery(state.branchId).getById(invoiceId),
        event = new SettingsService(state.branchId).getEvent('invoice', 'created'),
        handler = event && event.handler
            ? eval(`(${event.handler})`)
            : defaultOnInvoiceCreated;

    handler.call({runService}, invoice);

    function runService(serviceName, params) {
        return RunService(serviceName, params, state);
    }
}

EventEmitter.on("onInvoiceCreated", async(onInvoiceCreatedChanged));
EventEmitter.on("onInvoiceEdited", async(onInvoiceCreatedChanged));
EventEmitter.on("onInvoiceConfirmed", async(onInvoiceCreatedChanged));