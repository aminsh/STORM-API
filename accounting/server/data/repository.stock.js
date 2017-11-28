"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class BankRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
        this.create = async(this.create);
    }

    findById(id) {
        return await(this.knex
            .table('stocks')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first());
    }

    isUsedOnInventory(id) {
        return await(this.knex.select('id')
            .from('inventories')
            .modify(this.modify, this.branchId)
            .where('stockId', id)
            .first());
    }

    getDefaultStock() {
        return await(this.knex
            .table('stocks')
            .modify(this.modify, this.branchId)
            .first());
    }

    create(entity) {
        super.create(entity);
        return this.knex('stocks').insert(entity);
    }

    update(id, entity) {
        return await(this.knex('stocks')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .update(entity));
    }

    remove(id) {
        return await(this.knex('stocks')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .del());
    }
}


module.exports = BankRepository;
