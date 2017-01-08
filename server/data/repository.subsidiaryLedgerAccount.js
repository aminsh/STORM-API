"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

class SubsidiaryLedgerAccountRepository {
    constructor(knexService) {
        this.knexService = knexService;
        this.create = async(this.create);
    }

    findById(id) {
        return this.knexService.table('subsidiaryLedgerAccounts')
            .where('id', id)
            .first();
    }

    findByCode(code, generalLedgerAccountId, notEqualId) {
        let query = this.knexService.table('subsidiaryLedgerAccounts')
            .where('code', code)
            .andWhere('generalLedgerAccountId', generalLedgerAccountId);

        if (notEqualId)
            query.andWhere('id', '$ne', notEqualId);

        return query.first();
    }

    create(entity) {
        entity.id = await(this.knexService('subsidiaryLedgerAccounts')
            .returning('id')
            .insert(entity));

        return entity;
    }

    update(entity) {
        return this.knexService('subsidiaryLedgerAccounts')
            .where('id', id)
            .update(entity);
    }

    remove(id) {
        return this.knexService('subsidiaryLedgerAccounts')
            .where('id', id)
            .del();
    }
}

module.exports = SubsidiaryLedgerAccountRepository;

