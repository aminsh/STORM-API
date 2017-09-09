"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    InventoryRepository = require('../data/repository.inventory'),
    PersianDate = instanceOf('utility').PersianDate;


module.exports = class InventoryDomain {
    constructor(branchId, fiscalPeriodId) {
        this.branchId = branchId;
        this.fiscalPeriodId = fiscalPeriodId;

        this.inventoryRepository = new InventoryRepository(branchId);

        this.getPrice = async(this.getPrice);
        this.getInputFirst = async(this.getInputFirst);
        this.addProductToInputFirst = async(this.addProductToInputFirst);
    }

    getPrice(productId) {
        let inputs = await(this.inventoryRepository
                .getAllInputBeforeDate(this.fiscalPeriodId, productId, new Date)),
            sumPrice = inputs.asEnumerable().sum(e => (e.unitPrice * e.quantity)),
            sumQuantity = inputs.asEnumerable().sum(e => e.quantity);

        return sumPrice / sumQuantity;
    }

    getInventory(productId) {
        let result = await(this.inventoryRepository.inventoryByProduct(productId, this.fiscalPeriodId));
        return result.sum || 0;
    }

    getInputFirst(stockId) {
        let first = await(this.inventoryRepository.findFirst(stockId));

        if (first) return first;

        first = {
            number: 1,
            date: PersianDate.current(),
            fiscalPeriodId: this.fiscalPeriodId,
            branchId: this.branchId,
            inventoryType: 'input',
            ioType: 'inputFirst',
            stockId,
            description: 'رسید اول دوره',
            inventoryLines: []
        };

        await(this.inventoryRepository.create(first));

        return this.inventoryRepository.findFirst(stockId);
    }

    addProductToInputFirst(cmd) {

        cmd.data.forEach(item => {
            let inputFirst = await(this.getInputFirst(item.stockId)),
                linesEnumerable = inputFirst.inventoryLines.asEnumerable(),
                line = linesEnumerable.singleOrDefault(line => line.productId === cmd.productId);

            if (line)
                linesEnumerable.remove(line);

            inputFirst.inventoryLines.push({
                productId: cmd.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice
            });

            await(this.inventoryRepository.updateBatch(inputFirst.id, inputFirst));
        });

    }
};