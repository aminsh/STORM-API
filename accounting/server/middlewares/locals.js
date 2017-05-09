"use strict";

const config = require('../config'),
    translation = require('../config/translate.client.fa.json'),
    reports = require('../../reporting/report.config.json'),
    persianDate = require('../services/shared').service.PersianDate;

module.exports = (req, res, next) => {

    res.locals = {
        today: persianDate.current(),
        clientTranslation : translation,
        currentUser: req.user,
        version: config.version,
        reports: reports,
        env: config.env
    };

    next();
};