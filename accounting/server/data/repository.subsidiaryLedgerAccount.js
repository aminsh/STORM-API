"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class SubsidiaryLedgerAccountRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
        this.create = async(this.create);
    }

    findById(id) {
        return this.knex.table('subsidiaryLedgerAccounts')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first();
    }

    findByCode(code, generalLedgerAccountId, notEqualId) {
        let query = this.knex.table('subsidiaryLedgerAccounts')
            .where('code', code);

        if(generalLedgerAccountId)
            query.andWhere('generalLedgerAccountId', generalLedgerAccountId);

        if (notEqualId)
            query.andWhere('id', '!=', notEqualId);

        return query.first();
    }

    create(entity) {

        if (Array.isArray(entity))
            entity.forEach(e => super.create(e));
        else
            super.create(entity);

        return this.knex('subsidiaryLedgerAccounts').insert(entity);
    }

    update(entity) {
        return this.knex('subsidiaryLedgerAccounts')
            .modify(this.modify, this.branchId)
            .where('id', entity.id)
            .update(entity);
    }

    remove(id) {
        return this.knex('subsidiaryLedgerAccounts')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .del();
    }

    isUsedOnJournalLines(id){
        return this.knex.from('journalLines')
            .modify(this.modify, this.branchId)
            .where('subsidiaryLedgerAccountId', id)
            .first();
    }
}

module.exports = SubsidiaryLedgerAccountRepository;

