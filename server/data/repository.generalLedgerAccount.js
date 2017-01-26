"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class GeneralLedgerAccountRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
        this.create = async(this.create);
    }

    findById(id) {
        return this.knex.table('generalLedgerAccounts')
            .where('id', id)
            .first();
    }

    findByCode(code, notEqualId) {
        let query = this.knex.table('generalLedgerAccounts')
            .where('code', code);

        if (notEqualId)
            query.andWhere('id', '$ne', notEqualId);

        return query.first();
    }

    create(entity) {
        entity.id = await(this.knex('generalLedgerAccounts')
            .returning('id')
            .insert(entity));

        return entity;
    }

    update(entity) {
        return this.knex('generalLedgerAccounts')
            .where('id', entity.id)
            .update(entity);
    }

    remove(id) {
        return this.knex('generalLedgerAccounts')
            .where('id', id)
            .del();
    }
}

module.exports = GeneralLedgerAccountRepository;