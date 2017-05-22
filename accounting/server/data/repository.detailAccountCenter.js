"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class DetailAccountCenterRepository extends BaseRepository {

    constructor(branchId) {
        super(branchId)
    }

    findById(id){
        return this.knex.table('detailAccountCenters').where('id', id).first();
    }

    create(entity) {
        super.create(entity);

        entity.id = await(this.knex('detailAccountCenters')
            .returning('id')
            .insert(entity))[0];

        return entity;
    }

    update(entity) {
        return this.knex('detailAccountCenters')
            .where('id', entity.id)
            .update(entity);
    }

    remove(id) {
        return this.knex('detailAccountCenters')
            .where('id', id)
            .del();
    }
}

module.exports = DetailAccountCenterRepository;