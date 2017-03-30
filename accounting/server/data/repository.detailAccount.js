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
            .where('id', id)
            .first();
    }

    findByCode(code, notEqualId) {
        let query = this.knex.table('detailAccounts')
            .where('code', code);

        if (notEqualId)
            query.andWhere('id', '!=', notEqualId);

        return query.first();
    }

    create(entity) {
        entity.id = await(this.knex('detailAccounts')
            .returning('id')
            .insert(entity));

        return entity;
    }

    update(entity) {
        return this.knex('detailAccounts')
            .where('id', entity.id)
            .update(entity);
    }

    remove(id) {
        return this.knex('detailAccounts')
            .where('id', id)
            .del();
    }
}

module.exports = DetailAccountRepository;