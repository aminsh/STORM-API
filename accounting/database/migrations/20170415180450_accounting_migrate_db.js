
exports.up = function(knex, Promise) {
    return knex.schema
        .dropTable('journalTags')
        .table('journals', table => {
            table.integer('tagId').unsigned();
            table.foreign('tagId').references('tags.id');
        })
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('journalTags', table => {
            table.integer('journalId').unsigned();
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
        .table('journals', table => {
            table.dropColumn('tagId');
        });

};
