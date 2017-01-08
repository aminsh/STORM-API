"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

class DimensionRepository {
    constructor(knexService) {
        this.knexService = knexService;
        this.create = async(this.create);
    }

    findById(id) {
        return this.knexService.table('dimensions')
            .where('id', id)
            .first();
    }

    findByCode(code, dimensionCategoryId, notEqualId) {
        let query = this.knexService.table('dimensions')
            .where('code', code)
            .andWhere('dimensionCategoryId', dimensionCategoryId);

        if (notEqualId)
            query.andWhere('id', '$ne', notEqualId);

        return query.first();
    }

    create(entity) {
        entity.id = await(this.knexService('dimensions')
            .returning('id')
            .insert(entity));

        return entity;
    }

    update(entity) {
        return this.knexService('dimensions')
            .where('id', id)
            .update(entity);
    }

    remove(id) {
        return this.knexService('dimensions')
            .where('id', id)
            .del();
    }
}

module.exports = DimensionRepository;

