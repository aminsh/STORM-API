"use strict";

const knex = instanceOf('knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Guid = instanceOf('utility').Guid,
    kendoQueryResolve = instanceOf('kendoQueryResolve');

let tableName = 'plans';

class PlansRepository {

    create(plan) {
        if (!plan.id)
            plan.id = Guid.new();

        return knex(tableName).insert(plan).returning('id');
    }

    update(id, plan) {
        return knex(tableName).where('id', id).update(plan).returning('*');
    }

    remove(id) {
        return knex(tableName).where('id', id).del();
    }

    getById(id) {
        return knex
            .select(tableName + '.*',
                tableName + '.id as id',
                'gifts.discountPrice',
                'gifts.discountPercentage',
                'gifts.invoice as giftInvoice',
                'gifts.duration as giftDuration',
                'gifts.id as giftId')
            .from(tableName)
            .leftJoin('gifts', tableName + '.giftId', 'gifts.id')
            .where(tableName + '.id', id)
            .andWhere(tableName + '.isArchived', false)
            .first();
    }

    getByParam(key, value) {
        return knex
            .select(tableName + '.*',
                tableName + '.id as id',
                'gifts.discountPrice',
                'gifts.discountPercentage',
                'gifts.invoice as giftInvoice',
                'gifts.duration as giftDuration',
                'gifts.id as giftId')
            .from(tableName)
            .leftJoin('gifts', tableName + '.giftId', 'gifts.id')
            .where(tableName + '.' + key, value)
            .andWhere(tableName + '.isArchived', false)
            .first();
    }

    getListByParam(key, value) {
        return knex
            .select(tableName + '.*',
                tableName + '.id as id',
                'gifts.discountPrice',
                'gifts.discountPercentage',
                'gifts.invoice as giftInvoice',
                'gifts.duration as giftDuration',
                'gifts.id as giftId')
            .from(tableName)
            .leftJoin('gifts', tableName + '.giftId', 'gifts.id')
            .where(tableName + '.' + key, value)
            .andWhere(tableName + '.isArchived', false);
    }


    get (params) {
        let query = knex.from(function () {
            this
                .select(tableName + '.*',
                    tableName + '.price as planPrice',
                    tableName + '.id as id',
                    'gifts.discountPrice',
                    'gifts.discountPercentage',
                    'gifts.invoice',
                    'gifts.duration',
                    'gifts.id as giftId')
                .from(tableName)
                .leftJoin('gifts', tableName + '.giftId', 'gifts.id')
                .where(tableName + '.isArchived', false)
                .as('base')
        })
        return kendoQueryResolve(query, params, x => x)
    }

}


module.exports = new PlansRepository();