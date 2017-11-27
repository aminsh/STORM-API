"use strict"

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class ScaleRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
    }

    findById(id) {
        return await(this.knex.table('scales')
            .modify(this.modify, this.branchId)
            .where('id', id).first());
    }

    create(entity) {
        super.create(entity);
        await(this.knex('scales').insert(entity));
    }

    update(id, entity) {
        await(this.knex('scales')
            .modify(this.modify, this.branchId)
            .where('id', id).update(entity));
    }

    remove(id) {
        await(this.knex('scales')
            .modify(this.modify, this.branchId)
            .where('id', id).del());
    }

}

module.exports = ScaleRepository;