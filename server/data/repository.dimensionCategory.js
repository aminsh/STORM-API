"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

class DimensionCategoryRepository {
    constructor(knex) {
        this.knex = knex;
    }

    findById(id) {
        return this.knex.table('dimensionCategories')
            .where('id', id)
            .first();
    }

    update(entity) {
        return this.knex('dimensionCategories')
            .where('id', entity.id)
            .update(entity);
    }
}

module.exports = DimensionCategoryRepository;
