
exports.up = function(knex, Promise) {
  return knex.schema
      .table('banks', table => {
          table.string('branchId');
      })
      .renameTable('banks','banksName');
};

exports.down = function(knex, Promise) {

    return knex.schema
        .table('banks', table => {
            table.dropColumn('branchId');
        })
        .renameTable('bankName','banks')
  
};
