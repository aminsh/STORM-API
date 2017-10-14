"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    InventoryRepository = require('../data/repository.inventory'),
    ProductRepostitory = require('../data/repository.product'),
    SettingRepository = require('../data/repository.setting'),
    StockRepository = require('../data/repository.stock'),
    PersianDate = instanceOf('utility').PersianDate,
    DomainException = instanceOf('domainException'),
    EventEmitter = instanceOf('EventEmitter');


class InventoryDomain {

    constructor(branchId, fiscalPeriodId) {
        this.branchId = branchId;
        this.fiscalPeriodId = fiscalPeriodId;

        this.inventoryRepository = new InventoryRepository(branchId);
        this.stockRepository = new StockRepository(branchId);
        this.settingsRepository = new SettingRepository(branchId);
        this.productRepository = new ProductRepostitory(branchId);

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

        if (!input)
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

    create(cmd) {

        if (cmd.inventoryType === 'output') {
            let errors = await(this.inventoryControl(cmd.inventoryLines, cmd.stockId));

            if (errors.length > 0)
                throw new DomainException(errors);
        }

        const maxNumber = await(this.inventoryRepository[
            cmd.inventoryType === 'input'
                ? 'inputMaxNumber'
                : 'outputMaxNumber'
            ](this.fiscalPeriodId, cmd.stockId, cmd.ioType)).max;

        let entity = {
            number: cmd.number || (maxNumber ? maxNumber + 1 : 2),
            date: cmd.date,
            ioType: cmd.ioType,
            inventoryType: cmd.inventoryType,
            description: cmd.description,
            fiscalPeriodId: this.fiscalPeriodId,
            stockId: cmd.stockId,
            inventoryLines: cmd.inventoryLines.asEnumerable()
                .select(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                }))
                .toArray()
        };

        await(this.inventoryRepository.create(entity));

        EventEmitter.emit(
            'onInventoryInputChanged',
            {branchId: this.branchId, fiscalPeriodId: this.fiscalPeriodId},
            entity.id);

        return entity.id;
    }

    update(id, cmd) {

        if (cmd.inventoryType === 'output') {
            let errors = await(this.inventoryControl(cmd.inventoryLines, cmd.stockId));

            if (errors.length > 0)
                throw new DomainException(errors);
        }

        let entity = {
            number: cmd.number,
            date: cmd.date || PersianDate.current(),
            ioType: cmd.ioType,
            inventoryType: cmd.inventoryType,
            description: cmd.description,
            fiscalPeriodId: this.fiscalPeriodId,
            inventoryLines: cmd.inventoryLines.asEnumerable()
                .select(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                }))
                .toArray()
        };

        await(this.inventoryRepository.updateBatch(id, entity));

        EventEmitter.emit(
            'onInventoryInputChanged',
            {branchId: this.branchId, fiscalPeriodId: this.fiscalPeriodId},
            entity.id);
    }

    inventoryControl(lines, stockId) {
        const inventoryList = lines.asEnumerable()
            .select(async.result(item => ({
                productId: item.productId,
                inventory: await(this.inventoryRepository
                    .getInventoryByProduct(item.productId, this.fiscalPeriodId, stockId, item.id)),
                quantity: item.quantity
            })))
            .toArray();

        return inventoryList.asEnumerable()
            .where(item => item.quantity > item.inventory)
            .select(async.result(item => {
                const productDisplay = await(this.productRepository.findById(item.productId)).title;
                return `کالای ${productDisplay} به مقدار درخواست شده موجود نیست`;
            }))
            .toArray();
    }
};

module.exports = InventoryDomain;