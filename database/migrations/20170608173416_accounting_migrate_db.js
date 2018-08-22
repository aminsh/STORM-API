"use strict";

const enums = require('../../dist/Constants/enums');

exports.up = function (knex, Promise) {
    return knex.schema
        .table('products', table => {
            table.enu('productType', enums.ProductType().getKeys());
            table.float('reorderPoint');
            table.float('salePrice');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('products', table => {
            table.dropColumn('productType');
            table.dropColumn('reorderPoint');
            table.dropColumn('salePrice');
        });
};

