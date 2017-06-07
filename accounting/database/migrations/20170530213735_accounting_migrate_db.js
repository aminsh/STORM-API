"use strict";

const enums = require('../../shared/enums');

exports.up = function (knex, Promise) {
    return knex.schema
        .table('saleLines', table => {
            table.string('description');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('saleLines', table => {
            table.dropColumn('description');
        });
};
