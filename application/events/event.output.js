"use strict";

"use strict";

const async = require('asyncawait/async'),
    EventEmitter = instanceOf('EventEmitter'),
    InventoryQuery = require('../queries').InventoryQuery,
    handle = require('./handle'),
    defaultEvents = require('../defaulEventHandlers/output.events');


function onCreated(outputId, state) {

    let output = new InventoryQuery(state.branchId).getById(outputId);

    handle("output", "created", defaultEvents.onCreated, state, output);
}

function onSetPrice(outputId, state) {

    let output = new InventoryQuery(state.branchId).getById(outputId);

    handle("output", "setPrice", defaultEvents.onSetPrice, state, output);
}

EventEmitter.on("onOutputCreated", async(onCreated));
EventEmitter.on("onOutputSetPrice", async(onSetPrice));