"use strict";

"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    InventoryRepository = require('../data/repository.inventory'),
    StockRepository = require('../data/repository.stock'),
    translate = require('../services/translateService'),
    InventoryDomain = require('../domain/inventory'),
    EventEmitter = require('../services/shared').service.EventEmitter;

EventEmitter.on('on-sale-created', async((sale, current) => {
    let inventoryRepository = new InventoryRepository(current.branchId),
        stockRepository = new StockRepository(current.branchId),
        inventoryDomain = new InventoryDomain(current.branchId,current.fiscalPeriodId),

        input = {
            number: await(inventoryRepository.outputMaxNumber(current.fiscalPeriodId).max || 0) + 1,
            date: sale.date,
            stockId: await(stockRepository.getDefaultStock()).id,
            description: translate('For Cash sale invoice number ...').format(sale.number),
            inventoryType: 'output'
        },
        inputLines = sale.invoiceLines.asEnumerable().select(line => ({
            productId: line.productId,
            quantity: line.quantity,
            unitPrice: await(inventoryDomain.getPrice(line.productId))
        })).toArray();


    input.inventoryLines = inputLines;

    await(inventoryRepository.create(input));
}));