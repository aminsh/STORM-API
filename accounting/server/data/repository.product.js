"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

module.exports = class ProductRepository extends BaseRepository {

    constructor(branchId) {
        super(branchId)
    }

    findById(id){
        return this.knex.table('products')
            .where('id', id)
            .first();
    }

    findByReferenceId(referenceId){
        return this.knex.table('products')
            .where('referenceId', referenceId)
            .first();
    }

    create(entity){
        entity.id = await(
            this.knex('products')
                .returning('id')
                .insert(entity))[0].id;

            return entity;
    }

    update(id, entity){
        return this.knex('products').where('id', id).update(entity);
    }

    remove(id){
        return this.knex('products').where('id', id).del();
    }
};