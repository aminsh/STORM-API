"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    InvoiceRepository = require('../data/repository.invoice'),
    InventoryRepository = require('../data/repository.inventory'),
    ProductRepository = require('../data/repository.product'),
    StockRepository = require('../data/repository.stock'),
    translate = require('../services/translateService'),
    InventoryDomain = require('../domain/inventory'),
    SettingRepository = require('../data/repository.setting'),
    EventEmitter = require('../services/shared').service.EventEmitter;

EventEmitter.on('on-sale-created', async((cmd, current) => {
    let inventoryRepository = new InventoryRepository(current.branchId),
        invoiceRepository = new InvoiceRepository(current.branchId),
        stockRepository = new StockRepository(current.branchId),
        inventoryDomain = new InventoryDomain(current.branchId, current.fiscalPeriodId),
        productRepository = new ProductRepository(current.branchId),
        settingRepository = new SettingRepository(current.branchId);


    const sale = await(invoiceRepository.findById(cmd.id)),

        settings = await(settingRepository.get());


    if (!sale.invoiceLines
            .asEnumerable()
            .any(async(line => await(productRepository.isGood(line.productId)))))
        return;

    if (!settings.canControlInventory)
        return;

    let output = await(instanceOf('createOutput', current.branchId, current.fiscalPeriodId, settings)
        .set(Object.assign(cmd, sale)));

    await(inventoryRepository.create(output));

    EventEmitter.emit('on-output-created', output.id, current);
}));