"use strict";

const knex = instanceOf('knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Guid = instanceOf('utility').Guid,
    kendoQueryResolve = instanceOf('kendoQueryResolve');

let tableName = 'planCategories';

class PlanCategoryRepository {

    create(PlanCategory) {
        if (!PlanCategory.id)
            PlanCategory.id = Guid.new();

        return knex(tableName).insert(PlanCategory).returning('id');
    }

    update(id, PlanCategory) {
        return knex(tableName).where('id', id).update(order);
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

    getAll(params) {
        let query = knex
            .from(function () {
                this.from(tableName)
                    .groupBy("createdAt")
                    .groupBy("updatedAt")
                    .groupBy("id")
                    .orderBy("orderNumber")
                    .as("base");
            });

        return kendoQueryResolve(query, params, x => x)

    }


    getByParam(key, value) {
        return knex
            .from(tableName)
            .where(key, value)
            .first();
    }


}


module.exports = new PlanCategoryRepository();