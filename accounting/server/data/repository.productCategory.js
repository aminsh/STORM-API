"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

module.exports = class ProductCategoryRepository extends BaseRepository {

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
        return this.knex('productCategories').insert(entity);
    }

    update(id, entity) {
        return this.knex('productCategories')
            .modify(this.modify, this.branchId)
            .where('id', id).update(entity);
    }

    remove(id) {
        return this.knex('productCategories')
            .modify(this.modify, this.branchId)
            .where('id', id).del();
    }
};