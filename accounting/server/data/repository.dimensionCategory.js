"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class DimensionCategoryRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
    }

    findById(id) {
        return this.knex.table('dimensionCategories')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first();
    }

    update(entity) {
        return this.knex('dimensionCategories')
            .modify(this.modify, this.branchId)
            .where('id', entity.id)
            .update(entity);
    }
}

module.exports = DimensionCategoryRepository;
