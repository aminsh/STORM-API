"use strict";

exports.up = function(knex, Promise) {
    return knex.schema
        .raw('ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "payments_paymentType_check";')
};

exports.down = function(knex, Promise) {

};
