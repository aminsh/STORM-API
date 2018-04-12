"use strict";


const fs = require('fs'),
    path = require('path'),
    config = require('../config'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    ReportQueryAccounts = require('../queries/query.report.accounts'),
    ReportQueryBalance = require('../queries/query.report.balance'),
    ReportQueryFinancialOffices = require('../queries/query.report.financialOffices'),
    ReportQueryTurnover = require('../queries/query.report.turnover'),
    ReportQueryJournal = require('../queries/query.report.journal'),
    ReportQueryInvoice = require('../queries/query.report.invoices'),
    InventoriesReport = require('../reportQueries/inventory.input-output'),
    InventoriesTurnoverReport = require('../reportQueries/inventory.turnover'),
    ProductReports = require('../reportQueries/ProductReports'),
    SeasonalReport = require('../reportQueries/seasonalReport'),
    BalanceSheet = require('../reportQueries/balanceSheet'),
    ProfitLossStatement = require('../reportQueries/profit.loss.statement'),
    CustomerReceipts = require('../reportQueries/customer.receipts'),
    InvoiceTurnover = require('../queries/query.invoice'),
    SaleInvoice = require('../reportQueries/invoice.sale'),
    ChequeReportQueries = require('../reportQueries/treasury.Cheque'),
    DetailAccountQuery = require('../queries/query.detailAccount');

router.route('/')
    .post((req, res) => {
        let report = req.body;

        fs.writeFile(
            path.normalize(`${config.rootPath}/reporting/files/${report.fileName}`),
            report.data,
            err => {
                if (err)
                    return res.status(500).send({isValid: false, error: err});

                res.json({isValid: true});
            }
        );
    });

router.route('/general-ledger-accounts')
    .get(async((req, res) => {
        let ins = new ReportQueryAccounts(req.branchId),
            result = await(ins.getGeneralLedgerAccounts());
        res.json(result);

    }));

router.route('/subsidiary-ledger-accounts')
    .get(async((req, res) => {
        let ins = new ReportQueryAccounts(req.branchId),
            result = await(ins.getSubsidiaryLedgerAccounts());
        res.json(result);
    }));

router.route('/detail-accounts')
    .get(async((req, res) => {
        let ins = new ReportQueryAccounts(req.branchId),
            result = await(ins.getDetailAccounts());
        res.json(result);

    }));

router.route('/general-balance')
    .get(async((req, res) => {
        let ins = new ReportQueryBalance(
            req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getGeneralBalance());
        res.json(result);
    }));

router.route('/subsidiary-balance')
    .get(async((req, res) => {
        let ins = new ReportQueryBalance(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getSubsidiaryBalance());
        res.json(result);
    }));

router.route('/subsidiary-detail-balance')
    .get(async((req, res) => {
        let ins = new ReportQueryBalance(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getSubsidiaryDetailBalance());
        res.json(result);
    }));

router.route('/general-subsidiary-detail-balance')
    .get(async((req, res) => {
        let ins = new ReportQueryBalance(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getSubsidiaryDetailBalance());
        res.json(result);
    }));

router.route('/journal-office')
    .get(async((req, res) => {
        let ins = new ReportQueryFinancialOffices(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getJournalOffice());
        res.json(result);
    }));

router.route('/general-office')
    .get(async((req, res) => {
        let ins = new ReportQueryFinancialOffices(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getGeneralOffice());
        res.json(result);
    }));

router.route('/subsidiary-office')
    .get(async((req, res) => {
        let ins = new ReportQueryFinancialOffices(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getSubsidiaryOffice());
        res.json(result);
    }));

router.route('/total-general-subsidiary-turnover')
    .get(async((req, res) => {
        let ins = new ReportQueryTurnover(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getTotalTurnover());
        res.json(result);
    }));

router.route('/total-subsidiary-detail-turnover')
    .get(async((req, res) => {
        let ins = new ReportQueryTurnover(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getTotalTurnover());
        res.json(result);
    }));

router.route('/total-general-subsidiary-detail-turnover')
    .get(async((req, res) => {
        let ins = new ReportQueryTurnover(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getTotalTurnover());
        res.json(result);
    }));

router.route('/detail-general-subsidiary-turnover')
    .get(async((req, res) => {
        let ins = new ReportQueryTurnover(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getDetailTurnover());
        res.json(result);
    }));

router.route('/detail-subsidiary-detail-turnover')
    .get(async((req, res) => {
        let ins = new ReportQueryTurnover(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getDetailTurnover());
        res.json(result);
    }));

router.route('/detail-general-subsidiary-detail-turnover')
    .get(async((req, res) => {
        let ins = new ReportQueryTurnover(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getDetailTurnover());
        res.json(result);
    }));

router.route('/detail-journal')
    .get(async((req, res) => {
        let ins = new ReportQueryJournal(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getDetailJournals());
        res.json(result);
    }));

router.route('/detail-general-journal')
    .get(async((req, res) => {
        let ins = new ReportQueryJournal(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getDetailJournals());
        res.json(result);
    }));

router.route('/detail-general-subsidiary-journal')
    .get(async((req, res) => {
        let ins = new ReportQueryJournal(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getDetailJournals());
        res.json(result);
    }));

router.route('/detail-subsidiary-detail-journal')
    .get(async((req, res) => {
        let ins = new ReportQueryJournal(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getDetailJournals());
        res.json(result);
    }));

router.route('/invoices')
    .get(async((req, res) => {
        let ins = new ReportQueryInvoice(req.branchId),
            result = await(ins.invoice(req.query.id));
        res.json(result);
    }));

router.route('/un-invoices')
    .get(async((req, res) => {
        let ins = new ReportQueryInvoice(req.branchId),
            result = await(ins.invoice(req.query.id));
        res.json(result);
    }));

router.route('/pre-invoices')
    .get(async((req, res) => {
        let ins = new ReportQueryInvoice(req.branchId),
            result = await(ins.invoice(req.query.id));
        res.json(result);
    }));

router.route('/inventory-outputs')
    .get(async((req, res) => {
        let ins = new InventoriesReport(req.branchId),
            result = await(ins.getInventories(req.query.ids));

        res.json(result);
    }));

router.route('/inventory-input')
    .get(async((req, res) => {
        let ins = new InventoriesReport(req.branchId),
            result = await(ins.getInventories(req.query.ids));

        res.json(result);
    }));

router.route('/inventory-turnover')
    .get(async((req, res) => {
        let ins = new InventoriesTurnoverReport(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getInventoriesTurnover(req.query.ids));
        res.json(result);
    }));

router.route('/product-turnover')
    .get(async((req, res) => {
        let ins = new ProductReports(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getProductTurnovers(req.query.ids, req.query.fixedType, req.query.stockId));
        res.json(result);
    }))

router.route('/product-turnover-total')
    .get(async((req, res) => {
        let ins = new ProductReports(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getProductTurnovers(req.query.ids, req.query.fixedType, req.query.stockId));
        res.json(result);
    }));

router.route('/seasonal')
    .get(async((req, res) => {
        let ins = new SeasonalReport(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query.extra ? req.query.extra.filter : req.query),
            resultDetail = await(ins.getSeasonalWithFilter(req.query)),
            resultTotal = await(ins.getTotalSeasonal());

        res.json(Object.assign({}, resultDetail, {resultTotal}));
    }));

router.route('/balance-sheet')
    .get(async((req, res) => {
        let ins = new BalanceSheet(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getBalanceSheet());
        res.json(result);
    }));

router.route('/profit-loss-statement')
    .get(async((req, res) => {
        let ins = new ProfitLossStatement(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getProfitLossStatement());
        res.json(result);
    }));

router.route('/compare-profit-loss-statement')
    .get(async((req, res) => {
        let ins = new ProfitLossStatement(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getCompareProfitLossStatement());
        res.json(result);
    }));

router.route('/customer-receipts')
    .get(async((req, res) => {
        let ins = new CustomerReceipts(req.branchId),
            result = await(ins.getCustomerReceipt(req.query.id));
        res.json(result);
    }));

router.route('/sale-invoice-turnover')
    .get(async((req, res) => {
        let ins = new SaleInvoice(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getAll());
        res.json(result);
    }));

router.route('/receive-cheque-due-date')
    .get(async((req, res) => {
        let ins = new ChequeReportQueries(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getChequesDueDate('receive',req.query));
        res.json(result);
    }));

router.route('/payment-cheque-due-date')
    .get(async((req, res) => {
        let ins = new ChequeReportQueries(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getChequesDueDate('payment',req.query));
        res.json(result);
    }));

router.route('/receive-cheque-passed')
    .get(async((req, res) => {
        let ins = new ChequeReportQueries(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getPassedCheque('receive', req.query));
        res.json(result);
    }));

router.route('/payment-cheque-passed')
    .get(async((req, res) => {
        let ins = new ChequeReportQueries(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getPassedCheque('payment', req.query));
        res.json(result);
    }));

router.route('/receive-cheques-with-status')
    .get(async((req, res) => {
        let ins = new ChequeReportQueries(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getChequesWithStatus('receive', req.query));
        res.json(result);
    }));

router.route('/payment-cheques-with-status')
    .get(async((req, res) => {
        let ins = new ChequeReportQueries(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getChequesWithStatus('payment', req.query));
        res.json(result);
    }));

router.route('/bank-turnover')
    .get(async((req, res) => {
        let ins = new DetailAccountQuery(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getBankAndFundTurnover(req.query.bankId, 'bank', req.fiscalPeriodId, req.query));
        res.json(result);
    }));

router.route('/fund-turnover')
    .get(async((req, res) => {
        let ins = new DetailAccountQuery(req.branchId,
            req.fiscalPeriodId,
            'create',
            req.query),
            result = await(ins.getBankAndFundTurnover(req.query.fundId, 'fund', req.fiscalPeriodId, req.query));
        res.json(result);
    }));

module.exports = router;
