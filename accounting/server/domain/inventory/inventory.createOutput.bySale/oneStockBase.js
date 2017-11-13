"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    InventoryRepository = require('../../../data/repository.inventory'),
    ProductRepository = require('../../../data/repository.product'),
    StockRepository = require('../../../data/repository.stock'),
    translate = require('../../../services/translateService'),
    InventoryDomain = require('../../inventory'),
    SettingRepository = require('../../../data/repository.setting'),
    PersianDate = instanceOf('utility').PersianDate;

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
                date: cmd.date || PersianDate.current(),
                stockId: this.stockId,
                description: translate('For Cash sale invoice number ...').format(cmd.sale.number),
                inventoryType: 'output',
                ioType: 'outputSale',
                invoiceId: cmd.sale.id,
                fiscalPeriodId: this.fiscalPeriodId
            };

        output.inventoryLines = cmd.lines.asEnumerable()
            .select(line => ({
                productId: line.product.id,
                quantity: line.quantity,
                unitPrice: await(this.inventoryDomain.getPrice(line.product.id)),
                invoiceLineId: line.invoiceLine.id
            })).toArray();

        return output;

    }
}

module.exports = OneStockBase;
