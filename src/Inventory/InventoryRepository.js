import toResult from "asyncawait/await";
import { BaseRepository } from "../Infrastructure/BaseRepository";
import { injectable } from "inversify";

@injectable()
export class InventoryRepository extends BaseRepository {

    findById(id) {
        let inventory = toResult(this.knex.table('inventories').where('id', id).first());

        if (!inventory) return null;

        let inventoryLines = toResult(this.knex.table('inventoryLines').where('inventoryId', id));

        inventory.inventoryLines = inventoryLines;

        return inventory;
    }

    findByIds(ids) {
        return toResult(
            this.knex.select('*').from('inventories')
                .where({ branchId: this.branchId })
                .whereIn('id', ids)
        );
    }

    findOneLine(condition) {
        condition = ( condition || {} );
        condition.branchId = this.branchId;

        return toResult(
            this.knex.select('*').from('inventoryLines').where(condition).first()
        );
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

    findAllProduct(filter) {
        let branchId = this.branchId,
            state = this.state,
            query = this.knex.select('productId')
                .from(function () {
                    this.from('inventories')
                        .leftJoin('inventoryLines', 'inventories.id', 'inventoryLines.inventoryId')
                        .where('inventories.branchId', branchId)
                        .where('fiscalPeriodId', state.fiscalPeriodId)
                        .whereBetween('date', [ filter.minDate, filter.maxDate ])
                        .as('base');
                })
                .groupBy('productId');

        if (filter.stockIds && filter.stockIds.length > 0)
            query.whereIn('stockId', filter.stockIds);

        let result = toResult(query);

        return result.map(item => item.productId);
    }

    findAllInventories(condition, dateRange) {
        condition = Object.assign({}, condition, {
            branchId: this.branchId,
            fiscalPeriodId: this.state.fiscalPeriodId
        });

        let query = this.knex.select('*').from('inventories').where(condition);

        if (dateRange && dateRange.length > 0)
            query.whereBetween('date', dateRange);

        return toResult(query);
    }

    findInventoriesAndLinesFlatten(dateRange, exceptInventories) {
        const self = {
                tableName: 'inventories',
                inventoryLineTableName: 'inventoryLines',
                branchId: this.branchId,
                fiscalPeriodId: this.state.fiscalPeriodId
            },
            knex = this.knex;

        const query = this.knex.select('*').from(function () {
            this.select(
                `${self.inventoryLineTableName}.productId`,
                `${self.inventoryLineTableName}.quantity`,
                `${self.inventoryLineTableName}.unitPrice`,
                `${self.inventoryLineTableName}.baseInventoryId`,
                knex.raw(`"${self.inventoryLineTableName}".id as "lineId"`),
                `${self.tableName}.id`,
                `${self.tableName}.ioType`,
                `${self.tableName}.stockId`,
                knex.raw(`${self.tableName}."inventoryType" as type`)
            )
                .from(self.tableName)
                .leftJoin(self.inventoryLineTableName, `${self.inventoryLineTableName}.inventoryId`, `${self.tableName}.id`)
                .where(`${self.tableName}.branchId`, self.branchId)
                .where(`${self.tableName}.fiscalPeriodId`, self.fiscalPeriodId)
                .whereBetween(`${self.tableName}.date`, dateRange)
                .whereNotIn(`${self.tableName}.id`, exceptInventories)
                .orderByRaw(`${self.tableName}.date, (${self.tableName}.time AT time zone 'Iran')::time, CASE WHEN ${self.tableName}."inventoryType" = 'input' THEN 1 ELSE 2 END, ${self.tableName}.number`)
                .as('base')
        });

        return toResult(query);
    }

    findAllLinesByInventoryIds(inventoryIds) {
        return toResult(
            this.knex.select('*').from('inventoryLines')
                .where('branchId', this.branchId)
                .whereIn('inventoryId', inventoryIds)
        );
    }

    findByInvoiceId(invoiceId, inventoryType) {
        let query = this.knex.select('id').from('inventories')
            .modify(this.modify, this.branchId)
            .where('invoiceId', invoiceId);

        if (inventoryType)
            query.where('inventoryType', inventoryType);

        let ids = toResult(query);

        if (!( ids && ids.length > 0 ))
            return [];

        return ids.asEnumerable()
            .select(item => toResult(this.findById(item.id)))
            .toArray();
    }

    getInventoryByProduct(productId, fiscalPeriodId, stockId) {

        let knex = this.knex,
            branchId = this.branchId,
            modify = this.modify,

            query = toResult(knex.from(function () {
                const q = this.select(knex.raw(`((case
                     when "inventories"."inventoryType" = 'input' then 1
                     when "inventories"."inventoryType" = 'output' then -1
                     end) * "inventoryLines"."quantity") as "countOfProduct"`))
                    .from('inventories')
                    .leftJoin('inventoryLines', 'inventories.id', 'inventoryLines.inventoryId')
                    .modify(modify, branchId, 'inventories.branchId')
                    //.where('quantityStatus', '!=', 'draft')
                    .where('fiscalPeriodId', fiscalPeriodId)
                    .where('productId', productId);

                if (stockId)
                    q.where('stockId', stockId);

                q.as('base');
            })
                .sum('countOfProduct')
                .first());

        return query.sum;
    }

    getInventoriesByProductId(productId, fiscalPeriodId, stockId, expectInventoryLineId) {

        let query = this.knex.select('inventoryLines.*', 'inventories.inventoryType', 'inventories.ioType').from('inventories')
            .leftJoin('inventoryLines', 'inventories.id', 'inventoryLines.inventoryId')
            .modify(this.modify, this.branchId, 'inventories.branchId')
            .andWhere('fiscalPeriodId', fiscalPeriodId)
            .andWhere('productId', productId)
            .andWhere('stockId', stockId)
            .andWhere('quantityStatus', '!=', 'draft')
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
        catch (e) {
            trx.rollback(e);

            throw new Error(e);
        }
    }

    update(id, entity) {
        if (Array.isArray(id))
            return toResult(this.knex('inventories')
                .modify(this.modify, this.branchId)
                .whereIn('id', id).update(entity));

        return toResult(this.knex('inventories')
            .modify(this.modify, this.branchId)
            .where('id', id).update(entity));
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
        catch (e) {
            trx.rollback(e);

            throw new Error(e);
        }

    }

    updateLine(lineId, data) {
        toResult(
            this.knex('inventoryLines').where({ id: lineId }).update(data)
        );
    }

    updateLines(lines) {

        const trx = this._createdByUnitOfWork ? this.knex : this.transaction;

        try {
            lines.forEach(e => toResult(trx('inventoryLines').where('id', e.id).update(e)));

            this._createdByUnitOfWork === false && trx.commit();
        }
        catch (e) {
            this._createdByUnitOfWork === false && trx.rollback(e);

            throw new Error(e);
        }
    }

    updateLinesById(id, data) {
        toResult(
            this.knex('inventoryLines').where({ branchId: this.branchId, inventoryId: id }).update(data)
        );
    }

    remove(id) {
        return toResult(this.knex('inventories').where('id', id).del());
    }

    createInventory(entity, knex) {
        super.create(entity);

        /* entity.fixedAmount = false;
         entity.fixedQuantity = false;*/

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

    findByJournal(journalId) {
        return toResult(
            this.knex.select('id', 'journalId').from('inventories')
                .where({ branchId: this.branchId, journalId })
        );
    }
}
