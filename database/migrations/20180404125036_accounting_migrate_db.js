
exports.up = function(knex, Promise) {
    return knex.schema
        .table('treasurySettings', table => {
            table.boolean('journalGenerateAutomatic');
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('treasurySettings', table => {
            table.dropColumn('journalGenerateAutomatic');
        });
};
