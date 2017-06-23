"use strict";

const users = require('../users.json').RECORDS,
    branches = require('../branches.json').RECORDS,
    userInBranches = require('../userInBranches.json').RECORDS,
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

exports.seed = async(function (knex, Promise) {

    let journalLines = await(knex.select('*').from('journalLines')
        .whereNotNull('dimension1Id')
        .orWhereNotNull('dimension2Id'));

    await(knex('journalLines')
        .whereNotNull('dimension1Id')
        .orWhereNotNull('dimension2Id')
        .del());

    let dimension1s = await(knex.select('*')
            .from('dimensions')
            .where('dimensionCategoryId', 'a4836f0f-841f-4d66-9579-ff2172774afa')),

        dimension2s = await(knex.select('*')
            .from('dimensions')
            .where('dimensionCategoryId', '53bb2cca-e8fb-4ba1-b406-4be737f0daf9'));

    await(knex('dimensionCategories').del());
    await(knex('dimensionCategories').insert([
        {id: '1', title: 'تفصیل 2'},
        {id: '2', title: 'تفصیل 3'}
    ]));

    dimension1s.forEach(e => e.dimensionCategoryId = '1');
    dimension2s.forEach(e => e.dimensionCategoryId = '2');

    await(knex('dimensions').insert(dimension1s));
    await(knex('dimensions').insert(dimension2s));

    await(knex('journalLines').insert(journalLines));

    users.forEach(u => {
        let user = await(knex.select('id').table('users').where('id', u.id).first());

        if (user)
            await(knex('users').where('id', u.id).update(u));
        else
            await(knex('users').insert(u));
    });

    await(knex('branches').insert(branches));
    await(knex('userInBranches').insert(userInBranches));
});
