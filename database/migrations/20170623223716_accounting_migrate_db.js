"use strict";

const enums = require('../../shared/enums');

exports.up = function(knex, Promise) {
    return knex.schema
        .table('payments', table => {
            table.dropColumn('chequeId');
            table.enu('receiveOrPay', enums.ReceiveOrPay().getKeys());
            table.enu('chequeStatus', enums.ChequeStatus().getKeys());
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('payments', table => {
            table.string('chequeId');
            table.dropColumn('receiveOrPay');
            table.dropColumn('chequeStatus');
        });
};
