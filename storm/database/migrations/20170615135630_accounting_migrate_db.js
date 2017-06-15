"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .table('branches', table => {
            table.string('ownerName');
            table.string('nationalCode');
            table.string('postalCode');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('branches', table => {
            table.dropColumn('ownerName');
            table.dropColumn('nationalCode');
            table.dropColumn('postalCode');
        });
};
