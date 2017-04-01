exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('users', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.string('name');
            table.string('email');
            table.string('password');
            table.enu('state', ['pending', 'active']);
            table.text('token');
        })
        .createTable('branches', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.string('name');
            table.text('logo');
            table.string('phone');
            table.string('address');
            table.string('ownerId');
        })
        .createTable('userInBranches', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.increments('id').primary();
            table.enu('state', ['active', 'inactive']);
            table.enu('app', ['accounting']);
            table.string('branchId');
            table.string('userId');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTable('userInBranches')
        .dropTable('branches')
        .dropTable('users');
};
