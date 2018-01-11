"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class InvoiceRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
    }

    findById(id) {

        let knex = this.knex,
            data = await(this.knex.select(
                'invoices.*', 'invoiceLines.*',
                knex.raw('"invoices"."description" as "invoiceDescription"'),
                knex.raw('"invoiceLines"."description" as "invoiceLineDescription"'),
                knex.raw('"invoiceLines"."id" as "invoiceLineId"'),
                knex.raw('"detailAccounts"."title" as "detailAccountTitle"'),
                knex.raw('"detailAccounts"."code" as "detailAccountCode"')
            ).from('invoices')
                .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                .leftJoin('detailAccounts','detailAccounts.id','invoices.detailAccountId')
                .where('invoices.branchId', this.branchId)
                .andWhere('invoices.id', id));

        let first = data[0];

        if (!first) return null;

        let invoice = {
            id: first.invoiceId,
            number: first.number,
            date: first.date,
            detailAccountId: first.detailAccountId,
            detailAccount: {
                title: first.detailAccountTitle,
                code: first.detailAccountCode
            },
            description: first.invoiceDescription,
            referenceId: first.referenceId,
            journalId: first.journalId,
            invoiceStatus: first.invoiceStatus,
            orderId: first.orderId,
            invoiceType: first.invoiceType,
            ofInvoiceId: first.ofInvoiceId,
            costs: first.costs,
            charges: first.charges,
            bankReceiptNumber: (first.custom || {}).bankReceiptNumber,
            discount: first.discount
        };

        invoice.invoiceLines = data.asEnumerable().select(line => ({
            id: line.invoiceLineId,
            invoiceId: line.invoiceId,
            productId: line.productId,
            description: line.invoiceLineDescription,
            unitPrice: line.unitPrice,
            quantity: line.quantity,
            discount: line.discount,
            stockId: line.stockId,
            vat: line.vat
        }))
            .toArray();

        return invoice;
    }

    findByNumber(number, type, notEqualId) {
        let query = this.knex.table('invoices')
            .modify(this.modify, this.branchId)
            .where('invoiceType', type)
            .where('number', number);

        if (notEqualId)
            query.andWhere('id', '!=', notEqualId);

        return query.first();
    }

    findInvoiceLinesByInvoiceId(id) {
        return this.knex.table('invoiceLines').where('invoiceId', id);
    }

    maxNumber(invoiceType) {
        const result = await(this.knex.table('invoices')
            .modify(this.modify, this.branchId)
            .where('invoiceType', invoiceType)
            .max('number')
            .first());

        return result && result.max ? result.max || 0 : 0;
    }

    isNumberDuplicated(number, invoiceType, notEqualId){
        let query = this.knex.select('id')
            .from('invoices')
            .modify(this.modify, this.branchId)
            .where('invoiceType', invoiceType)
            .where('number', number);

        if(notEqualId)
            query.where('id', '!=', notEqualId);

        return await(query.first());
    }

    create(entity) {

        const trx = await(this.transaction);

        try {
            let lines = entity.invoiceLines;

            delete  entity.invoiceLines;

            await(this.createInvoice(entity, trx));

            await(this.createInvoiceLines(lines, entity.id, trx));

            entity.invoiceLines = lines;

            trx.commit();

            return entity;
        }
        catch (e) {
            trx.rollback();

            throw new Error(e);
        }
    }

    update(id, entity) {
        await(this.knex('invoices').where('id', id).update(entity));
    }

    updateBatch(id, entity) {
        this.entity = entity;

        return await(new Promise((resolve, reject) => {
            this.knex.transaction(async(trx => {
                let entity = this.entity;

                try {
                    let lines = this.entity.invoiceLines;

                    delete  entity.invoiceLines;

                    await(this.updateInvoice(id, entity, trx));

                    await(this.updateInvoiceLines(id, lines, trx));

                    entity.invoiceLines = lines;

                    resolve(entity);
                }
                catch (e) {
                    reject(e);
                }
            }));
        }));
    }

    remove(id) {
        return await(this.knex('invoices').where('id', id).del());
    }

    createInvoice(entity, trx) {
        super.create(entity);

        await(this.knex('invoices')
            .transacting(trx)
            .insert(entity));

        return entity;
    }

    updateInvoice(id, entity, trx) {

        await(this.knex('invoices')
            .transacting(trx)
            .where('id', id)
            .update(entity));

        return entity;
    }

    createInvoiceLines(lines, id, trx) {
        lines.forEach(line => {
            super.create(line);
            line.invoiceId = id;
        });

        await(this.knex('invoiceLines')
            .transacting(trx)
            .insert(lines));
    }

    updateInvoiceLines(id, lines, trx) {
        let persistedLines = await(this.knex.table('invoiceLines').where('invoiceId', id)),

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
                line.invoiceId = id;
            });

            await(this.knex('invoiceLines')
                .transacting(trx)
                .insert(shouldAddedLines));
        }

        if (shouldDeletedLines.asEnumerable().any())
            shouldDeletedLines.forEach(e => await(this.knex('invoiceLines')
                .transacting(trx).where('id', e.id).del()));

        if (shouldUpdatedLines.asEnumerable().any())
            shouldUpdatedLines.forEach(e => await(this.knex('invoiceLines')
                .transacting(trx).where('id', e.id).update(e)));
    }

    isExistsProduct(productId) {
        return await(this.knex('id')
            .from('invoiceLines')
            .modify(this.modify, this.branchId)
            .where('productId', productId)
            .first());
    }

    isExistsCustomer(customerId) {
        return await(this.knex('id')
            .from('invoices')
            .modify(this.modify, this.branchId)
            .where('detailAccountId', customerId)
            .first());
    }

    isExitsJournal(journalId) {
        return await(this.knex('id')
            .from('invoices')
            .modify(this.modify, this.branchId)
            .where('journalId', journalId)
            .first());
    }

    isExitsStock(stockId) {
        return await(this.knex.select('id')
            .from('invoiceLines')
            .modify(this.modify, this.branchId)
            .where('stockId', stockId)
            .first()
        );
    }
}

module.exports = InvoiceRepository;