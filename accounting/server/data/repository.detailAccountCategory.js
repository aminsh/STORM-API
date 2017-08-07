"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class DetailAccountCategoryRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
    }

    findById(id) {
        return this.knex.table('detailAccountCategories')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first();
    }

    create(entity) {
        super.create(entity);

        return this.knex('detailAccountCategories').insert(entity);
    }

    update(id ,entity) {
        return this.knex('detailAccountCategories')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .update(entity);
    }

    remove(id) {
        return this.knex('detailAccountCategories')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .del();
    }
}

module.exports = DetailAccountCategoryRepository;
