exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('sales', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.integer('number');
            table.string('date');
            table.string('detailAccountId');
            table
                .foreign('detailAccountId')
                .references('id')
                .inTable('detailAccounts')
                .onDelete('CASCADE');
            table.string('description');
            table.string('referenceId');
        })

        .createTable('products', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.string('title');
            table.string('code');
            table.string('referenceId');
        })

        .createTable('saleLines', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.string('productId');

            table
                .foreign('productId')
                .references('id')
                .inTable('products')
                .onDelete('CASCADE');

            table.string('saleId');

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
        })

        .table('detailAccounts', table => {
            table.string('referenceId');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTable('saleLines')
        .dropTable('products')
        .dropTable('sales')

        .table('detailAccounts', table => table.dropColumn('referenceId'));
};
