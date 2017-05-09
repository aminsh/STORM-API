exports.up = function (knex, Promise) {
    return knex.schema
        .table('subsidiaryLedgerAccounts', table => {
            table.integer('generalLedgerAccountId');
            table
                .foreign('generalLedgerAccountId')
                .references('id')
                .inTable('generalLedgerAccounts')
                .onDelete('RESTRICT');
        })
        .table('chequeCategories', table => {
            table.integer('bankId');
            table
                .foreign('bankId')
                .references('id')
                .inTable('banks')
                .onDelete('SET NULL');

            table.integer('detailAccountId');
            table
                .foreign('detailAccountId')
                .references('id')
                .inTable('detailAccounts')
                .onDelete('SET NULL');
        })
        .table('dimensions', table => {
            table.integer('dimensionCategoryId');
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

            table.integer('periodId');
            table
                .foreign('periodId')
                .references('id')
                .inTable('fiscalPeriods')
                .onDelete('RESTRICT');
        })
        .table('journalTags', table => {
            table.integer('journalId');
            table
                .foreign('journalId')
                .references('id')
                .inTable('journals')
                .onDelete('CASCADE');

            table.integer('tagId');
            table
                .foreign('tagId')
                .references('id')
                .inTable('tags')
                .onDelete('CASCADE');
        })
        .table('journalLines', table => {
            table.integer('journalId');
            table
                .foreign('journalId')
                .references('id')
                .inTable('journals')
                .onDelete('CASCADE');

            table.integer('generalLedgerAccountId');
            table
                .foreign('generalLedgerAccountId')
                .references('id')
                .inTable('generalLedgerAccounts')
                .onDelete('RESTRICT');
            table.integer('subsidiaryLedgerAccountId');
            table
                .foreign('subsidiaryLedgerAccountId')
                .references('id')
                .inTable('subsidiaryLedgerAccounts')
                .onDelete('RESTRICT');

            table.integer('detailAccountId');
            table
                .foreign('detailAccountId')
                .references('id')
                .inTable('detailAccounts')
                .onDelete('RESTRICT');

            table.integer('dimension1Id');
            table
                .foreign('dimension1Id')
                .references('id')
                .inTable('dimensions')
                .onDelete('RESTRICT');

            table.integer('dimension2Id');
            table
                .foreign('dimension2Id')
                .references('id')
                .inTable('dimensions')
                .onDelete('RESTRICT');

            table.integer('dimension3Id');
            table
                .foreign('dimension3Id')
                .references('id')
                .inTable('dimensions')
                .onDelete('RESTRICT');
        })
        .table('cheques', table => {
            table.integer('journalLineId');
            table
                .foreign('journalLineId')
                .references('id')
                .inTable('journalLines')
                .onDelete('SET NULL');

            table.integer('chequeCategoryId');
            table
                .foreign('chequeCategoryId')
                .references('id')
                .inTable('chequeCategories')
                .onDelete('CASCADE');
        });
};

exports.down = function (knex, Promise) {

};
