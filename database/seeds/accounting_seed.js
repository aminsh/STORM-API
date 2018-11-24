"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    enums = require('../../dist/Constants/enums'),
    Uuid = require('uuid-token-generator'),
    uuid = new Uuid,
    idGenerate = () => uuid.generate();

exports.seed = async(function (knex, Promise) {

    //await(knex('inventories').update({quantityStatus: 'confirmed', priceStatus: 'draft'}));

    const googleUsers = await(knex.select('*').from('users').whereNotNull('googleToken'));

    await(knex('users_oauth_profiles').insert(googleUsers.map(user => ({
        provider: 'google',
        provider_user_id: user.id,
        userId: user.id,
        token: user.googleToken
    }))));
});

