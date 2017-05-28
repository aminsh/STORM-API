exports.up = function (knex, Promise) {
    return knex.schema
        .table('subsidiaryLedgerAccounts', table => {
            table.string('generalLedgerAccountId');
            table
                .foreign('generalLedgerAccountId')
                .references('id')
                .inTable('generalLedgerAccounts')
                .onDelete('RESTRICT');
        })
        .table('chequeCategories', table => {
            table.string('bankId');
            table
                .foreign('bankId')
                .references('id')
                .inTable('banks')
                .onDelete('SET NULL');

            table.string('detailAccountId');
            table
                .foreign('detailAccountId')
                .references('id')
                .inTable('detailAccounts')
                .onDelete('SET NULL');
        })
        .table('dimensions', table => {
            table.string('dimensionCategoryId');
            table
                .foreign('dimensionCategoryId')
                .references('id')
                .inTable('dimensionCategories')
                .onDelete('CASCADE');
        })
        .table('journals', table => {
            table.string('createdById');
            table
                .foreign('createdById')
                .references('id')
                .inTable('users')
                .onDelete('RESTRICT');

            table.string('periodId');
            table
                .foreign('periodId')
                .references('id')
                .inTable('fiscalPeriods')
                .onDelete('RESTRICT');
        })
        .table('journalTags', table => {
            table.string('journalId');
            table
                .foreign('journalId')
                .references('id')
                .inTable('journals')
                .onDelete('CASCADE');

            table.string('tagId');
            table
                .foreign('tagId')
                .references('id')
                .inTable('tags')
                .onDelete('CASCADE');
        })
        .table('journalLines', table => {
            table.string('journalId');
            table
                .foreign('journalId')
                .references('id')
                .inTable('journals')
                .onDelete('CASCADE');

            table.string('generalLedgerAccountId');
            table
                .foreign('generalLedgerAccountId')
                .references('id')
                .inTable('generalLedgerAccounts')
                .onDelete('RESTRICT');
            table.string('subsidiaryLedgerAccountId');
            table
                .foreign('subsidiaryLedgerAccountId')
                .references('id')
                .inTable('subsidiaryLedgerAccounts')
                .onDelete('RESTRICT');

            table.string('detailAccountId');
            table
                .foreign('detailAccountId')
                .references('id')
                .inTable('detailAccounts')
                .onDelete('RESTRICT');

            table.string('dimension1Id');
            table
                .foreign('dimension1Id')
                .references('id')
                .inTable('dimensions')
                .onDelete('RESTRICT');

            table.string('dimension2Id');
            table
                .foreign('dimension2Id')
                .references('id')
                .inTable('dimensions')
                .onDelete('RESTRICT');

            table.string('dimension3Id');
            table
                .foreign('dimension3Id')
                .references('id')
                .inTable('dimensions')
                .onDelete('RESTRICT');
        })
        .table('cheques', table => {
            table.string('journalLineId');
            table
                .foreign('journalLineId')
                .references('id')
                .inTable('journalLines')
                .onDelete('SET NULL');

            table.string('chequeCategoryId');
            table
                .foreign('chequeCategoryId')
                .references('id')
                .inTable('chequeCategories')
                .onDelete('CASCADE');
        });
};

exports.down = function (knex, Promise) {

};
