"use strict";

const enums = require('../../shared/enums');

exports.up = function (knex, Promise) {
    return knex.schema
        .table('sales', table => {
            table.enu('saleType', enums.SaleType().getKeys());
        })
        .table('saleLines', table => {
            table.string('description');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('sales', table => {
            table.dropColumn('saleType');
        })
        .table('saleLines', table => {
            table.dropColumn('description');
        });
};
