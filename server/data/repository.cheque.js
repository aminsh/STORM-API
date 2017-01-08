"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

class ChequeRepository {
    constructor(knexService) {
        this.knexService = knexService;
    }

    findById(id) {
        return this.knexService.table('cheques')
            .where('id', id)
            .first();
    }

    update(entity) {
        return this.knexService('cheques')
            .where('id', entity.id)
            .update(entity);
    }
}

module.exports = ChequeRepository;
