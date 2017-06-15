"use strict";

const enums = require('../../shared/enums');

module.exports = function(entity) {

    return {
        id: entity.id,
        number: entity.number,
        date: entity.date,
        description: entity.description,
        detailAccountId: entity.detailAccountId,
        detailAccountDisplay: entity.detailAccountDisplay,
        status: entity.invoiceStatus,
        statusDisplay: enums.InvoiceStatus().getDisplay(entity.invoiceStatus),
        invoiceLines: entity.invoiceLines
    };
};


