"use strict";

const enums = instanceOf('Enums'),
    Crypto = instanceOf('Crypto'),
    config = instanceOf('config');

module.exports = function (entity, settings) {

    const printUrl = entity.invoiceType === 'sale' && entity.invoiceStatus !== 'draft'
        ? `${process.env.DASHBOARD_URL}/invoice/${entity.id}/?branchId=${entity.branchId}`
        : undefined;

    return Object.assign({}, {
        branchId: entity.branchId,
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
        statusDisplay:enums.InvoiceStatus().getDisplay(entity.invoiceStatus),
        invoiceLines: entity.invoiceLines,
        sumTotalPrice: entity.sumTotalPrice,
        sumPaidAmount: entity.sumPaidAmount,
        sumRemainder: entity.sumRemainder,
        costs: mapCostsAndCharges(entity.costs, settings.saleCosts),
        charges: mapCostsAndCharges(entity.charges, settings.saleCharges),
        discount: entity.discount || 0,
        totalVat: entity.totalVat || 0,
        chargesVat: entity.chargesVat || 0,
        marketerId: entity.marketerId,
        marketerDisplay: entity.marketerDisplay
    }, entity.custom);


};

function mapCostsAndCharges(items, itemsInSettings) {

    if (!(items && items.length > 0))
        return undefined;

    return (items || []).asEnumerable()
        .select(e => ({
            key: e.key,
            value: e.value,
            vatIncluded: e.vatIncluded,
            display: (itemsInSettings.asEnumerable().singleOrDefault(c => c.key === e.key) || {}).display
        }))
        .toArray();
}



