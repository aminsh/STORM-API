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

                    resolve(entity);
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }

    createInvoice(entity, trx) {
        super.create(entity);

        entity.id = await(this.knex('sales')
            .transacting(trx)
            .returning('id')
            .insert(entity))[0];

        return entity;
    }

    createInvoiceLines(lines, salesId, trx) {
        lines.forEach(line => {
            super.create(line);
            line.saleId = salesId;
        });

        await(this.knex('saleLines')
            .transacting(trx)
            .insert(lines));
    }
};