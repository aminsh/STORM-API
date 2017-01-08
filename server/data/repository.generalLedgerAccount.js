"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

class GeneralLedgerAccountRepository {
    constructor(knexService) {
        this.knexService = knexService;
        this.create = async(this.create);
    }

    findById(id) {
        return this.knexService.table('generalLedgerAccounts')
            .where('id', id)
            .first();
    }

    findByCode(code, notEqualId) {
        let query = this.knexService.table('generalLedgerAccounts')
            .where('code', code);

        if (notEqualId)
            query.andWhere('id', '$ne', notEqualId);

        return query.first();
    }

    create(entity) {
        entity.id = await(this.knexService('generalLedgerAccounts')
            .returning('id')
            .insert(entity));

        return entity;
    }

    update(entity) {
        return this.knexService('generalLedgerAccounts')
            .where('id', entity.id)
            .update(entity);
    }

    remove(id) {
        return this.knexService('generalLedgerAccounts')
            .where('id', id)
            .del();
    }
}

module.exports = GeneralLedgerAccountRepository;