"use strict";

"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    InventoryRepository = require('../data/repository.inventory'),
    ProductRepository = require('../data/repository.product'),
    StockRepository = require('../data/repository.stock'),
    translate = require('../services/translateService'),
    InventoryDomain = require('../domain/inventory'),
    SettingRepository = require('../data/repository.setting'),
    EventEmitter = require('../services/shared').service.EventEmitter;

EventEmitter.on('on-sale-created', async((sale, current) => {
    let inventoryRepository = new InventoryRepository(current.branchId),
        stockRepository = new StockRepository(current.branchId),
        inventoryDomain = new InventoryDomain(current.branchId, current.fiscalPeriodId),
        productRepository = new ProductRepository(current.branchId),
        settingRepository = new SettingRepository(current.branchId);

    if (!sale.invoiceLines
            .asEnumerable()
            .any(async(line => await(productRepository.isGood(line.productId)))))
        return;

    if(!await(settingRepository.get()).canControlInventory)
        return;

    let input = {
            number: (await(inventoryRepository.outputMaxNumber(current.fiscalPeriodId)).max || 0) + 1,
            date: sale.date,
            stockId: await(stockRepository.getDefaultStock()).id,
            description: translate('For Cash sale invoice number ...').format(sale.number),
            inventoryType: 'output',
            invoiceId: sale.id,
            fiscalPeriodId: current.fiscalPeriodId
        },
        inputLines = sale.invoiceLines.asEnumerable()
            .where(async(line => await(productRepository.isGood(line.productId))))
            .select(line => ({
                productId: line.productId,
                quantity: line.quantity,
                unitPrice: await(inventoryDomain.getPrice(line.productId)),
                invoiceLineId: line.id
            })).toArray();


    input.inventoryLines = inputLines;

    await(inventoryRepository.create(input));
}));