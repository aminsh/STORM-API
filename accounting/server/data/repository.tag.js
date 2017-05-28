"use strict"

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

module.exports = class TagRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);

        this.create = async(this.create);
    }

    findById(id) {
        return this.knex.table('tags')
            .modify(this.modify, this.branchId)
            .where('id', id).first();
    }

    create(entity) {
        super.create(entity);

        entity.id = await(this.knex('tags').returning('id').insert(entity))[0];

        if(Array.isArray(entity.id))
            entity.id = entity.id[0];

        return entity;
    }

    update(entity) {
        return this.knex('tags')
            .modify(this.modify, this.branchId)
            .where('id', entity.id).update(entity);
    }

    remove(id) {
        return this.knex('tags')
            .modify(this.modify, this.branchId)
            .where('id', id).del();
    }
};