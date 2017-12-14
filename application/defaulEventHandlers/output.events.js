"use strict";

/**
 * @property {Function} runService
 * @param {Object} output
 */
function onCreated(output) {

    if (output.ioType === "outputSale") {
        this.runService("inventoryOutputCalculatePrice", [output.id]);
        this.runService("journalGenerateForOutputSale", [output.id]);
    }

}

function onSetPrice(output) {

    if (output.inputId) {
        let input = this.query('InventoryQuery').getById(output.inputId);

        let lines = output.inventoryLines.asEnumerable()
            .join(
                input.inventoryLines,
                outputLine => outputLine.productId,
                inputLine => inputLine.productId,
                (outputLine, inputLine) => ({
                    id: inputLine.id,
                    unitPrice: outputLine.unitPrice
                }))
            .toArray();

        this.runService('inventoryInputSetPrice', [input.id, lines]);
    }
}


module.exports = {onCreated, onSetPrice};