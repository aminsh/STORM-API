import {BaseQuery} from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import {injectable, inject} from "inversify";

@injectable()
export class ReportCustomerReceiptsQuery extends BaseQuery {

    getCustomerReceipt(invoiceId) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.state.user.id,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),

            result = toResult(knex.select(knex.raw(`
            DISTINCT invoices."id" as "invoiceId",invoices."number", "detailAccounts".title as customer, 
            CONCAT('${translate('For invoice with number')}',' ',invoices."number" ,', ','${'در تاریخ'}' ,' ',invoices."date") AS invoiceFor,
	        payment.amount, payment."paymentDescription", payment."paymentTypeText"
        `))
                .from('invoices')
                .innerJoin('detailAccounts', 'detailAccounts.id', 'invoices.detailAccountId')
                .innerJoin(knex.raw(`(
                SELECT "documentType" AS "paymentType", 
                        "number", amount, "transferDate" as "date",
                        "treasuryPurpose"."referenceId" as "invoiceId",
                        "detailAccounts".title,
												CASE WHEN "documentType" = 'cheque' THEN
													'${'چک'}' 
													WHEN "documentType" = 'cash' THEN
													'${'نقدی'}'
													WHEN "documentType" = 'receipt' THEN
													'${'واریز به بانک'}'
												END AS "paymentTypeText",
											
											CASE WHEN "documentType" = 'receipt' THEN
												CONCAT ( '${'شماره فیش'}', ' ', "treasuryDocumentDetails"."number" ) 
												WHEN "documentType" = 'cheque' THEN
												CONCAT (
													'${'چک به شماره'}',
													' ',
													"treasuryDocumentDetails"."number",
													' , ',
													'${'بانک'}',
													' ',
													"treasuryDocumentDetails".bank,
													' , ',
													'${'تاریخ چک'}',
													' ',
													"treasuryDocumentDetails"."dueDate" 
												) 
												WHEN "documentType" = 'cash' THEN
												'${'دریافت نقدی'}'
											END AS "paymentDescription" 																				
                        FROM treasury
                        LEFT JOIN "treasuryDocumentDetails" ON treasury."documentDetailId" = "treasuryDocumentDetails"."id"
                        LEFT JOIN "treasuryPurpose" ON treasury."id" = "treasuryPurpose"."treasuryId"
                        LEFT JOIN "detailAccounts" ON "detailAccounts"."id" = treasury."sourceDetailAccountId"
                        WHERE treasury."branchId" = '${branchId}'
                ) as payment`),
                    'payment.invoiceId', 'invoices.id')
                .modify(modify, branchId, userId, canView, 'invoices')
                .where('invoices.id', invoiceId));

        return result;
    }
}