"use strict";

const enums = instanceOf('Enums'),
    Crypto = instanceOf('Crypto'),
    config = instanceOf('config');

module.exports = function (entity) {

    const printUrl = entity.invoiceType === 'sale' && entity.invoiceStatus !== 'draft'
        ? `${config.url.origin}/invoice/token/${Crypto.sign({
            branchId: entity.branchId,
            invoiceId: entity.id
        })}`
        : undefined;

    return Object.assign({}, {
        id: entity.id,
        printUrl,
        number: entity.number,
        date: entity.date,
        description: entity.description,
        title: entity.title,
        journalId: entity.journalId,
        inventoryIds: entity.inventoryIds,
        detailAccountId: entity.detailAccountId,
        detailAccountDisplay: entity.detailAccountDisplay,
        customer: {id: entity.detailAccountId},
        customerId: entity.detailAccountId,
        customerDisplay: entity.detailAccountDisplay,
        status: entity.invoiceStatus,
        statusDisplay: enums.InvoiceStatus().getDisplay(entity.invoiceStatus),
        invoiceLines: entity.invoiceLines,
        sumTotalPrice: entity.sumTotalPrice,
        sumPaidAmount: entity.sumPaidAmount,
        sumRemainder: entity.sumRemainder,
        costs: entity.costs,
        charges: entity.charges
    }, entity.custom);
};


