"use strict";


const fs = require('fs'),
    path = require('path'),
    config = require('../config'),
    reportConfig = require('../../reporting/report.config.json'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    layout = getReport('layout'),
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
    InvoiceTurnover = require('../queries/query.invoice');

function getReport(fileName) {
    return JSON.parse(
        fs.readFileSync(
            path.normalize(`${config.rootPath}/reporting/files/${fileName}`)));
}

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

router.route('/file/:fileName').get((req, res) => {
    let withLayout = reportConfig.asEnumerable()
            .selectMany(rc => rc.items)
            .any(rc => [undefined, true].includes(rc.useLayout) && rc.fileName == req.params.fileName),
        report = getReport(req.params.fileName);

    if (withLayout) {
        let reportComponents = report.Pages[0].Components,
            reportComponentsMaxKeys = (Object.keys(reportComponents)
                    .asEnumerable()
                    .select(c => parseInt(c))
                    .max() || 0) + 1,
            layoutComponents = layout.Pages[0].Components,
            header = layoutComponents[0],
            footer = layoutComponents[1];

        reportComponents[++reportComponentsMaxKeys] = header;
        reportComponents[++reportComponentsMaxKeys] = footer;
    }

    res.json(report);

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
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getGeneralBalance());
        res.json(result);
    }));

router.route('/subsidiary-balance')
    .get(async((req, res) => {
        let ins = new ReportQueryBalance(req.branchId,
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getSubsidiaryBalance());
        res.json(result);
    }));

router.route('/subsidiary-detail-balance')
    .get(async((req, res) => {
        let ins = new ReportQueryBalance(req.branchId,
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getSubsidiaryDetailBalance());
        res.json(result);
    }));

router.route('/general-subsidiary-detail-balance')
    .get(async((req, res) => {
        let ins = new ReportQueryBalance(req.branchId,
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getSubsidiaryDetailBalance());
        res.json(result);
    }));

router.route('/journal-office')
    .get(async((req, res) => {
        let ins = new ReportQueryFinancialOffices(req.branchId,
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getJournalOffice());
        res.json(result);
    }));

router.route('/general-office')
    .get(async((req, res) => {
        let ins = new ReportQueryFinancialOffices(req.branchId,
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getGeneralOffice());
        res.json(result);
    }));

router.route('/subsidiary-office')
    .get(async((req, res) => {
        let ins = new ReportQueryFinancialOffices(req.branchId,
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getSubsidiaryOffice());
        res.json(result);
    }));

router.route('/total-general-subsidiary-turnover')
    .get(async((req, res) => {
        let ins = new ReportQueryTurnover(req.branchId,
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getTotalTurnover());
        res.json(result);
    }));

router.route('/total-subsidiary-detail-turnover')
    .get(async((req, res) => {
        let ins = new ReportQueryTurnover(req.branchId,
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getTotalTurnover());
        res.json(result);
    }));

router.route('/total-general-subsidiary-detail-turnover')
    .get(async((req, res) => {
        let ins = new ReportQueryTurnover(req.branchId,
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getTotalTurnover());
        res.json(result);
    }));

router.route('/detail-general-subsidiary-turnover')
    .get(async((req, res) => {
        let ins = new ReportQueryTurnover(req.branchId,
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getDetailTurnover());
        res.json(result);
    }));

router.route('/detail-subsidiary-detail-turnover')
    .get(async((req, res) => {
        let ins = new ReportQueryTurnover(req.branchId,
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getDetailTurnover());
        res.json(result);
    }));

router.route('/detail-general-subsidiary-detail-turnover')
    .get(async((req, res) => {
        let ins = new ReportQueryTurnover(req.branchId,
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getDetailTurnover());
        res.json(result);
    }));

router.route('/detail-journal')
    .get(async((req, res) => {
        let ins = new ReportQueryJournal(req.branchId,
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getDetailJournals());
        res.json(result);
    }));

router.route('/detail-general-journal')
    .get(async((req, res) => {
        let ins = new ReportQueryJournal(req.branchId,
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getDetailJournals());
        res.json(result);
    }));

router.route('/detail-general-subsidiary-journal')
    .get(async((req, res) => {
        let ins = new ReportQueryJournal(req.branchId,
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getDetailJournals());
        res.json(result);
    }));

router.route('/detail-subsidiary-detail-journal')
    .get(async((req, res) => {
        let ins = new ReportQueryJournal(req.branchId,
            req.cookies['current-period'],
            req.cookies['current-mode'],
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

router.route('/inventory-output')
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
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getInventoriesTurnover(req.query.ids));
        res.json(result);
    }));

router.route('/product-turnover')
    .get(async((req, res) => {
        let ins = new ProductReports(req.branchId,
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getProductTurnovers(req.query.ids, req.query.fixedType));
        res.json(result);
    }))

router.route('/product-turnover-total')
    .get(async((req, res) => {
        let ins = new ProductReports(req.branchId,
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getProductTurnovers(req.query.ids, req.query.fixedType));
        res.json(result);
    }));

router.route('/seasonal')
    .get(async((req, res) => {
        let ins = new SeasonalReport(req.branchId,
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query.extra ? req.query.extra.filter : req.query),
            resultDetail = await(ins.getSeasonalWithFilter(req.query)),
            resultTotal = await(ins.getTotalSeasonal());

        res.json(Object.assign({}, resultDetail, {resultTotal}));
    }));

router.route('/balance-sheet')
    .get(async((req, res) => {
        let ins = new BalanceSheet(req.branchId,
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getBalanceSheet());
        res.json(result);
    }));

router.route('/profit-loss-statement')
    .get(async((req, res) => {
        let ins = new ProfitLossStatement(req.branchId,
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getProfitLossStatement());
        res.json(result);
    }));

router.route('/compare-profit-loss-statement')
    .get(async((req, res) => {
        let ins = new ProfitLossStatement(req.branchId,
            req.cookies['current-period'],
            req.cookies['current-mode'],
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
        let ins = new InvoiceTurnover(req.branchId,
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getAll(req.query.params,'sale'));
        res.json(result.data);
    }));

module.exports = router;
