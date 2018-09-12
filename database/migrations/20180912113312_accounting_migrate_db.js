
exports.up = function(knex, Promise) {
    return knex.schema
        .table('storm_plans', table => {
            table.bool('isActive');
        })
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('storm_plans', table => {
            table.dropColumn('isActive');
        });
};
