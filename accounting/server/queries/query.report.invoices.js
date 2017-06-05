"use strict";

const BaseQuery = require('./query.base'),
    enums = require('../constants/enums'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

module.exports = class InvoicesQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    };

    Invoice(id) {
        let knex = this.knex,
            branchId = this.branchId;

        return knex.select(`"invoices".number as number, "invoices".date as date,
        "invoices".description as "invoiceDescription",
        "invoices"."invoicesType" as "invoicesType",
        "invoiceLines".quantity as quantity, "invoiceLines"."unitPrice" as "unitPrice",
        "invoiceLines".vat as vat,"invoiceLines".discount as discount,
        (("invoiceLines"."unitPrice" * "invoiceLines".quantity)-"invoiceLines".discount) as "grossPrice",
        (("invoiceLines"."unitPrice" * "invoiceLines".quantity)-"invoiceLines".discount)*0.09 as "vatPrice",
        (("invoiceLines"."unitPrice" * "invoiceLines".quantity)-"invoiceLines".discount) 
            + (("invoiceLines"."unitPrice" * "invoiceLines".quantity)-"invoiceLines".discount)*0.09 as "netPrice",
        "invoiceLines".description as "saleLineDescription",
        "products".title as "productName",
        "detailAccount".title as "customerName", "detailAccount".address as "customerAddress",
        CASE WHEN "detailAccounts"."personType" = 'legal' THEN "detailAccounts"."economyCode" 
             WHEN "detailAccounts"."personType" = 'real' THEN "detailAccounts"."nationalCode" END as "personCode"`)
            .from('invoices')
            .where('invoices.branchId', branchId)
            .andWhere('invoices.id',id)
            .innerJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
            .innerJoin('detailAccount', 'detailAccount.id', 'invoices.detailAccountId')
            .innerJoin('products', 'products.id', 'invoiceLines.productId')
            .as('Invoice');
    }
};