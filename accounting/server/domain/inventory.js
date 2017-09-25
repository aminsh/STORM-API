"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    InventoryRepository = require('../data/repository.inventory'),
    SettingRepository = require('../data/repository.setting'),
    StockRepository = require('../data/repository.stock'),
    PersianDate = instanceOf('utility').PersianDate,
    DomainException = instanceOf('domainException');


class InventoryDomain {
    constructor(branchId, fiscalPeriodId) {
        this.branchId = branchId;
        this.fiscalPeriodId = fiscalPeriodId;

        this.inventoryRepository = new InventoryRepository(branchId);
        this.stockRepository = new StockRepository(branchId);
        this.settingsRepository = new SettingRepository(branchId);

        this.settings = await(this.settingsRepository.get());

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

    getInventory(productId, stockId) {
        let result = await(this.inventoryRepository.getInventoryByProduct(productId, this.fiscalPeriodId, stockId));
        return result || 0;
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

        let errors = cmd.data.asEnumerable()
            .select(item => {
                let inventories = await(this.inventoryRepository.getInventoriesByProductId(
                    cmd.productId, this.fiscalPeriodId, item.stockId)),
                    inputFirst = inventories
                        .asEnumerable()
                        .singleOrDefault(item => item.inventoryType === 'input' && item.ioType === 'inputFirst');

                if (inputFirst)
                    inputFirst.quantity = item.quantity;

                return {
                    isValid: this.isValidInventoryTurnover(inventories),
                    stockId: item.stockId
                };
            })
            .where(item => !item.isValid)
            .select(item => {
                const stockTitle = await(this.stockRepository.findById(item.stockId)).title;

                return `گردش موجود کالا در ${stockTitle} منفی میشود`;
            })
            .toArray();

        if (errors.length > 0)
            throw new DomainException(errors);

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

    checkIsValidTurnoverByProductAndStockAfterUpdate(productId, stockId, quantity, inputId) {
        let inventories = await(this.inventoryRepository.getInventoriesByProductId(productId, this.fiscalPeriodId, stockId)),
            input = inventories.asEnumerable().singleOrDefault(item => item.id === inputId);

        if(!input)
            return true;

        input.quantity = quantity;

        return this.isValidInventoryTurnover(inventories);
    }

    isValidInventoryTurnover(inventories) {
        if (inventories.length === 0) return true;

        let inventoryTurnover = inventories
            .map(item => {
                item.total = item.quantity * (item.inventoryType === 'input' ? 1 : -1);
                return item;
            })
            .reduce((memory, current) => {
                if (Array.isArray(memory)) {
                    let last = memory.asEnumerable().lastOrDefault(),
                        remainder = last ? last.remainder : 0;

                    current.remainder = remainder + current.total;
                    memory.push(current);
                    return memory;
                }
                else {
                    memory.remainder = memory.total;
                    current.remainder = memory.remainder + current.total;
                    return [memory, current];
                }
            });

        return inventoryTurnover.asEnumerable().all(item => item.remainder >= 0);
    }

    isValidInventoryControl(productId, quantity, stockId) {

        if (!this.settings.canControlInventory)
            return true;

        if (this.settings.canCreateSaleOnNoEnoughInventory)
            return true;

        const inventory = await(this.getInventory(productId, stockId));

        return inventory >= quantity;
    }
};

module.exports = InventoryDomain;