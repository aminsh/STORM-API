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
        let knex = this.knex,

            handler = (resolve, reject) => {
                knex.transaction(async(trx => {
                    try {
                        let lines = entity.lines;

                        delete  entity.lines;

                        this.createSale(entity , trx);

                        this.createSaleLines(lines,entity.id, trx);

                        resolve(entity);
                    }
                    catch (e) {
                        reject(e);
                    }
                }));
            };

        return new Promise(handler);
    }

    createSale(entity, trx) {
        entity.id = await(this.knex('sales')
            .transacting(trx)
            .returning('id')
            .insert(entity))[0];
    }

    createSaleLines(lines, salesId, trx){

        lines.forEach(line => {
            line.saleId = salesId;
        });

        await(this.knex
            .transacting(trx)
            .insert(lines));
    }
};