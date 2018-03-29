
exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('treasurySettings', table =>{
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('createdById');
            table
                .foreign('createdById')
                .references('id')
                .inTable('users')
                .onDelete('RESTRICT');
            table.string('id').primary();
            table.string('branchId').notNull();
            table.json('subsidiaryLedgerAccounts');
        });
  
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('treasurySettings')
};
