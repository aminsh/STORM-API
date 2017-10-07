"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    InventoryRepository = require('../data/repository.inventory'),
    ProductRepository = require('../data/repository.product'),
    SettingRepository = require('../data/repository.setting'),
    EventEmitter = instanceOf('EventEmitter'),
    webhook = instanceOf('webhook');

EventEmitter.on('onInventoryInputChanged', async((current, inputId) => {
    const inventoryRepository = new InventoryRepository(current.branchId),
        productRepository = new ProductRepository(current.branchId),
        settingsRepository = new SettingRepository(current.branchId),

        settings = await(settingsRepository.get()),
        webhookConfigs = settings.webhooks.asEnumerable()
            .where(item => item.event === 'onInventoryInputChanged')
            .toArray();

    if (webhookConfigs.length === 0)
        return;

    const input = await(inventoryRepository.findById(inputId)),

        list = input.inventoryLines.asEnumerable()
            .select(item => {
                const product = await(productRepository.findById(item.productId)),
                    quantity = await(inventoryRepository
                        .getInventoryByProduct(product.id, input.stockId, current.fiscalPeriodId));

                return {
                    productId: product.referenceId || product.id,
                    quantity
                }
            })
            .toArray();

        webhookConfigs.forEach(config => {

            list.forEach(async.result(item => await(webhook.send(config, item))));
        })


}));