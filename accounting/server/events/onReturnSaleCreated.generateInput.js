"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    InventoryRepository = require('../data/repository.inventory'),
    StockRepository = require('../data/repository.stock'),
    EventEmitter = require('../services/shared').service.EventEmitter,
    Common = instanceOf('utility').Common;

EventEmitter.on('on-returnSale-created', async((returnSale, current) => {
    let inventoryRepository = new InventoryRepository(current.branchId),
        stockRepository = new StockRepository(current.branchId);

    const stockId = returnSale.stockId,
        outputsByInvoice = await(inventoryRepository.findByInvoiceId(returnSale.ofInvoiceId, 'output'));

    if (!(outputsByInvoice && outputsByInvoice.length > 0))
        return;

    const outputsProductAndLastPriceCreatedForThisSale = outputsByInvoice.asEnumerable()

    /*
        if we have more than one price recent price should be write
    */
        .orderByDescending(item => item.createdAt)

        .selectMany(item => item.inventoryLines)
        .groupBy(
            item => item.productId,
            item => item.unitPrice,
            (key, items) => ({productId: key, price: items.first()}))
        .toArray();

    let input = {
        number: (await(inventoryRepository.inputMaxNumber(
            current.fiscalPeriodId,
            stockId,
            'inputBackFromSaleOrConsuming')).max || 0) + 1,
        date: returnSale.date,
        stockId,
        description: `بابت فاکتور برگشت از فروش شماره ${returnSale.number}`,
        inventoryType: 'input',
        ioType: 'inputBackFromSaleOrConsuming',
        fiscalPeriodId: current.fiscalPeriodId,
        invoiceId: returnSale.id
    };

    input.inventoryLines = returnSale.invoiceLines
        .asEnumerable()
        .join(outputsProductAndLastPriceCreatedForThisSale,
            returnSale => returnSale.productId,
            output => output.productId,
            (returnSale, output) => ({
                productId: returnSale.productId,
                quantity: returnSale.quantity,
                unitPrice: output.price
            }))
        .where(item => item.productId)
        .toArray();

    await(inventoryRepository.create(input));

    await(Common.waitFor(1000));

    EventEmitter.emit('on-inputReturnSale-created', input.id, current);
}));