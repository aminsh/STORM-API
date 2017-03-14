exports.up = function (knex, Promise) {
    return knex.schema
        .table('branches', table => {
            table
                .foreign('ownerId')
                .references('id')
                .inTable('users')
                .onDelete('SET NULL');

        })
        .table('userInBranches', table => {
            table
                .foreign('branchId')
                .references('id')
                .inTable('branches')
                .onDelete('CASCADE');

            table
                .foreign('userId')
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');
        });


};

exports.down = function (knex, Promise) {

};
