"use strict";

const users = require('../users.json').RECORDS,
    branches = require('../branches.json').RECORDS,
    userInBranches = require('../userInBranches.json').RECORDS,
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

exports.seed = function (knex, Promise) {

    return knex('dimensionCategories').del()
        .then(function () {

            return knex('dimensionCategories').insert([
                {id: '1', title: 'تفصیل 2'},
                {id: '2', title: 'تفصیل 3'}
            ]);
        }).then(async(function () {
            users.forEach(u => {
                let user = await(knex.select('id').table('users').where('id', u.id).first());

                if (user)
                    await(knex('users').where('id', u.id).update(u));
                else
                    await(knex('users').insert(u));
            });

            await(knex('branches').insert(branches));
            await(knex('userInBranches').insert(userInBranches));
        }));
};
