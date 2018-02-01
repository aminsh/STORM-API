"use strict";

exports.up = function(knex, Promise) {
    return knex.schema
        .raw('ALTER TABLE "invoices" DROP CONSTRAINT IF EXISTS "invoices_invoiceStatus_check";');
};

exports.down = function(knex, Promise) {

};
