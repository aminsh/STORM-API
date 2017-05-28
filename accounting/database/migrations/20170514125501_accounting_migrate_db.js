
exports.up = function(knex, Promise) {
  return knex.schema
      .createTable('detailAccountCenters', table => {
          table.timestamp('createdAt').defaultTo(knex.fn.now());
          table.timestamp('updatedAt').defaultTo(knex.fn.now());
          table.string('id').primary();
          table.string('subsidiaryLedgerAccountId');
          table
              .foreign('subsidiaryLedgerAccountId')
              .references('id')
              .inTable('subsidiaryLedgerAccounts')
              .onDelete('CASCADE');

          table.string('detailAccountId');
          table
              .foreign('detailAccountId')
              .references('id')
              .inTable('detailAccounts')
              .onDelete('CASCADE');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('detailAccountCenters')
};
