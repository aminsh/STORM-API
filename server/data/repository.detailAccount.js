"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

class DetailAccountRepository {
    constructor(knexService) {
        this.knexService = knexService;
        this.create = async(this.create);
    }

    findById(id) {
        return this.knexService.table('detailAccounts')
            .where('id', id)
            .first();
    }

    findByCode(code, notEqualId) {
        let query = this.knexService.table('detailAccounts')
            .where('code', code);

        if (notEqualId)
            query.andWhere('id', '$ne', notEqualId);

        return query.first();
    }

    create(entity) {
        entity.id = await(this.knexService('detailAccounts')
            .returning('id')
            .insert(entity));

        return entity;
    }

    update(entity) {
        return this.knexService('detailAccounts')
            .where('id', entity.id)
            .update(entity);
    }

    remove(id) {
        return this.knexService('detailAccounts')
            .where('id', id)
            .del();
    }
}

module.exports = DetailAccountRepository;
