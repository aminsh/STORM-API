"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

module.exports = class InvoiceRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
        this.create = async(this.create);
        this.createInvoice = async(this.createInvoice);
        this.createInvoiceLines = async(this.createInvoiceLines);
        this.updateInvoice = async(this.updateInvoice);
        this.updateInvoiceLines = async(this.updateInvoiceLines);
    }

    findById(id) {
        return this.knex.table('invoices').where('id', id).first();
    }

    saleMaxNumber() {
        return this.knex.table('invoices')
            .modify(this.modify, this.branchId)
            .where('invoiceType', 'sale')
            .max('number');
    }

    create(entity) {
        this.entity = entity;

        return new Promise((resolve, reject) => {
            this.knex.transaction(async(trx => {
                let entity = this.entity;

                try {
                    let lines = this.entity.lines;

                    delete  entity.lines;

                    await(this.createInvoice(entity, trx));

                    await(this.createInvoiceLines(lines, entity.id, trx));

                    entity.lines = lines;

                    resolve(entity);
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }

    update(id, entity) {
        this.entity = entity;

        return new Promise((resolve, reject) => {
            this.knex.transaction(async(trx => {
                let entity = this.entity;

                try {
                    let lines = this.entity.lines;

                    delete  entity.lines;

                    await(this.updateInvoice(id ,entity, trx));

                    await(this.updateInvoiceLines(lines, id, trx));

                    entity.lines = lines;

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
                .where(e => !lines.asEnumerable().any(p => p.id == e.id)),
            shouldAddedLines = lines.asEnumerable()
                .where(e => !persistedLines.asEnumerable().any(p => p.id == e.id)),
            shouldUpdatedLines = persistedLines.asEnumerable()
                .where(e => lines.asEnumerable().any(p => p.id == e.id));

        shouldAddedLines.forEach(line => {
            super.create(line);
            line.invoiceId = id;
        });

        await(this.knex('invoiceLines')
            .transacting(trx)
            .insert(shouldAddedLines));

        shouldDeletedLines.forEach(e => this.knex('invoiceLines')
            .transacting(trx).where('id', e.id).del(e));
        shouldUpdatedLines.forEach(e => this.knex('invoiceLines')
            .transacting(trx).where('id', e.id).update(e));

        lines.forEach(line => await(this.knex('invoiceLines')
            .transacting(trx)
            .where('id', line.id)
            .update(line)));
    }
};