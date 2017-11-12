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

    return {
        id: entity.id,
        printUrl,
        number: entity.number,
        date: entity.date,
        description: entity.description,
        title: entity.title,
        detailAccountId: entity.detailAccountId,
        detailAccountDisplay: entity.detailAccountDisplay,
        customerId: entity.detailAccountId,
        customerDisplay: entity.detailAccountDisplay,
        status: entity.invoiceStatus,
        statusDisplay: enums.InvoiceStatus().getDisplay(entity.invoiceStatus),
        invoiceLines: entity.invoiceLines,
        sumTotalPrice: entity.sumTotalPrice,
        sumPaidAmount: entity.sumPaidAmount,
        sumRemainder: entity.sumRemainder
    };
};


