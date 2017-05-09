
exports.up = function(knex, Promise) {
    return knex.schema
        .table('users', table => {
            table.text('googleToken');
            table.string('image');
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('users', table => {
            table.dropColumn('googleToken');
            table.dropColumn('image');
        });
};
