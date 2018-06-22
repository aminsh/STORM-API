"use strict";

const  BaseQuery = require('../queries/query.base'),
    await = require('asyncawait/await'),
    translate = require('../services/translateService');

class CustomerReceipts extends BaseQuery{
    constructor(branchId, userId) {
        super(branchId, userId);
    }

    getCustomerReceipt(invoiceId) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify,

            result =await(knex.select(knex.raw(`
            DISTINCT invoices."id" as "invoiceId",invoices."number", "detailAccounts".title as customer, 
            CONCAT('${translate('For invoice with number')}',' ',invoices."number" ,', ','${translate('In date')}' ,' ',invoices."date") AS invoiceFor,
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
													'${translate('Cheque')}' 
													WHEN "documentType" = 'cash' THEN
													'${translate('Cash')}'
													WHEN "documentType" = 'receipt' THEN
													'${translate('New Receipt receive')}'
												END AS "paymentTypeText",
											
											CASE WHEN "documentType" = 'receipt' THEN
												CONCAT ( '${translate('Receipt number')}', ' ', "treasuryDocumentDetails"."number" ) 
												WHEN "documentType" = 'cheque' THEN
												CONCAT (
													'${translate('cheque to number')}',
													' ',
													"treasuryDocumentDetails"."number",
													' , ',
													'${translate('Bank')}',
													' ',
													"treasuryDocumentDetails".bank,
													' , ',
													'${translate('cheque date')}',
													' ',
													"treasuryDocumentDetails"."dueDate" 
												) 
												WHEN "documentType" = 'cash' THEN
												'${translate('New Cash receive')}'
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

module.exports = CustomerReceipts;