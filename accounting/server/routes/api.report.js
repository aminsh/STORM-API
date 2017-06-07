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
    ReportQueryInvoice = require('../queries/query.report.invoices');

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
            .selectMany(rc=> rc.items)
            .any(rc => rc.useLayout && rc.fileName ==  req.params.fileName),
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
        let ins = new ReportQueryAccounts(req.cookies['branch-id']),
            result = await(ins.getGeneralLedgerAccounts());
        res.json(result);

    }));

router.route('/subsidiary-ledger-accounts')
    .get(async((req, res) => {
        let ins = new ReportQueryAccounts(req.cookies['branch-id']),
            result = await(ins.getSubsidiaryLedgerAccounts());
        res.json(result);
    }));

router.route('/detail-accounts')
    .get(async((req, res) => {
        let ins = new ReportQueryAccounts(req.cookies['branch-id']),
            result = await(ins.getDetailAccounts());
        res.json(result);

    }));

router.route('/general-balance')
    .get(async((req, res) => {
        let ins = new ReportQueryBalance(
            req.cookies['branch-id'],
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getGeneralBalance());
        res.json(result);
    }));

router.route('/subsidiary-balance')
    .get(async((req, res) => {
        let ins = new ReportQueryBalance(req.cookies['branch-id'],
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getSubsidiaryBalance());
        res.json(result);
    }));

router.route('/subsidiary-detail-balance')
    .get(async((req, res) => {
        let ins = new ReportQueryBalance(req.cookies['branch-id'],
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getSubsidiaryDetailBalance());
        res.json(result);
    }));

router.route('/general-subsidiary-detail-balance')
    .get(async((req, res) => {
        let ins = new ReportQueryBalance(req.cookies['branch-id'],
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getSubsidiaryDetailBalance());
        res.json(result);
    }));

router.route('/journal-office')
    .get(async((req, res) => {
        let ins = new ReportQueryFinancialOffices(req.cookies['branch-id'],
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getJournalOffice());
        res.json(result);
    }));

router.route('/general-office')
    .get(async((req, res) => {
        let ins = new ReportQueryFinancialOffices(req.cookies['branch-id'],
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getGeneralOffice());
        res.json(result);
    }));

router.route('/subsidiary-office')
    .get(async((req, res) => {
        let ins = new ReportQueryFinancialOffices(req.cookies['branch-id'],
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getSubsidiaryOffice());
        res.json(result);
    }));

router.route('/total-general-subsidiary-turnover')
    .get(async((req, res) => {
        let ins = new ReportQueryTurnover(req.cookies['branch-id'],
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getTotalTurnover());
        res.json(result);
    }));

router.route('/total-subsidiary-detail-turnover')
    .get(async((req, res) => {
        let ins = new ReportQueryTurnover(req.cookies['branch-id'],
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getTotalTurnover());
        res.json(result);
    }));

router.route('/total-general-subsidiary-detail-turnover')
    .get(async((req, res) => {
        let ins = new ReportQueryTurnover(req.cookies['branch-id'],
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getTotalTurnover());
        res.json(result);
    }));

router.route('/detail-general-subsidiary-turnover')
    .get(async((req, res) => {
        let ins = new ReportQueryTurnover(req.cookies['branch-id'],
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getDetailTurnover());
        res.json(result);
    }));

router.route('/detail-subsidiary-detail-turnover')
    .get(async((req, res) => {
        let ins = new ReportQueryTurnover(req.cookies['branch-id'],
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getDetailTurnover());
        res.json(result);
    }));

router.route('/detail-general-subsidiary-detail-turnover')
    .get(async((req, res) => {
        let ins = new ReportQueryTurnover(req.cookies['branch-id'],
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getDetailTurnover());
        res.json(result);
    }));

router.route('/detail-journal')
    .get(async((req, res) => {
        let ins = new ReportQueryJournal(req.cookies['branch-id'],
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getDetailJournals());
        res.json(result);
    }));

router.route('/detail-general-journal')
    .get(async((req, res) => {
        let ins = new ReportQueryJournal(req.cookies['branch-id'],
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getDetailJournals());
        res.json(result);
    }));

router.route('/detail-general-subsidiary-journal')
    .get(async((req, res) => {
        let ins = new ReportQueryJournal(req.cookies['branch-id'],
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getDetailJournals());
        res.json(result);
    }));

router.route('/detail-subsidiary-detail-journal')
    .get(async((req, res) => {
        let ins = new ReportQueryJournal(req.cookies['branch-id'],
            req.cookies['current-period'],
            req.cookies['current-mode'],
            req.query),
            result = await(ins.getDetailJournals());
        res.json(result);
    }));

router.route('/invoices')
    .get(async((req, res) => {
        let ins = new ReportQueryInvoice(req.cookies['branch-id']),
            result = await(ins.Invoice(req.query.id));
/*            result = [
                {
                    number: 0,
                    date: '',
                    invoiceDescription: '',
                    invoiceType: '',
                    quantity: 0,
                    unitPrice: 0,
                    vat: 0,
                    discount: 0,
                    grossPrice: 0,
                    vatPrice: 0,
                    netPrice: 0,
                    invoiceLineDescription: '',
                    productName: '',
                    customerName:'',
                    customerAddress: '',
                    personCode: ''
                }
            ];*/
        res.json(result);
    }));

module.exports = router;
