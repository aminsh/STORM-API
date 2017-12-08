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
        return await(this.knex.table('subsidiaryLedgerAccounts')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first());
    }

    findByCode(code, generalLedgerAccountId, notEqualId) {
        let query = this.knex.table('subsidiaryLedgerAccounts')
            .where('branchId', this.branchId)
            .andWhere('code', code);

        if(generalLedgerAccountId)
            query.andWhere('generalLedgerAccountId', generalLedgerAccountId);

        if (notEqualId)
            query.andWhere('id', '!=', notEqualId);

        return await(query.first());
    }

    create(entity) {

        if (Array.isArray(entity))
            entity.forEach(e => super.create(e));
        else
            super.create(entity);

        await(this.knex('subsidiaryLedgerAccounts').insert(entity));
    }

    update(id,entity) {
        return await(this.knex('subsidiaryLedgerAccounts')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .update(entity));
    }

    remove(id) {
        return await(this.knex('subsidiaryLedgerAccounts')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .del());
    }

    isUsedOnJournalLines(id){
        return await(this.knex.from('journalLines')
            .modify(this.modify, this.branchId)
            .where('subsidiaryLedgerAccountId', id)
            .first());
    }
}

module.exports = SubsidiaryLedgerAccountRepository;

