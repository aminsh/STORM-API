"use strict";

const BaseQuery = require('./query.base'),
    enums = require('../constants/enums'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

module.exports = class InvoicesQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    };

    invoice(id) {
        let knex = this.knex,
            branchId = this.branchId;

        return knex.select(knex.raw(`invoices."number" as "number", invoices."date" as "date",
        invoices.description as "invoiceDescription",
        scales.title as "scaleTitle",
        "invoiceLines".quantity || ' ' || scales.title as "amount",
        invoices."invoiceType" as "invoiceType",
        "invoiceLines".quantity as quantity, "invoiceLines"."unitPrice" as "unitPrice",
        "invoiceLines".vat as vat,"invoiceLines".discount as discount,
        (("invoiceLines"."unitPrice" * "invoiceLines".quantity)-"invoiceLines".discount) as "grossPrice",
        "invoiceLines".vat as "vatPrice",
        (("invoiceLines"."unitPrice" * "invoiceLines".quantity)-"invoiceLines".discount) + "invoiceLines".vat as "netPrice",
        "invoiceLines".description as "invoiceLineDescription",
        "invoiceLines".description as "productName",
        "detailAccounts"."postalCode" as "postalCode",
        "detailAccounts".title as "customerName", "detailAccounts".address as "customerAddress",
        CASE WHEN "detailAccounts"."personType" = 'legal' THEN "detailAccounts"."economicCode" 
             WHEN "detailAccounts"."personType" = 'real' THEN "detailAccounts"."nationalCode" END as "personCode"`))
            .from('invoices')
            .where('invoices.branchId', branchId)
            .andWhere('invoices.id',id)
            .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
            .leftJoin('detailAccounts', 'detailAccounts.id', 'invoices.detailAccountId')
            .leftJoin('products', 'products.id', 'invoiceLines.productId')
            .leftJoin('scales','products.scaleId','scales.id')
            .as('Invoice');
    }
};