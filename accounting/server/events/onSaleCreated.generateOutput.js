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

        settings = await(settingRepository.get()),
        products = await(productRepository
            .findByIds(sale.invoiceLines.asEnumerable()
                .select(item => item.productId)
                .toArray()));


    if (!products.asEnumerable()
            .any(item => item.productType === 'good'))
        return;

    if (!settings.canControlInventory)
        return;

    const params = {
        sale,
        lines: cmd.invoiceLines.asEnumerable()
            .join(
                products,
                first => first.productId,
                second => second.id,
                (first, second) => ({
                    product: second,
                    quantity: first.quantity,
                    stockId: first.stockId,
                    invoiceLine: sale.invoiceLines.asEnumerable().single(item => item.productId === second.id)
                }))
            .toArray()
    };

    let output = await(instanceOf('createOutput', current.branchId, current.fiscalPeriodId, settings)
        .set(params));

    if (Array.isArray(output))
        return output.forEach(item => {
            await(inventoryRepository.create(item));
            EventEmitter.emit('on-output-created', item.id, current);
        });


    await(inventoryRepository.create(output));

    EventEmitter.emit('on-output-created', output.id, current);
}));