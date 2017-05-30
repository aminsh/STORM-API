"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class DimensionRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
        this.create = async(this.create);
    }

    findById(id) {
        return this.knex.table('dimensions')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first();
    }

    findByCode(code, dimensionCategoryId, notEqualId) {
        let query = this.knex.table('dimensions')
            .modify(this.modify, this.branchId)
            .where('code', code)
            .andWhere('dimensionCategoryId', dimensionCategoryId);

        if (notEqualId)
            query.andWhere('id', '!=', notEqualId);

        return query.first();
    }

    create(entity) {
        super.create(entity);
        return this.knex('dimensions').insert(entity)
    }

    update(entity) {
        return this.knex('dimensions')
            .modify(this.modify, this.branchId)
            .where('id', entity.id)
            .update(entity);
    }

    remove(id) {
        return this.knex('dimensions')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .del();
    }
}

module.exports = DimensionRepository;

