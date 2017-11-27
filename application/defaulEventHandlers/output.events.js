"use strict";

/**
 * @property {Function} runService
 * @param {Object} output
 */
function onInvoiceCreatedOrChanged(output) {

    if (output.ioType === "outputSale"){
        this.runService("inventoryOutputCalculatePrice", [output.id]);
        this.runService("journalGenerateForOutputSale", [output.id]);
    }

}


module.exports = onInvoiceCreatedOrChanged;