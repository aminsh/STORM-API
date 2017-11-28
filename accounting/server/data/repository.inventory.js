"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class InventoryRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
    }

    findById(id) {
        let inventory = await(this.knex.table('inventories').where('id', id).first());

        if (!inventory) return null;

        let inventoryLines = await(this.knex.table('inventoryLines').where('inventoryId', id));

        inventory.inventoryLines = inventoryLines;

        return inventory;
    }

    findFirst(stockId, fiscalPeriodId, expectId) {

        let query = this.knex.select('id')
            .from('inventories')
            .where('branchId', this.branchId)
            .where('fiscalPeriodId', fiscalPeriodId)
            .where('inventoryType', 'input')
            .where('ioType', 'inputFirst')
            .where('stockId', stockId);

        if (expectId)
            query.whereNot('id', expectId);

        let first = await(query.first());

        return first ? this.findById(first.id) : null;
    }

    findByInvoiceId(invoiceId, inventoryType) {
        const ids = await(this.knex.select('id').from('inventories')
            .where('invoiceId', invoiceId)
            .where('inventoryType', inventoryType));

        if (!(ids && ids.length > 0))
            return [];

        return ids.asEnumerable()
            .select(async.result(item => await(this.findById(item.id))))
            .toArray();
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
                    .where('inventories.branchId', branchId)
                    .andWhere('fiscalPeriodId', fiscalPeriodId)
                    .andWhere('productId', productId)
                    .andWhere('stockId', stockId)
                    .as('base');
            })
                .sum('countOfProduct')
                .first());

        return query.sum;
    }

    getInventoriesByProductId(productId, fiscalPeriodId, stockId, expectInventoryLineId) {

        let query = this.knex.select('inventoryLines.*', 'inventories.inventoryType', 'inventories.ioType').from('inventories')
            .leftJoin('inventoryLines', 'inventories.id', 'inventoryLines.inventoryId')
            .where('inventoryLines.branchId', this.branchId)
            .andWhere('fiscalPeriodId', fiscalPeriodId)
            .andWhere('productId', productId)
            .andWhere('stockId', stockId)
            .orderBy('inventories.createdAt');

        if (expectInventoryLineId)
            query.whereNot('id', expectInventoryLineId);

        return await(query);
    }

    inputMaxNumber(fiscalPeriodId, stockId, ioType) {
        if (!ioType)
            throw new Error('ioType is undefined');

        return await(this.knex.table('inventories')
            .modify(this.modify, this.branchId)
            .where('inventoryType', 'input')
            .andWhere('fiscalPeriodId', fiscalPeriodId)
            .andWhere('stockId', stockId)
            .andWhere('ioType', ioType)
            .max('number')
            .first());
    }

    outputMaxNumber(fiscalPeriodId, stockId, ioType) {
        if (!ioType)
            throw new Error('ioType is undefined');

        return await(this.knex.table('inventories')
            .modify(this.modify, this.branchId)
            .where('inventoryType', 'output')
            .andWhere('fiscalPeriodId', fiscalPeriodId)
            .andWhere('stockId', stockId)
            .andWhere('ioType', ioType)
            .max('number')
            .first());
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
        const trx = await(this.transaction);

        try {
            let lines = entity.inventoryLines;

            delete  entity.inventoryLines;

            await(this.createInventory(entity, trx));

            if (lines && lines.length > 0)
                await(this.createInventoryLines(lines, entity.id, trx));

            entity.inventoryLines = lines;

            trx.commit();

            return entity;
        }
        catch (e) {
            trx.rollback();

            throw new Error(e);
        }
    }

    update(id, entity) {
        return this.knex('inventories').where('id', id).update(entity);
    }

    updateBatch(id, entity) {

        const trx = await(this.transaction);

        try {
            let lines = entity.inventoryLines;

            delete  entity.inventoryLines;

            await(this.updateInventory(id, entity, trx));

            await(this.updateInventoryLines(id, lines, trx));

            entity.inventoryLines = lines;

            trx.commit();
        }
        catch (e) {
            trx.rollback();

            throw new Error(e);
        }
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

    isExistsProduct(productId) {
        return this.knex('id')
            .from('inventoryLines')
            .modify(this.modify, this.branchId)
            .where('productId', productId)
            .first();
    }

    isExitsJournal(journalId){
        return await(this.knex('id')
            .from('inventories')
            .modify(this.modify, this.branchId)
            .where('journalId', journalId)
            .first());
    }

    isExitsStock(stockId){
        return await(this.knex('id')
            .from('inventories')
            .modify(this.modify, this.branchId)
            .where('stockId', stockId)
            .first());
    }
}

module.exports = InventoryRepository;