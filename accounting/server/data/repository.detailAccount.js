"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class DetailAccountRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId)
        this.create = async(this.create);
    }

    findById(id) {
        return this.knex.table('detailAccounts')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first();
    }

    findByCode(code, notEqualId) {
        let query = this.knex.table('detailAccounts')
            .modify(this.modify, this.branchId)
            .where('code', code);

        if (notEqualId)
            query.andWhere('id', '!=', notEqualId);

        return query.first();
    }

    findByReferenceId(referenceId) {
        return this.knex.table('detailAccounts')
            .modify(this.modify, this.branchId)
            .where('referenceId', referenceId)
            .first();
    }

    create(entity) {
        super.create(entity);

        entity.id = await(this.knex('detailAccounts')
            .returning('id')
            .insert(entity))[0];

        return entity;
    }

    update(entity) {
        return this.knex('detailAccounts')
            .modify(this.modify, this.branchId)
            .where('id', entity.id)
            .update(entity);
    }

    remove(id) {
        return this.knex('detailAccounts')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .del();
    }
}

module.exports = DetailAccountRepository;
