"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    enums = require('../../shared/enums'),
    Uuid = require('uuid-token-generator'),
    uuid = new Uuid,
    idGenerate = () => uuid.generate();

exports.seed = async(function (knex, Promise) {

    let number = 10000,
        trial = await(knex.select('id').from('storm_plans').where('category', 'Trial').first());

    if(!trial)
        throw new Error('Trial is empty');

    let branches = await(knex.select('*').from('branches').where('isUnlimited', false).orWhereNull('isUnlimited')),

        orders = branches.map(item => ({
            id: idGenerate(),
            number: ++number,
            issuedDate: item.createdAt,
            branchId: item.id,
            planId: trial.id,
            duration: 1,
            unitPrice: 0,
            discount: 0
        })),
        subscriptions = branches.map(item => ({
            startDate: item.createdAt,
            endDate: nextMonth(item.createdAt),
            planId: trial.id,
            branchId: item.id,
            isActiveApi: nextMonth(item.createdAt, 2) <= new Date,
        }));

    await(knex('storm_orders').insert(orders));
    await(knex('branch_subscriptions').insert(subscriptions));
});

function nextMonth(date, value = 1) {
    let endDate = new Date(date.valueOf());

    endDate.setMonth(endDate.getMonth() + value);

    return endDate;
}