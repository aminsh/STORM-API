
exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('treasuryPurpose', table => {
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
            table.string('treasuryId').notNull();
            table
                .foreign('treasuryId')
                .references('id')
                .inTable('treasury')
                .onDelete('RESTRICT');
            table.string('reference');
            table.string('referenceId').notNull();
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('treasuryPurpose');
};
