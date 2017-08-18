const enums = require('../../shared/enums');

exports.up = function (knex, Promise) {
    return knex.schema

        .table('journalLines', table => {
            table.string('receiptNumber');
            table.string('receiptDate');
        })

        .table('detailAccounts', table => {
            table.string('address');
            table.string('phone');
            table.string('nationalCode');
            table.string('email');
            table.enu('personType', enums.PersonType().getKeys());
        });
};

exports.down = function (knex, Promise) {
    return knex.schema

        .table('journalLines', table => {
            table.dropColumn('receiptNumber');
            table.dropColumn('receiptDate');
        })

        .table('detailAccounts', table => {
            table.dropColumn('address');
            table.dropColumn('phone');
            table.dropColumn('nationalCode');
            table.dropColumn('email');
            table.dropColumn('personType');
        });
};
