"use strict";

const BaseQuery = require('./query.base'),
    enums = instanceOf('Enums'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    SettingsQuery = require('./query.settings');

module.exports = class InvoicesQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    };

    invoice(id) {
        let knex = this.knex,
            branchId = this.branchId,
            settings = new SettingsQuery(this.branchId).get(),

            invoice = await(knex.select(knex.raw(`invoices."number" as "number", invoices."date" as "date",
                COALESCE(charges,'[{"key":"","value":0}]'::json) as charges,
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
                products."referenceId", "detailAccounts".city as "customerCity", "detailAccounts".phone as "customerPhone",
                "detailAccounts".fax as "customerFax", "detailAccounts"."registrationNumber" as "customerRegistrationNumber", 
                CASE WHEN "detailAccounts"."personType" = 'legal' THEN "detailAccounts"."economicCode" 
                     WHEN "detailAccounts"."personType" = 'real' THEN "detailAccounts"."nationalCode" END as "personCode"`))
                .from('invoices')
                .where('invoices.branchId', branchId)
                .where('invoices.id', id)
                .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                .leftJoin('detailAccounts', 'detailAccounts.id', 'invoices.detailAccountId')
                .leftJoin('products', 'products.id', 'invoiceLines.productId')
                .leftJoin('scales', 'products.scaleId', 'scales.id')
            );

        invoice.forEach(item => {
            item.charges = (item.charges || []).asEnumerable()
                .select(c => ({
                    key: c.key,
                    value: c.value,
                    display: ((settings.saleCharges || []).asEnumerable()
                        .firstOrDefault(e => e.key === c.key) || {}).display
                }))
                .toArray();
        });


        return invoice;
    }
};