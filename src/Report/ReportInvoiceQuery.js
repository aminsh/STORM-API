import {BaseQuery} from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import {injectable, inject} from "inversify";

@injectable()
export class ReportInvoiceQuery extends BaseQuery {
    
    @inject("SettingsQuery")
    /**@type{SettingsQuery}*/ settingsQuery = undefined;

    invoice(id) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.state.user.id,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),
            settings = this.settingsQuery.get(),

            invoice = toResult(knex.select(knex.raw(` invoices."id" as "invoiceId",
                "invoiceLines"."id" as "invoiceLinesId",
                COALESCE(invoices.discount,0) as "invoiceDiscount",
                products.code as "iranCode",
                invoices."number" as "number", invoices."date" as "date",
                CASE WHEN charges is NULL OR charges::TEXT = '[]' THEN '[{"key":"","value":0}]'::json ELSE charges END as charges,
                invoices.description as "invoiceDescription",
                scales.title as "scaleTitle",
                "invoiceLines".quantity || ' ' || scales.title as "amount",
                invoices."invoiceType" as "invoiceType",
                "invoiceLines".quantity as quantity, "invoiceLines"."unitPrice" as "unitPrice",
                "invoiceLines".vat + "invoiceLines".tax as vat,
                "invoiceLines".discount as discount,
                (("invoiceLines"."unitPrice" * "invoiceLines".quantity)-"invoiceLines".discount) as "grossPrice",
                (("invoiceLines"."unitPrice" * "invoiceLines".quantity)-"invoiceLines".discount) + "invoiceLines".vat + "invoiceLines".tax as "netPrice",
                "invoiceLines".description as "invoiceLineDescription",
                "invoiceLines".description as "productName",
                "detailAccounts"."postalCode" as "postalCode",
                "detailAccounts".title as "customerName", "detailAccounts".address as "customerAddress",
                products."referenceId", "detailAccounts".city as "customerCity", "detailAccounts".phone as "customerPhone",
                "detailAccounts".fax as "customerFax", "detailAccounts"."registrationNumber" as "customerRegistrationNumber", 
                CASE WHEN "detailAccounts"."personType" = 'legal' THEN "detailAccounts"."economicCode" 
                     WHEN "detailAccounts"."personType" = 'real' THEN "detailAccounts"."nationalCode" END as "personCode"`))
                .from('invoices')
                .modify(modify, branchId, userId, canView, 'invoices')
                .where('invoices.id', id)
                .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                .leftJoin('detailAccounts', 'detailAccounts.id', 'invoices.detailAccountId')
                .leftJoin('products', 'products.id', 'invoiceLines.productId')
                .leftJoin('scales', 'products.scaleId', 'scales.id')
                .as('base')
            );

        let lineHaveVat = invoice.asEnumerable().firstOrDefault(e => e.vat !== 0),
            persistedVat = lineHaveVat
                ? (100 * (lineHaveVat.vat + lineHaveVat.tax) / (((lineHaveVat.quantity * lineHaveVat.unitPrice) - lineHaveVat.discount)))
                : 0;

        invoice.forEach(item => {
            item.charges = (item.charges || []).asEnumerable()
                .select(c => ({
                    key: c.key,
                    value: c.value,
                    vat: c.vatIncluded ? c.value * persistedVat / 100 : 0,
                    sumVat: (item.charges || []).asEnumerable()
                        .sum(c => c.vatIncluded ? c.value * persistedVat / 100 : 0),
                    sumValue: (item.charges || []).asEnumerable()
                        .sum(e => e.value),
                    display: ((settings.saleCharges || []).asEnumerable()
                        .firstOrDefault(e => e.key === c.key) || {}).display
                }))
                .toArray();
        });

        return invoice;
    }
}