"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    InventoryRepository = require('../data/repository.inventory'),
    StockRepository = require('../data/repository.stock'),
    translate = require('../services/translateService'),
    EventEmitter = require('../services/shared').service.EventEmitter;

EventEmitter.on('on-purchase-created', async((purchase, current) => {
    let inventoryRepository = new InventoryRepository(current.branchId),
        stockRepository = new StockRepository(current.branchId),

        input = {
            number: await(inventoryRepository.inputMaxNumber(current.fiscalPeriodId).max || 0) + 1,
            date: purchase.date,
            stockId: await(stockRepository.getDefaultStock()).id,
            description: translate('For Cash purchase invoice number ...').format(purchase.number),
            inventoryType: 'input'
        },
        inputLines = purchase.invoiceLines.asEnumerable().select(line => ({
            productId: line.productId,
            quantity: line.quantity,
            unitPrice: line.unitPrice
        })).toArray();


    input.inventoryLines = inputLines;

    await(inventoryRepository.create(input));
}));