import {Controller, Get,} from "../core/expressUtlis";
import {async} from "../core/@decorators";
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
    @async()
    getGeneralLedgerAccounts() {

        return this.reportAccountsQuery.getGeneralLedgerAccounts();
    }

    @Get("/subsidiary-ledger-accounts")
    @async()
    getSubsidiaryLedgerAccounts() {

        return this.reportAccountsQuery.getSubsidiaryLedgerAccounts();
    }

    @Get("/detail-accounts")
    @async()
    getDetailAccounts() {

        return this.reportAccountsQuery.getDetailAccounts();
    }

    @Get("/general-balance")
    @async()
    getGeneralBalance() {

        return this.reportBalanceQuery.getGeneralBalance();
    }

    /*@Get("/subsidiary-balance")
    @async()
    getSubsidiaryBalance() {

        return this.reportBalanceQuery.getSubsidiaryBalance();
    }

    @Get("/subsidiary-detail-balance")
    @async()
    getSubsidiaryDetailBalance() {

        return this.reportBalanceQuery.getSubsidiaryDetailBalance();
    }

    @Get("/general-subsidiary-detail-balance")
    @async()
    getSubsidiaryDetailBalance() {

        return this.reportBalanceQuery.getSubsidiaryDetailBalance();
    }*/

    @Get("/journal-office")
    @async()
    getJournalOffice() {

        return this.reportFinancialOfficesQuery.getJournalOffice();
    }

    @Get("/general-office")
    @async()
    getGeneralOffice() {

        return this.reportFinancialOfficesQuery.getGeneralOffice();
    }

    @Get("/subsidiary-office")
    @async()
    getSubsidiaryOffice() {

        return this.reportFinancialOfficesQuery.getSubsidiaryOffice();
    }

    @Get("/total-general-subsidiary-turnover")
    @async()
    getTotalTurnover() {

        return this.reportTurnoverQuery.getTotalTurnover();
    }

    @Get("/total-subsidiary-detail-turnover")
    @async()
    getTotalTurnover_2() {

        return this.reportTurnoverQuery.getTotalTurnover();
    }

    @Get("/total-general-subsidiary-detail-turnover")
    @async()
    getTotalTurnover_3() {

        return this.reportTurnoverQuery.getTotalTurnover();
    }

    @Get("/detail-general-subsidiary-turnover")
    @async()
    getDetailTurnover() {

        return this.reportTurnoverQuery.getDetailTurnover();
    }

    @Get("/detail-subsidiary-detail-turnover")
    @async()
    getDetailTurnover_2() {

        return this.reportTurnoverQuery.getDetailTurnover();
    }

    @Get("/detail-general-subsidiary-detail-turnover")
    @async()
    getDetailTurnover_3() {

        return this.reportTurnoverQuery.getDetailTurnover();
    }

    @Get("/detail-journal")
    @async()
    getDetailJournals() {

        return this.reportJournalQuery.getDetailJournals();
    }

    @Get("/detail-general-journal")
    @async()
    getDetailJournals_2() {

        return this.reportJournalQuery.getDetailJournals();
    }

    @Get("/detail-general-subsidiary-journal")
    @async()
    getDetailJournals_3() {

        return this.reportJournalQuery.getDetailJournals();
    }

    @Get("/detail-subsidiary-detail-journal")
    @async()
    getDetailJournals_4() {

        return this.reportJournalQuery.getDetailJournals();
    }

    @Get("/detail-subsidiary-detail-journal")
    @async()
    getDetailJournals_4() {

        return this.reportJournalQuery.getDetailJournals();
    }

    @Get("/invoices")
    @async()
    invoice(req) {

        return this.reportInvoiceQuery.invoice(req.query.id);
    }

    @Get("/un-invoices")
    @async()
    unInvoice(req) {

        return this.reportInvoiceQuery.invoice(req.query.id);
    }

    @Get("/pre-invoices")
    @async()
    preInvoice(req) {

        return this.reportInvoiceQuery.invoice(req.query.id);
    }

    @Get("/inventory-outputs")
    @async()
    getOutputsTurnover(req) {

        return this.reportInventoryTurnoverQuery.getInventoriesTurnover(req.query.ids);
    }

    @Get("/inventory-input")
    @async()
    getInputsTurnover(req) {

        return this.reportInventoryTurnoverQuery.getInventoriesTurnover(req.query.ids);
    }

    @Get("/product-turnover")
    @async()
    getProductTurnovers(req) {

        return this.reportProductQuery.getProductTurnovers(req.query.ids, req.query.fixedType, req.query.stockId);
    }

    @Get("/product-turnover-total")
    @async()
    getProductTurnoversTotal(req) {

        return this.reportProductQuery.getProductTurnovers(req.query.ids, req.query.fixedType, req.query.stockId);
    }

    @Get("/seasonal")
    @async()
    seasonal(req) {

        const resultDetail = this.reportSeasonalQuery.getSeasonalWithFilter(req.query),
            resultTotal = this.reportSeasonalQuery.getTotalSeasonal();

        return Object.assign({}, resultDetail, resultTotal);
    }

    @Get("/balance-sheet")
    @async()
    getBalanceSheet() {

        return this.reportBalanceSheetQuery.getBalanceSheet();
    }

    @Get("/compare-profit-loss-statement")
    @async()
    getCompareProfitLossStatement() {

        return this.reportProfitLossStatementQuery.getCompareProfitLossStatement();
    }

    @Get("/customer-receipts")
    @async()
    getCustomerReceipt(req) {

        return this.reportCustomerReceiptsQuery.getCustomerReceipt(req.query.id);
    }

    @Get("/sale-invoice-detail-turnover")
    @async()
    getSaleDetailTurnover(req) {

        return this.reportSaleQuery.getDetail(req.query.invoiceStatus);
    }

    @Get("/receive-cheque-due-date")
    @async()
    getReceiveChequeDueDate(req) {

        return this.reportTreasuryChequeQuery.getChequesDueDate('receive', req.query);
    }

    @Get("/payment-cheque-due-date")
    @async()
    getPaymentChequeDueDate(req) {

        return this.reportTreasuryChequeQuery.getChequesDueDate('payment', req.query);
    }

    @Get("/receive-cheque-passed")
    @async()
    getReceivePassedCheque(req) {

        return this.reportTreasuryChequeQuery.getPassedCheque('receive', req.query);
    }

    @Get("/payment-cheque-passed")
    @async()
    getPaymentPassedCheque(req) {

        return this.reportTreasuryChequeQuery.getPassedCheque('payment', req.query);
    }

    @Get("/receive-cheques-with-status")
    @async()
    getReceiveChequesWithStatus(req) {

        return this.reportTreasuryChequeQuery.getChequesWithStatus('receive', req.query);
    }

    @Get("/payment-cheques-with-status")
    @async()
    getPaymentChequesWithStatus(req) {

        return this.reportTreasuryChequeQuery.getChequesWithStatus('payment', req.query);
    }

    @Get("/bank-turnover")
    @async()
    getBankTurnover(req) {

        return this.detailAccountQuery.getBankAndFundTurnover(req.query.bankId, 'bank', req.query);
    }

    @Get("/fund-turnover")
    @async()
    getFundTurnover(req) {

        return this.detailAccountQuery.getBankAndFundTurnover(req.query.fundId, 'fund', req.query);
    }
}