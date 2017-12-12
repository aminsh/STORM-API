"use strict";

const knex = instanceOf('knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Guid = instanceOf('utility').Guid,
    kendoQueryResolve = instanceOf('kendoQueryResolve');

let tableName = 'orders';

class OrderRepository {

    create(order) {
        if (!order.id)
            order.id = Guid.new();

        return knex(tableName).insert(order);
    }

    update(id, order) {
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
        let query = knex.from(function () {
            // this
            //     .select(tableName + '.*',
            //         tableName + '.price as planPrice',
            //         tableName + '.id as id',
            //         'gifts.discountPrice',
            //         'gifts.discountPercentage',
            //         'gifts.invoice',
            //         'gifts.duration',
            //         'gifts.id as giftId')
            //     .from(tableName)
            //     .leftJoin('gifts', tableName + '.giftId', 'gifts.id')
            //     .where(tableName + '.isArchived', false)
            //     .as('base')this
            this
                .select(tableName + '.*')
                .from(tableName)
                .join('branches', tableName + '.branchId', 'branches.id')
                .join('plans', tableName + '.planId', 'plans.id')
                .as('base')
        })
        return kendoQueryResolve(query, params, x => x)
    }

    getById(id) {
        return knex
            .select(tableName + '.*')
            .from(tableName)
            .join('branches', tableName + '.branchId', 'branches.id')
            .join('plans', tableName + '.planId', 'plans.id')
            .where(tableName+'.id', id)
            .first();
        // return knex
        //     .select(tableName+'.*', tableName+'.id as id', 'gifts.*', 'gifts.id as giftId')
        //     .from(tableName)
        //     .leftJoin('gifts', tableName+'.giftId' , 'gifts.id')
        //     .where(tableName+'.id', id)
        //     .andWhere(tableName+'.isArchived', false)
        //     .first();
    }

    getByParam(key, value) {
        return knex
            .from(tableName)
            .where(key, value)
            .first();
    }


    remove(id) {
        return knex(tableName).where('id', id).del();
    }


}



module.exports = new OrderRepository ();