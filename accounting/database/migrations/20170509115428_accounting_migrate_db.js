exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('sales', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.increments('id').primary();
            table.integer('number');
            table.string('date');
            table.integer('detailAccountId');
            table
                .foreign('detailAccountId')
                .references('id')
                .inTable('detailAccounts')
                .onDelete('CASCADE');
            table.string('description');
        })

        .createTable('products', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.increments('id').primary();
            table.string('title');
        })

        .createTable('saleLines', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.increments('id').primary();
            table.integer('productId');

            table
                .foreign('productId')
                .references('id')
                .inTable('products')
                .onDelete('CASCADE');

            table.integer('saleId');

            table
                .foreign('saleId')
                .references('id')
                .inTable('sales')
                .onDelete('CASCADE');

            table.float('quantity');
            table.float('unitPrice');
            table.float('tax');
            table.float('vat');
            table.float('discount');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTable('saleLines')
        .dropTable('products')
        .dropTable('sales');
};
