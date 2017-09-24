"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class InvoiceRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
        this.findById = async(this.findById);
        this.create = async(this.create);
        this.createInvoice = async(this.createInvoice);
        this.createInvoiceLines = async(this.createInvoiceLines);
        this.updateInvoice = async(this.updateInvoice);
        this.updateInvoiceLines = async(this.updateInvoiceLines);
    }

    findById(id) {

        let knex = this.knex,
            data = await(this.knex.select(
                '*',
                knex.raw('"invoices"."description" as "invoiceDescription"'),
                knex.raw('"invoiceLines"."description" as "invoiceLineDescription"'),
                knex.raw('"invoiceLines"."id" as "invoiceLineId"')
            ).from('invoices')
            .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
            .where('invoices.branchId', this.branchId)
            .andWhere('invoices.id', id));

        let first = data[0],
            invoice = {
                id: first.invoiceId,
                number: first.number,
                date: first.date,
                detailAccountId: first.detailAccountId,
                description: first.invoiceDescription,
                referenceId: first.referenceId,
                journalId: first.journalId,
                invoiceStatus: first.invoiceStatus,
                orderId: first.orderId,
                invoiceType: first.invoiceType,
            };

        invoice.invoiceLines = data.asEnumerable().select(line => ({
            id: line.invoiceLineId,
            invoiceId: line.invoiceId,
            productId: line.productId,
            description: line.invoiceLineDescription,
            unitPrice: line.unitPrice,
            quantity: line.quantity,
            discount: line.discount,
            vat: line.vat
        }))
            .toArray();

        return invoice;
    }

    findByNumber(number,type, notEqualId) {
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

    saleMaxNumber() {
        return this.knex.table('invoices')
            .modify(this.modify, this.branchId)
            .where('invoiceType', 'sale')
            .max('number')
            .first();
    }

    purchaseMaxNumber() {
        return this.knex.table('invoices')
            .modify(this.modify, this.branchId)
            .where('invoiceType', 'purchase')
            .max('number')
            .first();
    }

    create(entity) {
        this.entity = entity;

        return new Promise((resolve, reject) => {
            this.knex.transaction(async(trx => {
                let entity = this.entity;

                try {
                    let lines = this.entity.invoiceLines;

                    delete  entity.invoiceLines;

                    await(this.createInvoice(entity, trx));

                    await(this.createInvoiceLines(lines, entity.id, trx));

                    entity.invoiceLines = lines;

                    resolve(entity);
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }

    update(id, entity) {
        return this.knex('invoices').where('id', id).update(entity);
    }

    updateBatch(id, entity) {
        this.entity = entity;

        return new Promise((resolve, reject) => {
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
        });
    }

    remove(id) {
        return this.knex('invoices').where('id', id).del();
    }

    createInvoice(entity, trx) {
        super.create(entity);

        entity.id = await(this.knex('invoices')
            .transacting(trx)
            .returning('id')
            .insert(entity))[0];

        return entity;
    }

    updateInvoice(id, entity, trx) {

        entity.id = await(this.knex('invoices')
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
                .transacting(trx).where('id', e.id).del(e)));

        if (shouldUpdatedLines.asEnumerable().any())
            shouldUpdatedLines.forEach(e => await(this.knex('invoiceLines')
                .transacting(trx).where('id', e.id).update(e)));
    }

    isExistsProduct(productId) {
        return this.knex('id')
            .from('invoiceLines')
            .modify(this.modify, this.branchId)
            .where('productId', productId)
            .first();
    }

    isExistsCustomer(customerId) {
        return this.knex('id')
            .from('invoices')
            .modify(this.modify, this.branchId)
            .where('detailAccountId', customerId)
            .first();
    }
};

module.exports = InvoiceRepository;