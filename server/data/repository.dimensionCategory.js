"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

class DimensionCategoryRepository {
    constructor(knexService) {
        this.knexService = knexService;
    }

    findById(id) {
        return this.knexService.table('dimensionCategories')
            .where('id', id)
            .first();
    }

    update(entity) {
        return this.knexService('dimensionCategories')
            .where('id', entity.id)
            .update(entity);
    }
}

module.exports = DimensionCategoryRepository;
