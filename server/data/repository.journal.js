"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

class JournalRepository {
    constructor(knexService) {
        this.knexService = knexService;
        this.create = async(this.create);
        this.checkIsComplete = async(this.checkIsComplete);
    }

    findByTemporaryNumber(number, periodId) {
        return this.knexService.table('journals')
            .where('period', periodId)
            .andWhere('temporaryNumber', temporaryNumber)
            .first();
    }

    findById(id) {
        return this.knexService.table('journals')
            .where('id', id)
            .first();
    }

    maxTemporaryNumber(periodId) {
        return this.knexService.table('journals')
            .where('periodId', periodId)
            .max();
    }

    create(entity) {
        entity.id = await(this.knexService('journals')
            .returning('id')
            .insert(entity));

        return entity;
    }

    update(entity) {
        return this.knexService('journals')
            .where('id', entity.id)
            .update(entity);
    }

    remove(id) {
        return this.knexService('journals')
            .where('id', id)
            .del();
    }

    checkIsComplete(id) {
        let exp = this.knexService
            .row('sum("debtor") - sum("creditor") as "remainder"'),
            isInComplete = false,
            remainder = await(this.knexService.table('journalLines')
                .select(exp)
                .where('journalId', id)
                .first()).remainder;

        isInComplete = remainder != 0;

        return this.knexService('journals')
            .where('id', id)
            .update({ isInComplete });
    }
}

module.exports = JournalRepository;