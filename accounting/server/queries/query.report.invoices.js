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
        invoices."invoiceType" as "invoiceType",
        "invoiceLines".quantity as quantity, "invoiceLines"."unitPrice" as "unitPrice",
        "invoiceLines".vat as vat,"invoiceLines".discount as discount,
        (("invoiceLines"."unitPrice" * "invoiceLines".quantity)-"invoiceLines".discount) as "grossPrice",
        (("invoiceLines"."unitPrice" * "invoiceLines".quantity)-"invoiceLines".discount)* ("invoiceLines".vat*0.01) as "vatPrice",
        (("invoiceLines"."unitPrice" * "invoiceLines".quantity)-"invoiceLines".discount) 
            + (("invoiceLines"."unitPrice" * "invoiceLines".quantity)-"invoiceLines".discount)*("invoiceLines".vat*0.01) as "netPrice",
        "invoiceLines".description as "invoiceLineDescription",
        "products".title as "productName",
        "detailAccounts"."postalCode" as "postalCode",
        "detailAccounts".title as "customerName", "detailAccounts".address as "customerAddress",
        CASE WHEN "detailAccounts"."personType" = 'legal' THEN "detailAccounts"."economicCode" 
             WHEN "detailAccounts"."personType" = 'real' THEN "detailAccounts"."nationalCode" END as "personCode"`))
            .from('invoices')
            .where('invoices.branchId', branchId)
            .andWhere('invoices.id',id)
            .innerJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
            .innerJoin('detailAccounts', 'detailAccounts.id', 'invoices.detailAccountId')
            .innerJoin('products', 'products.id', 'invoiceLines.productId')
            .as('Invoice');
    }
};