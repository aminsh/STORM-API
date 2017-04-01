
exports.up = function(knex, Promise) {
    return knex.schema
        .table('branches', table => {
            table.string('accConnection');
        });
};

exports.down = function(knex, Promise) {
  
};
