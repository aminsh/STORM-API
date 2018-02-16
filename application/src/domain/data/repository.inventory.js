import toResult from "asyncawait/await";
import {BaseRepository} from "./repository.base";
import {injectable} from "inversify";

@injectable()
export class InventoryRepository extends BaseRepository {

    findById(id) {
        let inventory = toResult(this.knex.table('inventories').where('id', id).first());

        if (!inventory) return null;

        let inventoryLines = toResult(this.knex.table('inventoryLines').where('inventoryId', id));

        inventory.inventoryLines = inventoryLines;

        return inventory;
    }

    findFirst(stockId, fiscalPeriodId, expectId) {

        let query = this.knex.select('id')
            .from('inventories')
            .modify(this.modify, this.branchId)
            .where('fiscalPeriodId', fiscalPeriodId)
            .where('inventoryType', 'input')
            .where('ioType', 'inputFirst')
            .where('stockId', stockId);

        if (expectId)
            query.whereNot('id', expectId);

        let first = toResult(query.first());

        return first ? this.findById(first.id) : null;
    }

    findByInvoiceId(invoiceId, inventoryType) {
        let query = this.knex.select('id').from('inventories')
            .modify(this.modify, this.branchId)
            .where('invoiceId', invoiceId);

        if (inventoryType)
            query.where('inventoryType', inventoryType);

        let ids = toResult(query);

        if (!(ids && ids.length > 0))
            return [];

        return ids.asEnumerable()
            .select(item => toResult(this.findById(item.id)))
            .toArray();
    }

    getInventoryByProduct(productId, fiscalPeriodId, stockId) {

        let knex = this.knex,
            branchId = this.branchId,
            modify=this.modify,

            query = toResult(knex.from(function () {
                this.select(knex.raw(`((case
                     when "inventories"."inventoryType" = 'input' then 1
                     when "inventories"."inventoryType" = 'output' then -1
                     end) * "inventoryLines"."quantity") as "countOfProduct"`))
                    .from('inventories')
                    .leftJoin('inventoryLines', 'inventories.id', 'inventoryLines.inventoryId')
                    .modify(modify, branchId, 'inventories.branchId')

                    /* TODO this control is disabled temporarily .where('fixedQuantity', true)*/

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
            .modify(this.modify, branchId, 'inventories.branchId')
            .andWhere('fiscalPeriodId', fiscalPeriodId)
            .andWhere('productId', productId)
            .andWhere('stockId', stockId)
            .orderBy('inventories.createdAt');

        if (expectInventoryLineId)
            query.whereNot('id', expectInventoryLineId);

        return toResult(query);
    }

    inputMaxNumber(fiscalPeriodId, stockId, ioType) {

        if (!ioType)
            throw new Error('ioType is undefined');

        return toResult(this.knex.table('inventories')
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

        return toResult(this.knex.table('inventories')
            .modify(this.modify, this.branchId)
            .where('inventoryType', 'output')
            .andWhere('fiscalPeriodId', fiscalPeriodId)
            .andWhere('stockId', stockId)
            .andWhere('ioType', ioType)
            .max('number')
            .first());
    }

    getAllInputBeforeDate(fiscalPeriodId, productId, date) {
        return toResult(this.knex.table('inventories')
            .leftJoin('inventoryLines', 'inventories.id', 'inventoryLines.inventoryId')
            .where('inventories.branchId', this.branchId)
            .andWhere('inventoryType', 'input')
            .andWhere('fiscalPeriodId', fiscalPeriodId)
            .andWhere('inventories.createdAt', '<', date)
            .andWhere('productId', productId));
    }

    create(entity) {
        const trx = this.transaction;

        try {
            let lines = entity.inventoryLines;

            delete  entity.inventoryLines;

            toResult(this.createInventory(entity, trx));

            if (lines && lines.length > 0)
                toResult(this.createInventoryLines(lines, entity.id, trx));

            entity.inventoryLines = lines;

            trx.commit();

            return entity;
        }
        catch (e){
            trx.rollback(e);

            throw new Error(e);
        }
    }

    update(id, entity) {
        return toResult(this.knex('inventories').where('id', id).update(entity));
    }

    updateBatch(id, entity) {

        const trx = this.transaction;

        try {

            let lines = entity.inventoryLines;

            delete  entity.inventoryLines;

            toResult(this.updateInventory(id, entity, trx));

            toResult(this.updateInventoryLines(id, lines, trx));

            entity.inventoryLines = lines;

            trx.commit();
        }
        catch (e){
            trx.rollback(e);

            throw new Error(e);
        }

    }

    updateLines(lines) {

        const trx = this.transaction;

        lines.forEach(e => toResult(this.knex('inventoryLines').transacting(trx).where('id', e.id).update(e)));
    }

    remove(id) {
        return toResult(this.knex('inventories').where('id', id).del());
    }

    createInventory(entity, knex) {
        super.create(entity);

        toResult(knex('inventories').insert(entity));

        return entity;
    }

    updateInventory(id, entity, knex) {

        entity.id = toResult(knex('inventories')
            .where('id', id)
            .update(entity));

        return entity;
    }

    createInventoryLines(lines, id, knex) {
        lines.forEach(line => {
            super.create(line);
            line.inventoryId = id;

        });

        toResult(knex('inventoryLines').insert(lines));
    }

    updateInventoryLines(id, lines, knex) {
        let persistedLines = toResult(knex.table('inventoryLines').where('inventoryId', id)),

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

            toResult(knex('inventoryLines').insert(shouldAddedLines));
        }

        if (shouldDeletedLines.asEnumerable().any())
            shouldDeletedLines.forEach(e => toResult(knex('inventoryLines').where('id', e.id).del()));

        if (shouldUpdatedLines.asEnumerable().any())
            shouldUpdatedLines.forEach(e => toResult(knex('inventoryLines').where('id', e.id).update(e)));
    }

    isExistsProduct(productId) {
        return toResult(this.knex('id')
            .from('inventoryLines')
            .modify(this.modify, this.branchId)
            .where('productId', productId)
            .first());
    }

    isExitsJournal(journalId) {
        return toResult(this.knex('id')
            .from('inventories')
            .modify(this.modify, this.branchId)
            .where('journalId', journalId)
            .first());
    }

    isExitsStock(stockId) {
        return toResult(this.knex('id')
            .from('inventories')
            .modify(this.modify, this.branchId)
            .where('stockId', stockId)
            .first());
    }
}
