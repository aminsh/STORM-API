import {Controller, Get,} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/reports", "ShouldHaveBranch")
class ReportController {

    @inject("ReportAccountsQuery")
    /**@type{ReportAccountsQuery}*/ reportAccountsQuery = undefined;

    @inject("ReportBalanceQuery")
    /**@type{ReportBalanceQuery}*/ reportBalanceQuery = undefined;

    @inject("ReportBalanceSheetQuery")
    /**@type{ReportBalanceSheetQuery}*/ reportBalanceSheetQuery = undefined;

    @inject("ReportCustomerReceiptsQuery")
    /**@type{ReportCustomerReceiptsQuery}*/ reportCustomerReceiptsQuery = undefined;

    @inject("ReportFinancialOfficesQuery")
    /**@type{ReportFinancialOfficesQuery}*/ reportFinancialOfficesQuery = undefined;

    @inject("ReportInventoryTurnoverQuery")
    /**@type{ReportInventoryTurnoverQuery}*/ reportInventoryTurnoverQuery = undefined;

    @inject("ReportInventoryInputsOutputsTurnoverQuery")
    /**@type{ReportInventoryInputsOutputsTurnoverQuery}*/ reportInventoryInputsOutputsTurnoverQuery = undefined;

    @inject("ReportInvoiceQuery")
    /**@type{ReportInvoiceQuery}*/ reportInvoiceQuery = undefined;

    @inject("ReportJournalQuery")
    /**@type{ReportJournalQuery}*/ reportJournalQuery = undefined;

    @inject("ReportProductQuery")
    /**@type{ReportProductQuery}*/ reportProductQuery = undefined;

    @inject("ReportProfitLossStatementQuery")
    /**@type{ReportProfitLossStatementQuery}*/ reportProfitLossStatementQuery = undefined;

    @inject("ReportSaleQuery")
    /**@type{ReportSaleQuery}*/ reportSaleQuery = undefined;

    @inject("ReportSeasonalQuery")
    /**@type{ReportSeasonalQuery}*/ reportSeasonalQuery = undefined;

    @inject("ReportTreasuryChequeQuery")
    /**@type{ReportTreasuryChequeQuery}*/ reportTreasuryChequeQuery = undefined;

    @inject("ReportTurnoverQuery")
    /**@type{ReportTurnoverQuery}*/ reportTurnoverQuery = undefined;

    @inject("DetailAccountQuery")
    /**@type{DetailAccountQuery}*/ detailAccountQuery = undefined;

    @Get("/general-ledger-accounts")
    getGeneralLedgerAccounts() {

        return this.reportAccountsQuery.getGeneralLedgerAccounts();
    }

    @Get("/subsidiary-ledger-accounts")
    getSubsidiaryLedgerAccounts() {

        return this.reportAccountsQuery.getSubsidiaryLedgerAccounts();
    }

    @Get("/detail-accounts")
    getDetailAccounts() {

        return this.reportAccountsQuery.getDetailAccounts();
    }

    @Get("/general-balance")
    getGeneralBalance() {

        return this.reportBalanceQuery.getGeneralBalance();
    }

    @Get("/journal-office")
    getJournalOffice() {

        return this.reportFinancialOfficesQuery.getJournalOffice();
    }

    @Get("/general-office")
    getGeneralOffice() {

        return this.reportFinancialOfficesQuery.getGeneralOffice();
    }

    @Get("/subsidiary-office")
    getSubsidiaryOffice() {

        return this.reportFinancialOfficesQuery.getSubsidiaryOffice();
    }

    @Get("/total-general-subsidiary-turnover")
    getTotalTurnover() {

        return this.reportTurnoverQuery.getTotalTurnover();
    }

    @Get("/total-subsidiary-detail-turnover")
    getTotalTurnover_2() {

        return this.reportTurnoverQuery.getTotalTurnover();
    }

    @Get("/total-general-subsidiary-detail-turnover")
    getTotalTurnover_3() {

        return this.reportTurnoverQuery.getTotalTurnover();
    }

    @Get("/detail-general-subsidiary-turnover")
    getDetailTurnover() {

        return this.reportTurnoverQuery.getDetailTurnover();
    }

    @Get("/detail-subsidiary-detail-turnover")
    getDetailTurnover_2() {

        return this.reportTurnoverQuery.getDetailTurnover();
    }

    @Get("/detail-general-subsidiary-detail-turnover")
    getDetailTurnover_3() {

        return this.reportTurnoverQuery.getDetailTurnover();
    }

    @Get("/detail-journal")
    getDetailJournals() {

        return this.reportJournalQuery.getDetailJournals();
    }

    @Get("/detail-general-journal")
    getDetailJournals_2() {

        return this.reportJournalQuery.getDetailJournals();
    }

    @Get("/detail-general-subsidiary-journal")
    getDetailJournals_3() {

        return this.reportJournalQuery.getDetailJournals();
    }

    @Get("/detail-subsidiary-detail-journal")
    getDetailJournals_4() {

        return this.reportJournalQuery.getDetailJournals();
    }

    @Get("/detail-subsidiary-detail-journal")
    getDetailJournals_5() {

        return this.reportJournalQuery.getDetailJournals();
    }

    @Get("/invoices/:id")
    invoice(req) {

        return this.reportInvoiceQuery.invoice(req.params.id);
    }

    @Get("/un-invoices/:id")
    unInvoice(req) {

        return this.reportInvoiceQuery.invoice(req.params.id);
    }

    @Get("/pre-invoices/:id")
    preInvoice(req) {

        return this.reportInvoiceQuery.invoice(req.params.id);
    }

    @Get("/inventory-outputs")
    getOutputsTurnover(req) {

        return this.reportInventoryInputsOutputsTurnoverQuery.getInventories(req.query.ids,'output');
    }

    @Get("/inventory-inputs")
    getInputsTurnover(req) {

        return this.reportInventoryInputsOutputsTurnoverQuery.getInventories(req.query.ids,'input');
    }

    @Get("/inventory-turnover")
    getInputsTurnover(req) {

        return this.reportInventoryTurnoverQuery.getInventoriesTurnover(req.query.ids);
    }

    @Get("/product-turnover")
    getProductTurnovers(req) {

        return this.reportProductQuery.getProductTurnovers(req.query.ids, req.query.fixedType, req.query.stockId);
    }

    @Get("/product-turnover-total")
    getProductTurnoversTotal(req) {

        return this.reportProductQuery.getProductTurnovers(req.query.ids, req.query.fixedType, req.query.stockId);
    }

    @Get("/seasonal")
    seasonal(req) {

        const resultDetail = this.reportSeasonalQuery.getSeasonalWithFilter(req.query),
            resultTotal = this.reportSeasonalQuery.getTotalSeasonal();

        return Object.assign({}, resultDetail, {resultTotal});
    }

    @Get("/balance-sheet")
    getBalanceSheet() {

        return this.reportBalanceSheetQuery.getBalanceSheet();
    }

    @Get("/compare-profit-loss-statement")
    getCompareProfitLossStatement() {

        return this.reportProfitLossStatementQuery.getCompareProfitLossStatement();
    }

    @Get("/customer-receipts/:id")
    getCustomerReceipt(req) {

        return this.reportCustomerReceiptsQuery.getCustomerReceipt(req.params.id);
    }

    @Get("/sale-invoice-detail-turnover")
    getSaleDetailTurnover(req) {

        return this.reportSaleQuery.getDetail(req.query.invoiceStatus);
    }

    @Get("/sale-invoice-turnover")
    getSaleDetailTurnover(req) {

        return this.reportSaleQuery.getDetail(req.query.invoiceStatus);
    }

    @Get("/receive-cheque-due-date")
    getReceiveChequeDueDate(req) {

        return this.reportTreasuryChequeQuery.getChequesDueDate('receive', req.query);
    }

    @Get("/payment-cheque-due-date")
    getPaymentChequeDueDate(req) {

        return this.reportTreasuryChequeQuery.getChequesDueDate('payment', req.query);
    }

    @Get("/receive-cheque-passed")
    getReceivePassedCheque(req) {

        return this.reportTreasuryChequeQuery.getPassedCheque('receive', req.query);
    }

    @Get("/payment-cheque-passed")
    getPaymentPassedCheque(req) {

        return this.reportTreasuryChequeQuery.getPassedCheque('payment', req.query);
    }

    @Get("/receive-cheques-with-status")
    getReceiveChequesWithStatus(req) {

        return this.reportTreasuryChequeQuery.getChequesWithStatus('receive', req.query);
    }

    @Get("/payment-cheques-with-status")
    getPaymentChequesWithStatus(req) {

        return this.reportTreasuryChequeQuery.getChequesWithStatus('payment', req.query);
    }

    @Get("/bank-turnover")
    getBankTurnover(req) {

        return this.detailAccountQuery.getBankAndFundTurnover(req.query.bankId, 'bank', req.query);
    }

    @Get("/fund-turnover")
    getFundTurnover(req) {

        return this.detailAccountQuery.getBankAndFundTurnover(req.query.fundId, 'fund', req.query);
    }
}