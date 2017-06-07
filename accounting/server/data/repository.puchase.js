"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

module.exports = class PurchaseRepository extends BaseRepository {
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

                    await(this.createPurchase(entity, trx));

                    await(this.createPurchaseLines(lines, entity.id, trx));

                    resolve(entity);
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }

    createPurchase(entity, trx) {
        super.create(entity);

        entity.id = await(this.knex('purchases')
            .transacting(trx)
            .returning('id')
            .insert(entity))[0];

        return entity;
    }

    createPurchaseLines(lines, salesId, trx) {
        lines.forEach(line => {
            super.create(line);
            line.saleId = salesId;
        });

        await(this.knex('purchaseLines')
            .transacting(trx)
            .insert(lines));
    }
};