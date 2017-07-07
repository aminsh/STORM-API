"use strict";

const users = require('../users.json').RECORDS,
    branches = require('../branches.json').RECORDS,
    userInBranches = require('../userInBranches.json').RECORDS,
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

exports.seed = async(function (knex, Promise) {
    let codesShouldHaveDetailAccount = [
            '1104',
            '2101',
            '1105',
            '2102',
            '1103',
            '1101'
        ],
        codeShouldBeLocked = [
            '1104',
            '2101',
            '1105',
            '2102',
            '1103',
            '1101',
            '6101',
            '5101',
            '1111',
            '2106',
            '7203',
            '8305'
        ],
        genralCodeShouldBeLocked = [
            '11', '12', '21', '22', '31', '51', '61', '71', '72', '81', '82', '83', '91', '92', '93'
        ];

    codeShouldBeLocked.forEach(e =>
        await(knex('subsidiaryLedgerAccounts')
            .where('code', e)
            .update({'isLocked': true})));

    codesShouldHaveDetailAccount.forEach(e =>
        await(knex('subsidiaryLedgerAccounts')
            .where('code', e)
            .update({'hasDetailAccount': true})));

    genralCodeShouldBeLocked.forEach(e => await(knex('generalLedgerAccounts')
        .where('code', e)
        .update({isLocked: true})));
});
