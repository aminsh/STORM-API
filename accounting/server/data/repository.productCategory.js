"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class ProductCategoryRepository extends BaseRepository {

    constructor(branchId) {
        super(branchId)
    }

    findById(id) {
        return this.knex.table('productCategories')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first();
    }

    create(entity) {
        super.create(entity);
        await(this.knex('productCategories').insert(entity));
    }

    update(id, entity) {
        await(this.knex('productCategories')
            .modify(this.modify, this.branchId)
            .where('id', id).update(entity));
    }

    remove(id) {
        await(this.knex('productCategories')
            .modify(this.modify, this.branchId)
            .where('id', id).del());
    }
}

module.exports = ProductCategoryRepository;