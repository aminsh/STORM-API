"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .table('inventories', table => {
            table.boolean('priceEnteredAutomatically');
            table.timestamp('time');

            table.string('delivererId');
            table
                .foreign('delivererId')
                .references('id')
                .inTable('detailAccounts')
                .onDelete('RESTRICT');
            table.string('receiverId');
            table
                .foreign('receiverId')
                .references('id')
                .inTable('detailAccounts')
                .onDelete('RESTRICT');

            table.string('sourceStockId');
            table
                .foreign('sourceStockId')
                .references('id')
                .inTable('stocks')
                .onDelete('RESTRICT');

            table.string('destinationStockId');
            table
                .foreign('destinationStockId')
                .references('id')
                .inTable('stocks')
                .onDelete('RESTRICT');
        })
        .table('inventoryLines', table => {
            table.string('baseInventoryId');
            table
                .foreign('baseInventoryId')
                .references('id')
                .inTable('inventories')
                .onDelete('RESTRICT');

            table.double('vat', 14, 10);
            table.double('tax', 14, 10);
            table.double('unitPrice', 14, 10).alter();
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('inventories', table => {
            table.dropColumn('delivererId');
            table.dropColumn('receiverId');
            table.dropColumn('sourceStockId');
            table.dropColumn('destinationStockId');
        })
        .table('inventoryLines', table => {
            table.dropColumn('vat');
            table.dropColumn('tax');
        })
};
