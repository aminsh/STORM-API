"use strict";


const fs = require('fs'),
    path = require('path'),
    config = require('../config'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    layout = getReport('layout');

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
                    return res.status(500).send({isValid: false, error: err});

                res.json({isValid: true});
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

module.exports = router;
