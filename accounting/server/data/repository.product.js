"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class ProductRepository extends BaseRepository {

    constructor(branchId) {
        super(branchId)
    }

    findById(id) {
        return this.knex.table('products')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first();
    }


    /*
    * @return products by id array list
    * @param ids
    */

    findByIds(ids) {
        return this.knex.table('products')
            .modify(this.modify, this.branchId)
            .whereIn('id', ids);
    }

    isGood(id) {
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

        if (Array.isArray(entity))
            entity.forEach(item => super.create(item));
        else
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

module.exports = ProductRepository;