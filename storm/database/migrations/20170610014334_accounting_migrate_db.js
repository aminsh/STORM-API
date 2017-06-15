"use strict";

const enums = require('../../server/constants/enums');

exports.up = function (knex, Promise) {
    return knex.schema
        .table('branches', table => {
            table.enu('status', enums.BranchStatus().getKeys());
            table.string('webSite');
            table.string('mobile');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('branches', table => {
            table.dropColumn('status');
            table.dropColumn('webSite');
            table.dropColumn('mobile');
        });
};
