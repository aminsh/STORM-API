"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    InventoryRepository = require('../data/repository.inventory'),
    InvoiceRepository = require('../data/repository.invoice'),
    ProductRepository = require('../data/repository.product'),
    translate = require('../services/translateService'),
    SettingRepository = require('../data/repository.setting'),
    EventEmitter = require('../services/shared').service.EventEmitter;

EventEmitter.on('on-purchase-created', async((cmd, current) => {
    const inventoryRepository = new InventoryRepository(current.branchId),
        productRepository = new ProductRepository(current.branchId),
        settingRepository = new SettingRepository(current.branchId),
        invoiceRepository = new InvoiceRepository(current.branchId),

        settings = await(settingRepository.get()),
        maxNumber = (await(inventoryRepository
            .inputMaxNumber(current.fiscalPeriodId, cmd.stockId, 'inputPurchase')).max || 0);

    let purchase = await(invoiceRepository.findById(cmd.purchaseId));


    if (!purchase.invoiceLines
            .asEnumerable()
            .any(async.result(line => await(productRepository.isGood(line.productId)))))
        return;

    if (!settings.canControlInventory)
        return;

    let input = {
        number: maxNumber + 1,
        date: purchase.date,
        stockId: cmd.stockId,
        description: translate('For Cash purchase invoice number ...').format(purchase.number),
        inventoryType: 'input',
        ioType: 'inputPurchase',
        fiscalPeriodId: current.fiscalPeriodId,
        invoiceId: purchase.id,
        inventoryLines: purchase.invoiceLines.asEnumerable()
            .where(async.result(line => await(productRepository.isGood(line.productId))))
            .select(line => ({
                productId: line.productId,
                quantity: line.quantity,
                unitPrice: ((line.unitPrice * line.quantity) - line.discount) / line.quantity,
                invoiceLineId: line.id
            }))
            .toArray()
    };

    await(inventoryRepository.create(input));
}));