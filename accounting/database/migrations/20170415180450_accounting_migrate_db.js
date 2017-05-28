
exports.up = function(knex, Promise) {
    return knex.schema
        .dropTable('journalTags')
        .table('journals', table => {
            table.string('tagId');
            table
                .foreign('tagId')
                .references('id')
                .inTable('tags');
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .createTable('journalTags', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
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
        .table('journals', table => {
            table.dropColumn('tagId');
        });

};
