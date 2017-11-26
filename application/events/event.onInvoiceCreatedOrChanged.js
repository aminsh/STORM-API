"use strict";

const async = require('asyncawait/async'),
    EventEmitter = instanceOf('EventEmitter'),
    InvoiceQuery = require('../queries').InvoiceQuery,
    handle = require('./handle'),
    defaultOnInvoiceCreated = require('../defaulEventHandlers/invoice.events');


function onInvoiceCreatedChanged(event, invoiceId, state) {

    let invoice = new InvoiceQuery(state.branchId).getById(invoiceId);

    handle("invoice", event, defaultOnInvoiceCreated, state, invoice);
}

EventEmitter.on("onInvoiceCreated", async((invoiceId, state) => onInvoiceCreatedChanged("created", invoiceId, state)));
EventEmitter.on("onInvoiceEdited", async((invoiceId, state) => onInvoiceCreatedChanged("edited", invoiceId, state)));
EventEmitter.on("onInvoiceConfirmed", async((invoiceId, state) => onInvoiceCreatedChanged("confirmed", invoiceId, state)));