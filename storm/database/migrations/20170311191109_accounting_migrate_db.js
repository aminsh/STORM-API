
exports.up = function(knex, Promise) {
    return knex.schema
        .table('branches', table => {
            table.string('lucaConnectionId');
        });
};

exports.down = function(knex, Promise) {
  
};
