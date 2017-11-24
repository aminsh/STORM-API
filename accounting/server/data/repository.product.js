"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class ProductRepository extends BaseRepository {

    constructor(branchId) {
        super(branchId)
    }

    findById(id) {
        return await(this.knex.table('products')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first());
    }

    /*
    * @return products by id array list
    * @param ids
    */

    findByIds(ids) {
        return await(this.knex.table('products')
            .modify(this.modify, this.branchId)
            .whereIn('id', ids));
    }

    findByCode(code, notEqualId) {
        let query = this.knex.table('products')
            .modify(this.modify, this.branchId)
            .where('code', code);

        if (notEqualId)
            query.andWhere('id', '!=', notEqualId);

        return await(query.first());
    }

    isGood(id) {
        return await(this.knex.table('products')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .andWhere('productType', 'good')
            .first());
    }

    findByReferenceId(referenceId , notEqualId) {
        let query = this.knex.table('products')
            .modify(this.modify, this.branchId)
            .where('referenceId', referenceId);

        if(notEqualId)
            query.where('id', '!=', notEqualId);

        return await(query.first());
    }

    create(entity) {

        if (Array.isArray(entity))
            entity.forEach(item => super.create(item));
        else
            super.create(entity);

        return await(this.knex('products').insert(entity));
    }

    update(id, entity) {
        return this.knex('products')
            .modify(this.modify, this.branchId)
            .where('id', id).update(entity);
    }

    remove(id) {
        return await(this.knex('products')
            .modify(this.modify, this.branchId)
            .where('id', id).del());
    }

    isExistsCategory(categoryId){
        return await(this.knex.select('id')
            .from('products')
            .where('categoryId', categoryId)
            .first())
    }

    isExistsScale(scaleId){
        return await(this.knex.select('id')
            .from('products')
            .where('scaleId', scaleId)
            .first())
    }
}

module.exports = ProductRepository;