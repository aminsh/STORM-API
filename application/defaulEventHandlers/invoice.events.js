"use strict";

/**
 * @property {Function} runService
 * @param {Object} invoice
 */
function onInvoiceCreatedOrChanged(invoice) {

    if(invoice.status === 'draft')
        return;

    let journalId = this.runService("journalGenerateForInvoice", [invoice.id]);

    this.runService("invoiceSetJournal", [invoice.id, journalId]);
}


module.exports = onInvoiceCreatedOrChanged;