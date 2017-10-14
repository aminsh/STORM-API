"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    InventoryRepository = require('../../../data/repository.inventory'),
    ProductRepository = require('../../../data/repository.product'),
    StockRepository = require('../../../data/repository.stock'),
    translate = require('../../../services/translateService'),
    InventoryDomain = require('../../inventory'),
    SettingRepository = require('../../../data/repository.setting');

class OneStockBase {

    constructor(branchId, fiscalPeriodId) {

        this.inventoryRepository = new InventoryRepository(branchId);
        this.stockRepository = new StockRepository(branchId);
        this.inventoryDomain = new InventoryDomain(branchId, fiscalPeriodId);
        this.productRepository = new ProductRepository(branchId);

        const settingRepository = new SettingRepository(branchId);

        this.settings = await(settingRepository.get());

        this.branchId = branchId;
        this.fiscalPeriodId = fiscalPeriodId;
        this.stockId = null;
    }

    set(cmd) {

        let maxNumber = await(this.inventoryRepository
                .outputMaxNumber(this.fiscalPeriodId, this.stockId, 'outputSale'))
                .max || 0,

            output = {
                number: ++maxNumber,
                date: cmd.date,
                stockId: this.stockId,
                description: translate('For Cash sale invoice number ...').format(cmd.number),
                inventoryType: 'output',
                ioType: 'outputSale',
                invoiceId: cmd.id,
                fiscalPeriodId: this.fiscalPeriodId
            };

        output.inventoryLines = cmd.invoiceLines.asEnumerable()
            .select(line => ({
                productId: line.productId,
                quantity: line.quantity,
                unitPrice: await(this.inventoryDomain.getPrice(line.productId)),
                invoiceLineId: line.id
            })).toArray();

        return output;

    }
}

module.exports = OneStockBase;