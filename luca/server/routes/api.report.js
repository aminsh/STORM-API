"use strict";


const fs = require('fs'),
    path = require('path'),
    config = require('../config'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    layout = getReport('layout'),
    ReportQueryAccounts = require('../queries/query.report.accounts'),
    ReportQueryBalance = require('../queries/query.report.balance');

function getReport(fileName) {
    return JSON.parse(
        fs.readFileSync(
            path.normalize(`${config.rootPath}/client/reportFiles/${fileName}`)));
}

router.route('/')
    .post((req, res) => {
        let report = req.body;

        fs.writeFile(
            path.normalize(`${config.rootPath}/client/reportFiles/${report.fileName}`),
            report.data,
            err => {
                if (err)
                    return res.status(500).send({ isValid: false, error: err });

                res.json({ isValid: true });
            }
        );
    });

router.route('/file/:fileName').get((req, res) => {
    let report = getReport(req.params.fileName),
        reportComponents = report.Pages[0].Components,
        reportComponentsMaxKeys = (Object.keys(reportComponents)
            .asEnumerable()
            .select(c => parseInt(c))
            .max() || 0) + 1,
        layoutComponents = layout.Pages[0].Components,
        header = layoutComponents[0],
        footer = layoutComponents[1];

    reportComponents[++reportComponentsMaxKeys] = header;
    reportComponents[++reportComponentsMaxKeys] = footer;

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

module.exports = router;
