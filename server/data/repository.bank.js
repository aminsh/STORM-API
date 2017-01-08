"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

class BankRepository {
    constructor(knexService) {
        this.knexService = knexService;
        this.create = async(this.create);
    }

    findById(id) {
        return this.knexService
            .table('banks')
            .where('id', id)
            .first();
    }

    create(entity) {
        let id = await(this.knexService('banks')
            .returning('id')
            .insert(entity));

        entity.id = id;
        return entity;
    }

    update(entity) {
        return this.knexService('banks')
            .where('id', entity.id)
            .update(entity);
    }

    remove(id) {
        return this.knexService('banks')
            .where('id', id)
            .del();
    }
}


module.exports = BankRepository;
