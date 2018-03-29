"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('treasuryDocumentDetails', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('createdById');
            table
                .foreign('createdById')
                .references('id')
                .inTable('users')
                .onDelete('RESTRICT');
            table.string('id').primary();
            table.string('branchId').notNull();
            table.string('transferTo');
            table.string('transferFrom');
            table.string('number');
            table.string('issueDate');
            table.string('date');
            table.string('dueDate');
            table.string('bank');
            table.string('bankBranch');
            table.string('payTo');
            table.string('chequeAccountNumber');
            table.boolean('canTransferToAnother');
            table.string('identity'); // شناسه فیش
            table.string('trackingNumber'); // شماره رهگیری
            table.string('totalTreasuryNumber'); // شماره خزانه داری کل
            table.string('paymentLocation'); // جای پرداخت در سفته
            table.string('paymentPlace'); // محل پرداخت در سفته
            table.string('nationalCode'); // کدملی (متعهد) در سفته
            table.string('residence'); // محل اقامت متعهد در سفته
            table.string('demandNoteTo'); // به حواله کرد در سفته
            table.string('status'); // وضعیت چک
            table.json('chequeStatusHistory');
            table.string('chequeCategoryId');
            table
                .foreign('chequeCategoryId')
                .references('id')
                .inTable('chequeCategories')
                .onDelete('RESTRICT');
        })
        .table('treasury', table => {
            table.string('documentDetailId');
            table
                .foreign('documentDetailId')
                .references('id')
                .inTable('treasuryDocumentDetails')
                .onDelete('RESTRICT');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTable('treasuryDocumentDetails')
        .table('treasury', table => table.dropColumn('documentDetailId'));
};
