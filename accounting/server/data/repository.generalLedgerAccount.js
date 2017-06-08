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
        let generalLedgerAccount = await(
            this.knex.table('generalLedgerAccounts')
                .modify(this.modify, this.branchId)
                .where('id', id)
                .first()),
            subsidiaryLedgerAccounts = await(
                this.knex.select().from('subsidiaryLedgerAccounts')
                    .modify(this.modify, this.branchId)
                    .where('generalLedgerAccountId', id));

        generalLedgerAccount.subsidiaryLedgerAccounts = subsidiaryLedgerAccounts;

        return generalLedgerAccount;
    }

    findByCode(code, notEqualId) {
        let query = this.knex.table('generalLedgerAccounts')
            .modify(this.modify, this.branchId)
            .where('code', code);

        if (notEqualId)
            query.andWhere('id', '!=', notEqualId);

        return query.first();
    }

    create(entity) {
        if (Array.isArray(entity))
            entity.forEach(e => super.create(e));
        else
            super.create(entity);

        return this.knex('generalLedgerAccounts').insert(entity);
    }

    update(entity) {
        return this.knex('generalLedgerAccounts')
            .modify(this.modify, this.branchId)
            .where('id', entity.id)
            .update(entity);
    }

    remove(id) {
        return this.knex('generalLedgerAccounts')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .del();
    }
}

module.exports = GeneralLedgerAccountRepository;