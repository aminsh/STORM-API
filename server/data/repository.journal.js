"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class JournalRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
        this.create = async(this.create);
        this.checkIsComplete = async(this.checkIsComplete);
    }

    findByTemporaryNumber(number, periodId) {
        return this.knex.table('journals')
            .where('period', periodId)
            .andWhere('temporaryNumber', temporaryNumber)
            .first();
    }

    findById(id) {
        return this.knex.table('journals')
            .where('id', id)
            .first();
    }

    maxTemporaryNumber(periodId) {
        return this.knex.table('journals')
            .where('periodId', periodId)
            .max();
    }

    create(entity) {
        entity.id = await(this.knex('journals')
            .returning('id')
            .insert(entity));

        return entity;
    }

    update(entity) {
        return this.knex('journals')
            .where('id', entity.id)
            .update(entity);
    }

    remove(id) {
        return this.knex('journals')
            .where('id', id)
            .del();
    }

    checkIsComplete(id) {
        let exp = this.knex
            .row('sum("debtor") - sum("creditor") as "remainder"'),
            isInComplete = false,
            remainder = await(this.knex.table('journalLines')
                .select(exp)
                .where('journalId', id)
                .first()).remainder;

        isInComplete = remainder != 0;

        return this.knex('journals')
            .where('id', id)
            .update({isInComplete});
    }
}

module.exports = JournalRepository;