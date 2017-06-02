"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class JournalLineRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
        this.create = async(this.create);
    }

    findById(id) {
        return this.knex.table('journalLines')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first();
    }

    findByJournalId_ids(journalId){
        return this.knex.select('id')
            .from('journalLines')
            .modify(this.modify, this.branchId)
            .where('journalId', journalId)
            .map(item => item.id);
    }

    create(entity) {
        super.create(entity);
        return this.knex('journalLines').insert(entity);
    }

    update(entity) {
        return this.knex('journalLines')
            .modify(this.modify, this.branchId)
            .where('id', entity.id)
            .update(entity);
    }

    remove(id) {
        return this.knex('journalLines')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .del();
    }

}

module.exports = JournalLineRepository;
