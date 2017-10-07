"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    InventoryRepository = require('../data/repository.inventory'),
    StockRepository = require('../data/repository.stock'),
    ProductRepository = require('../data/repository.product'),
    translate = require('../services/translateService'),
    SettingRepository = require('../data/repository.setting'),
    EventEmitter = require('../services/shared').service.EventEmitter;

EventEmitter.on('on-purchase-created', async((purchase, current) => {
    let inventoryRepository = new InventoryRepository(current.branchId),
        stockRepository = new StockRepository(current.branchId),
        productRepository = new ProductRepository(current.branchId),
        settingRepository = new SettingRepository(current.branchId);

    if (!purchase.invoiceLines
            .asEnumerable()
            .any(async.result(line => await(productRepository.isGood(line.productId)))))
        return;

    if(!await(settingRepository.get()).canControlInventory)
        return;

        let input = {
                number: (await(inventoryRepository.inputMaxNumber(current.fiscalPeriodId)).max || 0) + 1,
                date: purchase.date,
                stockId: await(stockRepository.getDefaultStock()).id,
                description: translate('For Cash purchase invoice number ...').format(purchase.number),
                inventoryType: 'input',
                fiscalPeriodId: current.fiscalPeriodId,
                invoiceId: purchase.id
            },
            inputLines = purchase.invoiceLines.asEnumerable()
                .where(async.result(line => await(productRepository.isGood(line.productId))))
                .select(line => ({
                    productId: line.productId,
                    quantity: line.quantity,
                    unitPrice: ((line.unitPrice * line.quantity) - line.discount + line.vat) / line.quantity,
                    invoiceLineId: line.id
                }))
                .toArray();


    input.inventoryLines = inputLines;

    await(inventoryRepository.create(input));
}));