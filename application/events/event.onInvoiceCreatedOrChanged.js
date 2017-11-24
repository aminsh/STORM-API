"use strict";

const async = require('asyncawait/async'),
    EventEmitter = instanceOf('EventEmitter'),
    InvoiceQuery = require('../queries').InvoiceQuery,
    defaultOnInvoiceCreated = require('../defaulEventHandlers/invoice.events');


function onInvoiceCreatedChanged (invoiceId, state) {

    let invoice = new InvoiceQuery(state.branchId).getById(invoiceId);

    defaultOnInvoiceCreated.call({runService}, invoice);

    function runService(serviceName, params) {
        return RunService(serviceName, params, state);
    }
}

EventEmitter.on("onInvoiceCreated", async(onInvoiceCreatedChanged));
EventEmitter.on("onInvoiceEdited", async(onInvoiceCreatedChanged));
EventEmitter.on("onInvoiceConfirmed", async(onInvoiceCreatedChanged));