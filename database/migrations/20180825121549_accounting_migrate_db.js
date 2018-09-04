exports.up = function (knex, Promise) {
    return knex.schema
        .table('invoices', table => {
            table.string('marketerId');
            table
                .foreign('marketerId')
                .references('id')
                .inTable('detailAccounts')
                .onDelete('SET NULL');
        })
        .table('detailAccounts', table => {
            table.json('personRoles');
        })
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('invoices', table => {
            table.dropColumn('marketerId');
        })
        .table('detailAccounts', table => {
            table.dropColumn('personRoles');
        });
};
