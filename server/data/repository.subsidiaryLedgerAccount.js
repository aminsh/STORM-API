"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

class SubsidiaryLedgerAccountRepository {
    constructor(knex) {
        this.knex = knex;
        this.create = async(this.create);
    }

    findById(id) {
        return this.knex.table('subsidiaryLedgerAccounts')
            .where('id', id)
            .first();
    }

    findByCode(code, generalLedgerAccountId, notEqualId) {
        let query = this.knex.table('subsidiaryLedgerAccounts')
            .where('code', code)
            .andWhere('generalLedgerAccountId', generalLedgerAccountId);

        if (notEqualId)
            query.andWhere('id', '$ne', notEqualId);

        return query.first();
    }

    create(entity) {
        entity.id = await(this.knex('subsidiaryLedgerAccounts')
            .returning('id')
            .insert(entity));

        return entity;
    }

    update(entity) {
        return this.knex('subsidiaryLedgerAccounts')
            .where('id', id)
            .update(entity);
    }

    remove(id) {
        return this.knex('subsidiaryLedgerAccounts')
            .where('id', id)
            .del();
    }
}

module.exports = SubsidiaryLedgerAccountRepository;

