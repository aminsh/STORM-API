"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    enums = require('../../shared/enums');

exports.seed = async(function (knex, Promise) {

    await(knex('users').insert({
        id: 'STORM-API-USER',
        name: 'STORM-API-USER',
        email: 'api@storm-online.ir',
        state: 'active',
        image: '/public/images/apiuser.png',
    }))
});