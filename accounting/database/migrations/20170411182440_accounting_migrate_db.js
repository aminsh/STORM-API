"use strict";

const enums = require('../../server/constants/enums');

exports.up = function(knex, Promise) {
    return knex.schema
        .table('subsidiaryLedgerAccounts', table => {
            table.dropColumn('detailAccountAssignmentStatus');
            table.dropColumn('dimension1AssignmentStatus');
            table.dropColumn('dimension2AssignmentStatus');
            table.dropColumn('dimension3AssignmentStatus');

            table.boolean('hasDetailAccount');
            table.boolean('hasDimension1');
            table.boolean('hasDimension2');
            table.boolean('hasDimension3');
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('subsidiaryLedgerAccounts', table => {
            table.enu('detailAccountAssignmentStatus', enums.AssignmentStatus().getKeys());
            table.enu('dimension1AssignmentStatus', enums.AssignmentStatus().getKeys());
            table.enu('dimension2AssignmentStatus', enums.AssignmentStatus().getKeys());
            table.enu('dimension3AssignmentStatus', enums.AssignmentStatus().getKeys());

            table.dropColumn('hasDetailAccount');
            table.dropColumn('hasDimension1');
            table.dropColumn('hasDimension2');
            table.dropColumn('hasDimension3');
        });
};
