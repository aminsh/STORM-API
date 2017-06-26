"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

module.exports = class ProductRepository extends BaseRepository {

    constructor(branchId) {
        super(branchId)
    }

    findById(id) {
        return this.knex.table('products')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first();
    }

    isGood(id){
        return this.knex.table('products')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .andWhere('productType', 'good')
            .first();
    }

    findByReferenceId(referenceId) {
        return this.knex.table('products')
            .modify(this.modify, this.branchId)
            .where('referenceId', referenceId)
            .first();
    }

    create(entity) {
        super.create(entity);
        return this.knex('products').insert(entity);
    }

    update(id, entity) {
        return this.knex('products')
            .modify(this.modify, this.branchId)
            .where('id', id).update(entity);
    }

    remove(id) {
        return this.knex('products')
            .modify(this.modify, this.branchId)
            .where('id', id).del();
    }
};