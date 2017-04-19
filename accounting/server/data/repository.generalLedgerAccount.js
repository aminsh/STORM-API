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
        let generalLedgerAccount = await(this.knex.table('generalLedgerAccounts')
                .where('id', id)
                .first()),
            subsidiaryLedgerAccounts = await(this.knex.select().from('subsidiaryLedgerAccounts')
                .where('generalLedgerAccountId', id));

        generalLedgerAccount.subsidiaryLedgerAccounts = subsidiaryLedgerAccounts;

        return generalLedgerAccount;
    }

    findByCode(code, notEqualId) {
        let query = this.knex.table('generalLedgerAccounts')
            .where('code', code);

        if (notEqualId)
            query.andWhere('id', '!=', notEqualId);

        return query.first();
    }

    create(entity) {
        entity.id = await(this.knex('generalLedgerAccounts')
            .returning('id')
            .insert(entity))[0];

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