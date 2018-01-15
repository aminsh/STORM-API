
exports.up = function(knex, Promise) {
    return knex.schema
        .table('invoices', table => {
            table.float('discount');
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('invoices', table =>{
            table.dropColumn('discount');
        });
};
