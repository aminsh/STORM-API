
exports.up = function(knex, Promise) {
  return knex.schema
      .createTable('detailAccountCenters', table => {
          table.timestamp('createdAt').defaultTo(knex.fn.now());
          table.timestamp('updatedAt').defaultTo(knex.fn.now());
          table.increments('id').primary();
          table.integer('subsidiaryLedgerAccountId');
          table
              .foreign('subsidiaryLedgerAccountId')
              .references('id')
              .inTable('subsidiaryLedgerAccounts')
              .onDelete('CASCADE');

          table.integer('detailAccountId');
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
