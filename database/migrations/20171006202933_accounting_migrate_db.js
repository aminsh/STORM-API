"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .table('settings', table => {
            table.json('saleCosts');
            table.json('webhooks');
        })
        .createTable('webhookDeliveries', table => {
            table.increments('id').primary();
            table.timestamp('sentOn');
            table.timestamp('receivedOn');
            table.string('responseCode');
            table.string('response');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('settings', table => {
            table.dropColumn('saleCosts');
            table.dropColumn('webhooks');
        })
        .dropTable('webhookLoggs');
};
