"use strict";

"use strict";

const async = require('asyncawait/async'),
    EventEmitter = instanceOf('EventEmitter'),
    InventoryQuery = require('../queries').InventoryQuery,
    handle = require('./handle'),
    defaultOnInvoiceCreated = require('../defaulEventHandlers/invoice.events');


function onCreated(outputId, state) {

    let output = new InventoryQuery(state.branchId).getById(outputId);

    handle("output", "created", defaultOnInvoiceCreated, state, output);
}

EventEmitter.on("onOutputCreated", async(onCreated));