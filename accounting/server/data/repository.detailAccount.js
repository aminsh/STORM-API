"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class DetailAccountRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
    }

    findById(id) {
        return await(this.knex.table('detailAccounts')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first());
    }

    findByReferenceId(referenceId) {
        return await(this.knex.table('detailAccounts')
            .modify(this.modify, this.branchId)
            .where('referenceId', referenceId)
            .first());
    }

    findByCode(code, notEqualId) {
        let query = this.knex.table('detailAccounts')
            .modify(this.modify, this.branchId)
            .where('code', code);

        if (notEqualId)
            query.andWhere('id', '!=', notEqualId);

        return await(query.first());
    }

    findMaxCode(){
        let result = await(this.knex.table('detailAccounts')
            .modify(this.modify, this.branchId)
            .max('code')
            .first());

        return result.max;
    }

    findBankAccountNumber(bankAccountNumber) {
        let query = this.knex.table('detailAccounts')
            .modify(this.modify, this.branchId)
            .where('detailAccountType', 'bank');

        if (bankAccountNumber)
            query.andWhere('bankAccountNumber', bankAccountNumber);
        else query.andWhere('thisIsDefaultBankAccount', true);

        return query.first();
    }

    findFund(fundCode) {
        let query = this.knex.table('detailAccounts')
            .modify(this.modify, this.branchId)
            .where('detailAccountType', 'bank');

        if (fundCode)
            query.andWhere('code', fundCode);
        else query.andWhere('thisIsDefaultFund', true);

        return query.first();
    }

    create(entity) {
        super.create(entity);

        await(this.knex('detailAccounts').insert(entity));
    }

    update(entity) {
        return await(this.knex('detailAccounts')
            .modify(this.modify, this.branchId)
            .where('id', entity.id)
            .update(entity));
    }

    remove(id) {
        return await(this.knex('detailAccounts')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .del());
    }
}

module.exports = DetailAccountRepository;
