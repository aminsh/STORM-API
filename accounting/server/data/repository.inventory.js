"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

module.exports = class InventoryRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
        this.findById = async(this.findById);
        this.create = async(this.create);
        this.createInventory = async(this.createInventory);
        this.createInventoryLines = async(this.createInventoryLines);
        this.updateInventory = async(this.updateInventory);
        this.updateInventoryLines = async(this.updateInventoryLines);
        this.findFirst = async(this.findFirst);
    }

    findById(id) {
        let inventory = await(this.knex.table('inventories').where('id', id).first());

        if (!inventory) return null;

        let inventoryLines = await(this.knex.table('inventoryLines').where('inventoryId', id));

        inventory.inventoryLines = inventoryLines;

        return inventory;
    }

    findFirst(stockId) {
        const first = await(this.knex.select('id')
            .from('inventories')
            .where('branchId', this.branchId)
            .where('inventoryType', 'input')
            .where('ioType', 'inputFirst')
            .where('stockId', stockId)
            .first());

        return first ? this.findById(first.id) : null;
    }

    findInvoiceLinesByInvoiceId(id) {
        return this.knex.table('inventoryLines').where('inventoryId', id);
    }

    getInventoryByProduct(productId, fiscalPeriodId, stockId) {

        let knex = this.knex,
            branchId = this.branchId,

            query = await(knex.from(function () {
                this.select(knex.raw(`((case
                     when "inventories"."inventoryType" = 'input' then 1
                     when "inventories"."inventoryType" = 'output' then -1
                     end) * "inventoryLines"."quantity") as "countOfProduct"`))
                    .from('inventories')
                    .leftJoin('inventoryLines', 'inventories.id', 'inventoryLines.inventoryId')
                    .where('branchId', branchId)
                    .andWhere('fiscalPeriodId', fiscalPeriodId)
                    .andWhere('productId', productId)
                    .andWhere('stockId', stockId)
                    .as('base');
            })
                .sum('countOfProduct')
                .first());

        return query.sum;
    }

    getInventoriesByProductId(productId, fiscalPeriodId, stockId) {

        return this.knex.select('inventoryLines.*', 'inventories.inventoryType', 'inventories.ioType').from('inventories')
            .leftJoin('inventoryLines', 'inventories.id', 'inventoryLines.inventoryId')
            .where('inventoryLines.branchId', this.branchId)
            .andWhere('fiscalPeriodId', fiscalPeriodId)
            .andWhere('productId', productId)
            .andWhere('stockId', stockId)
            .orderBy('inventories.createdAt')
    }

    inputMaxNumber(fiscalPeriodId) {
        return this.knex.table('inventories')
            .modify(this.modify, this.branchId)
            .where('inventoryType', 'input')
            .andWhere('fiscalPeriodId', fiscalPeriodId)
            .max('number')
            .first();
    }

    outputMaxNumber(fiscalPeriodId, stockId) {
        return this.knex.table('inventories')
            .modify(this.modify, this.branchId)
            .where('inventoryType', 'output')
            .andWhere('fiscalPeriodId', fiscalPeriodId)
            .andWhere('stockId', stockId)
            .max('number')
            .first();
    }

    getAllInputBeforeDate(fiscalPeriodId, productId, date) {
        return this.knex.table('inventories')
            .leftJoin('inventoryLines', 'inventories.id', 'inventoryLines.inventoryId')
            .where('inventories.branchId', this.branchId)
            .andWhere('inventoryType', 'input')
            .andWhere('fiscalPeriodId', fiscalPeriodId)
            .andWhere('inventories.createdAt', '<', date)
            .andWhere('productId', productId);
    }

    create(entity) {
        this.entity = entity;

        return new Promise((resolve, reject) => {
            this.knex.transaction(async(trx => {
                let entity = this.entity;

                try {
                    let lines = this.entity.inventoryLines;

                    delete  entity.inventoryLines;

                    await(this.createInventory(entity, trx));

                    (lines && lines.length) && await(this.createInventoryLines(lines, entity.id, trx));

                    entity.inventoryLines = lines;

                    resolve(entity);
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }

    update(id, entity) {
        return this.knex('inventories').where('id', id).update(entity);
    }

    updateBatch(id, entity) {
        this.entity = entity;

        return new Promise((resolve, reject) => {
            this.knex.transaction(async(trx => {
                let entity = this.entity;

                try {
                    let lines = this.entity.inventoryLines;

                    delete  entity.inventoryLines;

                    await(this.updateInventory(id, entity, trx));

                    await(this.updateInventoryLines(id, lines, trx));

                    entity.inventoryLines = lines;

                    resolve(entity);
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }

    remove(id) {
        return this.knex('inventories').where('id', id).del();
    }

    createInventory(entity, trx) {
        super.create(entity);

        await(this.knex('inventories')
            .transacting(trx)
            .insert(entity));

        return entity;
    }

    updateInventory(id, entity, trx) {

        entity.id = await(this.knex('inventories')
            .transacting(trx)
            .where('id', id)
            .update(entity));

        return entity;
    }

    createInventoryLines(lines, id, trx) {
        lines.forEach(line => {
            super.create(line);
            line.inventoryId = id;

        });

        await(this.knex('inventoryLines')
            .transacting(trx)
            .insert(lines));
    }

    updateInventoryLines(id, lines, trx) {
        let persistedLines = await(this.knex.table('inventoryLines').where('inventoryId', id)),

            shouldDeletedLines = persistedLines.asEnumerable()
                .where(e => !lines.asEnumerable().any(p => p.id == e.id))
                .toArray(),
            shouldAddedLines = lines.asEnumerable()
                .where(e => !persistedLines.asEnumerable().any(p => p.id == e.id))
                .toArray(),
            shouldUpdatedLines = lines.asEnumerable()
                .where(e => persistedLines.asEnumerable().any(p => p.id == e.id))
                .toArray();

        if (shouldAddedLines.asEnumerable().any()) {
            shouldAddedLines.forEach(line => {
                super.create(line);
                line.inventoryId = id;
            });

            await(this.knex('inventoryLines')
                .transacting(trx)
                .insert(shouldAddedLines));
        }

        if (shouldDeletedLines.asEnumerable().any())
            shouldDeletedLines.forEach(e => await(this.knex('inventoryLines')
                .transacting(trx).where('id', e.id).del()));

        if (shouldUpdatedLines.asEnumerable().any())
            shouldUpdatedLines.forEach(e => await(this.knex('inventoryLines')
                .transacting(trx).where('id', e.id).update(e)));
    }
};