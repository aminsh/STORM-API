"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

module.exports = class SaleRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
        this.create = async(this.create);
        this.createSale = async(this.createSale);
    }

    create(entity) {

        this.entity = entity;

        return new Promise((resolve, reject) => {
            this.knex.transaction(async(trx => {
                let entity=this.entity;

                try {
                    let lines = this.entity.lines;

                    delete  entity.lines;

                    await(this.createSale(entity, trx));

                    await(this.createSaleLines(lines, entity.id, trx));

                    resolve(entity);
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }

    createSale(entity, trx) {
        super.create(entity);

        entity.id = await(this.knex('sales')
            .transacting(trx)
            .returning('id')
            .insert(entity))[0];

        return entity;
    }

    createSaleLines(lines, salesId, trx) {

        lines.forEach(line => {
            super.create(line);
            line.saleId = salesId;
        });

        await(this.knex('saleLines')
            .transacting(trx)
            .insert(lines));
    }
};