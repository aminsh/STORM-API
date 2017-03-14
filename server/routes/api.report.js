"use strict";

const fs = require('fs'),
    path = require('path'),
    config = require('../config'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router();

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

module.exports = router;
