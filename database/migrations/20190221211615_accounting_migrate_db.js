"use strict";

exports.up = function(knex, Promise) {
  return knex.schema
      .createTable('inventory_pricing', table => {
          table.timestamp('createdAt').defaultTo(knex.fn.now());
          table.timestamp('updatedAt').defaultTo(knex.fn.now());
          table.string('id').primary();
          table.string('branchId');
          table.string('fiscalPeriodId');
          table.string('createdById');

          table
              .foreign('fiscalPeriodId')
              .references('id')
              .inTable('fiscalPeriods')
              .onDelete('RESTRICT');
          table.string('fromDate');
          table.string('toDate');
      })
      .createTable('inventory_pricing_products', table => {
          table.timestamp('createdAt').defaultTo(knex.fn.now());
          table.timestamp('updatedAt').defaultTo(knex.fn.now());
          table.increments('id').primary();
          table.string('branchId');
          table.string('createdById');

          table.string('inventoryPricingId');
          table
              .foreign('inventoryPricingId')
              .references('id')
              .inTable('inventory_pricing')
              .onDelete('CASCADE');

          table.string('productId');
          table
              .foreign('productId')
              .references('id')
              .inTable('products')
              .onDelete('RESTRICT');
          table.float('lastPrice', 8);
          table.float('lastQuantity', 8);
      })
      .createTable('inventory_pricing_stocks', table => {
          table.timestamp('createdAt').defaultTo(knex.fn.now());
          table.timestamp('updatedAt').defaultTo(knex.fn.now());
          table.increments('id').primary();
          table.string('branchId');
          table.string('createdById');

          table.string('inventoryPricingId');
          table
              .foreign('inventoryPricingId')
              .references('id')
              .inTable('inventory_pricing')
              .onDelete('CASCADE');

          table.string('stockId');
          table
              .foreign('stockId')
              .references('id')
              .inTable('stocks')
              .onDelete('RESTRICT');
      })
      .createTable('inventory_pricing_inventories', table => {
          table.timestamp('createdAt').defaultTo(knex.fn.now());
          table.timestamp('updatedAt').defaultTo(knex.fn.now());
          table.increments('id').primary();
          table.string('branchId');
          table.string('createdById');

          table.string('inventoryPricingId');
          table
              .foreign('inventoryPricingId')
              .references('id')
              .inTable('inventory_pricing')
              .onDelete('CASCADE');

          table.string('inventoryId');
          table
              .foreign('inventoryId')
              .references('id')
              .inTable('inventories')
              .onDelete('RESTRICT');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('inventory_pricing')
        .dropTable('inventory_pricing_products')
        .dropTable('inventory_pricing_stocks')
        .dropTable('inventory_pricing_inventories');
};
