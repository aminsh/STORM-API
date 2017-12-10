"use strict";

const knex = instanceOf('knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Guid = instanceOf('utility').Guid,
    kendoQueryResolve = instanceOf('kendoQueryResolve');

    let tableName = 'gifts';

class PlansRepository {

    create(gift) {
        if (!gift.id)
            gift.id = Guid.new();

       return knex(tableName).insert(gift).returning('id');
    }

    update(id, gift) {
        return knex(tableName).where('id', id).update(gift).returning('*');
    }

    remove(id) {
        return knex(tableName).where('id', id).del();
    }

    getById(id) {
        return knex
            .from(tableName)
            .where('id', id)
            .first();
    }

    get(params) {
        let query =  knex
            .from(tableName);

        return kendoQueryResolve(query, params, x => x)
    }


}



module.exports = new PlansRepository ();